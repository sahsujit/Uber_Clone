import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'


// const CaptainProtectWrapper = ({children}) => {
//     const token = localStorage.getItem('token')
//     const navigate = useNavigate()
//     const { captain, setCaptain } = useContext(CaptainDataContext)
//     const [isLoading, setIsLoading] = useState(true)

//     useEffect(()=>{
//         if(!token){
//             navigate('/captain-login')
//         }

//         axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         }).then(res=>{
//             console.log("response",res)
//             if(res.status === 200){
//                 setCaptain(res.data.captain)
//                 setIsLoading(false)
//             }
//         }).catch(err=>{
//             console.log(err)
//             localStorage.removeItem('token')
//             navigate('/captain-login')
//         })
//     },[token])



//     if(isLoading){
//        return <div>
//               <h1>Loading...</h1>
//        </div>
//     }
//   return (
//    <>
//    {children}
//    </>
//   )
// }




const CaptainProtectWrapper = ({
    children
}) => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { captain, setCaptain } = useContext(CaptainDataContext)
    const [ isLoading, setIsLoading ] = useState(true)




    useEffect(() => {
        if (!token) {
            navigate('/captain-login')
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setCaptain(response.data.captain)
                setIsLoading(false)
            }
        })
            .catch(err => {

                localStorage.removeItem('token')
                navigate('/captain-login')
            })
    }, [ token ])

    

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }



    return (
        <>
            {children}
        </>
    )
}

export default CaptainProtectWrapper