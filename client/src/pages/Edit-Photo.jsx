import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";

function UpdatePhoto() {
  const navigate = useNavigate();
  const { post_id } = useParams();
  const fileInputRef = useRef(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [descriptionCount, setDescriptionCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/genres`);
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    const fetchPhotoDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/post/${post_id}`);
        const post = response.data;
        setTitle(post.title);
        setDescription(post.description);
        setLocation(post.location);
        setSelectedGenre(post.genre_id);
        setImage(`${import.meta.env.VITE_API_URL}${post.image_path}`);
      } catch (error) {
        console.error("Error fetching photo details:", error);
      }
    };

    fetchGenres();
    fetchPhotoDetails();
  }, [post_id]);

  useEffect(() => {
    setIsFormValid(
      !!title && description.length >= 10 && description.length <= 700 && !!selectedGenre && !!location
    );
  }, [title, description, selectedGenre, location]);

  const formatTitle = (title) => {
    if (!title) return "";
    return title
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSave = async () => {
    if (!image) {
      alert('Please upload an image before saving.');
      return;
    }
  
    setUploading(true);
  
    try {
      // Fetch current post details for comparison
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/post/${post_id}`);
      const originalPost = response.data;
    
      // Prepare data with only changed fields
      const formData = new FormData();
      
  
      if (title !== originalPost.title) formData.append('title', title);
      if (description !== originalPost.description) formData.append('description', description);
      if (selectedGenre !== originalPost.genre_id) formData.append('genre_id', selectedGenre);
      if (location !== originalPost.location) formData.append('location', location);
  
      // Only append image if it's changed
      if (image !== `${import.meta.env.VITE_API_URL}${originalPost.image_path}`) {
        const imgResponse = await fetch(image);
        const blob = await imgResponse.blob();
        const file = new File([blob], 'uploaded_image.jpg', { type: blob.type });
        formData.append('image', file);
      }
  
      // Send the update request
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/post/${post_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      alert('Photo updated successfully!');
      navigate(`/view-photo/${post_id}`);
    } catch (error) {
      console.error('Error updating photo:', error);
      alert(error.response?.data?.message || 'An error occurred while updating the photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this photo?');
    if (!confirmDelete) return; // Exit if user cancels

    try {
      setLoading(true); // Set loading state

        await axios.delete(`${import.meta.env.VITE_API_URL}/api/post/${post_id}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        alert('photo deleted successfully!');
        navigate('/dashboard');
    } catch (error) {
        console.error('Error deleting photo:', error.response?.data || error.message);
        alert('Failed to delete photo. Please try again.');
    } finally {
        setLoading(false); // Reset loading state
    }
};
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-6xl rounded-lg shadow-lg p-6">
        <h1 className="text-center text-3xl font-semibold text-gray-700 mb-6">Edit Photo</h1>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-200">
            {image ? (
              <div className="flex-1 relative w-full h-64">
                <img src={image} alt="image" className=" w-full" />
                <button className="absolute top-1 right-1 bg-red-500 text-red " onClick={removeImage}>
                  ✖
                </button>
              </div>
            ) : (
              <button onClick={handleFileUpload} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                Choose Image
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />
              </button>
            )}
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
          <button onClick={handleSave} disabled={!isFormValid || uploading} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          {uploading ? "updating..." : "Update"}
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
            Delete
          </button>
          <button onClick={() => navigate(`/view-photo/${post_id}`)} className="bg-gray-500 text-white py-2 px-2  rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Cancel
          </button> 
        </div>
      </div>
    </div>
  );
}

export default UpdatePhoto;
