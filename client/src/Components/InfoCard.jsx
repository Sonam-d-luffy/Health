import React from "react";

const InfoCard = ({ image, title, description, onClick, buttonName }) => {
  return (
    <div 
      className="max-w-sm w-full bg-white/15 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden hover:scale-105 hover:bg-white/20 transition-all duration-500 ease-out border border-pink-200/30 group cursor-pointer"
      style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
    >
      {/* Upper half - Image with Overlay */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-pink-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Lower half - Info with Glass Morphism */}
      <div className="relative p-6 flex flex-col justify-between h-48 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md">
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/10 via-pink-200/5 to-pink-100/10 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <h2 className="text-xl font-bold text-pink-800 group-hover:text-pink-900 transition-colors duration-300 mb-2 drop-shadow-sm">
              {title}
            </h2>
            <p className="text-sm text-pink-700/90 leading-relaxed line-clamp-3 group-hover:text-pink-800/95 transition-colors duration-300">
              {description}
            </p>
          </div>

          {/* Button */}
          <button
            onClick={onClick}
            className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-xl shadow-md hover:bg-pink-700 transition-colors duration-300"
          >
            {buttonName}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
