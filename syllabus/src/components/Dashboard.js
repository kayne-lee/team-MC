import React, { useState } from 'react'
import Navbar from '../navbar/Navbar'
import SylaScan from './SylaScan'
import TasksPage from './TasksPage'
import Classes from './Classes'

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('Classes')
  return (
    <div className="dashboard flex flex-col">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'Tasks' && <TasksPage />}
        {activeTab === 'Classes' && <Classes />}
        {/* {activeTab === 'Timeline' && <div className='h-full'>About timeline Content</div>} */}
        {activeTab === 'SylaScan' && <SylaScan />}
    </div>
  )
}
