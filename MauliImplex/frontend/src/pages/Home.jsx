import React, { useEffect, useState, useRef } from "react";
import { motion} from "framer-motion";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Showcase from "../components/Showcase";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

const products = [
  { name: "Alphonso Mangoes", img: "https://media.istockphoto.com/id/1043378762/photo/mango-product-harvest-from-farm.jpg?s=612x612&w=0&k=20&c=Ev3O_gIVUGet4KvfLmoxAkd6XxVwqU81SPPBR0FQEsg=" },
  { name: "Fresh Apples",type:"video", src: "https://cdn.pixabay.com/video/2023/08/17/176489-855554923_tiny.mp4" },
  { name: "Premium Grapes", img: "https://images.unsplash.com/photo-1745670922388-cc34082bb8cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JhcGVzJTIwY2xvc2UlMjB1cHxlbnwwfHwwfHx8MA%3D%3D" },
  { name: "Dragon Fruit", img: "https://cdn.pixabay.com/photo/2022/01/10/22/49/fruit-6929371_640.jpg" },
  { name: "Bananas", type: "video", 
 src: "https://videos.pexels.com/video-files/2235947/2235947-hd_1920_1080_24fps.mp4" },
  { name: "Alphonso Mangoes",type: "video", src: "https://videos.pexels.com/video-files/11760139/11760139-uhd_2732_1440_30fps.mp4" },
  { name: "Fresh Apples", img: "https://cdn.pixabay.com/photo/2014/08/27/14/42/apple-429213_640.jpg" },
  { name: "Premium Grapes", type: "video", src: "https://videos.pexels.com/video-files/6895108/6895108-uhd_2560_1440_30fps.mp4" },
  { name: "Dragon Fruit",   type: "video", 
 src: "https://videos.pexels.com/video-files/4443529/4443529-hd_1920_1080_25fps.mp4" },
  { name: "Bananas", img: "https://images.unsplash.com/photo-1635847352976-23665317e134?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJhbmFuYSUyMGNsb3NlJTIwdXB8ZW58MHx8MHx8fDA%3D" },
];
// 👉 Put this outside your component or at the top of the file
const mediaItems = [
   {
    type: "video",
    src: "https://media.istockphoto.com/id/2154869960/video/agricultural-activity-in-italy-strawberry-harvesting.mp4?s=mp4-640x640-is&k=20&c=HjQqzIYZ8nTBiJ221uzrXSpoOpr6wsptXxjwOcCbzPs=",
  },
  {
    type: "image",
    src: "https://cdn.pixabay.com/photo/2022/05/26/13/42/jackfruit-7222930_640.jpg",
  },
 
  {
    type: "image",
    src: "https://cdn.pixabay.com/photo/2014/04/11/17/50/banana-321853_640.jpg",
  },
  {
    type: "video",
    src: "https://cdn.pixabay.com/video/2022/11/03/137605-767056181_tiny.mp4",
  },
  {
    type: "image",
    src: "https://cdn.pixabay.com/photo/2015/02/12/16/22/cashew-633918_640.jpg",
  },
  {
    type: "image",
    src: "https://cdn.pixabay.com/photo/2014/03/16/07/56/mango-288333_640.jpg",
  },
];


