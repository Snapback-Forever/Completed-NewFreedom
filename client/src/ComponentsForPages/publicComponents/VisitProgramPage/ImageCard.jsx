import React from 'react'
import { useState } from 'react'

const ImageCard = ({ img }) => {

  const [viewImg, setViewImg] = useState(false)

  const baseUrl = "http://localhost:8080";
  const imgSrc = img?.imageFileId && img?.imageBucketName
    ? `${baseUrl}/upload/image/${img.imageFileId}?bucketName=${img.imageBucketName}`
    : img?.link || noImage;

  return (
    <div key={img?._id || `${programIndex}-${imgIndex}`} style={{ width: "98%", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 0", display: "flex", border: "solid antiqueWhite" }} className="responsiveUser">
      <img src={imgSrc} style={{ minHeight: "35vh", maxHeight: "35vh", minWidth: "40vw", maxWidth: "40vw", border: "solid lightGrey" }} className={viewImg ? "responsiveImageDiv drawHover" : "responsiveImageDiv"} onClick={() => setViewImg(prev => !prev)} />
      {img?.description ? <div style={{ width: "65%", textAlign: "center" }} className="responsiveImageDiv"><b>Description Of Image:</b><br />{img?.description}</div> : <div style={{ width: "65%", textAlign: "center" }} className="responsiveImageDiv">No Description Of image</div>}
    </div>
  )
}

export default ImageCard
