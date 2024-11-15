import { React, useState, useEffect } from 'react'
import '../styles/landing.css'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, message, Space } from 'antd';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CardStack from './CardStack';
import axios from 'axios'

export default function Landing() {
  const words = ['Create', 'Plan', 'Manage'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000); // Change word every 2 seconds

    return () => clearInterval(intervalId);
  }, []);

  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    console.log(email)
    e.preventDefault();
    // handle form submission logic here, like sending the email to the backend
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:3000');
    myHeaders.append('Access-Control-Allow-Credentials', 'true');
    
    const raw = JSON.stringify({
      "to": email
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    fetch("https://team-mc-email.vercel.app/api/send-email", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    messageApi.open({
      type: 'success',
      content: 'Successfully signed up to be a beta tester!',
    });
    setEmail('');
  };

  return (
    <div className="flex flex-col bg-white">
      {contextHolder}
      {/* header */}
      <Header />

      {/* landing */}
      <div className=" mt-[25px] landing border-t-[1px] border-black">
        <div className='first flex-row flex gap-4 w-[545px]'>
          <div className="word-container inline-block w-[194px] text-right">
            <AnimatePresence mode="wait">
              <motion.span
                key={words[currentWordIndex]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3, // 300ms duration for both entrance and exit
                  ease: [0.7, -0.4, 0.4, 1.4], // Custom cubic-bezier timing function
                }}
                className="inline-block grad-title text-right" // Align text to the right
              >
                {words[currentWordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="block"> {/* Use block so it stays in place */}
            {" "}all your tasks
          </div>
        </div>
        <div className="w-[714px] second font-normal">All-in-one academic tool that centralizes scattered syllabus details into a streamlined, proactive productivity tool, empowering students to unlock their potential.</div>
        <Link to="/signup">
          <div className="cursor-pointer h-[65px] w-[260px] text-[24px] text-white rounded-[45px] bg-[#8338EC] mt-[38px] flex justify-center items-center">Sign Up</div>
        </Link>
      </div>

      {/* product */}
      <div className="product flex flex-row justify-evenly">
        <div className=" mt-[185px]">
          <div className="font-[400] text-[32px] w-[606px] text-left ml-[36px]">
            <span className="w-[110px] h-[23px] text-[32px] font-[700]">Tiles&nbsp;</span>
             Help you see all your tasks in one <br />spot for the entire school week through
             <br />a clean minimalist display.
          </div>
          <div className="rounded-[45px] bg-white flex flex-col h-[469px] w-[677px] card mt-[138px] ">
            <div className="text-[24px] font-[700] ml-[35px] mt-[35px] text-left">Upload Syllabus</div>
            <div className="ml-[94.56px] mt-[32px] border-[1px] border-black flex justify-center items-center w-[487px] h-[295px] flex-col">
                <div className=" flex flex-row">
                  <img src="/assets/icons/Image.png" alt="" className="w-[62px]"/>
                  <img src="/assets/icons/Fileplus.png" alt="" className="w-[62px]"/>
                </div>
                <div className=" mt-[17px] w-[255px] h-[55px] rounded-[45px] bg-[#8338EC] text-[16px] font-[700] text-white flex items-center justify-center">
                  Upload or Attach Syllabus
                </div>
            </div>
          </div>
        </div>
        <div className="mt-[45px] flex flex-col">
          <div>
          <CardStack />
          </div>
          <div className="font-[400] text-[32px] w-[606px] text-left mt-[760px]">
            <span className="w-[110px] h-[23px] text-[32px] font-[700]">Syllabus Puller&nbsp;</span>
            Automatically fills your Tasks List with upcoming assignments <br />and dates from all your courses.
          </div>
        </div>
      </div>

      {/* signup for beta */}
      <div className="h-[416px] flex flex-col justify-center items-center">
        <div className="text-[52px] font-[700] ">Sign up to be a</div>
        <div className="beta">Beta Tester</div>
        <div className="flex flex-row justify-center items-center">
          <div className="flex items-center flex-row gap-[17px] w-[603px] h-[94px] border-[1px] border-black rounded-[15px] mt-[31px]">
            <img src="/assets/icons/Email.png" alt="Email Icon" className="w-[42px] ml-[38px]" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your school email" 
              className="text-[#9B9B9B] text-[24px] font-[600] flex-1 outline-none bg-transparent placeholder-[#9B9B9B]"
            />
          </div>
          <div className="flex items-center justify-center ml-[20px] mt-[31px]">
            <button 
              type="submit" 
              onClick={handleSubmit}
              className="w-[94px] h-[94px] bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-12 h-12"
              >
                <path 
                  d="M9 16.17l-3.88-3.88a1 1 0 1 1 1.42-1.42L9 13.34l7.46-7.46a1 1 0 0 1 1.42 1.42l-8.17 8.17a1 1 0 0 1-1.42 0z" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="text-[#9B9B9B] ">
        <Footer />
      </div>
    </div>
  )
}