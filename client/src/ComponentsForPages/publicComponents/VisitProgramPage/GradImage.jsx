import React from 'react'
import { useState } from 'react';

const GradImage = ({ grad }) => {

    const [ viewImg, setViewImg ] = useState(false) 
    const baseUrl = 'http://localhost:8080';
    const imgSrc = (grad?.gradImageFileId && grad?.gradImageBucketName)
      ? `${baseUrl}/upload/image/${grad.gradImageFileId}?bucketName=${grad.gradImageBucketName}` : grad.gradImage || noImage

  return (
    <div style={{ minHeight: "75%", maxHeight: "75%", minWidth: "30vw", maxWidth: "30vw" }} className='responsiveImageDiv'>
    <img src={imgSrc} style={{ minHeight: "98%", maxHeight: "98%", minWidth: "98%", maxWidth: "98%" }} className={viewImg ? "drawHover" : ""} onClick={()=> setViewImg(prev => !prev)} />
  
  </div>
  )
}

export default GradImage
