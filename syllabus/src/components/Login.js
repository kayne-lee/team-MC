import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css'
import Error from '../assets/error.png'
import Google from "../assets/google_button.png"
import { motion } from "framer-motion";
import GoogleService from '../services/GoogleService';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate()
    const googleService = GoogleService();
    const apiUrl = process.env.REACT_APP_NUCLEUS_API; // This will get the value from .env file
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setIsLoading(true); // Start loading
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
        "email": email,
        "password": password
        });

        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
        };
        fetch("https://api.nucleusapp.ca/auth/login", requestOptions)
            .then((response) => {
                return response.text().then((text) => {
                if (!response.ok) {
                    setMessage(text);
                } else {
                    setMessage('')
                    localStorage.setItem("jwt", text);
                    navigate("/");
                }
                });
            })
            .catch((error) => {
                setMessage('Network error, please try again later')
                console.error("Error:", error.message); // Log the error message from the server
            })
            .finally(() => {
                setIsLoading(false); // Stop loading regardless of outcome
            });
      };

    const handleSignup = async (e) => {
        e.preventDefault(); 
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const raw = JSON.stringify({
            email: email,
            password: password,
        });
    
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
    
        try {
            // TODO idk something wrong w endpoint maybe?
            // error 400 when existing email, error 403 otherwise
            const response = await fetch("http://35.183.132.114:8080/auth/signup", requestOptions);
            const text = await response.text();
    
            if (!response.ok) {
                console.log("Response error:", response.status, response.statusText);
                setMessage(text);
            } else {
                setMessage("Signup successful! Please log in."); 
                navigate("/login"); 
            }
        } catch (error) {
            setMessage("Network error, please try again later");
            console.error("Error:", error.message);
        }
    };

    const handleGoogleLogin = async (e) => {
        localStorage.setItem("googleLogin", true);
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.REACT_APP_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent('https://www.nucleusapp.ca/api/auth/callback/google')}` +
        // `&redirect_uri=${encodeURIComponent('http://localhost:3000/api/auth/callback/google')}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent('openid email profile https://www.googleapis.com/auth/calendar')}` +
        `&access_type=offline`;
    
        window.location.href = authUrl;
    };
    
    
  return (
    <div className="h-screen flex">
    {/* Left Section */}
    <div className="w-1/2 flex flex-col justify-center items-center">
      <div className="absolute top-[43px] left-[33px]">
        <img src="/nucleus.png" alt="" className="w-[141px]" />
      </div>
    </div>
  
            {/* Right Section (Login Form) */}
            <div className="w-full sm:w-1/2 flex flex-col justify-center items-center h-full right-login px-[33px] sm:px-[0px]">
                <div className="flex justify-start w-full sm:w-[78%] flex-col mt-[100px]">
                    <div className="md:text-[#F5F5F5] text-[#8338EC] px-[6px] sm:px-[12px] font-poppins text-[35px] sm:text-[50px] font-bold leading-normal mb-[19px]">Welcome Back</div>
                    <div className="w-full h-[77px] rounded-[20px] bg-[#F3F3F3]">
                        <div className="mt-[11px] ml-[23px] text-[#BFA1E9] font-[700] font-poppins text-[16px]">
                            Email
                        </div>
                        <input
                            type="email"
                            defaultValue=""
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[40px] rounded-[25px] pb-[5px] px-[23px] bg-[#F3F3F3] text-[#333] focus:outline-none"
                        />
                    </div>
        
                    <div className="w-full h-[77px] rounded-[20px] bg-[#F3F3F3] mt-[20px]">
                        <div className="mt-[11px] ml-[23px] text-[#BFA1E9] font-[700] font-poppins text-[16px]">
                            Password
                        </div>
                        <input
                            type="password"
                            defaultValue=""
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-[40px] rounded-[25px] pb-[5px] px-[23px] bg-[#F3F3F3] text-[#333] focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-row items-center px-[19px] justify-between w-full mt-[25px]">
                        <div className="flex flex-row gap-[6px] items-center">
                            <input 
                                type="checkbox" 
                                className="w-[20px] h-[20px] text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-[#BFA1E9] font-poppins text-[14px] font-medium leading-none">
                                Remember me
                            </span>
                        </div>

                        <span className="text-[#BFA1E9] font-poppins text-[14px] font-medium leading-none cursor-pointer">
                            Forgot Password?
                        </span>
                    </div>

                    {message && (
                        <div className="text-[#FB9393] font-poppins text-[14px] font-bold leading-none flex flex-row items-center justify-center mt-[23px]">
                            <img src={Error} alt="" className="w-[29px] h-[29px] mr-[5px]" />
                            There was a problem with the user details entered. Please try again.
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-10 sm:gap-4 w-full mt-[29px]">
                        <div
                            onClick={email && password ? handleLogin : null}
                            className={`w-full h-[45px] flex justify-center items-center rounded-[50px]  ${
                                email && password 
                                    ? "signin cursor-pointer hover:bg-[#DECBF8]" 
                                    : "bg-[#a898c0] cursor-not-allowed"
                            }`}
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            ) : (
                                <div className="text-[#F3F3F3] font-poppins text-[16px] font-bold leading-none">
                                    LOGIN
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="m-[10px] flex flex-row justify-center items-center gap-[24px] text-[#F3F3F3]">
                    <div className="w-[120px] h-[1px] bg-white" />
                        <div>OR</div>
                    <div className="w-[120px] h-[1px] bg-white" />
                    
                </div>
                <button
                        // onClick={uploadToCalendar}
                        className="bg-white border border-gray-3 rounded-[20px] px-6 py-3 shadow-md hover:bg-gray-100 transition duration-200 text-[#BFA1E9] font-poppins text-[16px] font-bold leading-none"
                        onClick={handleGoogleLogin}
                    >
                        Login With Google
                </button>
                </div>
                <div className="mt-[45px] flex items-center sm:text-[#F3F3F3] text-[#8338EC] gap-4">
                        <div className="flex-1 h-[1px] sm:bg-white bg-[#8338EC]" />
                        <div className="whitespace-nowrap">Don't have an account? <a href="/signup" className="text-blue-400 underline">Signup</a></div>
                        <div className="flex-1 h-[1px] sm:bg-white bg-[#8338EC]" />
                    </div>
                </div>  
            </div>
    );
}