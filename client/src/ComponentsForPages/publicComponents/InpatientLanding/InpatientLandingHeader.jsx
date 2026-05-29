import React, { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'

import inpatient from "../../../images/newfreedom Images/inpatient/inpatient.png"

const InpatientLandingHeader = ({ newGif, newGif2, darkMode, setDarkMode, landingContent }) => {

    const baseUrl = 'http://localhost:8080'

    const imgSrc = (landingContent?.impatientImgFileId && landingContent?.impatientImgBucketName)
        ? `${baseUrl}/upload/image/${landingContent.impatientImgFileId}?bucketName=${landingContent.impatientImgBucketName}`
        : landingContent?.inpatientMainImg

    const images = [inpatient, ...(imgSrc ? [imgSrc] : [])]

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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${currentBackgroundImage})`, backgroundRepeat: 'no-repeat', backgroundSize: "100vw", height: '60vh' }} className='responsiveHeader'>


                <div style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.866)', textAlign: 'center', padding: '2vw' }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(landingContent?.InpatientSub) }} />
            
            </div>
        </div>

    )
}

export default InpatientLandingHeader