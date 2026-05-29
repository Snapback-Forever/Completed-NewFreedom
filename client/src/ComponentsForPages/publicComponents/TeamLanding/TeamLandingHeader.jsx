import React, { useState } from 'react'

const TeamLandingHeader = ({ newGif, newGif2, darkMode, setDarkMode }) => {

    return (

        <div style={{ display: 'flex' }} className='responsiveBorder'>

            {!darkMode ? 
            <img src={newGif} style={{ width: "30vw", maxHeight: "50vh" }} className='responsiveImage' /> :
                <img src={newGif} style={{ width: "30vw", maxHeight: "50vh" }} className='responsiveImage' />}

            <div style={{ height: "50vh", width: "70vw", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} className='responsiveMessage'>



                <div style={{ width: "80%", color: !darkMode ? "white" : "black" }}>
                    <h2 style={{ color: darkMode ? "white" : "black" }}>New Freedom Team</h2>

                </div>
                <br />
                <div style={{ width: "80%", color: !darkMode ? "white" : "black" }}>

                </div>

            </div>
        </div>

    )
}

export default TeamLandingHeader
