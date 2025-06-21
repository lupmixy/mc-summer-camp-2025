# Gallery Management Guide

## How to Add Images to the Gallery

### Current Approach (Vercel-Optimized)

Due to Vercel's serverless function size limits, the gallery uses a predefined list of images to avoid build failures. 

### Adding New Images

1. **Copy your image files** to `/public/media/gallery/`
2. **Update the gallery API** using the helper script:
   ```bash
   npm run add-gallery-image your-image.jpg
   ```
   Or manually edit `/api/gallery.ts` and add your filename to the `mediaFiles` array
3. **Supported formats:**
   - Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
   - Videos: `.mp4`, `.mov`, `.avi`
4. **Deploy** the changes

### Example

```bash
# 1. Copy new images
cp my-new-image.jpg public/media/gallery/
cp another-photo.png public/media/gallery/

# 2. Add to gallery API (choose one method):
# Method A: Use helper script (recommended)
npm run add-gallery-image my-new-image.jpg
npm run add-gallery-image another-photo.png

# Method B: Manual edit - add to mediaFiles array in api/gallery.ts:
#    'my-new-image.jpg',
#    'another-photo.png'

# 3. Test locally
npm run test-gallery

# 4. Build and deploy
npm run build
git add .
git commit -m "Add new gallery images"
git push
```

### Notes

- Images are sorted alphabetically by filename
- The gallery API uses a predefined list to avoid Vercel's 300MB serverless function limit
- When adding new images, you must update both the file system and the API code
- This approach ensures reliable deployment on Vercel

### Current Images Include

- All original camp photos (`mcSoccerCamp2024-*.jpg`)
- Animated GIFs (`IMG_*-Animated Image (Large).gif`)
- Your custom images (`happy.png`, `serious.png`)
- Any new images you add to both the directory and API code

### Why This Approach?

Vercel serverless functions have a 300MB limit. The previous dynamic approach tried to include all gallery images in the function bundle, causing deployment failures. This predefined list approach:

- Keeps the function size small
- Ensures reliable deployments
- Still allows easy image management
- Provides full control over what appears in the gallery
