import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export default function ForgotPassword() {
    const [email, setEmail] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) {
            toast.warning('Email sending in progress');
            return;
        }
        setIsSubmitting(true);
        try {
            const { data } = await axios.post('http://localhost:4000/forgot-password', { email });
            toast.success(data.message);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send reset link';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="form_container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}
