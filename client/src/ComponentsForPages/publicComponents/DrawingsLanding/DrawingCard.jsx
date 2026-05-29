import React, { useState } from 'react'
import moment from 'moment'

const DrawingCard = ({ imgSrc, noImage, draw }) => {

    const [drawHover, setDrawHover] = useState(false)

  return (
    <div style={{ background: "rgba(250, 235, 215, 0.960)", padding: "1vh 0.5vw", minHeight: "35vh", maxHeight: "100%" }} onClick={() => setDrawHover(prev => !prev)} className={drawHover ? "drawHover drawingWidth" : "drawingWidth"}>
    <p style={{ fontSize: "small" }}>{moment(draw?.createdAt).format("hh:mm MMM Do YY")}</p>
    <img src={imgSrc || noImage} key={crypto.randomUUID()} style={{ minHeight: "30vh", maxHeight: "40vh", minWidth: "45vh", maxWidth: "45vh" }} className={drawHover ? "drawHover drawingWidth" : "drawingWidth"} />
  </div>
  )
}

export default DrawingCard
