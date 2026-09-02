import React from 'react';
import assets from '../assets/assets';

const Posts = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white">
      <h2 className="mb-6 text-lg md:text-xl font-medium max-w-2xl text-center">
        This page will contain all the posts, more like a social media for Athletes, Coaches, and Academies, to create a digital ecosystem between them.
      </h2>
      <img 
        src={assets.tbc} 
        alt="Coming Soon" 
        className="w-40 h-40 md:w-56 md:h-56 object-contain"
      />
    </div>
  );
};

export default Posts;
