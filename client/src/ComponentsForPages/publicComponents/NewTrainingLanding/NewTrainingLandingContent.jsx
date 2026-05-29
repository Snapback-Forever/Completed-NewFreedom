import Carousel from 'react-bootstrap/Carousel';

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPrograms } from '../../../redux/reducers/locationReducer'
import { Link } from 'react-router-dom'
import DOMPurify from 'dompurify';
import noImage from "../../../images/noImageNF.png"
import ImageCard from './ImageCard';

import joint from "../../../images/landingPageImg/joint.png"

const NewTrainingLandingContent = ({ darkMode, setDarkMode, allSupporters, allStories }) => {

  const dispatch = useDispatch()

  const allPrograms = useSelector(state => state.pro.allPrograms)


  useEffect(() => {
    dispatch(getAllPrograms())
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


    <div style={{ height: "84.1vh", overflow: "scroll", display: "flex", flexDirection: "column", alignItems: "center" }} className={darkMode ? "scrollBar QADark" : "scrollBar QAWhite"} >

      {allPrograms?.filter(pro => pro?.programType === "vocational" && pro?.createdAt && new Date(pro.createdAt) >= new Date(new Date().setMonth(new Date().getMonth() - 12))).length === 0 ? <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No New Programs Added Within The Last Year To View</h2> :
        <>
          <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>New Programs Added Within The Last Year </h1>
          <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>- Vocational Programs -</h2>
          {
            allPrograms?.filter(pro => pro?.programType === "vocational" && pro?.createdAt && new Date(pro.createdAt) >= new Date(new Date().setMonth(new Date().getMonth() - 12))).map(pro => {

              return (
                <div style={{ background: "rgba(250, 235, 215, 0.960)", width: "98%", margin: "1vh 1vw", padding: "1vh" }} key={crypto.randomUUID()}>

                  <div style={{ width: "96vw", display: "flex", overflowX: "scroll" }}>
                    {pro?.additionalImages?.filter(img => img).map(img => {
              
                      return (
                        <ImageCard img={img} />
                      )
                    })}
                  </div>

                  <h1 style={{ width: "100%", textAlign: "center" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pro?.programName) }} />
                  <h5 style={{ textAlign: "center" }}>Max Capacity: {pro?.maxCapacity}</h5>
                  <h5 style={{ textAlign: "center" }}>Length Of Program: {pro?.lengthOfProgram} Days</h5>
                  <h6 style={{ textAlign: "center" }}>{pro?.programType === "reg-Program" ? <>Non Vocational</> : <>Vocational Training</>}</h6>


                  <Link to={`/visitProgram/${pro?._id}`} style={{ height: "5vh", width: "100%", color: "black" }}>
                    <button style={{ textAlign: "center", background: "goldenRod", height: "5vh", width: "100%" }} className='rounded'>Visit This Program</button>
                  </Link>
                </div>
              )
            })
          }
        </>}

        {allStories?.filter((story) => story?.consentToPublish).length !== 0 ? (
        <div style={{ width: "100%", display: "flex", overflowX: "auto", gap: "1vw", boxSizing: "border-box", margin: "1vh 0" }}>
          {allStories
            ?.filter((story) => story?.consentToPublish)
            .slice()
            .reverse()
            .slice(0, 10)
            .map((story, index) => {
              const baseUrl = "http://localhost:8080";
              const imgSrc = story?.imageFileId && story?.imageBucketName ? `${baseUrl}/upload/image/${story?.imageFileId}?bucketName=${story?.imageBucketName}` : story?.imageUrl;
  
              return (
                <Link key={story?._id || index} to={`/successStory/${story?._id}`} style={{ color: "black", textDecoration: "none", flexShrink: 0 }}>
                  <div style={{ minWidth: "40vw", maxWidth: "50vw", minHeight: "40vh", maxHeight: "40vh", margin: "0.5vh 0.5vw", background: "white", flexShrink: 0 }}>
                    <img src={imgSrc} alt="Success story" style={{ width: "100%", minHeight: "20vh", maxHeight: "20vh", objectFit: "cover", display: "block" }} />
                    <h2 style={{ textAlign: "center" }}>{story?.firstName} {story?.lastName}</h2>
                    <h5 style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story?.outcomeSummary) }} />
                  </div>
                </Link>
              );
            })}
        </div>
      ) : null}
  
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

export default NewTrainingLandingContent
