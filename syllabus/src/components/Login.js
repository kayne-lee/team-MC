import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css'

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
    
  return (
    <div className="h-screen relative">
      {/* Top Section */}
      <div className="absolute top-[43px] left-[63px] w-full">
        <img src="/nucleus.png" alt="" className="w-[141px] "/>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col  w-[791px] welcome justify-evenly items-center">
        <div className="text-[#F5F5F5] text-center font-poppins text-[50px] font-bold pt-[57px]  mb-[29px]">
            Welcome Back
        </div>
        {message && (
            <div className="h-[57px] rounded-[20px] mb-[10px] w-[567px] bg-[#d87762] text-white text-center flex flex-row justify-center items-center">
                {message}
            </div>
        )}
        <div className="w-[567px] h-[77px] rounded-[20px] bg-[#F3F3F3]">
            <div className="mt-[11px] ml-[23px] text-[#BFA1E9] font-[700] font-poppins text-[16px]">
                Email
            </div>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[40px] rounded-[25px] pb-[5px] px-[23px] bg-[#F3F3F3] text-[#333] focus:outline-none"
            />
        </div>

        <div className="w-[567px] h-[77px] rounded-[20px] bg-[#F3F3F3] mt-[10px]">
            <div className="mt-[11px] ml-[23px] text-[#BFA1E9] font-[700] font-poppins text-[16px]">
                Password
            </div>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[40px] rounded-[25px] pb-[5px] px-[23px] bg-[#F3F3F3] text-[#333] focus:outline-none"
            />
        </div>

        <div onClick={handleLogin} className="w-[300px] h-[57px] bg-[#F3F3F3] flex flex-row justify-center items-center rounded-[25px] mt-[29px] mb-[29px] hover:bg-[#DECBF8] cursor-pointer">
            <div className="text-[#8338EC] text-center font-poppins text-[30px] text-center font-bold">
                Login
            </div>
        </div>


      </div>
    </div>
  )
}
