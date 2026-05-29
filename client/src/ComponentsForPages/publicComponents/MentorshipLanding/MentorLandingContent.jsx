import Carousel from 'react-bootstrap/Carousel';

import React, { useState } from 'react'
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import ApplicationForm from './ApplicationForm';

import noImg from "../../../images/noImageNF.png"

const MentorLandingContent = ({ darkMode, setDarkMode, landingContent, data, setData, allUsers, allSupporters }) => {

  const baseUrl = "http://localhost:8080";

  const tierOrder = { platinum: 1, gold: 2, silver: 3, bronze: 4 };

  const visibleSupporters = [...allSupporters].sort(
    (a, b) => (tierOrder[a.tier] || 999) - (tierOrder[b.tier] || 999)
  );

  const supporters = visibleSupporters.filter((sup) => sup.tier !== "supporter");
  const chunkSize = 4;
  const slides = supporters.reduce((acc, _, i) => (i % chunkSize === 0 ? [...acc, supporters.slice(i, i + chunkSize)] : acc), []);

  return (

   <> <div style={ data === "" ? { minHeight: "38%", color: !darkMode ? "black" : "white" }
       : { height: "84.1vh", overflow: "scroll", display: "flex", flexDirection: "column", alignItems: "center", }}
   className={ data === "" ? "" : darkMode ? "scrollBar QADark" : "scrollBar QAWhite" } >

      <div style={{ background: "white", width: "100%", display: "flex", justifyContent: "space-evenly", padding: "1vh 0" }}>

        {data === "mentor" ?
          <button className='rounded' style={{ background: "lightGrey", border: "solid goldenrod", color: "black", padding: "0 1vw", margin: "0 1vw", width: "50%" }}>Mentors </button>
          :
          <button className='rounded' style={{ background: "goldenRod", padding: "0 1vw", color: "black", margin: "0 1vw", width: "50%" }} onClick={() => setData("mentor")}>Mentors</button>
        }

        {data === "apply" ?
          <button className='rounded' style={{ background: "lightGrey", border: "solid goldenrod", color: "black", padding: "0 1vw", margin: "0 1vw", width: "50%" }}>Applying Mentor</button>
          :
          <button className='rounded' style={{ background: "goldenRod", padding: "0 1vw", color: "black", margin: "0 1vw", width: "50%" }} onClick={() => setData("apply")}>Become A Mentor</button>
        }

      </div>

      {data === "" ?
        <>
          { landingContent?.mentorVideo?.startsWith("htt") ? <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "2vh 0" }}>
            <video className='videoMedia' controls style={{ width: "60%", height: "50vh" }} aria-label="Welcome To New Freedom Video" title='Welcome To New Freedom Video'>
              <source src={videoSrc} type="video/mp4" />
            </video>
          </div> : ""}

          <h1 style={{ width: "100%", textAlign: "center" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(landingContent?.mentorTitle) }} />
          <div style={{ width: "100%", padding: "1vh 1vw" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(landingContent?.mentorContent) }} />
        </>
        : ""}

      {data === "mentor" ?
        <>
         {allUsers?.filter(user => user.mentor).map(user => {
          const baseUrl = "http://localhost:8080";
          const imgSrc =
          user?.profilePicFileId && user?.profilePicBucketName
            ? `${baseUrl}/upload/image/${user.profilePicFileId}?bucketName=${user.profilePicBucketName}`
            : user?.profilePic;
          
          return(
            <div style={{ width: "90%", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 1vw", display: "flex", border: "solid antiqueWhite", }} key={crypto.randomUUID()}>

            <div style={{ minHeight: "20vh", maxHeight: "35vh", minWidth: "20vw", maxWidth: "40vw"  }}>
              <img src={imgSrc || noImg} style={{ minHeight: "100%", maxHeight: "100%", minWidth: "100%", maxWidth: "100%"}} alt='Profile Picture' />
            </div>

            <div style={{ width: "90%", display: "flex", flexDirection: "column" }}>

              <div style={{ width: "90%", height: "80%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1 style={{ width: "100%", textAlign: "center" }}>{user?.firstName} {user?.lastName}</h1>
                {user.currentMentee.length !== 0 ? <h3>Currently Mentor For: ({user.currentMentee.length}) {user.currentMentee.length === 1 ? "Person" : "People" }</h3> : ""}
                {user.mentor ? <h4>Mentor For New Freedom</h4> : ""}
              </div>

              <div >

                <Link to={`/directMsg/${user?._id}`} style={{ height: "5vh", width: "100%", color: "black" }}>
                  <button style={{ textAlign: "center", background: "goldenRod", height: "3.5vh", width: "100%" }} className='rounded'>Msg Mentor Directly</button>
                </Link>
              </div>
            </div>
          </div>
          )
         })}
        </>
        : ""}

      {data === "apply" ?
       <ApplicationForm darkMode={darkMode} />
        : ""}


{data === "" ?  
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
  :""}
  
  {data === "" ?  <>
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
      </> : ""}
      

    </div>

</>
  )
}

export default MentorLandingContent
