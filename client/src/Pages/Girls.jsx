import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import assets from '../assets/assets';

const Girls = () => {
  const [academy, setAcademy] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate()
  const enroll = (acaId) => {
    navigate(`/academy/${acaId}`)
  }

  useEffect(() => {
    const fetchAca = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/academy/girls');
        setAcademy(res.data.institutes || []);
        setMessage(res.data.message || '');
      } catch (error) {
        setMessage(error?.response?.data?.message || 'Server Error');
      }
    };

    fetchAca(); // <-- make sure to call the function
  }, []);
 return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${assets.s1})`,
        }}
      />
      
      {/* Light Magenta Glassmorphism Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-200/15 via-purple-200/10 to-fuchsia-300/20 backdrop-blur-sm" />
      
      {/* Subtle Floating Effects */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-gradient-to-r from-pink-200/20 to-purple-300/15 rounded-full blur-2xl animate-pulse" />
      <div className="fixed bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-purple-200/10 to-fuchsia-300/15 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="fixed top-1/2 right-1/3 w-24 h-24 bg-gradient-to-r from-fuchsia-200/20 to-pink-300/20 rounded-full blur-xl animate-pulse delay-500" />

      {/* Navbar */}
      <Navbar 
        title={'Girls\' Academies'} 
        buttonName={'Home'} 
        onButtonClick={() => navigate('/')} 
        logo={assets.clogo}
      />

      {/* Main Content */}
      <div className="relative z-10 pt-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Girls' Sports Academies
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-300 to-purple-400 mx-auto rounded-full" />
          </div>

          {/* Content Area */}
          {academy.length === 0 ? (
            <div className="text-center p-8 backdrop-blur-lg bg-white/15 border border-white/30 rounded-2xl shadow-xl max-w-md mx-auto">
              <p className="text-white text-lg font-medium">
                {message || 'No institutes found'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {academy.map((inst) => (
                <div 
                  key={inst._id} 
                  className="backdrop-blur-lg bg-white/15 border border-white/30 rounded-2xl shadow-xl overflow-hidden hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl"
                >
                  {/* Academy Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={inst.docs.image} 
                      alt={inst.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Academy Content */}
                  <div className="p-6">
                    {/* Academy Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                        {inst.name}
                      </h3>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full" />
                    </div>

                  {/* Academy Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <span className="text-pink-200 font-medium text-sm mr-2 mt-0.5">📍</span>
                      <div>
                        <span className="text-pink-200 font-medium text-sm">Location:</span>
                        <p className="text-white text-sm mt-1">{inst.address.state} , {inst.address.district}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <span className="text-pink-200 font-medium text-sm mr-2">👥</span>
                      <span className="text-pink-200 font-medium text-sm mr-2">For Girls:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        inst.forGirls 
                          ? 'bg-gradient-to-r from-green-300/80 to-emerald-400/80 text-green-800' 
                          : 'bg-gradient-to-r from-red-300/80 to-rose-400/80 text-red-800'
                      }`}>
                        {inst.forGirls ? 'Yes' : 'No'}
                      </span>
                    </div>

                    {/* Description if available */}
                    {inst.description && (
                      <div className="pt-2">
                        <p className="text-white/90 text-sm leading-relaxed">
                          {inst.description}
                        </p>
                      </div>
                    )}
                  </div>

                    {/* Enroll Button */}
                    <button 
                      onClick={() => enroll(inst._id)}
                      className="w-full py-3 bg-gradient-to-r from-pink-300 to-purple-400 text-white font-semibold rounded-xl hover:from-pink-400 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Message Display */}
          {message && academy.length > 0 && (
            <div className="mt-8 p-4 backdrop-blur-lg bg-white/15 border border-white/30 rounded-2xl shadow-xl max-w-md mx-auto text-center">
              <p className="text-white font-medium">{message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-16" />
    </div>
  );
};


export default Girls;
