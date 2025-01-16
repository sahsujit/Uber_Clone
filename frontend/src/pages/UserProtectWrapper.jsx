import React from 'react'
import { useNavigate } from 'react-router-dom'

const UserProtectWrapper = ({children}) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    if(!token){
        navigate('/user-login')
    }
  return (
   <>
   {children}
   </>
  )
}

export default UserProtectWrapper