import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Helper function to check if file exists
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

router.get('/media/gallery', async (req, res) => {
  try {
    const galleryPath = path.join(__dirname, '../../public/media/gallery');
    
    if (!await fileExists(galleryPath)) {
      return res.status(404).json({ error: 'Gallery directory not found' });
    }

    const files = await fs.readdir(galleryPath);
    const mediaFiles = await Promise.all(files
      .filter(file => file.match(/\.(gif|jpg|jpeg|png)$/i) && !file.startsWith('.'))
      .map(async (file, index) => {
        const filePath = path.join(galleryPath, file);
        const format = path.extname(file).toLowerCase().slice(1);
        
        // Use BASE_URL from env if available, otherwise default to the request origin
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
        
        return {
          id: index + 1,
          type: 'image',
          src: `${baseUrl}/media/gallery/${file}`,
          format
        };
      }));

    res.json(mediaFiles);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to load media files',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;