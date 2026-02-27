#!/usr/bin/env python3
"""
Update gallery.js by scanning the images/ directory.
Run this script whenever you add/remove images.

Usage: python3 generate-gallery-data.py
"""

import os
import re
import json
from pathlib import Path

IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', 
                    '.tif', '.tiff', '.heic', '.bmp'}

def get_all_images(directory):
    """Get all image files from a directory."""
    images = []
    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for file in sorted(files):
            if Path(file).suffix.lower() in IMAGE_EXTENSIONS:
                images.append(os.path.join(root, file))
    return sorted(images)

def encode_path(file_path, base_dir):
    """Convert to web-safe path."""
    rel = os.path.relpath(file_path, base_dir).replace('\\', '/')
    return rel.replace(' ', '%20')

def get_category_name(folder_name):
    """Convert folder name to title."""
    return folder_name.replace('/', ' / ').title()

def generate_gallery_data():
    """Scan images/ and generate gallery data."""
    script_dir = Path(__file__).parent
    images_dir = script_dir / 'images'
    
    if not images_dir.exists():
        print("❌ images/ directory not found!")
        return None
    
    categories = sorted([d for d in images_dir.iterdir() 
                        if d.is_dir() and not d.name.startswith('.')])
    
    if not categories:
        print("❌ No category folders in images/")
        return None
    
    gallery_data = []
    for category_folder in categories:
        image_files = get_all_images(str(category_folder))
        image_paths = [encode_path(img, str(script_dir)) for img in image_files]
        
        gallery_data.append({
            'title': get_category_name(category_folder.name),
            'description': '',
            'images': image_paths
        })
    
    return gallery_data

def update_gallery_js(gallery_data):
    """Update gallery.js with new data."""
    script_dir = Path(__file__).parent
    gallery_js = script_dir / 'gallery.js'
    
    content = gallery_js.read_text(encoding='utf-8')
    
    # Create new galleryData declaration
    data_json = json.dumps(gallery_data, indent=2)
    new_declaration = f'const galleryData = {data_json};'
    
    # Replace the old galleryData
    pattern = r'const galleryData = .*?;'
    content = re.sub(pattern, new_declaration, content, flags=re.DOTALL)
    
    gallery_js.write_text(content, encoding='utf-8')

def main():
    print("🔍 Scanning images/...")
    gallery_data = generate_gallery_data()
    
    if not gallery_data:
        exit(1)
    
    total = sum(len(cat['images']) for cat in gallery_data)
    print(f"✅ Found {len(gallery_data)} categories, {total} images")
    for cat in gallery_data:
        print(f"   • {cat['title']}: {len(cat['images'])} images")
    
    print("\n📝 Updating gallery.js...")
    update_gallery_js(gallery_data)
    
    print("✅ Done! Gallery updated.")

if __name__ == '__main__':
    main()
