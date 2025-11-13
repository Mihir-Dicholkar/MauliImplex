import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import {
  FaAward,
  FaGlobe,
  FaBullhorn,
  FaLeaf,
  FaHandshake,
  FaUsers,
} from "react-icons/fa";
import axios from "axios";

const About = () => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/assigned-media");
        setMedia(res.data.data || res.data.assignedMedia || res.data || []);
      } catch (err) {
        console.error("Failed to fetch about intro media:", err);
      }
    };
    fetchMedia();
  }, []);

  // helper like in Gallery
  const getMediaByPosition = (position, type) =>
    Array.isArray(media)
      ? media.filter((m) => m.position === position && m.mediaType === type)
      : [];

  return (
    <>
      <Header />
      <main className="relative bg-gradient-to-r from-yellow-50 to-orange-100 min-h-screen my-12 pb-5 overflow-hidden">
        {/* Decorative blobs */}
        <div className="w-[400px] h-[400px] bg-orange-400 opacity-30 blur-3xl rounded-full absolute top-20 left-10 animate-pulse"></div>
        <div className="w-[450px] h-[450px] bg-yellow-300 opacity-25 blur-3xl rounded-full absolute bottom-20 right-10 animate-pulse"></div>
        <div className="w-[350px] h-[350px] bg-pink-200 opacity-20 blur-3xl rounded-full absolute top-1/3 right-1/4 animate-pulse"></div>
        {/* Intro Section */}
        <section className="relative container mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
            className="md:w-1/2 z-10"
          >
            <h2 className="text-4xl font-bold mb-6 text-orange-700">
              About Mauli Impex
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Mauli Impex is a major importer & exporter of the finest quality
              fruits, spices & vegetables in India. We ensure that our products
              meet international quality standards and reach customers fresh and
              timely. Our business spans mangoes, apples, lemons, chilies, and
              more — connecting growers with global markets.
            </p>
          </motion.div>

          {/* Dynamic Hero Media */}
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
            className="md:w-1/2 rounded-lg overflow-hidden shadow-lg z-10"
          >
            {(() => {
              const heroVideo = getMediaByPosition("About-Hero", "video")[0];
              const heroImage = getMediaByPosition("About-Hero", "image")[0];

              if (heroVideo) {
                return (
                  <video
                    src={heroVideo.fileUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-150 object-cover rounded-xl 
             shadow-[0_25px_50px_rgba(0,0,0,0.25)] 
             hover:shadow-[0_35px_60px_rgba(0,0,0,0.35)] 
             hover:scale-105 
             transition-all duration-500"
                  />
                );
              } else if (heroImage) {
                return (
                  <img
                    src={heroImage.fileUrl}
                    alt="About section"
                    className="w-full h-auto object-cover"
                  />
                );
              } else {
                return (
                  <img
                    src="https://cdn.pixabay.com/photo/2013/11/29/15/15/fruit-221158_640.jpg"
                    alt="Fresh fruits"
                    className="w-full h-auto object-cover"
                  />
                );
              }
            })()}
          </motion.div>
        </section>
        {/* Core Values */}
        <section className="container mx-auto px-6 mt-20 relative z-10">
          <h3 className="text-3xl font-semibold text-center text-orange-700 mb-10">
            Our Core Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaLeaf className="text-green-500 w-12 h-12 mb-4" />,
                title: "Sustainability",
                desc: "We believe in eco-friendly sourcing and farming.",
              },
              {
                icon: (
                  <FaHandshake className="text-yellow-600 w-12 h-12 mb-4" />
                ),
                title: "Integrity",
                desc: "Transparent and fair trade practices.",
              },
              {
                icon: <FaUsers className="text-blue-600 w-12 h-12 mb-4" />,
                title: "Community",
                desc: "Empowering farmers & building long-term relations.",
              },
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
              >
                {icon}
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {title}
                </h4>
                <p className="text-gray-600">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
        {/* Company Journey / Timeline */}{" "}
        <section className="container mx-auto px-6 mt-20 relative z-10">
          {" "}
          <h3 className="text-3xl font-semibold text-center text-orange-700 mb-10">
            {" "}
            Our Journey{" "}
          </h3>{" "}
          <div className="relative border-l-4 border-orange-400 ml-6">
            {" "}
            {[
              {
                year: "2015",
                text: "Founded with a vision to deliver premium produce.",
              },
              {
                year: "2018",
                text: "Expanded into international export markets.",
              },
              {
                year: "2022",
                text: "Recognized with national awards for excellence.",
              },
            ].map(({ year, text }, i) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-10 ml-6"
              >
                {" "}
                <span className="absolute -left-4 flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full text-xs text-white font-bold">
                  {" "}
                  {year}{" "}
                </span>{" "}
                <p className="ml-4 text-gray-700">{text}</p>{" "}
              </motion.div>
            ))}{" "}
          </div>{" "}
        </section>{" "}
        <section className="container mx-auto px-6 mt-20 relative z-10">
          {" "}
          <h3 className="text-3xl font-semibold text-center text-orange-700 mb-10">
            {" "}
            Awards & Recognitions{" "}
          </h3>{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {" "}
            {[
              {
                icon: <FaAward className="text-yellow-500 w-12 h-12 mb-4" />,
                title: "Best Importer Award 2023",
                description:
                  "Recognized nationally for excellence in importing fresh produce.",
              },
              {
                icon: <FaGlobe className="text-blue-500 w-12 h-12 mb-4" />,
                title: "Global Export Excellence",
                description:
                  "Awarded for outstanding performance in international food exports.",
              },
              {
                icon: <FaBullhorn className="text-red-500 w-12 h-12 mb-4" />,
                title: "Top Advertising Campaign",
                description:
                  "Honored for innovative marketing strategies in the food trade industry.",
              },
            ].map(({ icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
              >
                {" "}
                {icon}{" "}
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {" "}
                  {title}{" "}
                </h4>{" "}
                <p className="text-gray-600">{description}</p>{" "}
              </motion.div>
            ))}{" "}
          </div>{" "}
        </section>
        {/* Journey + Awards stay same ... */}
      </main>
      <Footer />
    </>
  );
};

export default About;
