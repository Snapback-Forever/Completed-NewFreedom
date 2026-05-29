import Carousel from 'react-bootstrap/Carousel';

import React, { useState } from 'react'
import DOMPurify from 'dompurify';
import { Link } from "react-router-dom";
import joint from "../../../images/landingPageImg/joint.png"

const OutPatientLandingContent = ({ darkMode, setDarkMode, landingContent, allPrograms, allSupporters }) => {

  const baseUrl = "http://localhost:8080";

  const tierOrder = { platinum: 1, gold: 2, silver: 3, bronze: 4 };

  const visibleSupporters = [...allSupporters].sort(
    (a, b) => (tierOrder[a.tier] || 999) - (tierOrder[b.tier] || 999)
  );

  const supporters = visibleSupporters.filter((sup) => sup.tier !== "supporter");
  const chunkSize = 4;
  const slides = supporters.reduce((acc, _, i) => (i % chunkSize === 0 ? [...acc, supporters.slice(i, i + chunkSize)] : acc), []);

  return (

    <div style={{ minHeight: "38%", color: !darkMode ? "black" : "white" }}  >

      { landingContent?.outReachVideo?.startsWith("htt") ? <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "2vh 0" }}>
        <video className='videoMedia' controls style={{ width: "60%", height: "50vh" }} aria-label="Welcome To New Freedom Video" title='Welcome To New Freedom Video'>
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div> : "" }

      {allPrograms.filter(pro => pro?.programType !== "vocational").length !== 0 ? 
      <div style={{ width: "100%", padding: "1vh 1vw", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(landingContent?.outReachTitle) }} /> 
      : <h2 style={{ textAlign: "center" }}>Currently No Outreach Programs</h2>}

      <div>
        
          {allPrograms.filter(pro => pro?.programType !== "vocational").reverse().map((pro, index) => {
    
            return (
              
                <div style={{ width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", padding: "0 70px", margin: "1vh 0" }}>
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
                      <div style={{ width: "100%", padding: "1vh 1vw", margin: "1vh 1vw", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pro?.descriptionOfProgram) }} />
                  

                    <Link to={`/visitProgram/${pro?._id}`} style={{ color: "black" }}>
                      <button style={{ background: "goldenRod", width: "100%" }}>Visit This Program</button>
                    </Link>

                  </div>
                </div>
            )
          })}
         
      </div>

      <div style={{ width: "100%", padding: "1vh 1vw", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(landingContent?.outReachContent) }} />

         <div style={{ display: "flex", justifyContent: "center", background: "white" }}>
        <a href="https://www.jointcommission.org/en-us/about-us/recognizing-excellence/find-accredited-organizations">
          <img src={joint} alt="Joint Commission" style={{ width: "30vw", height: "30vh", maxWidth: "30vw", maxHeight: "30vh" }} />
        </a>
      </div>
  
      <>
          {supporters.length !== 0 && !supporters.length > 6 ? <h3 style={{ textAlign: "center", margin: "0.5rem 0", background: "lightGrey", color: "black" }}>Supporters Of Our Mission</h3> : ""}
          {supporters.length > 6 ? (<>
            {supporters.length !== 0 ? <h3 style={{ textAlign: "center", margin: "0.5rem 0", background: "lightGrey", color: "black" }}>Supporters Of Our Mission</h3> : ""}

            <Carousel>
              {slides.map((group, idx) => (
                <Carousel.Item key={idx} interval={idx === 0 ? 5000 : idx === 1 ? 5000 : undefined}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: "0.5rem", width: "100%", boxSizing: "border-box", padding: "0.5rem" }}>
                    {group.map((sup) => {
                      const imgSrc = sup?.logoFileId && sup?.logoBucketName ? `${baseUrl}/upload/image/${sup?.logoFileId}?bucketName=${sup?.logoBucketName}` : sup?.logoUrl;
                      return (
                        <div key={sup?._id} title={sup?.name} style={{ flex: "0 0 22%", minWidth: "22%", maxWidth: "22%", minHeight: "20vh", background: "white" }}>
                          <a href={sup?.websiteLink} target="_blank" style={{ display: "block", width: "100%", height: "100%" }}>
                            <img src={imgSrc} alt={sup?.name || "Supporter logo"} style={{ width: "100%", height: "20vh", objectFit: "contain", display: "block" }} />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </>) : (
            <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "0.5rem", boxSizing: "border-box", margin: "0.5rem 0", flexWrap: "wrap" }}>
              {supporters.map((sup) => { const imgSrc = sup?.logoFileId && sup?.logoBucketName ? `${baseUrl}/upload/image/${sup?.logoFileId}?bucketName=${sup?.logoBucketName}` : sup?.logoUrl; return (<div key={sup?._id} title={sup?.name} style={{ minWidth: "10vw", maxWidth: "10vw", minHeight: "20vh", maxHeight: "20vh", margin: "1vh 0.5vw", background: "white" }}><a href={sup?.websiteLink} target="_blank"><img src={imgSrc} alt={sup?.name || "Supporter logo"} style={{ width: "100%", height: "20vh", objectFit: "contain", display: "block" }} /></a></div>); })}
            </div>
          )}
        </>
  
      {allSupporters.length !== 0 ? (
        <>
          <h3 style={{ textAlign: "center", margin: "1vh 0", background: "lightGrey", color: "black" }}>Agencies We Work With</h3>
          <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "1vw", boxSizing: "border-box", margin: "1vh 0", flexWrap: "wrap" }}>
            {allSupporters.filter((sup) => sup.tier === "supporter").map((sup) => {
          
              const baseUrl = "http://localhost:8080";
              const imgSrc = sup?.logoFileId && sup?.logoBucketName ? `${baseUrl}/upload/image/${sup?.logoFileId}?bucketName=${sup?.logoBucketName}` : sup?.logoUrl;
              return (
                <div key={sup?._id} style={{ minWidth: "10vw", maxWidth: "15vw", minHeight: "20vh", maxHeight: "20vh", margin: "1vh 0.5vw", background: "white" }} title={sup?.name}>
                <a href={sup?.websiteLink} target="_blank">
                  <img src={imgSrc} alt="Success story" style={{ minWidth: "100%", maxWidth: "100%", minHeight: "20vh", maxHeight: "20vh" }} />
                </a>
              </div>
              );
            })}
          </div>
        </>
      ) : null}
  

    </div>

  )
}

export default OutPatientLandingContent
