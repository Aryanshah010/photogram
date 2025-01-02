import React from 'react'
import background from '../assets/background.jpg';

function SignIn() {
    const InputField = ({ placeholder, type, icon }) => (
        <div className="w-110 flex items-center border border-slate-200/50 rounded">
            <input
                className="h-100 flex-1 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={placeholder}
                type={type}
            />
            <div className="px-3 text-white">
                <span className={`fa ${icon}`}></span>
            </div>
        </div>
    );
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-200">
                {/* Background Image */}
                <img
                    src={background}
                    alt="background"
                    className="absolute object-cover w-full h-full"
                />
    
                {/* Overlay (Optional for better readability) */}
                <div className="absolute inset-0 bg-black opacity-50"></div>
                {/*Login form*/}
                <div className="relative z-10">
                    <div className="bg-gray-500/50 w-full max-w-md shadow-md text-center p-5 rounded-md">
                        <h3 className="text-teal-400 text-xl font-bold">Login</h3>
                        <form className="w-80 h-auto flex flex-col mt-5 space-y-6">
                            <InputField placeholder="Email" type="email" icon="fa-envelope" />
                            <InputField placeholder="Password" type="password" icon="fa-eye-slash" />
                            <button
                                className="px-4 py-2 bg-teal-500 text-white font-medium rounded hover:bg-teal-600"
                                type="submit"
                            >
                                Sign In
                            </button>
                        </form>
                        <p className="mt-6 text-s text-zinc-900">
                            Or don't have an account?{' '}
                            <a href="#" className="text-teal-500 hover:underline">
                                Sign Up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
  )
}

export default SignIn;