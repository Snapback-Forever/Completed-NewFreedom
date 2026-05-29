import React from 'react'
import { useState } from 'react';

const ImageCard = ({ sup }) => {

  const [viewImg, setViewImg] = useState(false)

  const baseUrl = "http://localhost:8080";
  const imgSrcSupporter = sup?.logoFileId && sup?.logoBucketName
    ? `${baseUrl}/upload/image/${sup?.logoFileId}?bucketName=${sup?.logoBucketName}`
    : sup?.logoUrl;

  return (
    <img src={imgSrcSupporter} style={{ margin: "0 0.5vw", minHeight: "30vh", maxHeight: "30vh", minWidth: "30vw", maxWidth: "30vw" }}
    className={viewImg ? "drawHover" : ""} onClick={() => setViewImg(prev => !prev)}
  />
  )
}

export default ImageCard
