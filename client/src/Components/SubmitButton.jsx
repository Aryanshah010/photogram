import React from 'react';

function SubmitButton({ text }) {
    return (
        <input
            className="py-3 text-white text-sm font-medium bg-purple-600 hover:bg-purple-700 rounded focus:outline-none"
            type="submit"
            value={text}
        />
    );
}

export default SubmitButton;
