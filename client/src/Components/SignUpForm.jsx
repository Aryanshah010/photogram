import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';

function SignUpForm() {
    return (
        <form className="w-80 h-80 flex flex-col mt-5 space-y-6">
            <InputField placeholder="Name" type="text" icon="fa-user" />
            <InputField placeholder="Email" type="email" icon="fa-envelope" />
            <InputField placeholder="Password" type="password" icon="fa-eye-slash" />
            <InputField placeholder="Re-type password" type="password" icon="fa-eye-slash" />
            <SubmitButton text="SignUp" />
        </form>
    );
}

export default SignUpForm;
