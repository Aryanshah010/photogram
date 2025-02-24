import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import background from '../assets/background.jpg';
import axios from 'axios';

const InputField = ({ placeholder, type, value, onChange, error, icon }) => (
    <div className="w-110 flex flex-col space-y-1">
        <div className="flex items-center border border-slate-200/50 rounded">
            <input
                className="h-100 flex-1 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={onChange}
            />
            <div className="px-3 text-white">
                <span className={`fa ${icon}`}></span>
            </div>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
);

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const clearErrorAfterTimeout = (field) => {
    setTimeout(() => {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    }, 9000);
  };

  const validateForm = async (e) => {
    e.preventDefault();
    let formIsValid = true;
    const newErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
      formIsValid = false;
      clearErrorAfterTimeout('email');
    }

    if (password.length <= 6) {
      newErrors.password = 'Password must be more than 6 characters.';
      formIsValid = false;
      clearErrorAfterTimeout('password');
    }

    setErrors(newErrors);

    if (formIsValid) {
      await submitForm();
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/signin`, {
        email,
        password,
      });

      const { userId, token } = response.data;
      localStorage.setItem('userId', userId);
      localStorage.setItem('authToken', token);
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      alert(errorMessage);

      if (err.response?.data?.message?.toLowerCase().includes('email')) {
        setErrors((prevErrors) => ({ ...prevErrors, email: 'Invalid email address.' }));
      }
      if (err.response?.data?.message?.toLowerCase().includes('password')) {
        setErrors((prevErrors) => ({ ...prevErrors, password: 'Incorrect password.' }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-200">
      {/* Background Image */}
      <img src={background} alt="background" className="absolute object-cover w-full h-full" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Login form */}
      <div className="relative z-10">
        <div className="bg-gray-500/50 w-full max-w-md shadow-md text-center p-5 rounded-md">
          <h3 className="text-teal-400 text-xl font-bold">Sign In</h3>
          <form onSubmit={validateForm} className="w-80 h-auto flex flex-col mt-5 space-y-6">
            <InputField
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="fa-envelope"
              error={errors.email}
            />
            <InputField
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon="fa-eye-slash"
              error={errors.password}
            />
            <button
              className={`px-4 py-2 bg-teal-500 text-white font-medium rounded ${
                isSubmitting ? 'cursor-not-allowed bg-teal-400' : 'hover:bg-teal-600'
              }`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <p className="mt-6 text-s text-white">
            Don't have an account?{' '}
            <Link to="/signup" className="text-teal-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
