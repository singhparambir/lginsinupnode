import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
    });

    const { email, password } = inputValue;

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };

    const handleError = (err) =>
        toast.error(err, {
            position: "bottom-left",
        });

    const handleSuccess = (msg) =>
        toast.success(msg, {
            position: "bottom-left",
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                "http://localhost:4000/login",
                { email, password },
                { withCredentials: true }
            );

            if (data.success) {
                handleSuccess(data.message);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                handleError(data.message);
            }
        } catch (error) {
            console.log(error);
            handleError('Something went wrong. Please try again.');
        }

        setInputValue({
            email: "",
            password: "",
        });
    };


    return (
        <div className="form_container">
            <h2>Login Account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={handleOnChange}
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
                    />
                </div>
                <button type="submit">Submit</button>
                <span>
                    New user? <Link to={"/signup"}>Signup</Link>
                </span>
                <span>
                    Forgot your password? <Link to={"/forgot-password"}>Reset it</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}
