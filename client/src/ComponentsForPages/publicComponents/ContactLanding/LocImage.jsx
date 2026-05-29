import React from 'react'
import { useState } from 'react';

const LocImage = ({ loc }) => {

    const [onHover, setOnHover] = useState(false)

    const baseUrl = 'http://localhost:8080';
    const imgSrc = (loc?.locImageFileId && loc?.locImageBucketName)
      ? `${baseUrl}/upload/image/${loc.locImageFileId}?bucketName=${loc.locImageBucketName}` : loc?.locationImage || noImageLocation

  return (
    <img src={imgSrc} style={{ height: "40vh", width: "30vw", margin: "1vw" }} onClick={()=> setOnHover(prev => !prev)} className={ onHover ? "responsiveContactImage drawHover" : "responsiveContactImage"} alt='Location Image' />
  )
}

export default LocImage
