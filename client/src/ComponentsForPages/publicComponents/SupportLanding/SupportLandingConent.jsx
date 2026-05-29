import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllSupporters } from '../../../redux/reducers/supporterReducers'
import ImageCard from './ImageCard'

const SupportLandingContent = ({ darkMode, setDarkMode, allSupporters }) => {

  const dispatch = useDispatch()

  const supporter = useSelector(state => state.support.supporters)

  const tierOrder = {
    platinum: 1,
    gold: 2,
    silver: 3,
    bronze: 4,
    supporter: 5,
  };

  useEffect(() => {
    dispatch(getAllSupporters())
  }, [])


  return (
    <div style={{ height: "84.1vh", overflow: "scroll", display: "flex", flexDirection: "column", alignItems: "center" }} className={darkMode ? "scrollBar QADark" : "scrollBar QAWhite"} >
      
    
      {supporter?.filter(sup => sup).sort((a, b) => {
        const aRank = tierOrder[a.tier] ?? Number.MAX_SAFE_INTEGER;
        const bRank = tierOrder[b.tier] ?? Number.MAX_SAFE_INTEGER;
        return aRank - bRank;
      }).length === 0 ? <h2 style={{ textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Supporters To View</h2> :

        <>
        <h2 style={{ textAlign: "center", color: darkMode ? "white" : "black" }}>Our Support Partners</h2>
          {supporter?.filter(sup => sup).sort((a, b) => {
            const aRank = tierOrder[a.tier] ?? Number.MAX_SAFE_INTEGER;
            const bRank = tierOrder[b.tier] ?? Number.MAX_SAFE_INTEGER;
            return aRank - bRank;
          }).map(sup => {
     
            return (

              <div style={{ width: "90vw", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 0", display: "flex", border: "solid antiqueWhite", }} key={crypto?.randomUUID()} className='responsiveCardSupport'>

          <ImageCard sup={sup} />
          
                <div style={{ width: "65vw" }}>
                  <h1 style={{ width: "100%", textAlign: "center" }}>{sup?.name}</h1>
                  <h4 style={{ width: "100%", textAlign: "center" }}>{sup?.shortDescription}</h4>
                  {sup?.websiteLink.filter(link => link).length !== 0 ?
                    <a href={sup?.websiteLink} target="_blank">
                      <h5 style={{ width: "100%", textAlign: "center" }}>Visit {sup?.name} Website</h5>
                    </a> : ""}


                  {sup?.social?.filter(social => social).length === 0 ? <></> : <div style={{ width: "65vw", display: "flex", justifyContent: "center", margin: "1vh 1vw" }}>
                    <div style={{ borderTop: "solid black", width: "70%" }}>
                      <h6>Social Media {sup?.name}:</h6>
                      <div style={{ width: "90%", height: "5vh", display: "flex", justifyContent: "center", alignItems: "center" }} className='scrollBar' >
                        {sup?.social?.filter(social => social).map(social => {
                          const baseUrl = "http://localhost:8080";
                          const imgSrc =
                            social?.socialFileId && social?.socialBucketName
                              ? `${baseUrl}/upload/image/${social?.socialFileId}?bucketName=${social?.socialBucketName}`
                              : supporter?.socialLink;
                          return (
                            <div key={crypto.randomUUID()}>
                              {social?.socialName === "twitter" || social?.socialName === "x" ?
                                <>
                                  {/* Twitter */}
                                  <a href={social?.socialLink} target="_blank" rel="noopener noreferrer" title='X'>
                                    <svg style={{ margin: "0 0.5vw", minHeight: "5vh", minWidth: "4vh", maxHeight: "5vh", maxWidth: "4vw", color: "blue" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                                    </svg>
                                  </a>
                                </>
                                : ""}


                              {social?.socialName === "faceBook" ?
                                <>
                                  {/* facebook */}
                                  <a href={social?.socialLink} target="_blank" rel="noopener noreferrer" title='Facebook'>
                                    <svg style={{ margin: "0 0.5vw", minHeight: "5vh", minWidth: "4vh", maxHeight: "5vh", maxWidth: "4vw", color: "blue" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                      <path fillRule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clipRule="evenodd" />
                                    </svg>
                                  </a>

                                </>
                                : ""}

                              {social?.socialName === "linkedIn" ?
                                <>
                                  {/* LinkedIn */}
                                  <a href={"changeMe"} target="_blank" rel="noopener noreferrer" title='LinkedIn'>
                                    <svg style={{ margin: "0 0.5vw", minHeight: "5vh", minWidth: "4vh", maxHeight: "5vh", maxWidth: "4vw", color: "blue" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                      <path fillRule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clipRule="evenodd" />
                                      <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                                    </svg>
                                  </a>

                                </>
                                : ""}

                              {social?.socialName === "instagram" ?
                                <>
                                  {/* INSTAGRAM */}
                                  <a href={"changeMe"} target="_blank" rel="noopener noreferrer" title='Instagram'>
                                    <svg style={{ margin: "0 0.5vw", minHeight: "5vh", minWidth: "4vh", maxHeight: "5vh", maxWidth: "4vw", color: "blue" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                      <path fill="currentColor" fillRule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clipRule="evenodd" />
                                    </svg>
                                  </a>

                                </>
                                : ""}

                              {social?.socialName === "other" ?
                                <>
                                  <img style={{ margin: "0 0.5vw", minHeight: "5vh", minWidth: "4vh", maxHeight: "5vh", maxWidth: "4vw", color: "blue" }} src={imgSrc} title={social?.socialTitle} />

                                </>
                                : ""}

                            </div>
                          )
                        })}</div>
                    </div>
                  </div>}
                </div>
              </div>
            )
          })}</>}


    </div>

  )
}

export default SupportLandingContent





