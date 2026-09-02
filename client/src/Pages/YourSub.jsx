import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCurrentUser } from '../Context/CurrentUserContext';
import Navbar from '../Components/Navbar';
import assets from '../assets/assets';

const YourSub = () => {
  const { playerId } = useParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate()

  useEffect(() => {
    console.log(playerId)
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/reports/player/${playerId}`
        );

        const data = res.data.reports ;
        console.log(data)
        setReports(Array.isArray(data) ? data : [data]);
        setMessage(
          res.data.message || (data.length === 0 ? 'No submissions found' : '')
        );
      } catch (error) {
        setMessage(error?.response?.data?.message || 'Error fetching reports');
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    if (playerId) fetchReports();
  }, [playerId]);

   const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'from-green-300/90 to-emerald-400/90 text-green-900';
      case 'rejected':
        return 'from-red-300/90 to-rose-400/90 text-red-900';
      default:
        return 'from-yellow-300/90 to-amber-400/90 text-yellow-900';
    }
  };

 
  if (loading) return (
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
      
      <Navbar title={'My Submissions'} logo={assets.clogo} buttonName={'Home'} onButtonClick={() => navigate('/')}/>
      
      <div className="relative z-10 pt-8 flex items-center justify-center min-h-[60vh]">
        <div className="backdrop-blur-lg bg-white/15 border border-white/30 rounded-2xl shadow-xl p-8">
          <p className="text-white text-lg font-medium">Loading reports...</p>
        </div>
      </div>
    </div>
  );

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
      <div className="fixed top-16 left-12 w-24 h-24 bg-gradient-to-r from-pink-200/25 to-purple-300/20 rounded-full blur-2xl animate-pulse" />
      <div className="fixed bottom-16 right-12 w-32 h-32 bg-gradient-to-r from-purple-200/15 to-fuchsia-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="fixed top-1/2 left-1/4 w-20 h-20 bg-gradient-to-r from-fuchsia-200/30 to-pink-300/25 rounded-full blur-xl animate-pulse delay-500" />

      <Navbar title={'My Submissions'} logo={assets.clogo} buttonName={'Home'} onButtonClick={() => navigate('/')}/>

      {/* Content Below Navbar */}
      <div className="relative z-10 pt-36 px-4">
        <div className="max-w-5xl mx-auto">
          {reports.length === 0 ? (
            <div className="text-center p-6 backdrop-blur-lg bg-white/15 border border-white/30 rounded-2xl shadow-xl max-w-md mx-auto">
              <p className="text-white text-lg font-medium">{message}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reports.map((report, index) =>
                report ? (
                  <div 
                    key={report._id || index}
                    className="backdrop-blur-lg bg-white/15 border border-white/30 rounded-xl shadow-xl p-4 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl group"
                  >
                    {/* Report Content */}
                    <div className="space-y-3">
                      <p className="text-white">
                        <strong className="text-pink-200">Name:</strong> {report.name || 'No name'}
                      </p>
                    
                      <p className="text-white">
                        <strong className="text-pink-200">Sports:</strong>{' '}
                        {report.sports?.join(', ') || 'N/A'}
                      </p>
                      <p className="text-white flex items-center justify-between">
                        <strong className="text-pink-200">Status:</strong> 
                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getStatusColor(report.status)} shadow-lg ml-2`}>
                          {report.status || 'Pending'}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-12" />
    </div>
  );
};

export default YourSub;