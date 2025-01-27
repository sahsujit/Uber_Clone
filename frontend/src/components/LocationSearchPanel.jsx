import React from 'react'

const suggestions =[
  "Janakpur, Nepal",
  "Kathmandu, Nepal",
  "Pokhara, Nepal",
  "Biratnagar, Nepal",
  "Dharan, Nepal",
  "Butwal, Nepal",
]

const LocationSearchPanel = (props) => {
  return (
    <div>
      {
        suggestions.map((suggestion, index)=>(
          <div
          onClick={()=>{
            props.setVehiclePanel(true), props.setPanelOpen(false)
          }}
           key={index} className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'>
      <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'><i className="ri-map-pin-fill"></i></h2>
      <h4 className='font-medium'>{suggestion}</h4>
      </div>
        ))
      }
    </div>
  )
}

export default LocationSearchPanel