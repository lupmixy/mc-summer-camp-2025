import { VercelRequest, VercelResponse } from '@vercel/node'

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
    // For Vercel deployment, we'll use a predefined list to avoid filesystem access
    // This prevents the function from being too large and avoids serverless limitations
    const mediaFiles = [
      // Original camp photos
      'mcSoccerCamp2024-28.jpg',
      'mcSoccerCamp2024-29.jpg',
      'mcSoccerCamp2024-30.jpg',
      'mcSoccerCamp2024-31.jpg',
      'mcSoccerCamp2024-32.jpg',
      'mcSoccerCamp2024-33.jpg',
      'mcSoccerCamp2024-34.jpg',
      'mcSoccerCamp2024-35.jpg',
      'mcSoccerCamp2024-36.jpg',
      'mcSoccerCamp2024-37.jpg',
      'mcSoccerCamp2024-38.jpg',
      'mcSoccerCamp2024-39.jpg',
      'mcSoccerCamp2024-40.jpg',
      'mcSoccerCamp2024-41.jpg',
      'mcSoccerCamp2024-42.jpg',
      'mcSoccerCamp2024-43.jpg',
      'mcSoccerCamp2024-44.jpg',
      'mcSoccerCamp2024-45.jpg',
      'mcSoccerCamp2024-46.jpg',
      'mcSoccerCamp2024-47.jpg',
      'mcSoccerCamp2024-48.jpg',
      'mcSoccerCamp2024-49.jpg',
      'mcSoccerCamp2024-50.jpg',
      'mcSoccerCamp2024-51.jpg',
      'mcSoccerCamp2024-52.jpg',
      'mcSoccerCamp2024-53.jpg',
      'mcSoccerCamp2024-54.jpg',
      // Animated GIFs
      'IMG_1415-Animated Image (Large).gif',
      'IMG_1416-Animated Image (Large).gif',
      'IMG_1417-Animated Image (Large).gif',
      'IMG_1418-Animated Image (Large).gif',
      'IMG_1419-Animated Image (Large).gif',
      'IMG_1420-Animated Image (Large).gif',
      'IMG_1421-Animated Image (Large).gif',
      'IMG_1424-Animated Image (Large).gif',
      'IMG_1426-Animated Image (Large).gif',
      'IMG_1428-Animated Image (Large).gif',
      'IMG_1429-Animated Image (Large).gif',
      'IMG_1431-Animated Image (Large).gif',
      'IMG_1432-Animated Image (Large).gif',
      'IMG_1433-Animated Image (Large).gif',
      'IMG_1434-Animated Image (Large).gif',
      'IMG_1435-Animated Image (Large).gif',
      'IMG_1436-Animated Image (Large).gif',
      'IMG_1437-Animated Image (Large).gif',
      'IMG_1439-Animated Image (Large).gif',
      'IMG_1440-Animated Image (Large).gif',
      'IMG_1441-Animated Image (Large).gif',
      'IMG_1442 copy-Animated Image (Large).gif',
      'IMG_1442-Animated Image (Large).gif',
      'IMG_1443-Animated Image (Large).gif',
      'IMG_1444-Animated Image (Large).gif',
      'IMG_1445-Animated Image (Large).gif',
      'IMG_1446 (1)-Animated Image (Large).gif',
      'IMG_1446-Animated Image (Large).gif',
      'IMG_1447-Animated Image (Large).gif',
      // Custom images
      '2024teamPic.png',
      'happy.png',
      'serious.png'
    ]

    // Create media items with metadata
    const mediaItems = mediaFiles
      .map((filename, index) => {
        const ext = filename.split('.').pop()?.toLowerCase() || ''
        return {
          id: index + 1,
          type: ['mp4', 'mov', 'avi'].includes(ext) ? 'video' : 'image',
          src: `/media/gallery/${filename}`,
          format: ext,
          filename: filename
        }
      })
      .sort((a, b) => a.filename.localeCompare(b.filename))

    console.log(`Gallery API: Serving ${mediaItems.length} predefined media files`)
    
    res.json({ 
      success: true,
      media: mediaItems,
      count: mediaItems.length 
    })

  } catch (error) {
    console.error('Gallery API error:', error)
    res.status(500).json({ 
      error: 'Failed to load gallery media',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
