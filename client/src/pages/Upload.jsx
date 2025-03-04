import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function UploadPage() {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [descriptionCount, setDescriptionCount] = useState(0);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/genres`);
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const formatTitle = (title) => {
    if (!title) return "";
    return title
      .split(" ") // Split into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter
      .join(" "); // Rejoin words
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the actual file for upload
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setErrorMessage("");
      };
      reader.onerror = () => {
        setErrorMessage("Error reading file");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  useEffect(() => {
    setIsFormValid(
      !!title && description.length >= 10 && description.length <= 700 && !!selectedGenre && !!location && !!image
    );
  }, [title, description, selectedGenre, location, image]);

  const handleSave = async () => {
    if (!isFormValid) {
      setErrorMessage("Please fill all fields and upload an image.");
      return;
    }

    if (!image) {
      setErrorMessage("Please upload an image before saving.");
      return;
    }

    setUploading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      const userId = localStorage.getItem('userId');
      formData.append("userId", userId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("genre_id", selectedGenre);
      formData.append("location", location);
      formData.append("image", image);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/post`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      alert("Picture Uploaded successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error('Error uploading Photo:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Display server error message
      } else {
        setErrorMessage('An error occurred while uploading Photo. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-6xl rounded-lg shadow-lg p-6">
        <h1 className="text-center text-3xl font-semibold text-gray-700 mb-6">Upload Photo with details</h1>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-200">
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="rounded-lg w-full" />
                <button className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full" onClick={removeImage}>
                  ✖
                </button>
              </div>
            ) : (
              <button onClick={handleFileUpload} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                Choose Image
              </button>
            )}
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-lg font-medium">Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(formatTitle(e.target.value))} // Apply formatting on input change
              />
            </div>

            <div className="relative">
              <label className="block text-gray-700 text-lg font-medium">Description</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg"
                rows="3"
                maxLength={700}
                placeholder="Describe the content (10-700 characters)"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setDescriptionCount(e.target.value.length);
                }}
              ></textarea>
              <div className="absolute bottom-2 right-4 text-sm text-gray-500">{descriptionCount}/700</div>
            </div>
            <div>
              <label className="block text-gray-700 text-lg font-medium">Location</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-lg font-medium">Genre</label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option key="default" value="">Select Genre</option>
                {genres.length > 0 ? (
                  genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))
                ) : (
                  <option key="loading" disabled>Loading genres...</option>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={() => navigate("/dashboard")} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!isFormValid || uploading} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;