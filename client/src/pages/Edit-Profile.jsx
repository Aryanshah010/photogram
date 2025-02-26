import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import axios from '../api/axios';

function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States for image and cropping
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  // States for profile details
  const [realName, setRealName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [bioCount, setBioCount] = useState(0);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch current user's profile
  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const profile = response.data.profile;
      setRealName(profile.fullname || '');
      setCity(profile.city || '');
      setCountry(profile.country || '');
      setBio(profile.bio || '');
      setBioCount(profile.bio ? profile.bio.length : 0);
      setExistingImage(profile.image_path
        ? `${import.meta.env.VITE_API_URL}${profile.image_path}`
        : null
      );
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
      document.body.classList.add('dark');
    }
    fetchProfile();
  }, [fetchProfile]);

  // Handle file selection and preview
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

  // Cropper callbacks
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const removeImage = () => {
    setImage(null);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
    setBioCount(e.target.value.length);
  };

  // Handle profile update
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('fullname', realName || '');
      formData.append('city', city || '');
      formData.append('country', country || '');
      formData.append('bio', bio || '');

      // Append image if a new one has been selected
      if (selectedFile) {
        formData.append('profileAvatar', selectedFile);
      }

      await axios.patch(`${import.meta.env.VITE_API_URL}/api/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
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

  const handleCancel = () => {
    navigate('/profile');
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
  

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-3">
      <div className="bg-white min-h-screen max-w-lg w-full p-8 rounded-lg shadow-lg ">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Profile</h1>

        {/* Image Section */}
        <div className="flex justify-center mb-8 relative">
          {image ? (
            <div className="relative w-44 h-44 rounded-full overflow-hidden">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
              <button 
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                onClick={removeImage}
              >
                ✖
              </button>
            </div>
          ) : existingImage ? (
            <div className="relative w-44 h-44 rounded-full overflow-hidden">
              <img src={existingImage} alt="Profile" className="w-full h-full object-cover" />
              <button 
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                onClick={() => setExistingImage(null)}
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
          <div className="flex space-x-4">
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white py-2 px-2  rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
