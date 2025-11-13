import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";

function Certification() {
  const [activeCert, setActiveCert] = useState(null);

  const certificates = [
    "https://i.ibb.co/6bCgM8N/certificate1.jpg",
    "https://i.ibb.co/X3HHTV0/certificate2.jpg",
    "https://i.ibb.co/gPHSQzJ/certificate3.jpg",
  ];

  return (
    <>
      <Header />
      <main className="relative min-h-screen mt-12 flex flex-col items-center py-16 px-6 bg-gradient-to-r from-orange-100 via-yellow-100 to-orange-50 overflow-hidden">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-orange-700 mb-12 text-center z-10"
        >
          Our Certifications
        </motion.h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 z-10 w-full max-w-6xl">
          {certificates.map((cert, i) => (
            <motion.div
              key={i}
              className="relative rounded-xl shadow-lg overflow-hidden cursor-pointer bg-white"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveCert(cert)}
            >
              <motion.img
                src={cert}
                alt={`Certificate ${i + 1}`}
                className="w-full h-64 object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Active Card Modal */}
        <AnimatePresence>
          {activeCert && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCert(null)}
            >
              <motion.div
                className="relative max-w-3xl w-full rounded-xl shadow-2xl overflow-hidden bg-white"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={activeCert}
                  alt="Active Certificate"
                  className="w-full h-auto object-contain"
                />
                {/* Close Button */}
                <button
                  onClick={() => setActiveCert(null)}
                  className="absolute top-3 right-3 bg-white shadow-lg rounded-full px-3 py-1 text-black font-bold hover:bg-gray-200"
                >
                  ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

export default Certification;
