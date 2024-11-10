import React from 'react'
import Header from './Header'
import Footer from './Footer'

export default function Signup() {
  return (
    <div>
      
      <div className="signup flex flex-col">
        <div className="absolute top-0  w-full border-b-[1px] border-black">
          <Header />
        </div>
        <div className="flex flex-col justify-center items-center h-full">
          <div className="text-[52px] font-[700]">Sign up to be a</div>
          <div className="beta">Beta Tester</div>
          <div className="flex items-center flex-row gap-[17px] w-[603px] h-[94px] border-[1px] border-black rounded-[15px] mt-[31px]">
            <img src="/assets/icons/Email.png" alt="Email Icon" className="w-[42px] ml-[38px]" />
            <input 
              type="email" 
              placeholder="Enter your school email" 
              className="text-[#9B9B9B] text-[24px] font-[600] flex-1 outline-none bg-transparent placeholder-[#9B9B9B]"
            />
          </div>
        </div>
        <div className="absolute bottom-0 justify-center w-full text-white">
          <Footer />
        </div>
          
      </div>
      
    </div>
  )
}
