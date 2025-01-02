import React from 'react';
import SignUpForm from './SignUpForm';

function SignUpCard() {
    return (
        <div className="bg-gray-500/50 w-100 h-100 shadow-md text-center p-5 rounded-md">
            <h3 className="text-xl font-medium">User Registration</h3>
            <SignUpForm />
            <p className="mt-0 text-s text-zinc-900">
                Or already have an account? {' '}
                <a href="#" className="text-teal-500 hover:underline">
                    login 
                </a>
            </p>
        </div>
    );
}

export default SignUpCard;
