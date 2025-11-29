import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function Gallery() {
  const [media, setMedia] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  // --- Static Media ---
  const staticMedia = [
    {
      _id: "static1",
      mediaType: "video",
      fileUrl: "https://assets.mixkit.co/videos/4668/4668-720.mp4",
      position: "Gallery-Portrait",
    },
    {
      _id: "static2",
      mediaType: "image",
      fileUrl: "https://images.unsplash.com/photo-1523472721958-978152f4d69b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTMzfHxmcnVpdHxlbnwwfDB8MHx8fDI%3D",
      position: "Gallery-Portrait",
    },
    {
      _id: "static3",
      mediaType: "video",
      fileUrl: "https://assets.mixkit.co/videos/42946/42946-720.mp4",
      position: "Gallery-Quality",
    },
    {
      _id: "static3",
      mediaType: "video",
      fileUrl: "https://assets.mixkit.co/videos/3686/3686-720.mp4",
      position: "Gallery-Quality",
    },
    {
      _id: "static3",
      mediaType: "video",
      fileUrl: "https://assets.mixkit.co/videos/42956/42956-720.mp4",
      position: "Gallery-Products",
    },
    {
      _id: "static4",
      mediaType: "image",
      fileUrl: "https://images.unsplash.com/photo-1453487021979-5b739b2849f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJ1aXR8ZW58MHwwfDB8fHwy",
      position: "Gallery-Quality",
    },
    {
      _id: "static5",
      mediaType: "image",
      fileUrl: "https://images.unsplash.com/photo-1581375321224-79da6fd32f6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fGZydWl0fGVufDB8MHwwfHx8Mg%3D%3D",
      position: "Gallery-Products",
    },
  ];

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/assigned-media");
        const fetched = res.data.data || res.data.assignedMedia || res.data || [];
        setMedia([...staticMedia, ...fetched]); // merge static + dynamic
      } catch (err) {
        console.error("Failed to load gallery media:", err);
        setMedia(staticMedia); // fallback only static
      }
    };
    fetchMedia();
  }, []);

  const getMediaByPosition = (position, type) =>
    Array.isArray(media)
      ? media.filter((m) => m.position === position && m.mediaType === type)
      : [];

  // Fullscreen animation
  const fullscreenVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  // Section wrapper
  const Section = ({ title, position }) => {
    const videos = getMediaByPosition(position, "video");
    const images = getMediaByPosition(position, "image");

    return (
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 bg-clip-text text-transparent">
          {title}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side: Only Videos */}
          <div className="grid gap-6">
            {videos.map((item) => (
              <motion.div
                key={item._id}
                className="relative cursor-pointer"
                whileHover={{ scale: 1.03 }}
                onClick={() => setActiveItem(item)}
              >
                <video
                  src={item.fileUrl}
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                  muted
                  autoPlay
                  loop
                />
                <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
              </motion.div>
            ))}
          </div>

          {/* Right side: Only Images */}
          <div className="grid gap-6">
            {images.map((item) => (
              <motion.div
                key={item._id}
                className="relative cursor-pointer"
                whileHover={{ scale: 1.03 }}
                onClick={() => setActiveItem(item)}
              >
                <img
                  src={item.fileUrl}
                  alt="Gallery item"
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
                <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      <Header />
      <main className="px-6 pt-32 pb-12 min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-rose-50">
        <div className="relative z-10 space-y-24">
          <Section title="Collection & Sourcing" position="Gallery-Portrait" />
          <Section title="Quality & Standards" position="Gallery-Quality" />
          <Section title="Sorting & Processing" position="Gallery-Sorting" />
          <Section title="Our Products" position="Gallery-Products" />
          <Section title="Farms & Origins" position="Gallery-Farms" />
        </div>
      </main>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
            variants={fullscreenVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setActiveItem(null)}
          >
            {activeItem.mediaType === "video" ? (
              <motion.video
                src={activeItem.fileUrl}
                controls
                autoPlay
                className="max-w-5xl max-h-[80vh] rounded-xl shadow-2xl"
              />
            ) : (
              <motion.img
                src={activeItem.fileUrl}
                alt="Fullscreen"
                className="max-w-5xl max-h-[80vh] rounded-xl shadow-2xl"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default Gallery;
