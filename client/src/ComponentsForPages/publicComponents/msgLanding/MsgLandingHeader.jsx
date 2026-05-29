import React, { useState } from 'react'


const MsgLandingHeader = ({ newGif, newGif2, darkMode, setDarkMode }) => {



    return (

        <div style={{ display: "flex", backgroundImage: `url(${newGif})`, backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "100vw", height: "71vh", width: "100%", }} className='responsiveHeader'>

            <div style={{ height: "50vh", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} className='responsiveMessageUs'>

                <div style={{ width: "80%", color: darkMode ? "white" : "black", background: !darkMode ?  "rgba(255, 255, 255, 0.863)" : "rgba(0, 0, 0, 0.63)" }}>
                <h1 style={{  width: "100%", textAlign: "center" }}>Send Us A Message</h1>
                   <h4 style={{  width: "100%", textAlign: "center" }}>The Form To Submit A Message Is Below. Please Make Sure You Submit Your Correct Email So We Can Respond. We Look Forward To Hearing From You </h4>
                </div>
                <br />
                <div style={{ width: "80%", color: !darkMode ? "white" : "black" }}>
               
                </div>

            </div>
        </div>

    )
}

export default MsgLandingHeader
