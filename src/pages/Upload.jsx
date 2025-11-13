import React, { useState } from "react";
import axios from "axios";

import UploadGuidelines from "../components/UploadGuidelines";

function Upload() {
  const [portraitVideos, setPortraitVideos] = useState([]);
  const [landscapeVideos, setLandscapeVideos] = useState([]);
  const [portraitImages, setPortraitImages] = useState([]);
  const [landscapeImages, setLandscapeImages] = useState([]);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploading, setUploading] = useState(false); // flag to indicate upload in progress
  const [externalVideo, setExternalVideo] = useState("");
  const [videoType, setVideoType] = useState("portrait"); // dropdown selection
  const [externalVideos, setExternalVideos] = useState([]);
  const [externalImage, setExternalImage] = useState("");
  const [imageType, setImageType] = useState("portrait"); // default
  const [externalImages, setExternalImages] = useState([]); // [{ url, type }]

  const [showGuidelines, setShowGuidelines] = useState(false);

  const [error, setError] = useState("");

  const validateFiles = async (files) => {
    const validTypes = ["video/mp4", "video/quicktime", "video/webm"];
    const maxSizeMB = 150;
    const maxDurationSec = 240;

    for (let file of files) {
      // Type check
      if (!validTypes.includes(file.type))
        return { valid: false, message: "Invalid file type." };

      // Size check
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        return {
          valid: false,
          message: `File ${file.name} exceeds ${maxSizeMB}MB.`,
        };
      }

      // Duration check using HTMLVideoElement
      const duration = await getVideoDuration(file);
      if (duration >= maxDurationSec) {
        return {
          valid: false,
          message: `File ${file.name} is longer than ${maxDurationSec} seconds.`,
        };
      }
    }

    return { valid: true };
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.onerror = () => reject("Invalid video file.");

      video.src = URL.createObjectURL(file);
    });
  };

  const addExternalVideo = () => {
    console.log("External videos:", externalVideos);

    if (externalVideo.trim() !== "") {
      setExternalVideos([
        ...externalVideos,
        { url: externalVideo, type: videoType },
      ]);
      // <-- add this log
      setExternalVideo(""); // reset input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUploadPercent(0);
    setUploading(true); // Show progress bar on upload start

    // Validate only if files are present
    if (portraitVideos.length) {
      const result = await validateFiles(portraitVideos);
      if (!result.valid) {
        setError(result.message);
        setUploading(false);
        return;
      }
    }

    if (landscapeVideos.length) {
      const result = await validateFiles(landscapeVideos);
      if (!result.valid) {
        setError(result.message);
        setUploading(false);
        return;
      }
    }
    const hasValidExternalVideos = externalVideos.some(
      (v) => v.url.trim() !== ""
    );

    // No files selected at all
    if (
      portraitVideos.length === 0 &&
      landscapeVideos.length === 0 &&
      portraitImages.length === 0 &&
      landscapeImages.length === 0 &&
      !hasValidExternalVideos
    ) {
      if (externalVideo.trim() !== "") {
        setError("You typed a URL but didn't click 'Add URL'.");
      } else {
        setError("Please upload at least one file or add a video URL.");
      }
      setUploading(false);
      return;
    }

    // Categorize external videos
    const externalPortraitVideos = externalVideos
      .filter((v) => v.type === "portrait")
      .map((v) => v.url);

    const externalLandscapeVideos = externalVideos
      .filter((v) => v.type === "landscape")
      .map((v) => v.url);
      const externalPortraitImages = externalImages
  .filter((i) => i.type === "portrait")
  .map((i) => i.url);

const externalLandscapeImages = externalImages
  .filter((i) => i.type === "landscape")
  .map((i) => i.url);




    // Prepare FormData
    const formData = new FormData();
    portraitVideos.forEach((file) => formData.append("portraitVideos", file));
    landscapeVideos.forEach((file) => formData.append("landscapeVideos", file));
    portraitImages.forEach((file) => formData.append("portraitImages", file));
    landscapeImages.forEach((file) => formData.append("landscapeImages", file));

    // Add external video URLs (stringified arrays)
    formData.append(
      "externalPortraitVideos",
      JSON.stringify(externalPortraitVideos)
    );
    formData.append(
      "externalLandscapeVideos",
      JSON.stringify(externalLandscapeVideos)
    );
    formData.append(
      "externalPortraitImages",
      JSON.stringify(externalPortraitImages)
    );
    formData.append(
      "externalLandscapeImages",
      JSON.stringify(externalLandscapeImages)
    );

    try {
      const res = await axios.post(
        "http://localhost:5000/api/products",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadPercent(percent);
          },
        }
      );
      alert("Upload successful!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false); // Hide progress bar after upload
    }
  };

  return (
    <>
      <button
        onClick={() => setShowGuidelines(true)}
        className="fixed bottom-6 right-6 z-50 bg-yellow-400 text-black px-4 py-2 rounded-full shadow hover:bg-yellow-500 transition"
      >
        ℹ️ Guidelines
      </button>
      {showGuidelines && (
        <UploadGuidelines onClose={() => setShowGuidelines(false)} />
      )}

      <h2 className="text-2xl text-center font-bold mb-4">Upload Videos</h2>
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg text-black">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-600">{error}</p>}

          {/* File Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Portrait Videos */}
            <div>
              <label className="block mb-2 font-medium">
                📱 Portrait Videos
              </label>
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={(e) => setPortraitVideos([...e.target.files])}
                className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-yellow-400/80 file:text-black hover:file:bg-yellow-300"
              />
              <ul className="text-sm text-gray-700 mt-1 max-h-24 overflow-y-auto">
                {portraitVideos?.map((file, i) => (
                  <li key={i} className="truncate">
                    🎞️ {file.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Landscape Videos */}
            <div>
              <label className="block mb-2 font-medium">
                🌄 Landscape Videos
              </label>
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={(e) => setLandscapeVideos([...e.target.files])}
                className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-yellow-400/80 file:text-black hover:file:bg-yellow-300"
              />
              <ul className="text-sm text-gray-700 mt-1 max-h-24 overflow-y-auto">
                {landscapeVideos?.map((file, i) => (
                  <li key={i} className="truncate">
                    🎥 {file.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Portrait Images */}
            <div>
              <label className="block mb-2 font-medium">
                🖼️ Portrait Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setPortraitImages([...e.target.files])}
                className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-yellow-400/80 file:text-black hover:file:bg-yellow-300"
              />
              <ul className="text-sm text-gray-700 mt-1 max-h-24 overflow-y-auto">
                {portraitImages?.map((file, i) => (
                  <li key={i} className="truncate">
                    📷 {file.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Landscape Images */}
            <div>
              <label className="block mb-2 font-medium">
                🏞️ Landscape Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setLandscapeImages([...e.target.files])}
                className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-yellow-400/80 file:text-black hover:file:bg-yellow-300"
              />
              <ul className="text-sm text-gray-700 mt-1 max-h-24 overflow-y-auto">
                {landscapeImages?.map((file, i) => (
                  <li key={i} className="truncate">
                    🖼️ {file.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">External Video URL</label>
            <input
              type="text"
              value={externalVideo}
              onChange={(e) => setExternalVideo(e.target.value)}
              placeholder="Enter external image URL"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Orientation Selector */}
          <div className="mt-2">
            <select
              value={videoType}
              onChange={(e) => setVideoType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          {/* Add Button */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => {
                if (!externalVideo)
                  return alert("Please enter a valid image URL");
                setExternalVideos([
                  ...externalVideos,
                  { url: externalVideo, type: videoType },
                ]);
                setExternalVideo(""); // reset input
              }}
              className="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-white"
            >
              Add External Video
            </button>
            <ul className="text-sm text-gray-700 mt-2 max-h-24 overflow-y-auto">
  {externalVideos.map((v, i) => (
    <li key={i}>
      🎞️ [{v.type}] {v.url}
    </li>
  ))}
</ul>

          </div>
          {/* External Image Input */}
          <div>
            <label className="block mb-2 font-medium">External Image URL</label>
            <input
              type="text"
              value={externalImage}
              onChange={(e) => setExternalImage(e.target.value)}
              placeholder="Enter external image URL"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Orientation Selector */}
          <div className="mt-2">
            <select
              value={imageType}
              onChange={(e) => setImageType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          {/* Add Button */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => {
                if (!externalImage)
                  return alert("Please enter a valid image URL");
                setExternalImages([
                  ...externalImages,
                  { url: externalImage, type: imageType },
                ]);
                setExternalImage(""); // reset input
              }}
              className="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-white"
            >
              Add External Image
            </button>
            <ul className="text-sm text-gray-700 mt-2 max-h-24 overflow-y-auto">
  {externalImages.map((i, idx) => (
    <li key={idx}>
      🖼️ [{i.type}] {i.url}
    </li>
  ))}
</ul>

          </div>

          {uploading && (
            <div className="w-full bg-gray-300 rounded-full h-4 mb-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${uploadPercent}%` }}
              />
            </div>
          )}
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-black text-white hover:bg-yellow-500 hover:text-black transition"
          >
            Upload
          </button>
        </form>
      </div>
    </>
  );
}

export default Upload;
//
