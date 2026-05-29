import React from 'react'
import { useState } from 'react';

const ImageCard = ({ img }) => {

    const [viewImg, setViewImg] = useState(false)

    const baseUrl = 'http://localhost:8080';
    const imgSrc = (img?.imageFileId && img?.imageBucketName)
      ? `${baseUrl}/upload/image/${img.imageFileId}?bucketName=${img.imageBucketName}` : img.link || noImage

  return (
    <img
    src={imgSrc}
    style={{ margin: "0 0.5vw", border: "solid lightGrey", minWidth: "25vw", minHeight: "25vh", maxWidth: "25vw", maxHeight: "35vh" }}
    className={viewImg ? "drawHover" : ""} onClick={() => setViewImg(prev => !prev)}
  />
  )
}

export default ImageCard
