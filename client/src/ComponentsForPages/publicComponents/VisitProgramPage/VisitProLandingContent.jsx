import Carousel from 'react-bootstrap/Carousel';

import React, { useState } from 'react'
import DOMPurify from 'dompurify';
import moment from 'moment'
import { Link } from 'react-router-dom'

import noImage from "../../../images/noImageNF.png"
import ImageCard from './ImageCard';
import AddImage from './AddImage';
import UserImage from './UserImage';
import GradImage from './GradImage';

const VisitProLandingContent = ({ darkMode, singleProgram, data, setData, allSupporters, allPrograms, setChangeContent }) => {

  const baseUrl = "http://localhost:8080";

  const tierOrder = { platinum: 1, gold: 2, silver: 3, bronze: 4 };

  const visibleSupporters = [...allSupporters].sort(
    (a, b) => (tierOrder[a.tier] || 999) - (tierOrder[b.tier] || 999)
  );

  const supporters = visibleSupporters.filter((sup) => sup.tier !== "supporter");
  const chunkSize = 4;
  const slides = supporters.reduce((acc, _, i) => (i % chunkSize === 0 ? [...acc, supporters.slice(i, i + chunkSize)] : acc), []);

  return (

    <div style={{ minHeight: "38%", display: "flex", flexDirection: "column", alignItems: "center" }}  >

      <div style={{ background: "white", width: "100%", display: "flex", justifyContent: "space-evenly", padding: "1vh 0" }}>
        {data === "images" ?
          <button className='rounded' style={{ background: "lightGrey", border: "solid goldenrod", padding: "0 1vw", margin: "0 1vw", width: "25%" }}>Images</button>
          :
          <button className='rounded' style={{ background: "goldenRod", padding: "0 1vw", margin: "0 1vw", width: "25%" }} onClick={() => setData("images")}>Images</button>
        }

        {data === "locations" ?
          <button className='rounded' style={{ background: "lightGrey", border: "solid goldenrod", padding: "0 1vw", margin: "0 1vw", width: "25%" }}>locations</button>
          :
          <button className='rounded' style={{ background: "goldenRod", padding: "0 1vw", margin: "0 1vw", width: "25%" }} onClick={() => setData("locations")}>Locations</button>
        }

        {data === "staff" ?
          <button className='rounded' style={{ background: "lightGrey", border: "solid goldenrod", padding: "0 1vw", margin: "0 1vw", width: "25%" }}>Teachers</button>
          :
          <button className='rounded' style={{ background: "goldenRod", padding: "0 1vw", margin: "0 1vw", width: "25%" }} onClick={() => setData("staff")}>Teachers</button>
        }

        {data === "Graduates" ?
          <button className='rounded' style={{ background: "lightGrey", border: "solid goldenrod", padding: "0 1vw", margin: "0 1vw", width: "25%" }}>Graduates</button>
          :
          <button className='rounded' style={{ background: "goldenRod", padding: "0 1vw", margin: "0 1vw", width: "25%" }} onClick={() => setData("Graduates")}>Graduates</button>
        }

      </div>

      {data === "" ?
        <div style={{ width: "90%", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 1vw", display: "flex", flexDirection: "column", border: "solid antiqueWhite", padding: "1vh 1vw" }} className='rounded'>
          <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "2vh 0" }}>

            <h1 style={{ width: "100%", textAlign: "center", color: "black", margin: "1vh 0" }}>{singleProgram?.programName}</h1>

            {singleProgram?.descriptionOfProgramVideo?.startsWith("htt") ?
              <video className='videoMedia' controls style={{ width: "60%", height: "50vh" }} aria-label="Welcome To New Freedom Video" title='Welcome To New Freedom Video'>
                <source src={singleProgram?.descriptionOfProgramVideo} type="video/mp4" />
              </video> : ""}
          </div>

          <div>
            <h4 style={{ color: "black", whiteSpace: "pre-wrap", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(singleProgram?.descriptionOfProgram) }} />
          </div>

          <Link to={"/msg"}>
            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Send Us A Message About Program</button>
          </Link>

        </div>
        : ""}

      {data === "images" ?
        <>


          {singleProgram?.additionalImages?.filter(img => img).length === 0 ? <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Images Attached To Program</h1> : <>
            <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Images From Program</h1>
            {singleProgram?.additionalImages?.filter(img => img).map(img => {

              return (
                <ImageCard img={img} />
              )
            })}</>}
          <Link to={"/msg"} style={{ width: "100vw" }}>
            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Send Us A Message About Program</button>
          </Link>
        </>
        : ""}

      {data === "locations" ?
        <>



          {singleProgram?.location?.filter(loc => loc).length === 0 ? <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Locations Attached To Program</h1> : <>
            <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Program Locations</h1>
            {singleProgram?.location?.filter(loc => loc).map(loc => {
              return (
                <div style={{ width: "91.5%", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 0", display: "flex", flexDirection: "column", border: "solid antiqueWhite", }} key={crypto.randomUUID()}>
                  <div style={{ width: "89vw", display: "flex", overflowX: "scroll" }}>
                    {loc?.additionalImages.filter(img => img).map(img => {
                      return (
                        <AddImage img={img} />
                      )
                    })}</div>
                  <h1 style={{ textAlign: "center", color: "black" }}>{loc?.locationName}</h1>
                  <h6 style={{ textAlign: "center", color: "black" }}>{loc?.mailingAddress.street}</h6>
                  <div style={{ display: "flex", justifyContent: 'center' }}>
                    <h6 style={{ color: "black" }}>{loc?.mailingAddress.city}</h6>
                    <h6 style={{ color: "black" }}>, {loc?.mailingAddress.state}</h6>
                  </div>
                  <h6 style={{ textAlign: "center", color: "black" }}>{loc?.mailingAddress.zipCode}</h6>
                  <Link to={`/visitLocation/${loc?._id}`} style={{ width: "89.5vw", color: "black", height: "5vh" }} >
                    <button style={{ background: "goldenRod", height: "5vh", width: "100%" }}>Visit This Location</button>
                  </Link>
                </div>
              )
            })}</>}
          <Link to={"/msg"} style={{ width: "100vw" }}>
            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Send Us A Message About Program</button>
          </Link>
        </>
        : ""}


      {data === "staff" ? <>
        {singleProgram?.teachers?.filter(staff => staff).length === 0 ? <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Teachers To View</h2>
          : <>
            <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Teachers For Program</h1>
            <div style={{ display: "flex", flexWrap: "wrap", width: "97vw" }}>
              {singleProgram?.teachers?.filter(staff => staff?.teacher).map(staff => {

                return (
                  <div style={{ background: "rgba(250, 235, 215, 0.960)", width: "32%", margin: "1vh 1vw", padding: "1vh", display: "flex", flexDirection: "column" }} key={crypto.randomUUID()}>

                    <UserImage staff={staff} />

                    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>

                      <div style={{ width: "90%", height: "80%", display: "flex", flexDirection: "column" }}>
                        <h1 style={{ width: "100%", textAlign: "center" }}>{staff?.firstName} {staff?.lastName}</h1>
                        {staff.mentor ? <h6>Mentor</h6> : ""}
                        {staff.teacher ? <h6>Teacher</h6> : ""}

                      </div>

                      <Link to={`/directMsg/${staff?._id}`} style={{ height: "5vh", width: "100%", color: "black" }}>
                        <button style={{ textAlign: "center", background: "goldenRod", height: "3.5vh", width: "100%" }} className='rounded'>Msg Staff Directly</button>
                      </Link>

                    </div>
                  </div>
                )
              })}
            </div>
          </>}
        <Link to={"/msg"} style={{ width: "100vw" }}>
          <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Send Us A Message About Program</button>
        </Link>
      </> : ""}


      {data === "Graduates" ? <>
        {singleProgram?.graduates?.filter(grad => grad).length === 0 ? <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Graduates</h1> :
          <div style={{ display: "flex", flexWrap: "wrap", width: "97vw" }}>
            <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Current Program Graduates</h1>
            {singleProgram?.graduates?.filter(grad => grad).map(grad => {

              return (

                <div style={{ background: "rgba(250, 235, 215, 0.960)", minWidth: "30vw", margin: "1vh 1vw", padding: "1vh", display: "flex", flexDirection: "column" }} key={crypto.randomUUID()} className='responsiveGraduates'>

                  <GradImage grad={grad} />
                  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <h3 style={{ width: "100%", textAlign: "center" }}><span style={{ fontSize: "small" }}>Graduation Date: {moment(grad?.gradDate).format("hh:mm MMM Do YY")}</span></h3>
                    <h5 style={{ width: "100%", textAlign: "center" }}>Congratulations:</h5>
                    <h3 style={{ width: "100%", textAlign: "center" }}>{grad?.firstName} {grad?.lastName}</h3>
                  </div>
                </div>
              )
            })}
          </div>}
        <Link to={"/msg"} style={{ width: "100vw" }}>
          <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Send Us A Message About Program</button>
        </Link>
      </> : <></>
      }

      {data === "" ?
        <>
          <div style={{ width: "100vw", height: "fit-content", position: "relative", border: "10px double black", padding: "1vh 1vw", background: "rgba(211, 211, 211, 0.775)", margin: "2vh 0" }}>
            <h4 style={{ textAlign: "center" }}>Check Our Our Other Programs:</h4>
            <Carousel>
              {allPrograms.filter(pro => singleProgram?._id !== pro?._id).reverse().map((pro, index) => {
                return (
                  <Carousel.Item key={pro?._id}>
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

                        <Link to={`/visitProgram/${pro?._id}`} style={{ color: "black", width: "100%" }}>
                          <button style={{ background: "goldenRod", width: "100%" }}>Visit This Program</button>
                        </Link>

                      </div>
                    </div>
                  </Carousel.Item>
                )
              })}
            </Carousel>
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

        </>
        : ""}

    </div>
  )
}

export default VisitProLandingContent
