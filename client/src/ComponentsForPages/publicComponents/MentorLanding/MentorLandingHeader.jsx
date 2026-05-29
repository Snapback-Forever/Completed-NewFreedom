import React, { useState } from 'react'
import DOMPurify from 'dompurify';

const MentorLandingHeader = ({ newGif, newGif2, darkMode, setDarkMode, landingContent, data }) => {

    const baseUrl = 'http://localhost:8080';
    const imgSrc = (landingContent?.mentorImgFileId && landingContent?.mentorImgBucketName)
      ? `${baseUrl}/upload/image/${landingContent.mentorImgFileId}?bucketName=${landingContent.mentorImgBucketName}` : landingContent?.mentorMainImg

    return (

        <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", backgroundImage: `url(${imgSrc})`, backgroundRepeat: "no-repeat", backgroundSize: "100vw", height: "40vh" }}  className='responsiveHeader'>


        <div style={{ width: "40%", color: darkMode ? "white" : "black" }} className="responsiveMessage">
            <div style={{ background: "rgba(255, 255, 255, 0.566)", textAlign: "center", padding: "2vw", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(landingContent?.mentorSub) }} />

        </div>

 
</div>
    )
}

export default MentorLandingHeader
