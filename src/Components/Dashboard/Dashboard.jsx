import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashProfile from '../DashProfile/DashProfile'
import DashsideBar from '../sideBar/DashsideBar'

function Dashboard() {
  const location = useLocation()
  const [tab,setTab] = useState('')

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
    
  },[location.search])

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>  
      <div className='md:w-56'>
      {/* sidebar */}
      <DashsideBar/>
      </div>
      <div>
      {/* priflebar */}
      {tab === 'profile' && <DashProfile/>}
      </div>
    </div>
  )
}

export default Dashboard

