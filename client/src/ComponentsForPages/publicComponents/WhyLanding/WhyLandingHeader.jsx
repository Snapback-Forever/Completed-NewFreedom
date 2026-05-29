import React, { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'

import newCommunity from "../../../images/newfreedom Images/outpatient/images/newCommunity.png"

const WhyLandingHeader = ({ darkMode, setDarkMode, landingContent, newGif, newGif2 }) => {
  const baseUrl = 'http://localhost:8080'
  const imgSrc = landingContent?.whyImgFileId && landingContent?.whyImgBucketName ? `${baseUrl}/upload/image/${landingContent.whyImgFileId}?bucketName=${landingContent.whyImgBucketName}` : landingContent?.whyMainImg
  const images = [newCommunity, ...(imgSrc ? [imgSrc] : [])]
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (images.length === 0) return
    const interval = setInterval(() => { setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length) }, 8000)
    return () => clearInterval(interval)
  }, [images.length])

  const currentBackgroundImage = images[currentImageIndex]

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${currentBackgroundImage})`, backgroundRepeat: 'no-repeat', backgroundSize: "100vw", height: '60vh' }} className='responsiveHeader'>
      <div style={{ width: '40%', color: darkMode ? 'white' : 'black' }} className="responsiveMessage">
        <h6 style={{ background: 'rgba(255, 255, 255, 0.566)', textAlign: 'center', padding: '2vw', }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(landingContent?.whySub) }} />
      </div>
    </div>
  )
}

export default WhyLandingHeader
