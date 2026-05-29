import React from 'react'

const ApproachCard = ({ Carousel, pro }) => {

  return (
    
    <Carousel.Item>
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

        <Link to={`/visitProgram/${pro?._id}`} style={{ color: "black" }}>
          <button style={{ background: "goldenRod", width: "100%" }}>Visit This Program</button>
        </Link>

      </div>
    </div>
  </Carousel.Item>
  )
}

export default ApproachCard
