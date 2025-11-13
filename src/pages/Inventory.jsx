import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import axios from "axios";
const Inventory = () => {
  const [editTarget, setEditTarget] = useState(null); // { category: 'portraitImages', index: 2 }

  const [selectedPosition, setSelectedPosition] = useState("");

  // Predefined background positions
  const positions = [
    { name: "Hero", orientation: "landscape", dimensions: "1920x1080" },
    { name: "Showcase", orientation: "landscape", dimensions: "1920x600" },
    { name: "Gallery", orientation: "landscape", dimensions: "1920x300" },
    { name: "About-Hero", orientation: "portrait", dimensions: "1080x1350" },
    { name: "Contact", orientation: "landscape", dimensions: "1920x800" },
    { name: "Gallery-Banner", orientation: "landscape", dimensions: "1920x800" },
    { name: "Gallery-Portrait", orientation: "portrait", dimensions: "1080x1350" },
  ];
  const [media, setMedia] = useState({
    portraitImages: [],
    portraitVideos: [],
    landscapeImages: [],
    landscapeVideos: [],
    externalPortraitVideos: [],
    externalLandscapeVideos: [],
    externalPortraitImages: [], // ✅ must be initialized here
    externalLandscapeImages: [],
  });
  // const positionOrientationMap = {
  //   Hero: "landscape",
  //   Banner: "landscape",
  //   Footer: "landscape",
  //   About: "portrait",
  //   Contact: "landscape",
  // };

  const getFileType = (file) => {
    const ext = file.split(".").pop().toLowerCase();
    return ["mp4", "mov", "avi", "webm"].includes(ext) ? "video" : "image";
  };

  const fetchMedia = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      const categorized = {
        portraitImages: [],
        portraitVideos: [],
        landscapeImages: [],
        landscapeVideos: [],
        externalPortraitVideos: [],
        externalLandscapeVideos: [],
        externalPortraitImages: [],
        externalLandscapeImages: [],
      };

      res.data.forEach((product) => {
        product.portraitFiles?.forEach((file) => {
          const type = getFileType(file);
          const obj = {
            filename: file.split("/").pop(),
            url: `http://localhost:5000/${file}`,
   
            productId: product._id,
          };
          if (type === "image") categorized.portraitImages.push(obj);
          else categorized.portraitVideos.push(obj);
        });

        product.landscapeFiles?.forEach((file) => {
          const type = getFileType(file);
          const obj = {
            filename: file.split("/").pop(),
            url: `http://localhost:5000/${file}`,
  
            productId: product._id,
          };
          if (type === "image") categorized.landscapeImages.push(obj);
          else categorized.landscapeVideos.push(obj);
        });

        product.externalPortraitVideos?.forEach((url) => {
          categorized.externalPortraitVideos.push({
            url,
            // usedIn: product.name,
          });
        });

        product.externalLandscapeVideos?.forEach((url) => {
          categorized.externalLandscapeVideos.push({
            url,
            // usedIn: product.name,
          });
        });

        product.externalPortraitImages?.forEach((url) => {
          categorized.externalPortraitImages.push({
            url,
            // usedIn: product.name,
          });
        });
        product.externalLandscapeImages?.forEach((url) => {
          categorized.externalLandscapeImages.push({
            url,
            // usedIn: product.name,
          });
        });
      });

      setMedia(categorized);
    } catch (err) {
      console.error("Failed to fetch media:", err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleSingleFileDelete = async (productId, fileUrl, category) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/products/file/${productId}`,
        {
          data: { fileUrl, category },
        }
      );
      await fetchMedia();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file.");
    }
  };
  const handleSetAsBackground = (url) => {
    const position = prompt(
      "Enter background position (e.g. header, footer, hero, etc.):"
    );
    if (!position) return;
    // TODO: Save background setting via API or local state
    alert(`Set ${url} as background for ${position}`);
  };
  const renderMediaGrid = (title, items, category) => (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-gray-500">No files uploaded.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item, idx) => {
            const isEditing =
              editTarget?.category === category && editTarget?.index === idx;
            return (
              <div
                key={idx}
                className={`relative rounded-xl overflow-hidden shadow-md border-2 
                  // item.usedIn ? "border-yellow-500" : "border-gray-300"
          `}
              >
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button
                    onClick={() =>
                      setEditTarget(isEditing ? null : { category, index: idx })
                    }
                    className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
                    title="Set as Background"
                  >
                    <FaPencilAlt className="text-blue-600" />
                  </button>
                </div>
                {title.includes("Image") ? (
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-60 object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    controls
                    className="w-full h-60 object-cover"
                  />
                )}
              {isEditing && (
  <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 px-2 py-2">
    <select
      value={selectedPosition}
      onChange={(e) => {
        const selected = e.target.value;
        const selectedPos = positions.find((p) => p.name === selected);

        if (!selectedPos) return;

        const requiredOrientation = selectedPos.orientation;
        const isPortrait = category.toLowerCase().includes("portrait");
        const fileOrientation = isPortrait ? "portrait" : "landscape";

        if (requiredOrientation !== fileOrientation) {
          alert(
            `❌ "${selected}" requires ${requiredOrientation} media.`
          );
          return;
        }

        setSelectedPosition(selected);
      }}
      className="w-full p-1 border rounded mb-2"
    >
      <option value="">Select Position</option>
      {positions.map((pos) => (
        <option key={pos.name} value={pos.name}>
          {pos.name} ({pos.dimensions})
        </option>
      ))}
    </select>

    {/* Assign button (appears only if a position is selected) */}
    {selectedPosition && (
      <button
        onClick={async () => {
          try {
            await axios.post(
              "http://localhost:5000/api/assigned-media/assign",
              {
                position: selectedPosition,
                fileUrl: item.url,
                orientation: category.includes("portrait")
                  ? "portrait"
                  : "landscape",
                mediaType: getFileType(item.url),
              }
            );

            alert(`✅ Assigned successfully to ${selectedPosition}`);
            window.location.reload(); // reloads admin page
          } catch (err) {
            console.error("Assign error:", err);
            alert("❌ Failed to assign media");
          }
        }}
        className="w-full bg-blue-600 text-white rounded p-1 hover:bg-blue-700 transition"
      >
        Assign Media
      </button>
    )}
  </div>
)}

                <div className="p-2 bg-white">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium truncate">
                      {item.filename}
                    </p>
                    <button
                      onClick={() =>
                        handleSingleFileDelete(
                          item.productId,
                          item.url,
                          title.includes("Portrait") ? "portrait" : "landscape"
                        )
                      }
                      className="text-red-600 hover:text-red-800 cursor-pointer text-lg"
                      title="Delete File"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>

                  {/* {item.usedIn && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 shadow-sm">
                      Used in: {item.usedIn}
                    </span>
                  )} */}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
  const renderExternalLinks = (title, items, category) => (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-gray-500">No external links.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item, idx) => {
            const isEditing =
              editTarget?.category === category && editTarget?.index === idx;

            return (
              <div
                key={idx}
                className="relative p-4 border-2 border-blue-300 rounded-xl shadow-sm bg-blue-50"
              >
                {/* Pencil icon (top right) */}
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() =>
                      setEditTarget(isEditing ? null : { category, index: idx })
                    }
                    className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
                    title="Set as Background"
                  >
                    <FaPencilAlt className="text-blue-600" />
                  </button>
                </div>

                {/* Video preview */}
                <video
                  src={item.url}
                  controls
                  className="w-full h-60 object-cover mb-2 rounded"
                />

                {/* Dropdown (visible only if active) */}
                {isEditing && (
                  <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 px-2 py-1">
                  <select
  value={selectedPosition}
  onChange={async (e) => {
    const selected = e.target.value;
    const selectedPos = positions.find((p) => p.name === selected);

    if (!selectedPos) return;

    const requiredOrientation = selectedPos.orientation;

    // Determine file orientation from category
    const isPortrait = category.toLowerCase().includes("portrait");
    const fileOrientation = isPortrait ? "portrait" : "landscape";

    if (requiredOrientation !== fileOrientation) {
      alert(
        `❌ "${selected}" requires ${requiredOrientation} media.`
      );
      return;
    }

    setSelectedPosition(selected);

    await axios.post("http://localhost:5000/api/assigned-media/assign", {
      position: selected,
      fileUrl: item.url,
      orientation: fileOrientation,
      mediaType: getFileType(item.url),
    });

    alert(`✅ Assigned successfully to ${selected}`);
    window.location.reload();
  }}
  className="w-full p-1 border rounded"
>
  <option value="">Select Position</option>
  {positions.map((pos) => (
    <option key={pos.name} value={pos.name}>
      {pos.name} ({pos.dimensions})
    </option>
  ))}
</select>
  {selectedPosition && (
      <button
        onClick={async () => {
          try {
            await axios.post(
              "http://localhost:5000/api/assigned-media/assign",
              {
                position: selectedPosition,
                fileUrl: item.url,
                orientation: category.includes("portrait")
                  ? "portrait"
                  : "landscape",
                mediaType: getFileType(item.url),
              }
            );

            alert(`✅ Assigned successfully to ${selectedPosition}`);
            window.location.reload(); // reloads admin page
          } catch (err) {
            console.error("Assign error:", err);
            alert("❌ Failed to assign media");
          }
        }}
        className="w-full bg-blue-600 text-white rounded p-1 hover:bg-blue-700 transition"
      >
        Assign Media
      </button>
    )}

                  </div>
                )}

                {/* Info */}
                <p className="text-sm font-medium break-all text-blue-800">
                  {item.url}
                </p>
                {item.usedIn && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded">
                    Used in: {item.usedIn}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📁 Media Inventory</h2>

      {renderMediaGrid(
        "🖼️ Portrait Images",
        media.portraitImages,
        "portraitImages"
      )}
      {renderMediaGrid(
        "🎞️ Portrait Videos",
        media.portraitVideos,
        "portraitVideos"
      )}
      {renderMediaGrid(
        "🖼️ Landscape Images",
        media.landscapeImages,
        "landscapeImages"
      )}
      {renderMediaGrid(
        "🎞️ Landscape Videos",
        media.landscapeVideos,
        "landscapeVideos"
      )}

      {renderExternalLinks(
        "🔗 External Portrait Videos",
        media.externalPortraitVideos,
        "External Portrait Videos"
      )}
      {renderExternalLinks(
        "🔗 External Landscape Videos",
        media.externalLandscapeVideos,
        "External Landscape Videos"
      )}
      {renderExternalLinks(
        "🔗 External Portrait Images",
        media.externalPortraitImages,
        "External Portrait Images"
      )}

      {renderExternalLinks(
        "🔗 External Landscape Images",
        media.externalLandscapeImages,
        "External Landscape Images"
      )}
    </div>
  );
};

export default Inventory;
