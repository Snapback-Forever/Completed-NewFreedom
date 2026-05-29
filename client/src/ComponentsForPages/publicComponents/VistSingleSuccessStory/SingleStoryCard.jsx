import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const SingleStoryCard = ({ imgSrc, img, suc, deleteTheImage }) => {

    
    const [hoveredImage, setHoveredImage] = useState(null)
    const admin = useSelector(state => state.auth.user)
    
  
    return (
      <div key={img.imageFileId || img.link} style={{ display: "flex", flexDirection: "column", margin: "1vh 0.5vw", border: "double black", padding: "1vh 1vw", maxWidth: "20vw", minWidth: "20vw", maxHeight: "30vh", minHeight: "30vh" }}>
      <img src={imgSrc} style={{ maxWidth: "18vw", minWidth: "18vw", maxHeight: "100%", minHeight: "100%" }} className={hoveredImage ? "drawHover" : ""} onClick={()=> setHoveredImage(prev => !prev)} />
  
    </div>
    )
  }

export default SingleStoryCard
