import React, { useEffect, useState } from 'react'
import moment from 'moment'

const VisitSingleNewsHeader = ({ darkMode, setDarkMode, singleStory, newGif, newGif2, singleNews }) => {




    return (
  
      <div style={{ display: 'flex' }} className='responsiveBorder'>
  
  
        {!darkMode ? <img src={newGif} style={{ width: "30vw", maxHeight: "50vh" }} className='responsiveImage' /> :
          <img src={newGif2} style={{ width: "30vw", maxHeight: "50vh" }} className='responsiveImage' />}
  
        <div style={{ height: "50vh", width: "70vw", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} className='responsiveMessage'>
  
          <h3 style={{ color: darkMode ? "white" : "black" }}>News: {singleStory?.programName} {singleStory?.lastName}</h3>
          <h5 style={{ color: darkMode ? "white" : "black" }}>: {moment(singleStory?.periodStart).format("MMM Do, YYYY")}</h5>
  
        </div>
      </div>
  
    )
  }

export default VisitSingleNewsHeader
