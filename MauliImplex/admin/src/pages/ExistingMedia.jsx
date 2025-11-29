import React, { useEffect, useState } from "react";
import axios from "axios";

const ExistingMedia = () => {
  const [assignedMedia, setAssignedMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignedMedia = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assigned-media");
      setAssignedMedia(res.data);
    } catch (err) {
      console.error("Failed to fetch assigned media:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedMedia();
  }, []);

  if (loading) {
    return <p className="text-gray-600">Loading assigned media...</p>;
  }

  if (assignedMedia.length === 0) {
    return <p className="text-gray-600">No media assigned yet.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📌 Assigned Media Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignedMedia.map((media, idx) => (
          <div
            key={idx}
            className="border rounded-xl shadow-md overflow-hidden bg-white"
          >
            {/* Header */}
            <div className="p-3 border-b bg-gray-100">
              <h3 className="font-semibold text-lg">{media.position}</h3>
              <p className="text-sm text-gray-500">
                {media.orientation} • {media.mediaType}
              </p>
            </div>

            {/* Preview */}
            <div className="p-3">
              {media.mediaType === "video" ? (
                <video
                  src={media.fileUrl}
                  controls
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <img
                  src={media.fileUrl}
                  alt={media.position}
                  className="w-full h-48 object-cover rounded"
                />
              )}
            </div>

            {/* Footer */}
            <div className="p-3 text-xs text-gray-500 border-t">
              Assigned on: {new Date(media.assignedAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExistingMedia;
