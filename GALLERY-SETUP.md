# Gallery Auto-Update

## How It Works

The gallery automatically includes all images in the `images/` folder. Just run one script to update:

```bash
python3 generate-gallery-data.py
```

That's it! The script scans your image folders and updates `gallery.js`.

## Adding Images

1. Add images to any folder in `images/` (e.g., `images/Photography/new-photo.jpg`)
2. Run: `python3 generate-gallery-data.py`
3. Commit and push changes

## Image Organization

```
images/
  ├── 2d design/
  ├── Photography/
  ├── plush/
  ├── sculpture/
  └── wearable design/
```

Each folder becomes a gallery category. All image files are automatically discovered.

## Supported Formats

jpg, jpeg, png, gif, webp, svg, tif, tiff, heic, bmp

## That's All!

No dependencies, no JSON files, no watchers. Just one Python script to run when you change images.
