import React, { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'

import newMen from "../../../images/newfreedom Images/outpatient/images/newMen.png"
import newWomen from "../../../images/newfreedom Images/outpatient/images/newWomen.png"

const OutPatientLandingHeader = ({ newGif, newGif2, darkMode, setDarkMode, landingContent }) => {

    const baseUrl = 'http://localhost:8080'

    const imgSrc = (landingContent?.outReachImgFileId && landingContent?.outReachImgBucketName)
        ? `${baseUrl}/upload/image/${landingContent.outReachImgFileId}?bucketName=${landingContent.outReachImgBucketName}`
        : landingContent?.whyMainImg

    const images = [newMen, newWomen, ...(imgSrc ? [imgSrc] : [])]

    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
        if (images.length === 0) return

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
        }, 8000)

        return () => clearInterval(interval)
    }, [images.length])

    const currentBackgroundImage = images[currentImageIndex]

    return (

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${currentBackgroundImage})`, backgroundRepeat: 'no-repeat', width: "100vw", height: '60vh' }} className='responsiveHeader'>

            <div style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>

                <div style={{ background: 'rgba(255, 255, 255, 0.766)', padding: '2vw', whiteSpace: "pre-wrap"  }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(landingContent?.outReachSub) }} />

            </div>

        </div>

    )
}

export default OutPatientLandingHeader