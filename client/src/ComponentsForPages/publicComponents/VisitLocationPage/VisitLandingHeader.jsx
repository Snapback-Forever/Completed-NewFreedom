import React, { useState } from 'react'
import DOMPurify from 'dompurify'
 
const VisitLandingHeader = ({ darkMode, setDarkMode, singleLocation }) => {

    const [ viewImg, setViewImg ] = useState(false)
    const baseUrl = "http://localhost:8080";
    const imgSrc =
      singleLocation?.locImageFileId && singleLocation?.locImageBucketName
        ? `${baseUrl}/upload/image/${singleLocation.locImageFileId}?bucketName=${singleLocation.locImageBucketName}`
        : singleLocation?.locationImage;

    return (

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${imgSrc})`, backgroundRepeat: 'no-repeat', width: "100vw", backgroundSize: "100vw", }} className='responsiveHeader'>

        <div style={{ background: 'rgba(255, 255, 255, 0.766)', textAlign: 'center', padding: '2vw', width: "80%" }} className='responsiveMessage'>

                <div style={{ width: "100%", color: darkMode ? "white" : "black", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <h1 style={{ textAlign: 'center', padding: '2vw' }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(singleLocation?.locationName) }} />
                    <h5>{singleLocation?.mailingAddress?.street}</h5>

                    <div style={{ display: "flex" }}>
                        <h5>{singleLocation?.mailingAddress?.city}</h5>
                        <h5>, {singleLocation?.mailingAddress?.state}</h5>
                    </div>
                    <h5>{singleLocation?.mailingAddress?.zipCode}</h5>

                </div>
                <h1 style={{ textAlign: "center", color: darkMode ? "white" : "black" }}>{singleLocation?.locationPhoneNumber}</h1>
                <h4 style={{ textAlign: "center", color: !darkMode ? "black" : "white", }}>{singleLocation?.facilitySex === "female" && "Female Location"}</h4>
                <h4 style={{ textAlign: "center", color: !darkMode ? "black" : "white", }}>{singleLocation?.facilitySex === "male" && "Male Location"}</h4>
                <h4 style={{ textAlign: "center", color: !darkMode ? "black" : "white", }}>{singleLocation?.facilitySex === "coed" && "Coed Location"}</h4>
                <h6 style={{ textAlign: "center", color: !darkMode ? "black" : "white", }}>MaxCapacity: {singleLocation?.maxCapacity}</h6>
                <br />
                <div style={{ width: "80%", color: !darkMode ? "white" : "black" }}>

                </div>

            </div>
        </div>

    )
}


export default VisitLandingHeader
