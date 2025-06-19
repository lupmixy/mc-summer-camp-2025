import { Link } from 'react-router-dom'

const PROGRAM_HERO_IMAGE = '/images/hero/mcSoccerCamp2024-31.jpg' // Image showing school building

const Programs = () => {

  return (
    <div className="min-h-screen bg-gradient-to-b from-mc-blue via-mc-blue/95 to-white">
      {/* Hero Section with Background */}
      <div 
        className="relative h-48 mb-12 overflow-hidden"
        style={{
          backgroundImage: `url(${PROGRAM_HERO_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%' // Adjusted to better show the school building
        }}
      >
        <div className="absolute inset-0 bg-mc-blue/70 backdrop-blur-sm"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <img 
                src="/branding/soccerBearTatBrown.png" 
                alt="Programs" 
                className="w-12 h-12"
              />
              <h1 className="text-4xl font-bold text-white">Summer Programs</h1>
            </div>
            <div className="h-1 w-24 bg-mc-gold mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Program Cards - Moved up closer to hero */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Link 
            to="/register" 
            state={{ program: 'youth' }}
            className="bg-white rounded-xl p-8 shadow-lg transform transition-all hover:scale-[1.02] block"
          >
            <div className="flex items-center mb-6">
              <img 
                src="/branding/soccerBearTatBrown.png" 
                alt="Youth Program" 
                className="w-16 h-16 mr-4"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Youth Program</h2>
                <p className="text-gray-600">Ages 8-14</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-mc-blue mb-2">Schedule</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• July 28-31, 2025</li>
                  <li>• 8:00 AM - 12:00 PM daily</li>
                  <li>• Brother Gilbert Stadium (Donovan Field)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-mc-blue mb-2">Program Features</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Fundamental skill development</li>
                  <li>• Small-sided games</li>
                  <li>• Fun, engaging drills</li>
                  <li>• Professional coaching</li>
                  <li>• Daily goalkeeper training</li>
                </ul>
              </div>

              <div>
                <p className="text-3xl font-bold text-mc-blue mb-4">$199</p>
                <div className="text-center bg-mc-gold text-mc-blue px-6 py-3 rounded-md font-bold">
                  Register Now
                </div>
              </div>
            </div>
          </Link>

          <Link 
            to="/register" 
            state={{ program: 'highschool' }}
            className="bg-white rounded-xl p-8 shadow-lg transform transition-all hover:scale-[1.02] block"
          >
            <div className="flex items-center mb-6">
              <img 
                src="/branding/lancerGirlsSoccerladyLancerBluered@3x.png" 
                alt="High School Program" 
                className="w-16 h-16 mr-4"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">High School Program</h2>
                <p className="text-gray-600">Grades 8-12</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-mc-blue mb-2">Schedule</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• July 22-26, 2025</li>
                  <li>• 9:00 AM - 2:00 PM daily</li>
                  <li>• Brother Gilbert Stadium (Donovan Field)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-mc-blue mb-2">Program Features</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Advanced tactical training</li>
                  <li>• Position-specific development</li>
                  <li>• Competitive scrimmages</li>
                  <li>• College prep guidance</li>
                  <li>• Video analysis sessions</li>
                </ul>
              </div>

              <div>
                <p className="text-3xl font-bold text-mc-blue mb-4">$249</p>
                <div className="text-center bg-mc-gold text-mc-blue px-6 py-3 rounded-md font-bold">
                  Register Now
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Contact - Styled similarly to navbar branding */}
        <div className="text-center mb-12 bg-white rounded-xl p-8 shadow-lg">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/branding/soccerBearTatBrown.png" 
              alt="Contact" 
              className="w-8 h-8"
            />
            <div className="flex flex-col items-start">
              <span className="font-bold text-gray-800 text-lg leading-tight">
                Questions?
              </span>
              <a 
                href="mailto:mcgirlssoccer12@gmail.com" 
                className="text-mc-blue hover:text-mc-gold transition-colors font-bold text-lg leading-tight"
              >
                mcgirlssoccer12@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Programs