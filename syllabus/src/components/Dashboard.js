import React, { useState } from 'react'
import Navbar from '../navbar/Navbar'
import SylaScan from './SylaScan'
import TasksPage from './TasksPage'

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('SylaScan')
  return (
    <div className=" h-full flex flex-col">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'Tasks' && <TasksPage />}
        {activeTab === 'Timeline' && <TasksPage />}
        {/* {activeTab === 'Timeline' && <div className='h-full'>About timeline Content</div>} */}
        {activeTab === 'SylaScan' && <SylaScan />}
    </div>
  )
}
