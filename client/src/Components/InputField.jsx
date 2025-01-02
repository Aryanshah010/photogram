import React from 'react';

function InputField({ placeholder, type, icon }) {
    return (
        <div className="w-110  flex items-center border border-slate-200/50 rounded">
        <input
            className="h-100 flex-1 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={placeholder}
            type={type}
        />
        <icon className="px-3 text-white">
            <span className={`fa ${icon}`}></span>
        </icon>
    </div>
    );
}

export default InputField;