import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

type MediaItem = {
  id: number
  type: 'image' | 'video'
  src: string
  format: string
}

const GALLERY_HERO_IMAGE = '/images/hero/mcSoccerCamp2024-47.jpg' // Image showing soccer net/field

const Gallery = () => {
  const [displayedMedia, setDisplayedMedia] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const minSwipeDistance = 50 // minimum distance for a swipe

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      navigateGallery('next')
    } else if (isRightSwipe) {
      navigateGallery('prev')
    }

    setTouchEnd(0)
    setTouchStart(0)
  }

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const { data } = await axios.get<MediaItem[]>(`${import.meta.env.VITE_API_BASE_URL || '/api'}/media`)
        setDisplayedMedia(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load media:', error)
        setIsLoading(false)
      }
    }

    loadMedia()
  }, [])

  const navigateGallery = useCallback((direction: 'prev' | 'next') => {
    if (!selectedMedia || !displayedMedia.length) return

    const currentIndex = displayedMedia.findIndex(item => item.id === selectedMedia.id)
    let newIndex

    if (direction === 'next') {
      newIndex = currentIndex === displayedMedia.length - 1 ? 0 : currentIndex + 1
    } else {
      newIndex = currentIndex === 0 ? displayedMedia.length - 1 : currentIndex - 1
    }

    setSelectedMedia(displayedMedia[newIndex])
  }, [selectedMedia, displayedMedia])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedMedia) return

      if (e.key === 'Escape') {
        setSelectedMedia(null)
      } else if (e.key === 'ArrowRight') {
        navigateGallery('next')
      } else if (e.key === 'ArrowLeft') {
        navigateGallery('prev')
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedMedia, navigateGallery])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-mc-blue via-mc-blue/95 to-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <img 
            src="/branding/soccerBearTatBrown.png" 
            alt="Loading" 
            className="w-8 h-8 animate-bounce"
          />
          <span className="text-white text-xl">Loading gallery...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-mc-blue via-mc-blue/95 to-white">
      {/* Hero Section with Background */}
      <div 
        className="relative h-48 mb-12 overflow-hidden"
        style={{
          backgroundImage: `url(${GALLERY_HERO_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 55%' // Fine-tuned to better show the soccer net
        }}
      >
        <div className="absolute inset-0 bg-mc-blue/70 backdrop-blur-sm"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <img 
                src="/branding/soccerBearTatBrown.png" 
                alt="Gallery" 
                className="w-12 h-12"
              />
              <h1 className="text-4xl font-bold text-white">Camp Gallery</h1>
            </div>
            <div className="h-1 w-24 bg-mc-gold mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12 -mt-8">
        <div className="grid md:grid-cols-3 gap-6">
          {displayedMedia.map((media) => (
            <button 
              key={media.id}
              onClick={() => setSelectedMedia(media)}
              className="bg-white rounded-xl overflow-hidden shadow-lg aspect-square transform transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-mc-gold focus:ring-offset-2"
            >
              {media.type === 'image' ? (
                <img 
                  src={media.src}
                  alt={`Gallery item ${media.id}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video 
                  src={media.src}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              )}
            </button>
          ))}
        </div>

        {/* Registration CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 bg-mc-gold text-mc-blue px-8 py-4 rounded-md font-bold hover:bg-mc-gold-light transition-colors"
          >
            <span>Join Us This Summer</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Full Screen Viewer */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedMedia(null)
            }}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
            aria-label="Close viewer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateGallery('prev')
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-10 group"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateGallery('next')
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-10 group"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Content */}
          <div 
            className="h-[90vh] w-[90vw] relative flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            {selectedMedia.type === 'image' ? (
              <img 
                src={selectedMedia.src}
                alt={`Gallery item ${selectedMedia.id}`}
                className="h-full w-full object-contain"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              />
            ) : (
              <video 
                src={selectedMedia.src}
                controls
                autoPlay
                className="h-full w-full object-contain"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery