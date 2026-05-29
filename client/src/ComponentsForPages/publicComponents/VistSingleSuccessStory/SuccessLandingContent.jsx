import React, { useState } from 'react'
import DOMPurify from 'dompurify';
import SingleStoryCard from './SingleStoryCard';
import { Link } from 'react-router-dom';

const SuccessLandingContent = ({ darkMode, singleStory, data, setData,allStories }) => {

  const base = "http://localhost:8080"


  return (

    <div style={{ minHeight: "38%", display: "flex", flexDirection: "column", alignItems: "center" }}  >

      <>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "2vh 0" }}>

          {singleStory?.storyVideo?.startsWith("http") ?
            <video className='videoMedia' controls style={{ width: "60%", height: "50vh" }} aria-label="Welcome To New Freedom Video" title='Welcome To New Freedom Video'>
              <source src={singleStory?.storyVideo} type="video/mp4" title={singleStory?.outcomeSummary} />
            </video> : ""}
        </div>

        <div style={{ background: "white", width: "98vw", padding: "1vh 1vw", margin: "1vh 1vw" }}>
          <h2 style={{ color: darkMode ? "white" : "black", textAlign: "center", whiteSpace: "pre-wrap", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(singleStory?.title) }} />
          <div style={{ color: darkMode ? "white" : "black", whiteSpace: "pre-wrap", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(singleStory?.storyText) }} />
        </div>

        {singleStory?.additionalImages?.length > 0 &&
          <div style={{ display: "flex", flexDirection: "column", background: "white", border: "10px double black", padding: "1vh 1vw", margin: "1vh 1vw" }}>
            <b>Addittional Images:</b>
            <div style={{ display: "flex", overflowX: "scroll", background: "white", width: "94vw" }}>
              {singleStory.additionalImages.map((img, i) => {
                const src = img?.imageFileId && img?.imageBucketName ? `${base}/upload/image/${img.imageFileId}?bucketName=${img.imageBucketName}` : img?.link
                return <SingleStoryCard key={i} imgSrc={src} img={img} suc={singleStory} />
              })}
            </div>
          </div>}

      </>

      <Link to={"/submitSuccess"} style={{ width: "100vw", margin: "1vh 0" }}>
        <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Submit A Success Story</button>
      </Link>

      {allStories?.filter((story) => story?.consentToPublish).length !== 0 ?
        <div style={{ border: "10px double black", margin: "2vh 0", padding: "1vh 1vw", width: "100%", background: "rgba(255, 255, 255, 0.466)" }}>
          <b>View Other Success Stories:</b>
          <div style={{ width: "100%", height: "fit-content", display: "flex", flexWrap: "wrap", gap: "1vw", boxSizing: "border-box", scrollbarWidth: "thin", msOverflowStyle: "none", margin: "1vh 0" }}>

            {allStories?.filter((story) => story?.consentToPublish && singleStory?._id !== story?._id).reverse().slice(0, 6).map((story, index) => {
              const baseUrl = "http://localhost:8080";
              const imgSrc = story?.imageFileId && story?.imageBucketName ? `${baseUrl}/upload/image/${story?.imageFileId}?bucketName=${story?.imageBucketName}` : story?.imageUrl;

              return (
                <Link key={story?._id} to={`/successStory/${story?._id}`} style={{ color: "black", textDecoration: "none" }}>
                  <div key={story?._id || index} style={{ minWidth: "30vw", maxWidth: "30vw", minHeight: "40vh", maxHeight: "40vh", margin: "0.5vh 0.5vw", background: "white" }}>
                    <img src={imgSrc} alt="Success story" style={{ width: "100%", minHeight: "20vh", maxHeight: "20vh", objectFit: "cover", display: "block" }} />
                    <h2 style={{ textAlign: "center" }}>{story?.firstName} {story?.lastName}</h2>
                    <h5 style={{ textAlign: "center", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story?.outcomeSummary) }} />
                  </div>
                </Link>
              )
            })}
          </div>
          <Link to={"/allSuccessStory"}>
            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} > See All Success Stories </button>
          </Link>
        </div>
        : ""}


    </div>

  )
}

export default SuccessLandingContent

