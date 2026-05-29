import Carousel from 'react-bootstrap/Carousel';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllLocations } from '../../../redux/reducers/locationReducer'
import { Link } from 'react-router-dom'

import noImageLocation from "../../../images/noLocationImg.png"
import LocImage from './LocImage';
import LittleImages from './LittleImages';

const ContactLandingContent = ({ darkMode, setDarkMode, allSupporters }) => {

  const dispatch = useDispatch()

  const allLocations = useSelector(state => state.pro.allLocations)




  useEffect(() => {
    dispatch(getAllLocations())
  }, [])

  const baseUrl = "http://localhost:8080";

  const tierOrder = { platinum: 1, gold: 2, silver: 3, bronze: 4 };

  const visibleSupporters = [...allSupporters].sort(
    (a, b) => (tierOrder[a.tier] || 999) - (tierOrder[b.tier] || 999)
  );

  const supporters = visibleSupporters.filter((sup) => sup.tier !== "supporter");
  const chunkSize = 4;
  const slides = supporters.reduce((acc, _, i) => (i % chunkSize === 0 ? [...acc, supporters.slice(i, i + chunkSize)] : acc), []);

  return (
    <div style={{ height: "84.1vh", overflow: "scroll" }} className={darkMode ? "scrollBar contactDark" : "scrollBar contactWhite"}>

<h1 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>Locations & Contact Information</h1>

      <div style={{ width: "100vw", display: "flex", flexDirection: "column", alignItems: "center" }} >
        {allLocations?.filter(loc => loc).length === 0 ? <h2 style={{ textAlign: "center" }}>Currently No Locations</h2> : <>
          {allLocations?.filter(loc => loc).map(loc => {

            return (
              <div className='responsiveCard' style={{ width: "90%", display: "flex", alignItems: "center", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 0" }} key={crypto.randomUUID()}>
                
                <div style={{ display: "flex", flexDirection: "column" }}>
                

                  <LocImage loc={loc} />

                  <div style={{ display: "flex", overflowX: "scroll", width: "30vw", margin: "0 1vw", minHeight: "14vh", maxHeight: "14vh" }} className='responsiveContactImagesContainer'>
                    {
                      loc?.additionalImages.map(add => {
                
                        return (
                     <LittleImages add={add} key={add?._id}  />
                        )
                      })
                    }

                  </div>

                </div>

                <div style={{ width: "100%", height: "55vh", display: "flex", flexDirection: "column", justifyContent: "center", margin: "1vh 2vw" }}>
                  <div style={{ height: "85%", display: "flex", flexDirection: "column", justifyContent: "center", }}>
                    <h1 style={{ textAlign: "center" }}>{loc?.locationName}</h1>

                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                      <h2 style={{ textAlign: "center" }}>{loc?.mailingAddress.street}</h2>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <h2 style={{ textAlign: "center" }}>{loc?.mailingAddress.city}</h2>
                        <h2 style={{ textAlign: "center" }}>, {loc?.mailingAddress.state}</h2>
                      </div>
                      <h2 style={{ textAlign: "center" }}>{loc?.mailingAddress.zipCode}</h2>
                    </div>

                    <h6 style={{ textAlign: "center" }}>{loc?.facilitySex === "female" && "Female Location"}</h6>
                    <h6 style={{ textAlign: "center" }}>{loc?.facilitySex === "male" && "Male Location"}</h6>
                    <h6 style={{ textAlign: "center" }}>{loc?.facilitySex === "coed" && "Coed Location"}</h6>
                    <h6 style={{ textAlign: "center" }}>MaxCapacity: ({loc?.maxCapacity})</h6>
                  </div>
                  <h2 style={{ textAlign: "center" }}>{loc?.locationPhoneNumber}</h2>
                  <Link to={`/visitLocation/${loc?._id}`} style={{ height: "5vh", width: "100%", color: "black" }}>
                    <button style={{ textAlign: "center", background: "goldenRod", height: "5vh", width: "100%" }} className='rounded'>Visit This Location</button>
                  </Link>
                </div>

              </div>
            )
          })}
        </>}
      </div>

         
      <>
          {supporters.length !== 0 && !supporters.length > 6 ? <h3 style={{ textAlign: "center", margin: "0.5rem 0", background: "lightGrey", color: "black" }}>Supporters Of Our Mission</h3> : ""}
          {supporters.length > 6 ? (<>
            {supporters?.length !== 0 ? <h3 style={{ textAlign: "center", margin: "0.5rem 0", background: "lightGrey", color: "black" }}>Supporters Of Our Mission</h3> : ""}

            <Carousel>
              {slides?.map((group, idx) => (
                <Carousel.Item key={idx} interval={idx === 0 ? 5000 : idx === 1 ? 5000 : undefined}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: "0.5rem", width: "100%", boxSizing: "border-box", padding: "0.5rem" }}>
                    {group?.map((sup) => {
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

export default ContactLandingContent
