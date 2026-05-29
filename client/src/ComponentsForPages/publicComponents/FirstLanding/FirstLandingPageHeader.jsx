import React, { useState } from 'react'
import DOMPurify from 'dompurify';
import nfImage from "../../../images/nfImage.png"

const FirstLandingPageHeader = ({ newGif, newGif2, darkMode, setDarkMode, landingContent }) => {

    const baseUrl = 'http://localhost:8080';
    const imgSrc = (landingContent?.heroImgFileId && landingContent?.heroImgBucketName)
        ? `${baseUrl}/upload/image/${landingContent?.heroImgFileId}?bucketName=${landingContent?.heroImgBucketName}` : landingContent?.heroImage || nfImage

    return (

        <div style={{
            display: 'flex', background: !darkMode
                ? "linear-gradient(to right, lightBlue 30%, blue"
                : "linear-gradient(to right, black, blue)",
        }} className={!darkMode ? 'responsiveBorder ' : "responsiveBorderDark "}> 

            {!darkMode ? <img src={newGif} style={{ width: "30vw", maxHeight: "50vh" }} className='responsiveImage' /> :
                <img src={newGif2} style={{ width: "30vw", maxHeight: "50vh" }} className='responsiveImage' />}

            <div
                style={{
                    height: "50vh",
                    width: "70vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                className="responsiveMessage"
            >
                <div style={{ width: "50%" }} className='responsiveHeader'>
                    <div style={{ width: "100%", color: !darkMode ? "black" : "white" }}>

                        {landingContent?.subTitle ? <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(landingContent?.subTitle) }} style={{whiteSpace: "pre-wrap"}} /> :
                            <div>
                                <h1>A First For </h1> 
                                <h1>Second Chances</h1> 
                                <h4>We believe in the power of positive change for Justice-impacted individuals and their communities.</h4>
                            </div>
                        }

                    </div>

                </div>
                <div style={{ width: "50%", height: "100%", display: "flex", alignItems: "end" }} className='responsiveImageHeader'>
                    <img src={imgSrc} className="fadeInImage" style={{ maxHeight: "35vh", minWidth: "85%", maxWidth: "85%", margin: "1vh 0" }} />
                </div>
            </div>
        </div>

    )
}

export default FirstLandingPageHeader
