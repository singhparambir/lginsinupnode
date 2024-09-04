import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
    });
    const [lockoutMessage, setLockoutMessage] = useState("");
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutTime, setLockoutTime] = useState(0); // Time left for lockout

    const { email, password } = inputValue;

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                "http://localhost:4000/login",
                { email, password },
                { withCredentials: true }
            );

            if (data.success) {
                // Successful login - navigate to home and show toast message
                navigate("/");
                toast.success("User logged in successfully!"); // Add toast message
                setLockoutMessage("");
                setIsLocked(false);
                setLockoutTime(0);
            } else {
                // Handle lockout message and status
                if (data.message.includes("locked")) {
                    const lockoutPeriod = 2 * 60 * 1000; // 2 minutes in milliseconds
                    setLockoutMessage(data.message);
                    setIsLocked(true);
                    const lockoutEnd = Date.now() + lockoutPeriod;
                    setLockoutTime(lockoutEnd);

                    // Update lockout message and unlock form after 2 minutes
                    const updateLockoutStatus = setInterval(() => {
                        const timeLeft = lockoutEnd - Date.now();
                        if (timeLeft <= 0) {
                            clearInterval(updateLockoutStatus);
                            setLockoutMessage("");
                            setIsLocked(false);
                        } else {
                            setLockoutMessage(`Account locked. Try again in ${Math.ceil(timeLeft / 60000)} minutes.`);
                        }
                    }, 1000);
                } else {
                    setLockoutMessage(data.message);
                    setIsLocked(false); // Reset lockout state if the message is not related to lockout
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                const lockoutEnd = Date.now() + 2 * 60 * 1000; // Assuming lockout period is 2 minutes
                setLockoutMessage(error.response.data.message);
                setIsLocked(true);
                setLockoutTime(lockoutEnd);
            } else {
                setLockoutMessage('Something went wrong. Please try again.');
            }
        }

        // Clear the input values
        setInputValue({
            email: "",
            password: "",
        });
    };

    useEffect(() => {
        if (isLocked && lockoutTime > Date.now()) {
            const interval = setInterval(() => {
                const timeLeft = lockoutTime - Date.now();
                if (timeLeft <= 0) {
                    setLockoutMessage("");
                    setIsLocked(false);
                    clearInterval(interval);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isLocked, lockoutTime]);

    return (
        <div className="form_container">
            <h2>Login Account</h2>
            {lockoutMessage && (
                <div className="lockout_message">
                    {lockoutMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} style={{ pointerEvents: isLocked ? 'none' : 'auto', opacity: isLocked ? 0.5 : 1 }}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={handleOnChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Enter your password"
                        onChange={handleOnChange}
                        required
                    />
                </div>
                <button type="submit" disabled={isLocked}>Submit</button>
                <span>
                    New user? <Link to={"/signup"}>Signup</Link>
                </span>
                <span>
                    Forgot your password? <Link to={"/forgot-password"}>Reset it</Link>
                </span>
                {/* Lockout message moved to the bottom */}

            </form>
            <ToastContainer />
        </div>
    );
}
