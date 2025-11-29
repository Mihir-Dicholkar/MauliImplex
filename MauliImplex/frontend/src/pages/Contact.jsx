import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// const BG_VIDEO =
//   "https://videos.pexels.com/video-files/4121740/4121740-uhd_2560_1440_25fps.mp4"; // placeholder

export default function Contact() {
  const [form, setForm] = useState({ email: "", subject: "", context: "" });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [showModal, setShowModal] = useState(false);
    const [bgMedia, setBgMedia] = useState(null); // dynamic media from backend

  // 🔹 Fetch background media for Contact section

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/assigned-media/Contact");
        console.log("Contact API response:", res.data);

        // Directly set object instead of checking for array
        if (res.data && res.data.fileUrl) {
          setBgMedia(res.data);
        }
      } catch (err) {
        console.error("Error fetching Contact media:", err);
      }
    };

    fetchMedia();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.email || !form.subject || !form.context) return "Please fill all fields";
    const emailOK = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(form.email);
    if (!emailOK) return "Please enter a valid email";
    return "";
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const v = validate();
  if (v) {
    setStatus({ type: "error", msg: v });
    return;
  }
  setSending(true);
  setStatus({ type: "", msg: "" });
  try {
    // ✅ Map context → message for backend
  await axios.post("http://localhost:5000/api/inquiries", {
  email: form.email,
  subject: form.subject,
  message: form.context,
});

    setStatus({ type: "success", msg: "Thanks! Your inquiry has been sent." });
    setForm({ email: "", subject: "", context: "" });
    setShowModal(true); // ✅ trigger modal
  } catch (err) {
    setStatus({
      type: "error",
      msg: err?.response?.data?.message || "Something went wrong. Please try again.",
    });
  } finally {
    setSending(false);
  }
};


  return (
    <>
      <Header />
      <main className="relative min-h-[calc(100vh-140px)] overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 -z-10">
        {bgMedia ? (
        bgMedia.mediaType === "video" ? (
          <video
            src={bgMedia.fileUrl}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={bgMedia.fileUrl}
            alt="contact-background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )
      ) : (
        // fallback
        <video
          src="/fallback.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
          <div className="absolute inset-0 bg-black/40" />
        </div>


        {/* Decorative Blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-orange-400 via-amber-300 to-yellow-300 opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-400 via-lime-300 to-green-300 opacity-40 blur-3xl" />

        {/* Content */}
        <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-26 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-center text-4xl font-extrabold tracking-tight text-white drop-shadow md:text-5xl"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-10 max-w-2xl text-center text-white/90"
          >
            Have a question about our fresh imports, partnerships, or orders? Send us a
            note and we’ll get back to you quickly.
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full max-w-2xl rounded-2xl border border-white/20 bg-white/20 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.3)] backdrop-blur-xl sm:p-8"
          >
            {/* Status Banner */}
            {status.msg && (
              <div
                className={`${
                  status.type === "success"
                    ? "bg-emerald-500/20 text-emerald-100 border-emerald-400/40"
                    : "bg-rose-500/20 text-rose-100 border-rose-400/40"
                } mb-6 rounded-xl border px-4 py-3 text-sm`}
              >
                {status.msg}
              </div>
            )}

            {/* Email */}
            <label
              className="mb-2 block text-sm font-medium text-white/90"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mb-5 w-full rounded-xl border border-white/30 bg-white/70 px-4 py-3 text-gray-800 outline-none transition focus:border-white focus:ring-2 focus:ring-white/60"
              required
            />

            {/* Subject */}
            <label
              className="mb-2 block text-sm font-medium text-white/90"
              htmlFor="subject"
            >
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              placeholder="Inquiry subject"
              className="mb-5 w-full rounded-xl border border-white/30 bg-white/70 px-4 py-3 text-gray-800 outline-none transition focus:border-white focus:ring-2 focus:ring-white/60"
              required
              maxLength={120}
            />

            {/* Context */}
            <label
              className="mb-2 block text-sm font-medium text-white/90"
              htmlFor="context"
            >
              Message
            </label>
            <textarea
              id="context"
              name="context"
              rows={6}
              value={form.context}
              onChange={handleChange}
              placeholder="Tell us more about your inquiry..."
              className="mb-6 w-full resize-y rounded-xl border border-white/30 bg-white/70 px-4 py-3 text-gray-800 outline-none transition focus:border-white focus:ring-2 focus:ring-white/60"
              required
              maxLength={2000}
            />

            {/* Submit */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={sending}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-lime-400 to-amber-400 px-6 py-3 font-semibold text-gray-900 shadow-lg transition-transform hover:scale-[1.02] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              >
                {/* SVG with linear-gradient stroke */}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <defs>
                    <linearGradient
                      id="planeGradient"
                      x1="0"
                      y1="0"
                      x2="24"
                      y2="24"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#a3e635" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M21 3L3 10.5l7.5 2.5L13 20l8-17z"
                    stroke="url(#planeGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinejoin="round"
                  />
                </svg>
                {sending ? "Sending..." : "Send Inquiry"}
                <span
                  className="absolute inset-0 -z-10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60"
                  style={{
                    background:
                      "linear-gradient(90deg,#10b981,#a3e635,#f59e0b)",
                  }}
                />
              </button>
            </div>
          </motion.form>
        </section>

        {/* ✅ Success Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
                  alt="Success"
                  className="mx-auto mb-4 h-20 w-20"
                />
                <h2 className="mb-2 text-2xl font-bold text-gray-800">
                  Message Sent!
                </h2>
                <p className="mb-6 text-gray-600">
                  Thank you for reaching out. We’ll get back to you soon.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 px-6 py-2 font-semibold text-white shadow-lg hover:scale-105 transition"
                >
                  Close
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
