import React, { useState } from 'react'
import Navbar from '../navbar/Navbar'
import SylaScan from './SylaScan'

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('SylaScan')
  return (
    <div className=" h-full flex flex-col">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'Tasks' && <div className='h-full'>About tasks Content</div>}
        {activeTab === 'Timeline' && <div className='h-full'>About timeline Content</div>}
        {activeTab === 'SylaScan' && <SylaScan />}
    </div>
  )
}
