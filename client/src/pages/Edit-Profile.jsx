import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [realName, setRealName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [bioCount, setBioCount] = useState(0);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = response.data.profile;
      setRealName(profile.fullname || '');
      setCity(profile.city || '');
      setCountry(profile.country || '');
      setBio(profile.bio || '');
      setBioCount(profile.bio ? profile.bio.length : 0);
      setExistingImage(profile.image_path ? `${import.meta.env.VITE_API_URL}${profile.image_path}` : null);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setSelectedFile(null);
    setExistingImage(null);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
    setBioCount(e.target.value.length);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('fullname', realName || '');
      formData.append('city', city || '');
      formData.append('country', country || '');
      formData.append('bio', bio || '');

      if (selectedFile) {
        formData.append('profileAvatar', selectedFile);
      } else if (!existingImage) {
        formData.append('profileAvatar', '');
      }

      await axios.patch(`${import.meta.env.VITE_API_URL}/api/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });

      await fetchProfile();
      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('authToken');
  
        // Call API to delete the user account
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/deleteAccount`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        // Clear local storage and navigate
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
  
        alert('Your account has been deleted.');
        navigate('/signup'); // Redirect to signup or homepage
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete your account. Please try again.');
      }
    }
  };
  

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-3">
      <div className="bg-white min-h-screen max-w-lg w-full p-8 rounded-lg shadow-lg ">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Profile</h1>

        {/* Image Upload Section */}
        <div className="flex justify-center mb-8">
          {image || existingImage ? (
            <div className="relative w-44 h-44 rounded-full overflow-hidden group">
              <img src={image || existingImage} alt="Profile" className="w-full h-full object-cover" />
              <button
                className="absolute top-6 right-6 bg-red-500 text-white p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={removeImage}
              >
                ✖
              </button>
            </div>
          ) : (
            <button
              onClick={handleFileUpload}
              className="bg-gray-200 text-gray-700 w-44 h-44 rounded-full flex justify-center items-center"
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </button>
          )}
        </div>

        {/* Profile Details */}
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Bio</label>
            <textarea
              value={bio}
              onChange={handleBioChange}
              maxLength={500}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            ></textarea>
            <div className="text-sm text-gray-500 mt-1">{bioCount}/500</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-8 mt-6">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete Me
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white py-2 px-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
