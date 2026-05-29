import React, { useState } from 'react'
import noImg from "../../../images/noImageNf.png"

const DirectLandingHeader = ({ newGif, newGif2, darkMode, setDarkMode, singleUser }) => {
 
    const baseUrl = 'http://localhost:8080';
    const imgSrc = (singleUser?.profilePicFileId && singleUser?.profilePicBucketName)
      ? `${baseUrl}/upload/image/${singleUser.profilePicFileId}?bucketName=${singleUser.profilePicBucketName}` : singleUser?.profilePic || noImg

    return (

        <div style={{ display: 'flex', background: !darkMode
            ? "linear-gradient(to right, lightBlue 30%, blue"
            : "linear-gradient(to right, black, blue)",  }} className={!darkMode ? 'responsiveBorder' : "responsiveBorderDark"}>

            <img src={imgSrc} style={{ background: "white", width: "30vw", maxHeight: "50vh" }} className='responsiveImage' /> 

            <div style={{ height: "50vh", width: "70vw", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} className='responsiveMessageUs'>

                <div style={{ width: "80%", color: darkMode ? "white" : "black", background: !darkMode ?  "rgba(255, 255, 255, 0.663)" : "rgba(0, 0, 0, 0.63)" }}>
                <h1 style={{  width: "100%", textAlign: "center" }}>Send {singleUser?.firstName} {singleUser?.lastName}</h1>
                   <h4 style={{  width: "100%", textAlign: "center" }}>The Form To Submit A Message Is Below. Please Make Sure You Submit Your Correct Email So {singleUser?.firstName} Can Respond. {singleUser?.firstName} Looks Forward To Hearing From You </h4>
                </div>
                <br />
                <div style={{ width: "80%", color: !darkMode ? "white" : "black" }}>
               
                </div>

            </div>
        </div>

    )
}

export default DirectLandingHeader
