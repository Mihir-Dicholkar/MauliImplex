import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Showcase = ({ sectionName = "Showcase", staticItems = [] }) => {
  const [mediaItems, setMediaItems] = useState(staticItems);

  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/assigned-media/${sectionName}`
        );

        // Combine static + dynamic
        const combined = [...staticItems, ...(res.data || [])];
        setMediaItems(combined);
      } catch (err) {
        console.error(`Failed to load ${sectionName} media:`, err);
        setMediaItems(staticItems); // fallback only static
      }
    };

    fetchShowcase();
  }, [sectionName, staticItems]);

  return (
    <section className="relative py-20 bg-gradient-to-r from-amber-500 to-teal-100 bg-fixed bg-center bg-cover">
      {/* Gradient Heading */}
      <h2
        className="absolute inset-0 flex items-center text-center  justify-center 
                   text-4xl md:text-7xl font-extrabold tracking-wider 
                   bg-gradient-to-r from-amber-300 via-pink-500 to-teal-400 
                   bg-clip-text text-transparent drop-shadow-lg z-10 pointer-events-none"
      >
        OUR SIGNATURE TRADES
      </h2>

      {/* Media Grid */}
      <div className="relative grid grid-cols-3 gap-4 p-6 bg-white/5 backdrop-blur-md 
                      clip-path-polygon-container shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        {mediaItems.length > 0 ? (
          mediaItems.map((media, index) => {
            const directions = [
              { x: -100, y: 0 },
              { x: 100, y: 0 },
              { x: 0, y: -100 },
              { x: 0, y: 100 },
              { x: -120, y: -120 },
              { x: 120, y: 120 },
            ];
            const dir = directions[index % directions.length];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: dir.x, y: dir.y, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.2 * index, ease: "easeOut" }}
                viewport={{ once: true }}
                className={`relative overflow-hidden rounded-xl shadow-lg 
                            ${index % 3 === 0 ? "col-span-2 row-span-2" : "col-span-1"}`}
              >
                {media.type === "video" ? (
                  <video
                    src={media.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={media.src}
                    alt={`media-${index}`}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-white text-center col-span-3">
            No {sectionName} media available
          </p>
        )}
      </div>
    </section>
  );
};

export default Showcase;
