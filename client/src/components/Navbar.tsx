import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-mc-blue/95 backdrop-blur-sm shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - shows on all devices */}
          <Link to="/" className="flex items-center space-x-1 sm:space-x-2 group shrink-0">
            <img 
              src="/branding/soccerBearTatBrown.png" 
              alt="MC Soccer" 
              className="w-7 h-7 sm:w-8 sm:h-8"
            />
            {/* Desktop Logo Text */}
            <div className="hidden sm:flex sm:flex-col">
              <span className="text-white font-bold text-lg leading-tight group-hover:text-mc-gold transition-colors">
                MC Girls
              </span>
              <span className="text-mc-gold font-bold text-lg leading-tight group-hover:text-white transition-colors">
                Soccer Camps
              </span>
            </div>
            {/* Mobile Logo Text */}
            <div className="flex sm:hidden">
              <span className="text-white font-bold text-sm leading-tight group-hover:text-mc-gold transition-colors">
                MC Camp
              </span>
            </div>
          </Link>

          {/* Navigation Links - centered and always visible */}
          <div className="flex items-center justify-center flex-1 px-2">
            <div className="flex space-x-2 md:space-x-6 text-center">
              <Link to="/programs" className="text-white hover:text-mc-gold px-1 sm:px-3 py-2 text-xs sm:text-sm md:text-base transition-colors whitespace-nowrap">
                Programs
              </Link>
              <Link to="/gallery" className="text-white hover:text-mc-gold px-1 sm:px-3 py-2 text-xs sm:text-sm md:text-base transition-colors whitespace-nowrap">
                Gallery
              </Link>
            </div>
          </div>
          
          {/* Register button - always visible */}
          <Link to="/register" className="bg-mc-gold text-mc-blue hover:bg-mc-gold-light px-2 sm:px-3 py-1 sm:py-2 rounded-md font-medium text-xs sm:text-sm md:text-base transition-colors whitespace-nowrap shrink-0">
            Register
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar