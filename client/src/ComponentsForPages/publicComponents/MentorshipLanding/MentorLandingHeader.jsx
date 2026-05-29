import React, { useState } from 'react'

const MentorLandingHeader = ({ newGif, newGif2, darkMode, setDarkMode }) => {

    const baseUrl = 'http://localhost:8080';
    const imgSrc = (landingContent?.mentorImgFileId && landingContent?.mentorImgBucketName)
      ? `${baseUrl}/upload/image/${landingContent?.mentorImgFileId}?bucketName=${landingContent?.mentorImgBucketName}` : landingContent?.mentorMainImg

    //    className='responsiveHeader'
    return ( 

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${imgSrc})`, backgroundRepeat: 'no-repeat', backgroundSize: "100vw", height: '60vh' }}  className='responsiveHeader responsiveHeader'>


            <div style={{  height: "60vh", width: "70vw", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} className='responsiveMessage'>

                <div style={{ width: "80%", color: !darkMode ? "white" : "black" }}>
                    <h2>Mentor </h2>

                </div>
                <br />
                <div style={{ width: "80%", color: !darkMode ? "white" : "black" }}>

                </div>

            </div>
        </div>

    )
}

export default MentorLandingHeader
