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
        fetch("http://localhost:8080/auth/login", requestOptions)
            .then((response) => {
                // Read the response body as text
                return response.text().then((text) => {
                if (!response.ok) {
                    console.log(response);
                    setMessage(text);
                    
                } else {
                    setMessage('')
                    localStorage.setItem("jwt", text);
                    navigate("/");
                }
                console.log(text)
                
                });
            })
            .catch((error) => {
                setMessage('Network error, please try again later')
                console.error("Error:", error.message); // Log the error message from the server
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
    
    
  return (
    <div className="h-screen flex">
    {/* Left Section */}
    <div className="w-1/2 flex flex-col justify-center items-center">
      <div className="absolute top-[43px] left-[63px]">
        <img src="/nucleus.png" alt="" className="w-[141px]" />
      </div>
    </div>
  
    {/* Right Section (Login Form) */}
    <div className="w-1/2 flex flex-col justify-center items-center right-login">
        <div className="flex justify-start w-[528px] flex-col">
            <div class="text-[#F5F5F5] font-poppins text-[50px] font-bold leading-normal mb-[19px]">Welcome Back</div>
            <div className="w-[528px] h-[77px] rounded-[20px] bg-[#F3F3F3]">
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
    
            <div className="w-[528px] h-[77px] rounded-[20px] bg-[#F3F3F3] mt-[20px]">
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
                        class="w-[20px] h-[20px] text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                    <span class="text-[#BFA1E9] font-poppins text-[14px] font-medium leading-none">
                        Remember me
                    </span>
                </div>

                <span class="text-[#BFA1E9] font-poppins text-[14px] font-medium leading-none cursor-pointer">
                    Forgot Password?
                </span>
            </div>
            {message && (
                <div className="text-[#FB9393] font-poppins text-[14px] font-bold leading-none flex flex-row items-center justify-center mt-[23px]">
                    <img src={Error} alt="" className="w-[29px] h-[29px] mr-[5px]"/>
                    There was a problem with the user details entered.  Please try again
                </div>
            )}
            <div className="flex flex-row gap-10">
                <div
                    onClick={handleLogin}
                    className="w-full h-[45px] signin flex justify-center items-center rounded-[50px] mt-[29px] hover:bg-[#DECBF8] cursor-pointer"
                >
                    <div className="text-[#F3F3F3] font-poppins text-[16px] font-bold leading-none">
                    LOG IN
                    </div>
                    
                </div>
                {/* <div
                    hidden = {true}
                    onClick={handleSignup}
                    className="w-full h-[45px] signin flex justify-center items-center rounded-[50px] mt-[29px] hover:bg-[#DECBF8] cursor-pointer"
                >
                    <div className="text-[#F3F3F3] font-poppins text-[16px] font-bold leading-none">
                    SIGN UP
                    </div>
            </div> */}


            </div>
            

            <div className="mt-[45px] flex flex-row gap-[24px] items-center text-[#F3F3F3]">
                <div className="w-[120px] h-[1px] bg-white " />
                <div>Don't have an account? <a href="/signup">Signup</a></div>
                <div className="w-[120px] h-[1px] bg-white " />
            </div>
            {/* <div className="flex mt-[24px] justify-center items-center cursor-pointer">
                <img src={Google} alt="" className="w-[30px]" />
            </div> */}
        </div>
    </div>
  </div>
  
  )
}
