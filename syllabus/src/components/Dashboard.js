import React, { useState } from 'react'
import Navbar from '../navbar/Navbar'
import SylaScan from './SylaScan'

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('SylaScan')
  return (
    <div className=" h-full flex flex-col">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'Tasks' && <div>About tasks Content</div>}
        {activeTab === 'Timeline' && <div>About timeline Content</div>}
        {activeTab === 'SylaScan' && <SylaScan />}
    </div>
  )
}
