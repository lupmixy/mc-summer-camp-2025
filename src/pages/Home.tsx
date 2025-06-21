import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const [currentHeroImage, setCurrentHeroImage] = useState('/images/hero/mcSoccerCamp2024-28.jpg')
  const heroImages = useMemo(() => [
    '/images/hero/mcSoccerCamp2024-28.jpg',
    '/images/hero/mcSoccerCamp2024-30.jpg',
    '/images/hero/mcSoccerCamp2024-33.jpg',
    '/images/hero/mcSoccerCamp2024-36.jpg',
    '/images/hero/mcSoccerCamp2024-39.jpg',
    '/images/hero/mcSoccerCamp2024-42.jpg',
    '/images/hero/mcSoccerCamp2024-45.jpg',
    '/images/hero/mcSoccerCamp2024-48.jpg',
    '/images/hero/2024teamPic.png'
  ], [])

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % heroImages.length
      setCurrentHeroImage(heroImages[currentIndex])
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [heroImages])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] mb-8">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img
            src={currentHeroImage}
            alt="MC Girls Soccer Camp"
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-mc-blue/50"></div>
        </div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-4">
          {/* Logo */}
          <img 
            src="/branding/mclogo.png" 
            alt="MC Logo" 
            className="w-24 h-24 md:w-32 md:h-32 mb-6"
          />
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            MC Girls Soccer Camps
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Join us for an incredible summer of soccer development, fun, and growth
          </p>
          <Link
            to="/register"
            className="bg-mc-gold text-mc-blue px-8 py-4 rounded-md font-bold text-lg hover:bg-mc-gold-light transition-colors"
          >
            Register Now
          </Link>
        </div>
      </div>

      {/* Programs Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <Link 
            to="/register" 
            state={{ program: 'youth' }}
            className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg transform transition-all hover:scale-[1.02] block"
          >
            <div className="flex items-center mb-4">
              <img 
                src="/branding/soccerBearTatBrown.png" 
                alt="Youth Program" 
                className="w-12 h-12 mr-4"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Youth Program</h2>
                <p className="text-gray-600">Ages 8-14</p>
              </div>
            </div>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li>• August 4-7, 2025</li>
              <li>• 8:00 AM - 12:00 PM</li>
              <li>• Brother Gilbert Stadium (Donovan Field)</li>
              <li>• All skill levels welcome</li>
              <li>• Focus on fundamentals and fun</li>
            </ul>
            <div>
              <p className="text-3xl font-bold text-mc-blue mb-4">$199</p>
              <div className="text-center bg-mc-gold text-mc-blue px-6 py-3 rounded-md font-bold">
                Register Now
              </div>
            </div>
          </Link>

          <Link 
            to="/register" 
            state={{ program: 'highschool' }}
            className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg transform transition-all hover:scale-[1.02] block"
          >
            <div className="flex items-center mb-4">
              <img 
                src="/branding/lancerGirlsSoccerladyLancerBluered@3x.png" 
                alt="High School Program" 
                className="w-12 h-12 mr-4"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">High School Program</h2>
                <p className="text-gray-600">Grades 8-12</p>
              </div>
            </div>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li>• August 4-7, 2025</li>
              <li>• 8:00 AM - 12:00 PM</li>
              <li>• Brother Gilbert Stadium (Donovan Field)</li>
              <li>• Advanced skill development</li>
              <li>• College prep focus</li>
            </ul>
            <div>
              <p className="text-3xl font-bold text-mc-blue mb-4">$249</p>
              <div className="text-center bg-mc-gold text-mc-blue px-6 py-3 rounded-md font-bold">
                Register Now
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Gallery CTA */}
      <div className="text-center py-12">
        <Link
          to="/gallery"
          className="inline-block bg-mc-blue text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-mc-blue-dark transition-colors"
        >
          View Photo Gallery
        </Link>
      </div>
    </div>
  )
}

export default Home