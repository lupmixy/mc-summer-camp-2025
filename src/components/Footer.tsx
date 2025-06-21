const Footer = () => {
  return (
    <footer className="bg-mc-blue/95 backdrop-blur-sm text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="text-center md:text-left">
            <h3 className="text-mc-gold font-bold mb-2">Contact Us</h3>
            <a 
              href="mailto:mcgirlssoccer12@gmail.com"
              className="hover:text-mc-gold transition-colors"
            >
              mcgirlssoccer12@gmail.com
            </a>
          </div>
          <div className="text-center flex flex-col items-center">
            <img 
              src="/branding/mclogo.png" 
              alt="MC Logo" 
              className="w-12 h-12 mb-2"
            />
            <p>© 2025 Michael Colombo</p>
            <p className="text-sm text-gray-300 mt-1 max-w-xs">
              Independent camp held at Malden Catholic facilities
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-mc-gold font-bold mb-2">Location</p>
            <p>Malden Catholic High School</p>
            <p>99 Crystal Street, Malden, MA</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer