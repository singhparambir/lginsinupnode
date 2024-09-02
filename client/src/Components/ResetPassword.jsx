import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasClicked, setHasClicked] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) {
            toast.warning('Please wait, your request is being processed.');
            return;
        }

        setIsSubmitting(true);
        setHasClicked(true);

        try {
            const { data } = await axios.post(`http://localhost:4000/reset-password/${token}`, { password });
            toast.success(data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            toast.error('Failed to reset password');
        } finally {
            setIsSubmitting(false);
            // Optionally, reset the hasClicked flag after a successful operation
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
