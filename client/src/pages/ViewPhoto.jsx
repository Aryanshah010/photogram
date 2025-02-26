import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "../api/axios";

const ViewPhoto = () => {
  const { post_id } = useParams();
  const navigate = useNavigate();
  const [photoDetails, setPhotoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPhotoDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/post/${post_id}`);
        setPhotoDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching photo details:", error);
        setError("Failed to fetch photo details.");
        setLoading(false);
      }
    };

    fetchPhotoDetails();
  }, [post_id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 max-w-5xl w-full flex flex-col md:flex-row gap-8">
        {/* Image Section */}
        <div className="flex-1 flex flex-col items-center p-6 w-full h-96 relative">
          <img
            src={`${import.meta.env.VITE_API_URL}${photoDetails.image_path}`}
            alt={photoDetails.title}
            className="w-full h-full object-cover rounded-lg shadow"
          />
          {/* User Profile Section */}
          <div className="flex bottom left-1 flex items-center p-2">
            {photoDetails.user_profile_image ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${photoDetails.user_profile_image}`}
                alt="User Profile"
                className="w-10 h-10 rounded-full border"
              />
            ) : (
              <FaUserCircle size={40} className="text-gray-700" />
            )}
            <p className="ml-2 text-gray-800 font-medium">{photoDetails.username}</p>
          </div>
        </div>
        {/* Details Section */}
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Photo Details</h2>
          <div className="border-t border-gray-300 pt-2">
            <p className="text-gray-600 font-medium">Title:</p>
            <p className="text-gray-900">{photoDetails.title}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Description:</p>
            <p className="text-gray-900">{photoDetails.description}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Genre:</p>
            <p className="text-gray-900">{photoDetails.genre_name}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Location:</p>
            <p className="text-gray-900">{photoDetails.location}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Likes:</p>
            <p className="text-gray-900">{photoDetails.likes}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Date of Upload:</p>
            <p className="text-gray-900">
            {new Date(photoDetails.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
            </p>
            </div>
             <div className="flex space-x-4 mt-6">
            <button onClick={() => navigate(`/edit-photo/${post_id}`)} className="bg-blue-500 text-white px-2 py-0 rounded-lg hover:bg-blue-600">
              Edit Photo
            </button>
            <button onClick={() => navigate("/dashboard")} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPhoto;