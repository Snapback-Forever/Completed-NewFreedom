import Carousel from 'react-bootstrap/Carousel';

import React, { useState } from 'react'
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';

const WhyLandingContent = ({ darkMode, setDarkMode, landingContent, allStories, allSupporters }) => {


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

      {landingContent?.whyMainImg && landingContent?.whySub === "" || landingContent?.whyImgBucketName && landingContent?.whySub === "" ?
        <h1 style={{ width: "100%", textAlign: "center", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(landingContent?.whyTitle) }} />
        : ""}

      <div style={{ width: "100%", padding: "1vh 1vw", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(landingContent?.whyContent) }} />

      {allStories?.filter((story) => story?.consentToPublish).reverse().slice(0, 6).map((story, index) => {
  const baseUrl = "http://localhost:8080";
  const imgSrc =
    story?.imageFileId && story?.imageBucketName
      ? `${baseUrl}/upload/image/${story?.imageFileId}?bucketName=${story?.imageBucketName}`
      : story?.imageUrl;

  const isSmallScreen = window.innerWidth <= 768;

  return (
    <Link
      key={story?._id}
      to={`/successStory/${story?._id}`}
      style={{ color: "black", textDecoration: "none" }}
    >
      <div
        style={{
          width: isSmallScreen ? "100vw" : "30vw",
          minWidth: isSmallScreen ? "100vw" : "30vw",
          maxWidth: isSmallScreen ? "100vw" : "30vw",
          minHeight: "40vh",
          maxHeight: "40vh",
          margin: isSmallScreen ? "0.5vh 0" : "0.5vh 0.5vw",
          background: "white",
        }}
      >
        <img
          src={imgSrc}
          alt="Success story"
          style={{
            width: "100%",
            minHeight: "20vh",
            maxHeight: "20vh",
            objectFit: "cover",
            display: "block",
          }}
        />

        <h2 style={{ textAlign: "center" }}>
          {story?.firstName} {story?.lastName}
        </h2>

        <h5
          style={{ textAlign: "center" }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(story?.outcomeSummary),
          }}
        />
      </div>
    </Link>
  );
})}

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

      {allSupporters.length !== 0 ?
        <>
          <h3 style={{ textAlign: "center", margin: "1vh 0", background: "lightGrey", color: "black" }}>Agencies We Work With</h3>
          <div style={{ width: "100vw", display: "flex", justifyContent: "center", gap: "1vw", boxSizing: "border-box", margin: "1vh 0", flexWrap: "wrap" }}>
            {allSupporters.filter((sup) => sup.tier === "supporter").map(sup => {
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
        : ""}


    </div>

  )
}

export default WhyLandingContent
