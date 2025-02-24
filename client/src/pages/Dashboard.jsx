import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import camera from "../assets/camera.png";
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const photos = [
  "https://source.unsplash.com/600x400/?wildlife",
  "https://source.unsplash.com/600x400/?church",
  "https://source.unsplash.com/600x400/?bird",
  "https://source.unsplash.com/600x400/?sunset",
  "https://source.unsplash.com/600x400/?flower",
  "https://source.unsplash.com/600x400/?squirrel",
  "https://source.unsplash.com/600x400/?blossom",
  "https://source.unsplash.com/600x400/?landscape",
  "https://source.unsplash.com/600x400/?wave",
  "https://source.unsplash.com/600x400/?train",
  "https://source.unsplash.com/600x400/?sunrise",
  "https://source.unsplash.com/600x400/?portrait",
  "https://source.unsplash.com/600x400/?bridge",
];

function Dashboard() {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isGenreDropdownVisible, setGenreDropdownVisible] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genres, setGenres] = useState([]);
  const dropdownRef = useRef(null);
  const genredropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/genres`);
        setGenres(response.data);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    fetchGenres();
  }, []);

  const toggleGenreDropdown = () => {
    setGenreDropdownVisible((prev) => !prev);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre.name); // Set selected genre name
    setGenreDropdownVisible(false); // Close the dropdown after selection
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
    if (genredropdownRef.current && !genredropdownRef.current.contains(event.target)) {
      setGenreDropdownVisible(false);
    }
  };

  const handleProfile = () => {
    console.log("Profile clicked");
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("authToken");
      navigate('/signin');
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={camera} alt="Photogram Logo" className="w-6 h-6" />
          <h1 className="text-lg text-gray-700">Photogram</h1>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <a href="#" className="text-gray-700 hover:text-black">Home</a>

      {/* Genre Dropdown */}
            <div className="relative" ref={genredropdownRef}>
              <button 
                onClick={toggleGenreDropdown} 
                className="flex items-center space-x-1 text-gray-700 hover:text-black"
              >
                <span>{'Genres'}</span>
                <MdKeyboardArrowDown size={20} />
              </button>
              {isGenreDropdownVisible && (
                <div className="absolute right-0 mt-6 bg-white shadow-md w-96 transform "> {/* Adjusted margin and translate */}
                  <div className="flex">
                    {/* First Column */}
                    <div className="flex-1">
                      {genres.slice(0, Math.ceil(genres.length / 2)).map((genre) => (
                        <button 
                          key={genre.genre_id} 
                          className="block w-full px-4 py-2 text-gray-700 text-center hover:bg-gray-200"
                          onClick={() => handleGenreSelect(genre)}
                        >
                          {genre.name}
                        </button>
                      ))}
                    </div>

                    {/* Second Column */}
                    <div className="flex-1">
                      {genres.slice(Math.ceil(genres.length / 2)).map((genre) => (
                        <button 
                          key={genre.genre_id} 
                          className="block w-full px-4 py-2 text-gray-700 text-center hover:bg-gray-200"
                          onClick={() => handleGenreSelect(genre)}
                        >
                          {genre.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          {/* Upload Button */}
          <button className="flex items-center space-x-2 px-3 py-1 border-2 border-black text-black bg-white rounded-full hover:bg-blue-500 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
              <path d="M12 19V6M5 12l7-7 7 7" />
            </svg>
            <span>Upload</span>
          </button>

          {/* Profile Icon */}
          <div className="relative" ref={dropdownRef}>
            <FaUserCircle
              size={30}
              className="text-gray-700 cursor-pointer"
              onClick={toggleDropdown}
            />
            {isDropdownVisible && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-6 bg-white shadow-md w-15 p-1">
                <button className="block px-2 py-1 text-gray-700 text-sm hover:bg-gray-200" onClick={handleProfile}>Profile</button>
                <button className="block px-2 py-1 text-gray-700 text-sm hover:bg-gray-200" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-5 text-center">Explore Photos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((src, index) => (
            <div key={index} className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src={src}
                alt={`Photo ${index + 1}`}
                className="w-full h-60 object-cover hover:scale-105 transition duration-300 ease-in-out"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
