/**
 * Setup Public Role Permissions for Strapi
 *
 * This script sets up permissions for the Public role to access all content types
 * Run this after creating an admin account in Strapi
 * Usage: node setup-permissions.js
 */

const fetch = require('node-fetch');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

const contentTypes = [
  'hero-config',
  'calculator-config',
  'product',
  'smart-package',
  'features-config',
  'feature-card',
  'business-partner',
  'gallery-item',
  'gallery-group',
  'customer',
  'testimonial',
  'service',
];

async function setupPermissions() {
  if (!ADMIN_TOKEN) {
    console.error('ERROR: ADMIN_TOKEN environment variable is required');
    console.error('To get your token:');
    console.error('1. Login to http://localhost:1337/admin');
    console.error('2. Go to Settings → API Tokens');
    console.error('3. Create a new API Token with "Full access"');
    console.error('4. Run: ADMIN_TOKEN=your_token node setup-permissions.js');
    process.exit(1);
  }

  try {
    // Get all roles
    console.log('📋 Fetching roles...');
    const rolesRes = await fetch(`${STRAPI_URL}/admin/roles`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    if (!rolesRes.ok) throw new Error(`Failed to fetch roles: ${rolesRes.status}`);
    const { data: roles } = await rolesRes.json();

    const publicRole = roles.find(r => r.code === 'strapi-public');
    if (!publicRole) {
      throw new Error('Public role (strapi-public) not found');
    }
    console.log(`✅ Found public role (ID: ${publicRole.id})`);

    // Get existing permissions for public role
    console.log('📋 Fetching existing permissions...');
    const permsRes = await fetch(
      `${STRAPI_URL}/admin/permissions?filters[role]=${publicRole.id}`,
      { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } }
    );
    if (!permsRes.ok) throw new Error(`Failed to fetch permissions: ${permsRes.status}`);
    const { data: existingPerms } = await permsRes.json();
    console.log(`✅ Found ${existingPerms.length} existing permissions`);

    // Set up permissions for each content type
    for (const contentType of contentTypes) {
      const actions = ['api', contentType, 'find'];
      const action = actions.join('.');

      const hasPermission = existingPerms.some(p => p.action === action && p.role.id === publicRole.id);

      if (!hasPermission) {
        console.log(`➕ Creating permission: ${action}`);
        const createRes = await fetch(`${STRAPI_URL}/admin/permissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
          body: JSON.stringify({
            action,
            subject: `api::${contentType}.${contentType}`,
            properties: {},
            conditions: [],
            role: publicRole.id,
          }),
        });
        if (!createRes.ok) {
          console.error(`❌ Failed to create permission ${action}: ${createRes.status}`);
        } else {
          console.log(`✅ Created permission: ${action}`);
        }
      } else {
        console.log(`✓ Permission already exists: ${action}`);
      }
    }

    console.log('\n✅ All permissions have been set up!');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupPermissions();
