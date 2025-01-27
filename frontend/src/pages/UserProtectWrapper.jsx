import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'

const UserProtectWrapper = ({children}) => {
    const { user, setUser } = React.useContext(UserDataContext)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = React.useState(true)

    useEffect(()=>{
        if(!token){
            navigate('/user-login')
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        }).then(res=>{
            if(res.status === 200){
                setUser(res.data)
                setIsLoading(false)
            }
        }).catch(err=>{
            console.log(err)
            localStorage.removeItem('token')
            navigate('/user-login')})
    },[token])
    if(isLoading){
         return <div>
                  <h1>Loading...</h1>
         </div>
    }
  return (
   <>
   {children}
   </>
  )
}

export default UserProtectWrapper