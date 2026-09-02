import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import assets from '../assets/assets'
import Navbar from '../Components/Navbar'

const SubmitReport = () => {
  const { playerId, academyId } = useParams();
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    bmi: '',
    bloodPressure: '',
    experience: '',
    sports: '',
    achievements: '',
    image: null,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('height', formData.height);
    data.append('weight', formData.weight);
    data.append('bmi', formData.bmi);
    data.append('bloodPressure', formData.bloodPressure);
    data.append('experience', formData.experience);
    data.append('sports', formData.sports); // comma separated
    data.append('achievements', formData.achievements);
    if (formData.image) data.append('image', formData.image);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/reports/${playerId}/${academyId}`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setMessage(res.data.message);
      alert(res?.data?.message || 'Submission successful')
      navigate('/PlayerDashboard')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting report');
    }
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${assets.s4})`,
        }}
      />
      
      {/* Glassmorphism Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-500/30 via-purple-600/20 to-violet-800/40 backdrop-blur-sm" />
      
      {/* Floating Orbs for Glassy Effect */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-gradient-to-r from-pink-400/30 to-violet-500/30 rounded-full blur-xl animate-pulse" />
      <div className="fixed bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="fixed top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-violet-400/25 to-fuchsia-500/25 rounded-full blur-lg animate-pulse delay-500" />

      {/* Navbar */}
      <Navbar 
        title={'Enroll now'} 
        buttonName={'Home'} 
        onButtonClick={() => navigate('/')} 
        logo={assets.clogo}
      />

      {/* Main Content */}
      <div className="relative z-10 pt-32 px-4">
        <div className="max-w-2xl mx-auto">
        

          {/* Message Display */}
          {message && (
            <div className="mb-6 p-4 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl">
              <p className="text-white text-center font-medium">{message}</p>
            </div>
          )}

          {/* Report Form Container */}
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
            <div className="space-y-6">
              {/* Height and Weight Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wide">
                    Height
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-300"
                    placeholder="Enter height"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wide">
                    Weight
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-300"
                    placeholder="Enter weight"
                  />
                </div>
              </div>

              {/* BMI and Blood Pressure Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wide">
                    BMI
                  </label>
                  <input
                    type="number"
                    name="bmi"
                    value={formData.bmi}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-300"
                    placeholder="Enter BMI"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wide">
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., 120/80"
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wide">
                  Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="Years of experience"
                />
              </div>

              {/* Sports */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wide">
                  Sports (comma separated)
                </label>
                <input
                  type="text"
                  name="sports"
                  value={formData.sports}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="e.g., Football, Basketball, Tennis"
                />
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wide">
                  Achievements
                </label>
                <textarea
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Describe your achievements..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wide">
                  Upload Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600 file:transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-violet-600 text-white font-bold text-lg rounded-xl hover:from-pink-600 hover:via-purple-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-16" />
    </div>
  );
};

export default SubmitReport;
