#!/usr/bin/env python3
"""Script to create minimal HDR night sky environment maps."""
import struct
import os
import base64

# Base64 encoded minimal valid HDR file for a dark night sky
NIGHT_SKY_HDR = """#?RADIANCE
EXPOSURE=1.000000e+000
FORMAT=32-bit_rle_rgbe

-Y 256 -X 512
"""

def write_hdr_file(filename, data):
    """Write HDR file with proper format."""
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    # Write header
    with open(filename, 'wb') as f:
        f.write(NIGHT_SKY_HDR.encode('ascii'))
        
        # Add simple dark blue night sky gradient data (minimal RGBe encoded)
        for y in range(256):
            t = y / 256.0
            base_val = int((1.0 - t * 0.3) * 20)  # Darker at top
            
            for x in range(512):
                # Write RGBe encoded pixel (simple dark blue)
                f.write(bytes([base_val, min(base_val + 2, 255), base_val + 5, 128]))

def main():
    hdr_path = 'landing/public/textures/environment-maps/night-sky-nightly.hdr'
    
    # Write the HDR file with proper format
    os.makedirs('landing/public/textures/environment-maps', exist_ok=True)
    
    with open(hdr_path, 'wb') as f:
        f.write(NIGHT_SKY_HDR.encode('ascii'))
        
        # Add gradient data for night sky (top is darker than bottom)
        for y in range(256):
            t = y / 256.0
            base_val = int((1.0 - t * 0.3) * 20)
            
            for x in range(512):
                # Dark blue night sky gradient
                f.write(bytes([base_val, min(base_val + 2, 255), base_val + 5, 128]))
    
    print(f"Created: {hdr_path}")

if __name__ == '__main__':
    main()