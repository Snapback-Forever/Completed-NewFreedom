import React, { useState } from 'react'

const GraduatesLandingHeader = ({ newGif, newGif2, darkMode, setDarkMode }) => {


    return (

        <div style={{ display: 'flex' }} className='responsiveBorder'>

            {!darkMode ? <img src={newGif} style={{ background: "white", width: "30vw", maxHeight: "50vh", border: "solid grey" }} className='responsiveImage' /> :
                <img src={newGif2} style={{ background: "grey", width: "30vw", maxHeight: "50vh", border: "solid white" }} className='responsiveImage' />}

            <div style={{  height: "50vh", width: "70vw", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} className='responsiveMessage'>

                <div style={{ width: "80%", color: !darkMode ? "white" : "black" }}>
                    <h2>Graduates  </h2>

                </div>
                <br />
                <div style={{ width: "80%", color: !darkMode ? "white" : "black" }}>

                </div>

            </div>
        </div>

    )
}

export default GraduatesLandingHeader
