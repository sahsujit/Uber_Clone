import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <div className='h-screen pt-8 flex flex-col justify-between  bg-cover bg-center  overflow-hidden home'>
         <img className='w-16  ml-8' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
         <div className='bg-white px-4 py-4'>
          <h2 className='text-3xl font-bold'>
            Get Started With Uber
          </h2>
          <Link to={"/login"} className='w-full flex justify-center items-center bg-black py-3 text-white rounded mt-5'>
            Continue
          </Link>
         </div>
    </div>
    </div>
  )
}

export default Home