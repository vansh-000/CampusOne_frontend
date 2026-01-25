import React from 'react'
import { useNavigate } from 'react-router-dom'

const StudentDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className='w-screen h-screen bg-gray-600'>
      <div className='mx-auto my-auto'>
        <button onClick={() => navigate('/student/profile')}>
          Profile
        </button>
      </div>
    </div>
  )
}

export default StudentDashboard
