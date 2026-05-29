import React, { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'

import breakMen from "../../../images/newfreedom Images/aproach/images/breakFree.png"
import breakWomen from "../../../images/newfreedom Images/aproach/images/breakWomen.png"

const ApproachLandingHeader = ({ newGif, newGif2, darkMode, setDarkMode, landingContent }) => {
    
  const baseUrl = 'http://localhost:8080'

  const imgSrc = landingContent?.approachImgFileId && landingContent?.approachImgBucketName ? `${baseUrl}/upload/image/${landingContent?.approachImgFileId}?bucketName=${landingContent?.approachImgBucketName}` : landingContent?.approachMainImg

  const images = [breakMen, breakWomen, ...(imgSrc ? [imgSrc] : [])]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (images.length === 0) return
    const interval = setInterval(() => { setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length) }, 8000)
    return () => clearInterval(interval)
  }, [images.length])

  const currentBackgroundImage = images[currentImageIndex]

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${currentBackgroundImage})`, backgroundRepeat: 'no-repeat', width: "100vw", height: '65vh' }} className='responsiveHeader'>

      <div style={{ width: '40%', color: darkMode ? 'white' : 'black' }} className="responsiveMessage">
        <div style={{ background: 'rgba(255, 255, 255, 0.766)', textAlign: 'center', padding: '2vw' }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(landingContent?.approachSub) }} />
      </div>
    </div>
  )
}

export default ApproachLandingHeader
