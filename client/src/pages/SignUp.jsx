import React from 'react';
import SignUpCard from '../Components/SignUpCard';
import background from '../assets/background.jpg';

function SignUp() {
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
            
            {/* Registration Form */}
            <div className="relative z-10">
                <SignUpCard />
            </div>
        </div>
    );
}

export default SignUp;
