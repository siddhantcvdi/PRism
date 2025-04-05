import React from 'react'
import Sidebar from '../components/Sidebar'
import SummarySection from '../components/SummarySection'

const Dashboard = () => {
  return (
    <>
    <div className='flex poppins-regular'>
        <Sidebar/>
        <SummarySection/>
    </div>
    </>
  )
}

export default Dashboard