function Home() {
    const [isHovered, setIsHovered] = useState(false);
     const [activeIndex, setActiveIndex] = useState(null);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
const [heroMedia, setHeroMedia] = useState(null);
  const carouselRef = useRef(null);
    const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const [centeredIndex, setCenteredIndex] = useState(0);
useEffect(() => {
  const fetchHero = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assigned-media/Hero");
      setHeroMedia(res.data);
    } catch (err) {
      console.error("Failed to load hero media:", err);
    }
  };
  fetchHero();
}, []);

    useEffect(() => {
    let interval;
    if (!isHovered) {
      interval = setInterval(() => {
        if (containerRef.current) {
          containerRef.current.scrollBy({
            left: 300,
            behavior: "smooth",
          });
        }
      }, 3000); // autoplay every 3 sec
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  
    useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === activeIndex) {
          video.play().catch(() => {}); // prevent autoplay errors
        } else {
          video.pause();
          video.currentTime = 0; // reset when leaving center
        }
      }
    });
  }, [activeIndex]);
  // Set drag constraints on mount
  useEffect(() => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const clientWidth = carouselRef.current.clientWidth;
      setDragConstraints({ left: -(scrollWidth - clientWidth), right: 0 });
    }
  }, []);

    // On scroll or drag, detect centered card
  const handleScroll = () => {
    if (!carouselRef.current) return;

    const carousel = carouselRef.current;
    const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;

    // Find card closest to carousel center
    let closestIndex = 0;
    let closestDistance = Infinity;

    carousel.childNodes.forEach((child, i) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(carouselCenter - childCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    setCenteredIndex(closestIndex);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Listen to scroll events (including drag scroll)
    carousel.addEventListener("scroll", handleScroll);

    // Call once to set initial centered card
    handleScroll();

    return () => {
      carousel.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Autoplay scroll effect
  useEffect(() => {
    const carousel = carouselRef.current;
    let scrollAmount = 0;

    const autoScroll = () => {
      if (carousel) {
        scrollAmount += 1; // speed
        if (scrollAmount >= carousel.scrollWidth - carousel.clientWidth) {
          scrollAmount = 0; // loop back to start
        }
        carousel.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    };

    const interval = setInterval(autoScroll, 30); // adjust speed by changing interval
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />
      <main className="overflow-x-hidden">
        {/* HERO SECTION */}
        <div className="w-[400px] h-[400px] bg-orange-400 opacity-30 blur-3xl rounded-full absolute top-20 left-10 animate-pulse"></div>
        <div className="w-[450px] h-[450px] bg-yellow-300 opacity-25 blur-3xl rounded-full absolute bottom-20 right-10 animate-pulse"></div>
        <div className="w-[350px] h-[350px] bg-pink-200 opacity-20 blur-3xl rounded-full absolute top-1/3 right-1/4 animate-pulse"></div>
        <section
          id="hero-section"
          className="relative w-full h-screen overflow-hidden"
        >
          {heroMedia ? (
            heroMedia.mediaType === "video" ? (
              <video
                src={heroMedia.fileUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
              />
            ) : (
              <img
                src={heroMedia.fileUrl}
                alt="Hero Banner"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
              />
            )
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-700">No hero media assigned</p>
            </div>
          )}

          <div className="absolute inset-0 flex justify-center items-center z-10">
            <h1
              className="text-5xl text-center md:text-7xl font-bold animate-scale-in 
                 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 
                 bg-clip-text text-transparent"
            >
              Welcome to Mauli Impex
            </h1>
          </div>
        </section>

        {/* ABOUT US SECTION */}
        <section className="py-16 bg-gradient-to-r from-yellow-50 to-orange-100">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <h2 className="text-4xl font-bold text-orange-700 mb-4">
                About Mauli Impex
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Mauli Impex is a major importer & exporter of the finest quality
                fruits, spices & vegetables in India. India is a major food
                source and food exports contribute majorly in our overall
                revenue and earning. Mauli Impex offers various types of food
                exports like Mangoes, Apples, Lemons, Chilli, and we always
                ensure that our services conform to international quality
                standards.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <img
                src="https://cdn.pixabay.com/photo/2013/11/29/15/15/fruit-221158_640.jpg"
                alt="Fresh Fruits"
                className="rounded-2xl shadow-lg"
              />
            </motion.div>
          </div>
        </section>

        {/* FEATURED PRODUCTS SLIDER */}
   <section className="relative py-16 bg-gradient-to-r from-amber-200 via-white to-teal-100 overflow-hidden">
  <div className="absolute inset-0">
    <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
    <div className="absolute -bottom-32 -right-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
  </div>
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            spaceBetween={30}
            loop={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 180,
              modifier: 2.5,
              slideShadows: false,
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            modules={[EffectCoverflow]}
            className="w-full h-200 pt-20 flex items-center justify-center mt-20 max-w-8xl"
          >
            {products.map((product, index) => (
              <SwiperSlide
                key={index}
                className="!w-[390px] !h-[420px] flex items-center justify-center"
              >
                <motion.div
                  animate={{
                    scale: activeIndex === index ? 1.1 : 1,
                    y: activeIndex === index ? -10 : 0,
                    boxShadow:
                      activeIndex === index
                        ? "0px 15px 35px rgba(0,0,0,0.6)"
                        : "0px 5px 15px rgba(0,0,0,0.2)",
                  }}
                  transition={{ type: "spring", stiffness: 250, damping: 25 }}
                  className="w-full h-full mt-9 bg-white rounded-4xl overflow-hidden flex flex-col cursor-pointer"
                >
                  {product.type === "video" ? (
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={product.src}
                      muted
                      loop
                      playsInline
                      className="w-full h-95 object-cover rounded-xl"
                    />
                  ) : (
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-95 object-cover  rounded-l"
                    />
                  )}
                  <h3 className="mt-1 text-lg font-semibold text-gray-800 text-center">
                    {product.name}
                  </h3>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
        {/* MEDIA SHOWCASE SECTION */}
        {/* <section className="relative py-20 bg-gradient-to-r from-amber-500 to-teal-100 bg-fixed bg-center bg-cover">
 <div className="relative grid grid-cols-3 gap-4 p-6 bg-white/5 backdrop-blur-md 
                clip-path-polygon-container shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
  {mediaItems.map((media, index) => {
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
        transition={{ duration: 0.9, delay: 0.9, ease: "easeOut" }}
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
  })}
</div>

</section> */}

        <Showcase sectionName="Showcase" staticItems={mediaItems} />
      </main>
      <Footer />
    </>
  );
}

export default Home;
