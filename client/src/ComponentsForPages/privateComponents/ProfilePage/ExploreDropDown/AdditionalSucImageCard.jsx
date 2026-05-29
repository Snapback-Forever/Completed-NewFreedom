import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const AdditionalSucImageCard = ({ imgSrc, img, suc, deleteTheImage }) => {


  const [hoveredImage, setHoveredImage] = useState(null)
  const admin = useSelector(state => state.auth.user)

  return (
    <div key={img.imageFileId || img.link} style={{ display: "flex", flexDirection: "column", margin: "1vh 0.5vw", border: "double black", padding: "1vh 1vw", maxWidth: "20vw", minWidth: "20vw", maxHeight: "40vh", minHeight: "30vh" }}>
      <img src={imgSrc} style={{ maxWidth: "18vw", minWidth: "18vw", maxHeight: "20vh", minHeight: "20vh" }} className={hoveredImage ? "drawHover" : ""} onClick={() => setHoveredImage(prev => !prev)} />

      {img?.imageFileId ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img.imageFileId)} style={{ cursor: "pointer" }}><b>imageFileId: </b>{img?.imageFileId}</div> : ""}

      {img?.imageBucketName ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img.imageBucketName)} style={{ cursor: "pointer" }}><b>imageBucketName: </b>{img?.imageBucketName}</div> : ""}

      {img?.link && (
        <div title="Click to copy full link" onClick={() => navigator.clipboard.writeText(img.link)} style={{ cursor: "pointer" }}>
          <b>Link:</b> {img.link.length > 30 ? `${img.link.slice(0, 15)}...${img.link.slice(-10)}` : img.link}
        </div>
      )}


      {admin?.creator || admin?.NFadmin || admin?._id === suc?.userId ? <div style={{ display: "flex", justifyContent: "end" }}>
        <button type="button" style={{ background: "red", padding: "0 2vw", margin: "1vh 0" }} onClick={() => deleteTheImage(img)}>Delete Img</button>
      </div>
        : ""}

    </div>
  )
}

export default AdditionalSucImageCard
