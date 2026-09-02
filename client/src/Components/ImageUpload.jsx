import React, { useState } from "react";

const ImageUpload = ({ onImageChange }) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // preview
      onImageChange(file); // send file to parent
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
      onImageChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 group">
      {/* Interactive Upload Zone */}
      <label 
        className={`relative cursor-pointer transform transition-all duration-300 ease-out ${
          isDragging ? 'scale-110 rotate-3' : 'group-hover:scale-105'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 rounded-3xl object-cover shadow-2xl border-4 border-sky-200/40 backdrop-blur-sm ring-8 ring-sky-100/20 transition-all duration-500 ease-out"
            />
            {/* Overlay for changing image */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-center">
                <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Change</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={`w-40 h-40 rounded-3xl bg-gradient-to-br from-sky-100/15 to-sky-200/15 backdrop-blur-sm flex flex-col items-center justify-center text-sky-700 border-4 border-dashed shadow-2xl ring-8 transition-all duration-500 ease-out ${
            isDragging 
              ? 'border-sky-400/80 ring-sky-200/40 bg-sky-200/30' 
              : 'border-sky-200/30 ring-sky-100/15 group-hover:border-sky-300/50 group-hover:ring-sky-200/25'
          }`}>
            
            {/* Animated Upload Icon */}
            <div className={`transform transition-all duration-300 ${isDragging ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`}>
              <svg className="w-12 h-12 mb-3 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="text-center">
              <span className="text-lg font-bold mb-1 block">
                {isDragging ? 'Drop it!' : 'Click or Drop'}
              </span>
              <span className="text-xs opacity-70 font-medium">
                {isDragging ? 'Release to upload' : 'Upload your image'}
              </span>
            </div>
          </div>
        )}
        
        {/* Enhanced Glowing Ring Effect */}
        <div className={`absolute inset-0 rounded-3xl transition-all duration-700 -z-10 ${
          isDragging 
            ? 'bg-gradient-to-r from-sky-300/30 via-sky-400/20 to-sky-300/30 blur-xl opacity-100 scale-110' 
            : 'bg-gradient-to-r from-sky-200/20 via-sky-300/10 to-sky-200/20 blur-lg opacity-0 group-hover:opacity-100 group-hover:scale-105'
        }`}></div>
      </label>
    </div>
  );
};

export default ImageUpload;