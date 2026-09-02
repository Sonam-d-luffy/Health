import React, { useState } from 'react';
import { User, GraduationCap, Users, School, X, HelpCircle, icons,  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import assets from '../assets/assets';
import { useCurrentUser } from '../Context/CurrentUserContext';

const HomeNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const instLoginPage = () => navigate('/instituteLogin');
  const record = () => navigate('/record');
  const playerLoginPage = () => navigate('/playerLogin');
  const {currentUser} = useCurrentUser()

  const loginOptions = [
    {
      title: 'Login as Player',
      icon: <GraduationCap className="w-6 h-6" />,
      description: 'Access your student dashboard',
      gradient: 'from-sky-400 to-blue-500',
      onClick: playerLoginPage
    },
    {
      title: 'Activity Tracker',
      icon: <User className="w-6 h-6" />,
      description: 'Track your activities',
      gradient: 'from-blue-400 to-indigo-500',
      onClick: record
    },
    {
      title: 'Login as Institute',
      icon: <School className="w-6 h-6" />,
      description: 'Administrative access',
      gradient: 'from-sky-500 to-cyan-500',
      onClick: instLoginPage
    },
    {
      title: 'Login as Admin',
      icon: <Users className="w-6 h-6" />,
      description: "Monitor the management",
      gradient: 'from-blue-500 to-sky-600',
    },
  ];

  return (
    <>
     <Navbar logo={assets.clogo} title="sports sarthi"  onButtonClick={() => setSidebarOpen(!sidebarOpen)} buttonName={currentUser? currentUser?.name : "Login"}/>
       <div className="flex flex-1">
        {/* Sidebar (toggleable) */}
        {sidebarOpen && (
          <Sidebar
            logo={assets.clogo}
            title="Choose Login Option"
            cards={loginOptions.map((opt) => ({
              title: opt.title,
              info: opt.description,
              icon: opt.icon,
              onClick: opt.onClick
            
            }))}
          />
        )}
        </div>
    </>
  );
};

export default HomeNavbar;
