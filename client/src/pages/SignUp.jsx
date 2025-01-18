import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const clearErrorAfterTimeout = (field) => {
        setTimeout(() => {
            setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
        }, 9000);
    };

    const validateForm = async (e) => {
        e.preventDefault();
        let formIsValid = true;
        const newErrors = {};

        if (name.trim().length < 3) {
            newErrors.name = 'Name must be at least 3 characters long.';
            formIsValid = false;
            clearErrorAfterTimeout('name');
        }

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

        if (rePassword !== password) {
            newErrors.rePassword = 'Passwords do not match.';
            formIsValid = false;
            clearErrorAfterTimeout('rePassword');
        }

        setErrors(newErrors);

        if (formIsValid) {
            await submitForm();
        }
    };

    const submitForm = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, {
                name,
                email,
                password,
            });
            alert('User created successfully!');
            setName('');
            setEmail('');
            setPassword('');
            setRePassword('');
        } catch (err) {
            console.error('Error details:', err.response?.data || err.message);
            // Extract the error message from the response and show it as an alert
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
            alert(errorMessage);

            // Optionally, update specific field error state (e.g., for email)
            if (err.response?.data?.message?.toLowerCase().includes('email')) {
                setErrors((prevErrors) => ({ ...prevErrors, email: 'Email already exists.' }));
        }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-200">
            {/* Background Image */}
            <img
                src={background}
                alt="background"
                className="absolute object-cover w-full h-full"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Registration Form */}
            <div className="relative z-10">
                <div className="bg-gray-500/50 w-full max-w-md shadow-md text-center p-5 rounded-md">
                    <h3 className="text-teal-400 text-xl font-bold">Sign Up</h3>
                    <form onSubmit={validateForm} className="w-80 h-auto flex flex-col mt-5 space-y-6">
                        <InputField
                            placeholder="Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon="fa-user"
                            error={errors.name}
                        />
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
                        <InputField
                            placeholder="Re-type Password"
                            type="password"
                            value={rePassword}
                            onChange={(e) => setRePassword(e.target.value)}
                            icon="fa-eye-slash"
                            error={errors.rePassword}
                        />
                        <button
                            className={`px-4 py-2 bg-teal-500 text-white font-medium rounded ${
                                isSubmitting ? 'cursor-not-allowed bg-teal-400' : 'hover:bg-teal-600'
                            }`}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Sign Up'}
                        </button>
                    </form>
                    <p className="mt-6 text-s text-white">
                        Already have an account?{' '}
                        <Link to="/signin" className="text-teal-500 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
