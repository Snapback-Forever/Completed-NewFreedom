import React, { useState } from 'react'

const LittleImages = ({ add }) => {

    const [onHover, setOnHover] = useState(false)

    const baseUrl = 'http://localhost:8080';
    const addImgSrc = (add?.imageFileId && add?.imageBucketName)
      ? `${baseUrl}/upload/image/${add.imageFileId}?bucketName=${add.imageBucketName}` : add?.link

  return (
    <div onClick={() => setOnHover(prev => !prev)} className={onHover ? 'drawHover responsiveContactImages' : "responsiveContactImages"}>
    <img src={addImgSrc} style={{ minHeight: "10vh", minWidth: "10vw", maxHeight: "10vh", maxWidth: "10vw", marginRight: "1vw" }} />
  </div>
  )
}

export default LittleImages
