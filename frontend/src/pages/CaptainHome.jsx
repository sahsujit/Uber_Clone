// import React, { useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import CaptainDetails from "../components/CaptainDetails";
// import RidePopUp from "../components/RidePopUp";
// import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
// import { useGSAP } from '@gsap/react'
// import { useEffect, useContext } from 'react'
// import { SocketContext } from '../context/SocketContext'
// import { CaptainDataContext } from '../context/CapatainContext'
// import gsap from 'gsap'

// const CaptainHome = () => {

//   const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
//   const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)

//   const ridePopupPanelRef = useRef(null)
//   const confirmRidePopupPanelRef = useRef(null)
//   const [ ride, setRide ] = useState(null)

//   const { socket } = useContext(SocketContext)
//   const { captain } = useContext(CaptainDataContext)

//   useEffect(() => {
//     socket.emit('join', {
//       userId: captain._id,
//       userType: 'captain'
//   })

//   const updateLocation = () => {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(position => {

//             socket.emit('update-location-captain', {
//                 userId: captain._id,
//                 location: {
//                     ltd: position.coords.latitude,
//                     lng: position.coords.longitude
//                 }
//             })
//         })
//     }
// }

// const locationInterval = setInterval(updateLocation, 10000)
// updateLocation()

//   },[])

//   socket.on('new-ride', (data) => {

//     setRide(data)
//     setRidePopupPanel(true)
   
   

// })

// console.log("ride :", ride)

//   useGSAP(function () {
//     if (ridePopupPanel) {
//         gsap.to(ridePopupPanelRef.current, {
//             transform: 'translateY(0)'
//         })
//     } else {
//         gsap.to(ridePopupPanelRef.current, {
//             transform: 'translateY(100%)'
//         })
//     }
// }, [ ridePopupPanel ])

// useGSAP(function () {
//     if (confirmRidePopupPanel) {
//         gsap.to(confirmRidePopupPanelRef.current, {
//             transform: 'translateY(0)'
//         })
//     } else {
//         gsap.to(confirmRidePopupPanelRef.current, {
//             transform: 'translateY(100%)'
//         })
//     }
// }, [ confirmRidePopupPanel ])

//   return (
//     <div className="h-screen">
//       <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
//         <img
//           className="w-16"
//           src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
//           alt=""
//         />
//         <Link
//           to="/captain-home"
//           className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
//         >
//           <i className="text-lg font-medium ri-logout-box-r-line"></i>
//         </Link>
//       </div>

//       <div className="h-3/5">
//         <img
//           className="h-full w-full object-cover"
//           src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
//           alt=""
//         />
//       </div>

//       <div className="h-2/5 p-6">
//         <CaptainDetails />
//       </div>

//       <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
//                 <RidePopUp
//                     ride={ride}
//                     setRidePopupPanel={setRidePopupPanel}
//                     setConfirmRidePopupPanel={setConfirmRidePopupPanel}
             
                   
//                 />
//             </div>
//             <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
//                 <ConfirmRidePopUp
//                     ride={ride}
//                     setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
//             </div>
//     </div>
//   );
// };

// export default CaptainHome;







import React, { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useGSAP } from '@gsap/react';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CapatainContext';
import gsap from 'gsap';

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ride, setRide] = useState(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  // Handle join and location updates
  useEffect(() => {
    if (!socket || !captain?._id) return;

    // Join as captain
    socket.emit('join', {
      userId: captain._id,
      userType: 'captain',
    });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit('update-location-captain', {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    // Initial location update and interval
    updateLocation();
    const locationInterval = setInterval(updateLocation, 10000);

    return () => clearInterval(locationInterval);
  }, [socket, captain]);

  // Listen for new ride
  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (data) => {
      console.log("✅ Received new ride:", data);
      setRide(data);
      setRidePopupPanel(true);
    };

    socket.on('new-ride', handleNewRide);

    return () => {
      socket.off('new-ride', handleNewRide);
    };
  }, [socket]);

  // GSAP animation for RidePopup
  useGSAP(() => {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, { transform: 'translateY(0)' });
    } else {
      gsap.to(ridePopupPanelRef.current, { transform: 'translateY(100%)' });
    }
  }, [ridePopupPanel]);

  // GSAP animation for ConfirmRidePopup
  useGSAP(() => {
    if (confirmRidePopupPanel) {
      gsap.to(confirmRidePopupPanelRef.current, { transform: 'translateY(0)' });
    } else {
      gsap.to(confirmRidePopupPanelRef.current, { transform: 'translateY(100%)' });
    }
  }, [confirmRidePopupPanel]);

  return (
    <div className="h-screen">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>

      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>

      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
        />
      </div>

      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
