import React, { useState } from 'react'
import refer from "../../../images/refer.webp"

const ReferLandingHeader = ({ newGif, newGif2, darkMode, setDarkMode }) => {

    return ( 

        <div style={{ display: 'flex', background: !darkMode
            ? "linear-gradient(to right, lightBlue 30%, blue"
            : "linear-gradient(to right, black, blue)",  }} className={!darkMode ? 'responsiveBorder' : "responsiveBorderDark"}>

            <img src={refer} style={{ background: "white", width: "30vw", maxHeight: "50vh" }} className='responsiveImage' /> 

            <div style={{ height: "50vh", width: "70vw", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} className='responsiveMessageUs'>

                <div style={{ width: "80%", color: darkMode ? "white" : "black", background: !darkMode ?  "rgba(255, 255, 255, 0.663)" : "rgba(0, 0, 0, 0.63)" }}>
                <h1 style={{  width: "100%", textAlign: "center" }}>Refer A Fiend</h1>
                   <h4 style={{  width: "100%", textAlign: "center" }}>The Form To Refer A Friend Is Below. Please Make Sure You Submit Your Correct Email So We Can Respond. We Look Forward To Hearing From You </h4>
                </div>
                <br />
                <div style={{ width: "80%", color: !darkMode ? "white" : "black" }}>
               
                </div>

            </div>
        </div>


    )
}

export default ReferLandingHeader
