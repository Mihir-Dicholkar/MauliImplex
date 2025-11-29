import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function Inquiry() {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 6; // adjust how many inquiries per page

  // Fetch inquiries from backend
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/inquiries");
        const data = Array.isArray(res.data) ? res.data : [];
        // Sort: unread on top
        setInquiries(data.sort((a, b) => a.read - b.read));
      } catch (err) {
        console.error("Error fetching inquiries", err);
      }
    };
    fetchInquiries();
  }, []);

  // Mark as read when opening
  const handleOpenInquiry = async (inquiry) => {
    setSelectedInquiry(inquiry);
    if (!inquiry.read) {
      try {
        const res = await axios.put(
          `http://localhost:5000/api/inquiries/${inquiry._id}`,
          { read: true }
        );
        setInquiries((prev) =>
          prev
            .map((i) => (i._id === inquiry._id ? res.data : i))
            .sort((a, b) => a.read - b.read)
        );
      } catch (err) {
        console.error("Error marking as read", err);
      }
    }
  };

  // Mark as unread
  const handleMarkUnread = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/inquiries/${id}`, {
        read: false,
      });
      setInquiries((prev) =>
        prev
          .map((i) => (i._id === id ? res.data : i))
          .sort((a, b) => a.read - b.read)
      );
      setSelectedInquiry(null); // close modal
    } catch (err) {
      console.error("Error marking as unread", err);
    }
  };

  // Delete only if read
  const handleDelete = async (id, read) => {
    if (!read) return alert("You can delete only after reading the inquiry.");
    try {
      await axios.delete(`http://localhost:5000/api/inquiries/${id}`);
      setInquiries((prev) => prev.filter((i) => i._id !== id));
      setSelectedInquiry(null);
    } catch (err) {
      console.error("Error deleting inquiry", err);
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * inquiriesPerPage;
  const indexOfFirst = indexOfLast - inquiriesPerPage;
  const currentInquiries = inquiries.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(inquiries.length / inquiriesPerPage);

  return (
    <div className="p-6 min-h-screen rounded-3xl bg-gradient-to-r from-blue-200 via-amber-400 to-pink-300">
      <h1 className="text-2xl font-bold mb-6">📬 Admin Inbox</h1>

      {/* Inquiry Grid */}
      <div className="flex flex-col gap-4">
        {currentInquiries.map((inq) => (
          <div
            key={inq._id}
            onClick={() => handleOpenInquiry(inq)}
            className={`p-4 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-105 ${
              inq.read
                ? "bg-white border border-gray-200"
                : "bg-blue-50 border-2 border-blue-400"
            }`}
          >
            <p className="font-semibold truncate">{inq.email}</p>
            <p className="text-gray-600 truncate">{inq.subject}</p>
            {!inq.read && (
              <span className="text-xs text-blue-600 font-medium">Unread</span>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === idx + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal for selected inquiry */}
      <AnimatePresence>
        {selectedInquiry && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setSelectedInquiry(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                ✖
              </button>

              <h2 className="text-xl font-bold mb-2">
                {selectedInquiry.subject}
              </h2>
              <p className="text-gray-700 mb-1">
                <strong>From:</strong> {selectedInquiry.email}
              </p>
              <p className="text-gray-600 whitespace-pre-line mb-4">
                {selectedInquiry.message}
              </p>

              <div className="flex justify-between gap-3">
                {/* Mark Unread button */}
                {selectedInquiry.read && (
                  <button
                    onClick={() => handleMarkUnread(selectedInquiry._id)}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-black hover:bg-blue-600 transition"
                  >
                    Mark as Unread
                  </button>
                )}

                {/* Delete button */}
                <button
                  onClick={() =>
                    handleDelete(selectedInquiry._id, selectedInquiry.read)
                  }
                  className={`px-4 py-2 rounded-lg text-white ${
                    selectedInquiry.read
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Inquiry;
