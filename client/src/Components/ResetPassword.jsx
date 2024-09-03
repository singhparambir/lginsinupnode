import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const checkTokenValidity = async () => {
            try {
                // Adding a delay to ensure proper token verification timing

                const { data } = await axios.get(`http://localhost:4000/check-token/${token}`);
                if (!data.valid) {
                    toast.error('Token expired');
                    setTimeout(() => navigate('/login'), 3000); // Increased delay to give user more time to see the message
                }
            } catch (error) {
                toast.error('Error checking token validity');
                setTimeout(() => navigate('/login'), 3000); // Increased delay
            }
        };

        checkTokenValidity();
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) {
            toast.warning('Please wait, your request is being processed.');
            return;
        }

        setIsSubmitting(true);

        try {
            const { data } = await axios.get(`http://localhost:4000/verify-token/${token}`); toast.success(data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            if (error.response && error.response.data.message === 'Invalid or expired token.') {
                toast.error('The reset link has expired. Please request a new password reset.');
            } else {
                toast.error('Failed to reset password');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form_container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="password">New Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Enter your new password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Reset Password'}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}
