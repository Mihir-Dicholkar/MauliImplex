import React from "react";
import { FaTimes } from "react-icons/fa";

const UploadGuidelines = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      {/* Sliding Panel */}
      <div className="w-full max-w-md h-full bg-white shadow-lg transform translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-red-600 text-xl"
        >
          <FaTimes />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-4 text-yellow-700">Upload Guidelines 📋</h2>

        <div className="space-y-6 text-sm text-gray-700">
          {/* Video Guidelines */}
          <div>
            <h3 className="font-semibold text-lg mb-2">🎥 Video Upload</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Accepted formats: <strong>.mp4, .webm, .mov, .avi</strong></li>
              <li>Max file size: <strong>150MB</strong></li>
              <li>Recommended length: <strong>&lt; 240 seconds</strong></li>
              <li>Portrait videos: <strong>aspect ratio 9:16</strong></li>
              <li>Landscape videos: <strong>aspect ratio 16:9</strong></li>
            </ul>
          </div>

          {/* Image Guidelines */}
          <div>
            <h3 className="font-semibold text-lg mb-2">🖼️ Image Upload</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Accepted formats: <strong>.jpg, .jpeg, .png, .webp</strong></li>
              <li>Max file size: <strong>5MB</strong></li>
              <li>Portrait images: <strong>minimum 720x1280</strong></li>
              <li>Landscape images: <strong>minimum 1280x720</strong></li>
            </ul>
          </div>

          {/* External Links */}
          <div>
            <h3 className="font-semibold text-lg mb-2">🔗 External Links</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>You can add <strong>external URLs</strong> for videos or images.</li>
              <li>Use reliable hosting platforms (e.g., YouTube, Vimeo, Imgur).</li>
              <li>Select whether the link is for <strong>portrait</strong> or <strong>landscape</strong> usage.</li>
            </ul>
          </div>

          {/* Best Practices */}
          <div>
            <h3 className="font-semibold text-lg mb-2">✅ Best Practices</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Use high-resolution media for better user experience.</li>
              <li>Compress large files before uploading.</li>
              <li>Avoid overly long or large videos for better loading time.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadGuidelines;
