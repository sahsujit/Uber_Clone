// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { CaptainDataContext } from '../context/CapatainContext'
// import axios from 'axios'

// const CaptainLogin = () => {
//   const [ email, setEmail ] = useState('')
//   const [ password, setPassword ] = useState('')
//   const { captain, setCaptain } = React.useContext(CaptainDataContext)
//   const navigate = useNavigate()





//   const submitHandler = async (e) => {
//     e.preventDefault();
//     console.log('submitting')
//     const captain = {
//       email: email,
//       password
//     }
//     const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)
//     console.log(res)
//     if (res.status === 200) {
      
//       const data = res.data
//       setCaptain(data.captain)
//      navigate('/captain-home')
      
//     }


    

//     setEmail('')
//     setPassword('')
//   }
//   return (
//     <div className='p-7 h-screen flex flex-col justify-between'>
//       <div>
//         <img className='w-20 mb-3' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />

//         <form onSubmit={(e) => {
//           submitHandler(e)
//         }}>
//           <h3 className='text-lg font-medium mb-2'>What's your email</h3>
//           <input
//             required
//             value={email}
//             onChange={(e) => {
//               setEmail(e.target.value)
//             }}
//             className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
//             type="email"
//             placeholder='email@example.com'
//           />

//           <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

//           <input
//             className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
//             value={password}
//             onChange={(e) => {
//               setPassword(e.target.value)
//             }}
//             required type="password"
//             placeholder='password'
//           />

//           <button
//             className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
//           >Login</button>

//         </form>
//         <p className='text-center'>Join a fleet? <Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link></p>
//       </div>
//       <div>
//         <Link
//           to='/user-login'
//           className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
//         >Sign in as User</Link>
//       </div>
//     </div>
//   )
// }

// export default CaptainLogin











import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'

const CaptainLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { captain, setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    console.log('submitting')

    const captainCredentials = {
      email,
      password,
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captainCredentials)
      console.log(res)

      if (res.status === 200) {
        const data = res.data

        // ✅ Store token in localStorage for auth
        localStorage.setItem('token', data.token)

        // ✅ Set captain data in context
        setCaptain(data.captain)

        // ✅ Redirect to protected route
        navigate('/captain-home')
      }
    } catch (err) {
      console.error("Login failed:", err)
      alert("Invalid email or password!")
    }

    // Reset fields
    setEmail('')
    setPassword('')
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img
          className='w-20 mb-3'
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt="Uber Driver Icon"
        />

        <form onSubmit={submitHandler}>
          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="password"
            placeholder='password'
          />

          <button
            type="submit"
            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg'
          >
            Login
          </button>
        </form>

        <p className='text-center'>
          Join a fleet?{' '}
          <Link to='/captain-signup' className='text-blue-600'>
            Register as a Captain
          </Link>
        </p>
      </div>

      <div>
        <Link
          to='/user-login'
          className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg'
        >
          Sign in as User
        </Link>
      </div>
    </div>
  )
}

export default CaptainLogin
