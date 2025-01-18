import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'


const CaptainProtectWrapper = ({children}) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { captain, setCaptain } = React.useContext(CaptainDataContext)
    const [isLoading, setIsLoading] = React.useState(true)

    useEffect(()=>{
        if(!token){
            navigate('/user-login')
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        }).then(res=>{
            if(res.status === 200){
                const data = res.data
                setCaptain(data.captain)
                setIsLoading(false)
            }
        }).catch(err=>{
            console.log(err)
            localStorage.removeItem('token')
            navigate('/captain-login')
        })
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

export default CaptainProtectWrapper