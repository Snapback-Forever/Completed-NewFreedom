import React, { useEffect, useState } from 'react'
import moment from 'moment'

const AllSuccessHeader = ({ darkMode, setDarkMode, newGif, newGif2 }) => {



    return (
  
      <div style={{ display: 'flex' }} className='responsiveBorder'>
  
  
        {!darkMode ? <img src={newGif} style={{ width: "30vw", maxHeight: "50vh" }} className='responsiveImage' /> :
          <img src={newGif2} style={{ width: "30vw", maxHeight: "50vh" }} className='responsiveImage' />}
  
        <div style={{ height: "50vh", width: "70vw", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} className='responsiveMessage'>
  
          <h1 style={{ color: darkMode ? "white" : "black" }}></h1>
  
          <h3 style={{ color: darkMode ? "white" : "black" }}></h3>
          <h5 style={{ color: darkMode ? "white" : "black" }}></h5>
          <h1 style={{ color: darkMode ? "white" : "black" }}></h1>
        
  
        </div>
      </div>
  
    )
  }

export default AllSuccessHeader
