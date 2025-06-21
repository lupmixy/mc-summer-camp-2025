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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Path to the gallery directory (updated to correct location)
    const galleryPath = path.join(process.cwd(), 'public', 'media', 'gallery')
    
    if (!await fileExists(galleryPath)) {
      console.warn('Gallery directory not found at:', galleryPath)
      return res.json({ success: true, media: [], count: 0 })
    }

    const files = await fs.readdir(galleryPath)
    
    // Filter for image and video files, exclude hidden files
    const mediaFiles = files
      .filter(file => {
        if (file.startsWith('.')) return false
        const ext = path.extname(file).toLowerCase()
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.avi'].includes(ext)
      })
      .map((file, index) => {
        const ext = path.extname(file).toLowerCase()
        return {
          id: index + 1,
          type: ['.mp4', '.mov', '.avi'].includes(ext) ? 'video' : 'image',
          src: `/media/gallery/${file}`,
          format: ext.substring(1), // Remove the dot
          filename: file
        }
      })

    // Sort by filename for consistent ordering
    mediaFiles.sort((a, b) => a.filename.localeCompare(b.filename))

    console.log(`Gallery API: Found ${mediaFiles.length} media files`)
    
    res.json({ 
      success: true,
      media: mediaFiles,
      count: mediaFiles.length 
    })

  } catch (error) {
    console.error('Gallery API error:', error)
    res.status(500).json({ 
      error: 'Failed to load gallery media',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
