import React from 'react'
import Sidebar from '../components/Sidebar'
import SummarySection from '../components/SummarySection'
import { Button, Modal } from 'antd';

const Dashboard = () => {
  return (
    <>
    <div className='flex poppins-regular'>
        <Sidebar isModalOpen/>
        <SummarySection/>   
    </div>
    </>
  )
}

export default Dashboard