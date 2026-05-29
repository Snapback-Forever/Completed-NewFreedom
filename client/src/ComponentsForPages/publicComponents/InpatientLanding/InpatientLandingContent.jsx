import Carousel from 'react-bootstrap/Carousel';

import React, { useState } from 'react'
import DOMPurify from 'dompurify';
import { Link } from "react-router-dom";

const InpatientLandingContent = ({ darkMode, setDarkMode, landingContent, allPrograms }) => {


  return (

    <div style={{ minHeight: "38%", color: !darkMode ? "black" : "white" }}  >

      { landingContent?.InpatientVideo?.startsWith("htt") ? <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "2vh 0" }}>
        <video className='videoMedia' controls style={{ width: "60%", height: "50vh" }} aria-label="Welcome To New Freedom Video" title='Welcome To New Freedom Video'>
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div> : "" }


      { landingContent?.inpatientMainImg && landingContent?.InpatientSub === ""  || landingContent?.impatientImgBucketName &&  landingContent?.InpatientSub === "" ? 
      <h1 style={{ width: "100%", textAlign: "center", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(landingContent?.InpatientTitle) }} />
      : ""}

      <div style={{ width: "100%", padding: "1vh 1vw", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(landingContent?.InpatientContent) }} />

      {allPrograms.length === 0 ? "" : <>

      <div style={{ width: "100vw", height: "fit-content", position: "relative", border: "10px double black", padding: "1vh 1vw", background: "rgba(211, 211, 211, 0.775)", margin: "2vh 0" }}>
        <h4 style={{ textAlign: "center" }}>Check Our Our Programs:</h4>
        <Carousel>
          {allPrograms.filter(Boolean).reverse().map((pro, index) => {
            return (
              <Carousel.Item key={index}>
                <div style={{ width: "100%", minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "0 70px" }}>

                  <div style={{ width: "100%", maxWidth: "100%", minHeight: "40vh", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", padding: "20px", color: "black" }}>
                    <div style={{ display: "flex", overflowY: "scroll", padding: "1vh 1vw" }} className="scrollBar" >
                      {pro?.additionalImages.map(img => {
                        const baseUrl = 'http://localhost:8080';
                        const imgSrc = (img?.imageFileId && img?.imageBucketName)
                          ? `${baseUrl}/upload/image/${img.imageFileId}?bucketName=${img.imageBucketName}` : img.link
                        return (
                          <img src={imgSrc} style={{ minWidth: "15vw", maxWidth: "15vw", minHeight: "15vh", maxHeight: "15vh", margin: "0 0.5vw" }} />
                        )
                      })}
                    </div>
                    <h3 style={{ textAlign: "center" }}>{pro.programName}</h3>
                    <p style={{ width: "100%", padding: "1vh 1vw", textAlign: "center" }}><b>Program Type:</b> <br />{pro?.programType}</p>
                    <p style={{ width: "100%", padding: "1vh 1vw", textAlign: "center" }}><b>Remaining Capacity:</b> ({pro?.currentCapacity})</p>
                    <p style={{ width: "100%", padding: "1vh 1vw", textAlign: "center" }}>{pro?.openToPublic ? <b className="lookAtMe">Open To Public</b> : ""}</p>

                    <Link to={`/visitProgram/${pro?._id}`} style={{ color: "black" }}>
                      <button style={{ background: "goldenRod", width: "100%" }}>Visit This Program</button>
                    </Link>

                  </div>
                </div>
              </Carousel.Item>
            )
          })}
        </Carousel>
      </div></>} 

    </div>

  )
}

export default InpatientLandingContent
