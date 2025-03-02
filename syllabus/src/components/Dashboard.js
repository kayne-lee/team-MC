import React, { useState } from 'react'
import Navbar from '../navbar/Navbar'
import SylaScan from './SylaScan'
import TasksPage from './TasksPage'
import Classes from './Classes'
import ListView from './ListView'
export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('Classes')
    
    return (
        <div className="dashboard flex flex-col h-screen">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex flex-1">
                <div className="flex-1">
                    {activeTab === 'Tasks' && <TasksPage />}
                    {activeTab === 'Classes' && <Classes />}
                    {activeTab === 'SylaScan' && <SylaScan />}
                    {activeTab === 'List' && <ListView />}
                </div>
            </div>
        </div>
    )
}
