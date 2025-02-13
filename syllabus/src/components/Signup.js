import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import Error from '../assets/error.png';
import { motion } from 'framer-motion';

export default function Signup() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (!name || !lastName || !email || !password || !confirmPass) {
            setMessage("All fields are required")
        }else if (password != confirmPass) {
            setMessage("Ensure passwords match")
        } else {
            const raw = JSON.stringify({
                "firstName": name,
                "lastName": lastName,
                "email": email,
                "password": password,
                "friends": [],
                "streak": 0,
                "phone": phone,
                "notification": 3
                });
        
                const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: 'follow',
            };

            fetch('https://api.nucleusapp.ca/auth/signup', requestOptions)
                .then((response) => response.text().then((text) => {
                    if (!response.ok) {
                        setMessage(text);
                    } else {
                        const loginRaw = JSON.stringify({
                            email: email,
                            password: password,
                        });

                        const loginRequestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: loginRaw,
                            redirect: 'follow',
                        };

                        fetch('https://api.nucleusapp.ca/auth/login', loginRequestOptions)
                            .then((response) => response.text().then((text) => {
                                if (!response.ok) {
                                    setMessage(text);
                                } else {
                                    setMessage('');
                                    localStorage.setItem('jwt', text);
                                    navigate('/');
                                }
                            }))
                            .catch((error) => {
                                setMessage('Network error, please try again later');
                                console.error('Error:', error.message);
                            });
                    }
                }))
                .catch((error) => {
                    setMessage('Network error, please try again later');
                    console.error('Error:', error.message);
                });
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
            <div class="text-[#F5F5F5] font-poppins text-[50px] font-bold leading-normal mb-[19px]">Create an Account</div>
            <div className="w-[528px] h-[77px] rounded-[20px] bg-[#F3F3F3]">
                <div className="mt-[11px] ml-[23px] text-[#BFA1E9] font-[700] font-poppins text-[16px]">
                First Name
                </div>
                <input
                type="firstName"
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[40px] rounded-[25px] pb-[5px] px-[23px] bg-[#F3F3F3] text-[#333] focus:outline-none"
                />
            </div>
    
            <div className="w-[528px] h-[77px] rounded-[20px] bg-[#F3F3F3] mt-[20px]">
                <div className="mt-[11px] ml-[23px] text-[#BFA1E9] font-[700] font-poppins text-[16px]">
                Last Name
                </div>
                <input
                type="lastName"
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-[40px] rounded-[25px] pb-[5px] px-[23px] bg-[#F3F3F3] text-[#333] focus:outline-none"
                />
            </div>
            <div className="w-[528px] h-[77px] rounded-[20px] bg-[#F3F3F3] mt-[20px]">
                <div className="mt-[11px] ml-[23px] text-[#BFA1E9] font-[700] font-poppins text-[16px]">
                Email
                </div>
                <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[40px] rounded-[25px] pb-[5px] px-[23px] bg-[#F3F3F3] text-[#333] focus:outline-none"
                />
            </div>
            <div className="w-[528px] h-[77px] rounded-[20px] bg-[#F3F3F3] mt-[20px]">
                <div className="mt-[11px] ml-[23px] text-[#BFA1E9] font-[700] font-poppins text-[16px]">
                Phone Number
                </div>
                <input
                type="phone"
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-[40px] rounded-[25px] pb-[5px] px-[23px] bg-[#F3F3F3] text-[#333] focus:outline-none"
                />
            </div>
            <div className="w-[528px] h-[77px] rounded-[20px] bg-[#F3F3F3] mt-[20px]">
                <div className="mt-[11px] ml-[23px] text-[#BFA1E9] font-[700] font-poppins text-[16px]">
                Password
                </div>
                <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[40px] rounded-[25px] pb-[5px] px-[23px] bg-[#F3F3F3] text-[#333] focus:outline-none"
                />
            </div>
            <div className="w-[528px] h-[77px] rounded-[20px] bg-[#F3F3F3] mt-[20px]">
                <div className="mt-[11px] ml-[23px] text-[#BFA1E9] font-[700] font-poppins text-[16px]">
                  Confirm Password
                        </div>
                        <input
                            type="password"
                            onChange={(e) => setConfirmPass(e.target.value)}
                            className="w-full h-[40px] rounded-[25px] pb-[5px] px-[23px] bg-[#F3F3F3] text-[#333] focus:outline-none"
                        />
                    </div>

                    {message && (
                        <div className="text-[#FB9393] font-poppins text-[14px] font-bold leading-none flex flex-row items-center justify-center mt-[23px]">
                            <img src={Error} alt="" className="w-[29px] h-[29px] mr-[5px]" />
                            {message}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-10 sm:gap-4 w-full mt-[29px]">
                        <div
                            onClick={handleSignup}
                            className="w-full h-[45px] signin flex justify-center items-center rounded-[50px] hover:bg-[#DECBF8] cursor-pointer"
                        >
                            <div className="text-[#F3F3F3] font-poppins text-[16px] font-bold leading-none">
                                LOG IN
                            </div>
                        </div>
                    </div>

                    <div className="mt-[45px] flex items-center sm:text-[#F3F3F3] text-[#8338EC] gap-4">
                        <div className="flex-1 h-[1px] sm:bg-white bg-[#8338EC]" />
                        <div className="whitespace-nowrap">Already have an account? <a href="/login" className="text-blue-400 underline">Login</a></div>
                        <div className="flex-1 h-[1px] sm:bg-white bg-[#8338EC]" />
                    </div>
                </div>

                </div>
            </div>
    );
}