#!/usr/bin/env python3
"""
Scans the images/ folder recursively and generates gallery-data.json
with all images organized by category (subfolder).
"""

import os
import json
from pathlib import Path

def get_image_extensions():
    """Return set of supported image extensions."""
    return {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.heic', '.tif', '.tiff'}

def is_image_file(filename):
    """Check if file is an image."""
    return Path(filename).suffix.lower() in get_image_extensions()

def scan_images_folder(base_path='images'):
    """
    Scan images folder and return gallery data structure.
    Expects structure:
      images/
        2d design/
        Photography/
        etc.
    """
    gallery_data = []
    
    if not os.path.isdir(base_path):
        print(f"Warning: {base_path} folder not found")
        return gallery_data
    
    # Get all subdirectories (categories)
    items = sorted(os.listdir(base_path))
    
    for category_name in items:
        category_path = os.path.join(base_path, category_name)
        
        # Skip non-directories
        if not os.path.isdir(category_path):
            continue
        
        # Scan for images in this category
        images = []
        try:
            for filename in sorted(os.listdir(category_path)):
                filepath = os.path.join(category_path, filename)
                
                # Skip subdirectories
                if os.path.isdir(filepath):
                    continue
                
                # Check if it's an image
                if is_image_file(filename):
                    # Store as relative path with forward slashes
                    rel_path = os.path.join(base_path, category_name, filename).replace('\\', '/')
                    images.append(rel_path)
        except Exception as e:
            print(f"Error scanning {category_path}: {e}")
            continue
        
        # Only add category if it has images
        if images:
            gallery_data.append({
                'title': category_name,
                'description': '',
                'images': images
            })
    
    return gallery_data

def main():
    """Generate gallery data and write to JSON file."""
    output_file = 'gallery-data.json'
    
    print(f"Scanning images folder...")
    gallery_data = scan_images_folder('images')
    
    if not gallery_data:
        print("No images found!")
        return
    
    # Write to JSON file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(gallery_data, f, indent=2, ensure_ascii=False)
    
    # Print summary
    total_images = sum(len(cat['images']) for cat in gallery_data)
    print(f"\nGenerated {output_file}")
    print(f"Categories: {len(gallery_data)}")
    print(f"Total images: {total_images}")
    
    for category in gallery_data:
        print(f"  - {category['title']}: {len(category['images'])} images")

if __name__ == '__main__':
    main()
