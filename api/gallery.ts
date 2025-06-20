import { VercelRequest, VercelResponse } from '@vercel/node'
import fs from 'fs/promises'
import path from 'path'

// Helper function to check if file exists
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // For Vercel, we need to serve the media files from the public directory
    // The gallery images should be moved to client/public/media/gallery/
    const galleryPath = path.join(process.cwd(), 'client/public/media/gallery')
    
    if (!await fileExists(galleryPath)) {
      return res.status(404).json({ error: 'Gallery directory not found' })
    }

    const files = await fs.readdir(galleryPath)
    const mediaFiles = await Promise.all(files
      .filter(file => file.match(/\.(gif|jpg|jpeg|png)$/i) && !file.startsWith('.'))
      .map(async (file, index) => {
        const format = path.extname(file).toLowerCase().slice(1)
        
        // For production, use the request origin, for dev use relative paths
        const baseUrl = req.headers.host?.includes('localhost') 
          ? '' 
          : `https://${req.headers.host}`
        
        return {
          id: index + 1,
          type: 'image',
          src: `${baseUrl}/media/gallery/${file}`,
          format
        }
      }))

    res.json(mediaFiles)
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to load media files',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
