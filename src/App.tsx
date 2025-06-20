import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Registration from './pages/Registration'
import Programs from './pages/Programs'
import Gallery from './pages/Gallery'
import RegistrationSuccess from './pages/RegistrationSuccess'
import AdminRegistrations from './pages/AdminRegistrations'
import Contact from './pages/Contact'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

// Set default appearance for Stripe Elements
const stripeOptions = {
  appearance: {
    theme: "stripe" as const,
    variables: {
      colorPrimary: '#003087',
    },
  },
}

function App() {
  return (
    <Router>
      <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-b from-mc-blue to-mc-blue-dark">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Elements stripe={stripePromise} options={stripeOptions}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/registration-success" element={<RegistrationSuccess />} />
              <Route path="/admin-registrations" element={<AdminRegistrations />} />
            </Routes>
          </Elements>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
