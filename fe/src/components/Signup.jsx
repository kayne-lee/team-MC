import { React, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import { message } from 'antd';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = (e) => {
    console.log(email)
    e.preventDefault();
    // handle form submission logic here, like sending the email to the backend
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

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
    <div>
      {contextHolder}
      <div className="signup flex flex-col justify-center items-center">
        <div className="absolute top-0  w-full border-b-[1px] border-black">
          <Header />
        </div>
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
        <div className="absolute bottom-0 justify-center w-full text-white">
          <Footer />
        </div>
          
      </div>
      
    </div>
  )
}
