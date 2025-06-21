# Gallery Management Guide

## How to Add Images to the Gallery

The gallery now automatically displays all images in the `/public/media/gallery/` directory. 

### Adding New Images

1. **Copy your image files** to `/public/media/gallery/`
2. **Supported formats:**
   - Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
   - Videos: `.mp4`, `.mov`, `.avi`
3. **That's it!** The images will automatically appear in the gallery

### Current Gallery Contents

Run `npm run test-gallery` to see all current images in the gallery.

### Example

```bash
# Copy new images
cp my-new-image.jpg public/media/gallery/
cp another-photo.png public/media/gallery/

# Test to verify they're detected
npm run test-gallery

# Build and deploy
npm run build
git add .
git commit -m "Add new gallery images"
git push
```

### Notes

- Images are sorted alphabetically by filename
- Hidden files (starting with `.`) are ignored
- The gallery API endpoint `/api/gallery` dynamically scans the directory
- No code changes needed when adding new images
- Images will appear immediately after deployment

### Current Images Include

- All original camp photos (`mcSoccerCamp2024-*.jpg`)
- Animated GIFs (`IMG_*-Animated Image (Large).gif`)
- Your custom images (`happy.png`, `serious.png`)
- Any new images you add to the directory
