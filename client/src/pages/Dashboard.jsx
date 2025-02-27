import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaHeart } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import camera from "../assets/camera.png";
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function Dashboard() {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isGenreDropdownVisible, setGenreDropdownVisible] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genres, setGenres] = useState([]);
  const [posts, setPosts] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const dropdownRef = useRef(null);
  const genredropdownRef = useRef(null);
  const navigate = useNavigate();

  const handlePhotoClick = (post_id) => {
    navigate(`/view-photo/${post_id}`);
  };

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/post`, {
          params: { genre_id: selectedGenre ? selectedGenre.id : undefined },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    fetchPosts();
  }, [selectedGenre]);

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
        setProfileImage(profile.image_path ? `${import.meta.env.VITE_API_URL}${profile.image_path}` : null);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchInitialLikeStates = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/liked-posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const likeStates = response.data.reduce((acc, post) => {
          acc[post.post_id] = true;
          return acc;
        }, {});

        setLikedPosts(likeStates);
      } catch (error) {
        console.error('Failed to fetch liked posts:', error);
      }
    };

    fetchInitialLikeStates();
  }, []);

  const toggleGenreDropdown = () => {
    setGenreDropdownVisible((prev) => !prev);
  };

  const handleGenreSelect = (genre) => {
    if (selectedGenre === genre) {
      // If clicking the same genre again, clear the filter
      setSelectedGenre(null);
    } else {
      // Set the new genre filter
      setSelectedGenre(genre);
    }
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
    navigate('/profile');
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("authToken");
      navigate('/signin');
    }
  };

  const handleLikeToggle = async (postId, e) => {
    e.stopPropagation(); // Prevent image click when clicking the heart
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (likedPosts[postId]) {
        // Unlike post
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/like/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setLikedPosts(prev => ({
          ...prev,
          [postId]: false
        }));
      } else {
        // Like post
        await axios.post(`${import.meta.env.VITE_API_URL}/api/like/${postId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setLikedPosts(prev => ({
          ...prev,
          [postId]: true
        }));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      alert('Failed to update like status. Please try again.');
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate('/dashboard');
    setSelectedGenre(null);
  };

  const filteredPosts = selectedGenre
    ? posts.filter((post) => post.genre_id === selectedGenre.id)
    : posts;

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
        <a href="#" className="text-gray-700 hover:text-black" onClick={handleHomeClick}>Home</a>

          {/* Genre Dropdown */}
          <div className="relative" ref={genredropdownRef}>
            <button 
              onClick={toggleGenreDropdown} 
              className="flex items-center space-x-1 text-gray-700 hover:text-black"
            >
              <span>{selectedGenre ? selectedGenre.name : 'Genres'}</span>
              <MdKeyboardArrowDown size={20} />
            </button>
            {isGenreDropdownVisible && (
              <div className="absolute right-0 mt-2 bg-white shadow-md w-96 transform z-50">
                <div className="flex rounded-lg overflow-hidden border border-gray-200">
                  {/* First Column */}
                  <div className="flex-1 border-r border-gray-200">
                    {genres.slice(0, Math.ceil(genres.length / 2)).map((genre) => (
                      <button 
                        key={`genre-col1-${genre.id}`}
                        className={`block w-full px-4 py-2 text-gray-700 text-left hover:bg-gray-100 transition-colors ${
                         selectedGenre && selectedGenre.id === genre.id ? 'bg-blue-100' : ''
                        }`}
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
                        key={`genre-col2-${genre.id}`}
                        className={`block w-full px-4 py-2 text-gray-700 text-left hover:bg-gray-100 transition-colors ${
                          selectedGenre && selectedGenre.id === genre.id ? 'bg-blue-100' : ''
                        }`}
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
          <button onClick={() => navigate('/upload')} className="flex items-center space-x-2 px-3 py-1 border-2 border-black text-black bg-white rounded-full hover:bg-blue-500 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
              <path d="M12 19V6M5 12l7-7 7 7" />
            </svg>
            <span>Upload</span>
          </button>

          {/* Profile Icon */}
          <div className="relative" ref={dropdownRef}>
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={toggleDropdown}
              />
            ) : (
              <FaUserCircle
                size={30}
                className="text-gray-700 cursor-pointer"
                onClick={toggleDropdown}
              />
            )}
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
          {filteredPosts.map((post) => (
            <div key={post.post_id} className="relative overflow-hidden shadow-lg group">
              <img
                src={`${import.meta.env.VITE_API_URL}${post.image_path}`}
                alt={post.title}
                className="w-full h-60 object-cover group-hover:scale-105 transition duration-300 ease-in-out"
                onClick={() => handlePhotoClick(post.post_id)}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                <span className="text-sm">{post.username}</span>
                <FaHeart
                  className={`cursor-pointer transition-colors duration-200 ${
                    likedPosts[post.post_id] ? 'text-red-500' : 'text-gray-400'
                  }`}
                  size={20}
                  onClick={(e) => handleLikeToggle(post.post_id, e)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;