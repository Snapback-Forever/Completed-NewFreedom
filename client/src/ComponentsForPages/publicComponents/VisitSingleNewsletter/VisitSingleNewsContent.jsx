import React, { useState } from 'react'
import DOMPurify from 'dompurify';
import moment from 'moment'
import { Link } from 'react-router-dom';
import ImgCard from './ImgCard';

const VisitSingleNewsContent = ({ darkMode, data, setData, singleNews, allNewsLetters }) => {


    return (

        <div style={{ height: "84.1vh", overflow: "scroll", display: "flex", flexDirection: "column", alignItems: "center" }} className={darkMode ? "scrollBar QADark" : "scrollBar QAWhite"} >

            <div style={{ background: "whiteSmoke", border: "solid black", margin: "1vh 0", width: "98vw", display: "flex", flexDirection: "column", alignItems: "center", padding: "2vw" }} key={crypto.randomUUID()}>

                <div style={{ width: "100%" }} ><b>News Letter Date: </b>{moment(singleNews?.periodStart).format("MMM YYYY")}</div>

                <div style={{ width: "95%",  margin: '2vh 0' }}>

                    <h1 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(singleNews?.postTitle) }} style={{whiteSpace: "pre-wrap", textAlign: "center" }} />

                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(singleNews?.postBody) }} style={{whiteSpace: "pre-wrap"}} />

                </div>


                {singleNews?.additionalImages?.length === 0 ? <></> : <>
                    <b>News Letter Images</b><div style={{ width: "100%", display: "flex", overflowX: "scroll", maxHeight: "28vh", minHeight: "27vh", background: "lightGrey" }}>
                        {singleNews?.additionalImages?.filter(img => img).map((img, i) => {

                            const baseUrl = "http://localhost:8080";
                            const imgSrc =
                                img?.imageFileId && img?.imageBucketName
                                    ? `${baseUrl}/upload/image/${img.imageFileId}?bucketName=${img.imageBucketName}`
                                    : img?.link || null;
                            return (
                                <ImgCard imgSrc={imgSrc} key={i} /> 
                            )

                        })}</div></>}

                <Link to={"/subscribe"} style={{ width: "100%", margin: "1vh 0" }}>
                    <button className='rounded lookAtMe' style={{ width: "100%", margin: "0.5vh 0", color: "black" }}>Subscribe To Receive News Letter's</button>
                </Link>

                <Link to={`/directMsg/${singleNews?.userId}`} style={{ width: "90%", color: "black", height: "5vh" }} >
                    <button style={{ background: "goldenRod", height: "5vh", width: "100%" }} className='rounded'>Msg Author Directly</button>
                </Link>
            </div>

            {allNewsLetters?.filter((story) => story?.status).length !== 0 ?
        <div style={{ border: "10px double black", margin: "2vh 0", padding: "1vh 1vw", width: "100%", background: "rgba(255, 255, 255, 0.466)" }}>
          <b>View Other News Letters:</b>
          <div style={{ width: "100%", height: "fit-content", display: "flex", flexWrap: "wrap", gap: "1vw", boxSizing: "border-box", scrollbarWidth: "thin", msOverflowStyle: "none", margin: "1vh 0" }}>

            {allNewsLetters?.filter((story) => story?.status && singleNews?._id !== story?._id).reverse().slice(0, 6).map((story, index) => {
              return (
                <Link key={story?._id} to={`/newsletter/${story?._id}`} style={{ color: "black", textDecoration: "none" }}>
                  <div key={story?._id || index} style={{ minWidth: "30vw", maxWidth: "30vw", minHeight: "40vh", maxHeight: "40vh", margin: "0.5vh 0.5vw", background: "white", padding: "1vh 1vw" }}>
                  <div style={{ fontSize: "small", display: "flex", justifyContent: "space-between" }}>
                    <p><b>NewsLetter Date:</b> {moment(story?.periodStart).format("MMM Do YY")}</p>
                    
                    </div>
                    <h2 style={{ textAlign: "center", margin: "2vh 0" }}>{story?.postTitle}</h2>
                    <b style={{ margin: "1vh 1vw" }}>Featuring: </b>
                    <h5 style={{ textAlign: "center", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story?.StoriesThisNews) }} />
                  </div>
                </Link>
              )
            })}
          </div>
          <Link to={"/allNewsLetters"}>
            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} > See All News Letters </button>
          </Link>
        </div>
        : ""}

        </div>

    )
}

export default VisitSingleNewsContent
