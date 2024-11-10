import React from 'react'
import '../styles/landing.css'

export default function Landing() {
  return (
    <div className="flex flex-col">
        {/* header */}
      <div className='header'>
        <div className='logo'>
          <p>Nucleus</p>
        </div>
      </div>

      {/* landing */}
      <div className="landing">
        <div className='first'><span>Create</span> all your tasks</div>
        <div className="h-[87px] w-[714px] second font-normal">All-in-one academic tool that centralizes scattered syllabus details into a streamlined, proactive productivity tool, empowering students to unlock their potential.</div>
      </div>
    </div>
  )
}
