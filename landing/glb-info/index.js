import { NodeIO } from '@gltf-transform/core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// گرفتن مسیر پوشه از پارامتر خط فرمان
// مثال اجرا: node index.js ../public/models
const folderPath = process.argv[2];
if (!folderPath) {
    console.error("❌ لطفاً مسیر پوشه را به عنوان پارامتر بدهید. مثال: node index.js ../public/models");
    process.exit(1);
}

const resultsDir = path.join(__dirname, 'results');
if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
}

const io = new NodeIO();

/**
 * Fallback: parse raw GLB binary to extract the embedded JSON chunk.
 * GLB format: 12-byte file header + chunks (each: 4-byte length, 4-byte type, N bytes data).
 * Chunk type 0x4E4F534A = "JSON".
 */
function extractGltfJson(filePath) {
    const buf = fs.readFileSync(filePath);
    const magic = buf.readUInt32LE(0);
    if (magic !== 0x46546C67) throw new Error('Not a valid GLB file');
    let offset = 12; // skip 12-byte file header
    while (offset < buf.length) {
        const chunkLength = buf.readUInt32LE(offset);
        const chunkType = buf.readUInt32LE(offset + 4);
        if (chunkType === 0x4E4F534A) { // JSON chunk
            const jsonStr = buf.toString('utf8', offset + 8, offset + 8 + chunkLength).trimEnd();
            return JSON.parse(jsonStr);
        }
        offset += 8 + chunkLength;
    }
    throw new Error('No JSON chunk found in GLB');
}

function extractFromGltfJson(gltf) {
    const data = { objects: [], materials: [], cameras: [], animations: [], meshes: [], lights: [] };

    (gltf.nodes || []).forEach(node => {
        const entry = {
            name: node.name || null,
            translation: node.translation || [0, 0, 0],
            rotation: node.rotation || [0, 0, 0, 1],
            scale: node.scale || [1, 1, 1],
            mesh: node.mesh != null ? (gltf.meshes?.[node.mesh]?.name ?? `mesh_${node.mesh}`) : null
        };
        if (node.extensions?.KHR_lights_punctual != null) {
            const lightIdx = node.extensions.KHR_lights_punctual.light;
            const lights = gltf.extensions?.KHR_lights_punctual?.lights || [];
            const light = lights[lightIdx];
            entry.light = light ? { name: light.name, type: light.type, intensity: light.intensity, color: light.color } : lightIdx;
        }
        data.objects.push(entry);
    });

    (gltf.materials || []).forEach(mat => {
        data.materials.push({
            name: mat.name || null,
            baseColorFactor: mat.pbrMetallicRoughness?.baseColorFactor || null,
            roughnessFactor: mat.pbrMetallicRoughness?.roughnessFactor ?? null,
            metallicFactor: mat.pbrMetallicRoughness?.metallicFactor ?? null,
            alphaMode: mat.alphaMode || 'OPAQUE',
            doubleSided: mat.doubleSided || false
        });
    });

    (gltf.cameras || []).forEach(cam => {
        data.cameras.push({
            name: cam.name || null,
            type: cam.type,
            ...(cam.perspective || cam.orthographic || {})
        });
    });

    (gltf.animations || []).forEach(anim => {
        data.animations.push({ name: anim.name || null, channels: anim.channels?.length ?? 0, samplers: anim.samplers?.length ?? 0 });
    });

    (gltf.meshes || []).forEach(mesh => {
        data.meshes.push({ name: mesh.name || null, primitives: mesh.primitives?.length ?? 0 });
    });

    // standalone lights from KHR_lights_punctual extension
    (gltf.extensions?.KHR_lights_punctual?.lights || []).forEach(light => {
        data.lights.push({ name: light.name || null, type: light.type, intensity: light.intensity, color: light.color });
    });

    return data;
}

// گرفتن همه فایل‌های glb در پوشه
const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.glb'));

if (files.length === 0) {
    console.log("هیچ فایل GLB در این پوشه پیدا نشد.");
    process.exit(0);
}

for (const file of files) {
    const inputFile = path.join(folderPath, file);
    const outputFile = path.join(resultsDir, path.basename(file, '.glb') + '.json');

    let data;
    try {
        // primary path: gltf-transform (full typed API)
        const doc = await io.read(inputFile);
        const root = doc.getRoot();

        data = { objects: [], materials: [], cameras: [], animations: [], meshes: [] };

        root.listNodes().forEach(node => {
            data.objects.push({
                name: node.getName(),
                translation: node.getTranslation(),
                rotation: node.getRotation(),
                scale: node.getScale(),
                mesh: node.getMesh() ? node.getMesh().getName() : null
            });
        });

        root.listMaterials().forEach(mat => {
            data.materials.push({
                name: mat.getName(),
                baseColorFactor: mat.getBaseColorFactor(),
                roughnessFactor: mat.getRoughnessFactor(),
                metallicFactor: mat.getMetallicFactor(),
                alphaMode: mat.getAlphaMode(),
                doubleSided: mat.getDoubleSided()
            });
        });

        root.listCameras().forEach(cam => {
            data.cameras.push({
                name: cam.getName(),
                type: cam.getType(),
                aspectRatio: cam.getAspectRatio(),
                zNear: cam.getZNear(),
                zFar: cam.getZFar()
            });
        });

        root.listAnimations().forEach(anim => {
            data.animations.push({
                name: anim.getName(),
                channels: anim.listChannels().length,
                samplers: anim.listSamplers().length
            });
        });

        root.listMeshes().forEach(mesh => {
            data.meshes.push({ name: mesh.getName(), primitives: mesh.listPrimitives().length });
        });

        console.log(`✅ ${file} → results/${path.basename(file, '.glb')}.json`);
    } catch (err) {
        // fallback: raw binary parsing (handles unsupported required extensions)
        try {
            const gltf = extractGltfJson(inputFile);
            data = extractFromGltfJson(gltf);
            console.log(`✅ ${file} → results/${path.basename(file, '.glb')}.json  (fallback parser)`);
        } catch (fallbackErr) {
            console.error(`❌ خطا در پردازش ${file}: ${err.message} / ${fallbackErr.message}`);
            continue;
        }
    }

    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
}
