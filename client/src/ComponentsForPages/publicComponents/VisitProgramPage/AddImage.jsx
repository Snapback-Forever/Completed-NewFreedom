import React from 'react'
import { useState } from 'react';

const AddImage = ({ img }) => {

    const [ viewImg, setViewImg ] = useState(false)

    const baseUrl = "http://localhost:8080";
    const imgSrc = img?.imageFileId && img?.imageBucketName
    ? `${baseUrl}/upload/image/${img?.imageFileId}?bucketName=${img?.imageBucketName}`
    : img?.link;

  return (
    <div key={crypto.randomUUID()}>
    <img src={imgSrc} className={viewImg ? "drawHover" : ""} onClick={()=> setViewImg(prev => !prev)} style={{ margin: "0 0.5vw", border: "solid lightGrey", minHeight: "20vh", maxHeight: "20vh", minWidth: "20vw", maxWidth: "20vw" }} />
  </div>
  )
}

export default AddImage
