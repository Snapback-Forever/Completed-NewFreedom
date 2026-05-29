import React, { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import noImage from "../../../images/noImageNf.png"

const VisitProLandingHeader = ({ darkMode, setDarkMode, singleProgram }) => {

  const images = (singleProgram?.additionalImages ?? [])

  const [currentIndex, setCurrentIndex] = useState(0);
  const [ viewImg, setViewImg ] = useState(false) 

  useEffect(() => {
    if (images.length === 0) return;
    const intervalId = setInterval(() => {
      setCurrentIndex(prev =>
        (prev + 1) % images.length
      );
    }, 10000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  if (!singleProgram || images.length === 0) {
    return null; // or <div>Loading...</div>
  }

  const current = images[currentIndex];

  const baseUrl = 'http://localhost:8080';
  const imgSrc = (current?.imageFileId && current?.imageBucketName) && `${baseUrl}/upload/image/${current?.imageFileId}?bucketName=${current?.imageBucketName}` 


  return (

    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${imgSrc})`, backgroundRepeat: 'no-repeat',  backgroundSize: "100vw", height: '60vh' }} className='responsiveHeader'>

      <div style={{ background: 'rgba(255, 255, 255, 0.766)', textAlign: 'center', padding: '2vw', width: "80%" }} className='responsiveMessage'>
        <h1 style={{ textAlign: 'center', padding: '2vw' }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(singleProgram?.programName) }} />
        
        <h5 style={{ color: darkMode ? "white" : "black" }}>{singleProgram?.lengthOfProgram} Day Program</h5>
        <h6 style={{ color: darkMode ? "white" : "black" }}>Max Capacity: {singleProgram?.maxCapacity}</h6>
        <h6 style={{ textAlign: "center", color: darkMode ? "white" : "black" }}>{singleProgram?.programType === "reg-Program" ? <>Non Vocational</> : <>Vocational Training</>}</h6>

      </div>
    </div>

  )
}

export default VisitProLandingHeader
