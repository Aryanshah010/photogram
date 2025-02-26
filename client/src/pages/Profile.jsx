import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bbt from "../assets/bbt.jpg";

function Profile() {
  const [username, setUsername] = useState("Username");
  const [location, setLocation] = useState("Location");
  const [bio, setBio] = useState("Biography");
  const [avatar, setAvatar] = useState(null);
  const [realName, setRealName] = useState("Real Name");
  const [activeTab, setActiveTab] = useState("Photos");
  const [dateJoined, setDateJoined] = useState("Date");

  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate('/edit-profile');
  };

  const handleHome = () => {
    navigate('/dashboard');
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
            <img
              src={bbt}
              alt="User Profile"
              className="w-56 h-56 rounded-full border"
            />
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
          <p className="font-semibold">5</p> {/* Replace with dynamic value */}
        </div>
        <div>
          <p className="text-gray-500">Total Likes</p>
          <p className="font-semibold">10</p> {/* Replace with dynamic value */}
        </div>
        <div>
          <p className="text-gray-500">Photo Liked</p>
          <p className="font-semibold">10</p> {/* Replace with dynamic value */}
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
    </div>
  );
}

export default Profile;