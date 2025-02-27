import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { FaUserCircle } from "react-icons/fa"; // Import the FaUserCircle icon

function Profile() {
  const [username, setUsername] = useState("Username");
  const [location, setLocation] = useState("Location");
  const [bio, setBio] = useState("Biography");
  const [avatar, setAvatar] = useState(null);
  const [realName, setRealName] = useState("Real Name");
  const [activeTab, setActiveTab] = useState("Photos");
  const [dateJoined, setDateJoined] = useState("Date");
  const [totalUploads, setTotalUploads] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [photosLiked, setPhotosLiked] = useState(0);
  const [userPhotos, setUserPhotos] = useState([]);
  const [likedPhotos, setLikedPhotos] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = response.data.profile;
        setUsername(profile.username);
        setRealName(profile.fullname);
        setLocation(`${profile.city || "City"}, ${profile.country || "Country"}`);
        setBio(profile.bio);
        const createdAtLocal = new Date(profile.created_at).toLocaleDateString(undefined, {
          year: "numeric",
          day: "2-digit",
          month: "2-digit",
        });
        setDateJoined(createdAtLocal);        
        setAvatar(profile.image_path ? `${import.meta.env.VITE_API_URL}${profile.image_path}` : null); // Set avatar to null if image_path is not available
        setTotalUploads(profile.total_uploads);
        setTotalLikes(profile.total_likes);
        setPhotosLiked(profile.photos_liked);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchUserPhotos = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user-photos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserPhotos(response.data.photos);
      } catch (error) {
        console.error('Error fetching user photos:', error);
      }
    };

    const fetchLikedPhotos = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/liked-photos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLikedPhotos(response.data.photos);
      } catch (error) {
        console.error('Error fetching liked photos:', error);
      }
    };

    fetchProfile();
    fetchUserPhotos();
    fetchLikedPhotos();
  }, []);

  const handleEditClick = () => {
    navigate('/edit-profile/');
  };

  const handleHome = () => {
    navigate('/dashboard');
  };


  const handlePhotoClick = (post_id) => {
    navigate(`/view-photo/${post_id}`);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Profile About Container */}
      <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-md p-6 mb-6">

        {/* Left Section */}
        <div className="w-full lg:w-1/3 flex flex-col items-center mb-6 lg:mb-0">
          <div className=" text-blue-500 font-bold cursor-pointer mb-4" onClick={handleHome}>
            Home
          </div>
          <div className="mb-3">
            {avatar ? (
              <img
                src={avatar}
                alt="User Profile"
                className="w-56 h-56 rounded-full border"
              />
            ) : (
              <FaUserCircle className="w-56 h-56 text-gray-400" />
            )}
          </div>
          <div className="text-x font-semibold">{realName}</div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-2/3 pl-0 lg:pl-8">
          <div className="mb-0">
            <div className=" flex justify-between mt-6 items-center">
              <h2 className=" text-xl font-bold">{username}</h2>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={handleEditClick}>
                Edit Profile
              </button>
            </div>
            <p className=" text-gray-600">{location}</p>
            <p className=" mt-3 text-gray-700">{bio}</p>
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="stats flex justify-between bg-gray-100 p-4 rounded-lg mb-6">
        <div>
          <p className="text-gray-500">Joined on Photogram</p>
          <p className="font-semibold">{dateJoined}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Upload</p>
          <p className="font-semibold">{totalUploads}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Likes</p>
          <p className="font-semibold">{totalLikes}</p>
        </div>
        <div>
          <p className="text-gray-500">Photo Liked</p>
          <p className="font-semibold">{photosLiked}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs flex justify-center mb-6">
        <a
          className={`px-4 py-2 mx-2 rounded-lg cursor-pointer ${activeTab === "Photos" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("Photos")}
        >
          Photos
        </a>
        <a
          className={`px-4 py-2 mx-2 rounded-lg cursor-pointer ${activeTab === "Photo-Liked" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("Photo-Liked")}
        >
            Photo Liked
        </a>
      </div>

    {/* User Photos */}
    {activeTab === "Photos" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {userPhotos.map((photo) => (
          <div key={photo.post_id} onClick={()=>handlePhotoClick(photo.post_id)} className="relative overflow-hidden  shadow-lg group">
            <img
              src={`${import.meta.env.VITE_API_URL}${photo.image_path}`}
              alt={photo.title}
              className="w-full h-60 object-cover group-hover:scale-105 transition duration-300 ease-in-out"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
              <span className="text-sm">{photo.title}</span>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Liked Photos */}
    {activeTab === "Photo-Liked" && (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {likedPhotos.map((photo) => (
          <div key={photo.post_id} onClick={()=>handlePhotoClick(photo.post_id)} className="relative overflow-hidden  shadow-lg group">
            <img
              src={`${import.meta.env.VITE_API_URL}${photo.image_path}`}
              alt={photo.title}
              className="w-full h-60 object-cover group-hover:scale-105 transition duration-300 ease-in-out"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
              <span className="text-sm">{photo.username}</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  );
}

export default Profile;