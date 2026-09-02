import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import assets from '../assets/assets'
import { useCurrentUser } from '../Context/CurrentUserContext'

const AcademyDetails = () => {
  const [academy, setAcademy] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const {currentUser} = useCurrentUser()
  const navigate = useNavigate()
  const report = (playerId , academyId) => {
    navigate(`/${playerId}/${academyId}/report`)
  }
  const { acaId } = useParams()

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true)
      try {
        const res = await axios.get(
          `http://localhost:5000/api/academy/academy/${acaId}`
        )
        setAcademy(res.data.academy)
      } catch (error) {
        setMessage(error?.message || 'No details, sorry')
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [acaId])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `url(${
              assets.s1 ||
              'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop'
            })`,
            filter: 'blur(2px)',
          }}
        />
      </div>

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar
          title={academy?.name}
          logo={assets.clogo}
          buttonName={'Home'}
          onButtonClick={() => navigate('/')}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-32 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {loading && <p className="text-center text-pink-600">Loading...</p>}
          {message && !loading && (
            <p className="text-center text-pink-500">{message}</p>
          )}

          {academy && !loading && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div className="backdrop-blur-2xl bg-pink-500/30 rounded-3xl border border-pink-500/40 overflow-hidden shadow-2xl">
                <div className="relative h-80 md:h-96 overflow-hidden">
                  <img
                    src={academy.docs.image}
                    alt={academy.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-8 left-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl">
                      {academy.name}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="backdrop-blur-2xl bg-pink-500/30 p-8 rounded-3xl border border-pink-500/40 shadow-2xl">
                  <h2 className="text-2xl font-bold text-pink-100 mb-4">
                    Contact Information
                  </h2>
                  <p className="text-white">Email: {academy.email}</p>
                  <p className="text-white">Phone: {academy.phone}</p>
                </div>

                {/* Sports Offered */}
                <div className="backdrop-blur-2xl bg-pink-500/30 p-8 rounded-3xl border border-pink-500/40 shadow-2xl">
                  <h2 className="text-2xl font-bold text-pink-100 mb-4">
                    Sports Offered
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {academy.sports?.map((sport, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-pink-600/40 rounded-full text-white border border-pink-500/40"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="backdrop-blur-2xl bg-pink-500/30 p-8 rounded-3xl border border-pink-500/40 shadow-2xl">
                <h2 className="text-2xl font-bold text-pink-100 mb-4">
                  Academy Address
                </h2>
                <p className="text-white">State: {academy.address.state}</p>
                <p className="text-white">District: {academy.address.district}</p>
                <p className="text-white">Local Area: {academy.address.local}</p>
              </div>

              {/* Enroll Button */}
              <div className="text-center">
                <button
                  onClick={() =>
                   report(currentUser?._id , academy?._id)
                  }
                  className="px-12 py-4 bg-pink-700 text-white rounded-2xl font-bold text-xl hover:bg-pink-800 transition-all duration-300 shadow-lg"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AcademyDetails
