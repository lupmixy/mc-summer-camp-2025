import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-mc-blue via-mc-blue/95 to-white">
      {/* Hero Section */}
      <div className="relative h-48 mb-12 overflow-hidden bg-mc-blue">
        <div className="absolute inset-0 bg-gradient-to-r from-mc-blue to-mc-blue-dark"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <img 
                src="/branding/soccerBearTatBrown.png" 
                alt="Coach Colombo" 
                className="w-12 h-12"
              />
              <h1 className="text-4xl font-bold text-white">Meet Coach Colombo</h1>
            </div>
            <div className="h-1 w-24 bg-mc-gold mx-auto"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Bio Section */}
        <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg mb-12">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Coach Headshot */}
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-4 overflow-hidden rounded-lg shadow-lg">
                <img 
                  src="/media/coach-colombo-girls-soccer.jpg" 
                  alt="Coach Michael Colombo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-mc-blue mb-2">Michael Colombo</h2>
              <p className="text-mc-gold font-semibold mb-2">Head Varsity Girls Soccer Coach</p>
              <p className="text-gray-600">Malden Catholic High School</p>
              <p className="text-sm text-gray-500 mt-2">USSF Grassroots Licensed • Metro North Staff Coach</p>
            </div>

            {/* Bio Content */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-mc-blue mb-3">About Coach Colombo</h3>
                <p className="text-gray-700 mb-4">
                  Michael Colombo is a dedicated soccer coach with a passion for developing young athletes both on and off the field. Currently serving as the Head Varsity Girls Soccer Coach at Malden Catholic High School, Coach Colombo brings years of experience and a deep understanding of the game to every training session.
                </p>
                <p className="text-gray-700 mb-4">
                  A Notre Dame alumnus, Coach Colombo combines his academic background with practical coaching experience as a Metro North Staff Coach and USSF Grassroots Licensed instructor. His commitment to player development extends beyond the traditional school season through his independent summer soccer camps, where players receive intensive, personalized training.
                </p>
                <p className="text-gray-700">
                  Coach Colombo's approach emphasizes technical skill development, tactical understanding, and most importantly, fostering a genuine love for the beautiful game. His camps provide a supportive yet challenging environment where players can push their limits and discover their potential.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-mc-blue mb-3">Coaching Philosophy</h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Player-Centered Development:</strong> Every player has unique strengths and areas for growth. Coach Colombo tailors training to meet individual needs while building strong team chemistry.
                  </p>
                  <p>
                    <strong>Technical Excellence:</strong> Mastering the fundamentals is the foundation of great soccer. Players develop precise ball control, passing accuracy, and shooting technique through structured drills and game-like scenarios.
                  </p>
                  <p>
                    <strong>Tactical Awareness:</strong> Understanding the game goes beyond individual skills. Players learn positioning, decision-making, and how to read the game to become more complete soccer players.
                  </p>
                  <p>
                    <strong>Character Building:</strong> Soccer teaches life lessons. Through challenges, teamwork, and perseverance, players develop confidence, leadership skills, and resilience that extend far beyond the field.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-mc-blue mb-3">Experience & Credentials</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-mc-blue mb-2">Coaching Experience</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Head Varsity Girls Soccer Coach, Malden Catholic High School</li>
                      <li>• Metro North Staff Coach</li>
                      <li>• Independent Soccer Camp Director</li>
                      <li>• Youth Development Specialist</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-mc-blue mb-2">Licenses & Education</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• USSF Grassroots Licensed Coach</li>
                      <li>• Notre Dame Alumni</li>
                      <li>• Continuing Education in Player Development</li>
                      <li>• Safety & First Aid Certified</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-mc-blue mb-3">Camp Methodology</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-3">
                    The Colombo Girls Soccer Camps utilize a progressive training methodology that builds skills systematically:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-mc-blue rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <h5 className="font-semibold text-mc-blue mb-1">Foundation</h5>
                      <p className="text-gray-600">Technical skills, ball mastery, and core fundamentals</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-mc-gold rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-mc-blue font-bold">2</span>
                      </div>
                      <h5 className="font-semibold text-mc-blue mb-1">Application</h5>
                      <p className="text-gray-600">Game situations, tactical awareness, and decision-making</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-mc-blue rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h5 className="font-semibold text-mc-blue mb-1">Mastery</h5>
                      <p className="text-gray-600">Advanced play, leadership, and creative expression</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/branding/soccerBearTatBrown.png" 
              alt="Soccer Bear" 
              className="w-8 h-8"
            />
            <h3 className="text-2xl font-bold text-mc-blue">Train with Coach Colombo This Summer</h3>
          </div>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            Experience intensive, personalized soccer training that combines technical skill development, tactical understanding, and character building. Our camps provide the perfect environment for players to reach their potential while developing a lifelong love for the beautiful game.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              to="/register"
              className="bg-mc-gold text-mc-blue px-8 py-3 rounded-md font-bold text-lg hover:bg-mc-gold-light transition-colors shadow-md"
            >
              Register for Camp
            </Link>
            <Link
              to="/contact"
              className="bg-mc-blue text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-mc-blue-dark transition-colors shadow-md"
            >
              Contact Coach Colombo
            </Link>
          </div>
          <p className="text-sm text-gray-600">
            Questions about our training methodology or camp structure? <Link to="/contact" className="text-mc-blue hover:underline">Get in touch</Link> with Coach Colombo directly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
