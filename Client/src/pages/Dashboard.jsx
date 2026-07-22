import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/core/Dashboard/Sidebar';
import { GiHamburgerMenu } from 'react-icons/gi';

const Dashboard = () => {

    const {loading: authLoading} = useSelector((state) => state.auth);
    const {loading: profileLoading} = useSelector((state) => state.profile);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if(profileLoading || authLoading){
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
    }
    
  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)] bg-richblack-900 ' >

      {/* Mobile sidebar toggle button */}
      <button
        className='lg:hidden fixed bottom-5 right-5 z-50 bg-yellow-50 text-richblack-900 rounded-full p-3 shadow-lg'
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <GiHamburgerMenu size={22} />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static z-40 top-0 left-0 h-full transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className='h-[calc(100vh-3.5rem)] flex-1 overflow-auto ' >
        <div className='mx-auto w-11/12 max-w-[1000px] py-10 ' >
            <Outlet/>
        </div>
      </div>

    </div>
  )
}

export default Dashboard
