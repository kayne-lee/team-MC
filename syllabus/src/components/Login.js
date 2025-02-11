import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css'
import Error from '../assets/error.png'
import Google from "../assets/google_button.png"
import { motion } from "framer-motion";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault(); 
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
                setMessage('Network error, please try again later');
                console.error("Error:", error.message);
            });
    };

    return (
        <div className="h-screen flex flex-col sm:flex-row">
            {/* Left Section */}
            <div className="w-full sm:w-1/2 flex flex-col justify-center items-center relative">
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
                            onClick={handleLogin}
                            className="w-full h-[45px] signin flex justify-center items-center rounded-[50px] hover:bg-[#DECBF8] cursor-pointer"
                        >
                            <div className="text-[#F3F3F3] font-poppins text-[16px] font-bold leading-none">
                                LOG IN
                            </div>
                        </div>
                    </div>

                    <div className="mt-[45px] flex items-center sm:text-[#F3F3F3] text-[#8338EC] gap-4">
                        <div className="flex-1 h-[1px] sm:bg-white bg-[#8338EC]" />
                        <div className="whitespace-nowrap">Don't have an account? <a href="/signup" className="text-blue-400 underline">Signup</a></div>
                        <div className="flex-1 h-[1px] sm:bg-white bg-[#8338EC]" />
                    </div>


                </div>
            </div>
        </div>
    );
}