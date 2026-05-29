import Carousel from 'react-bootstrap/Carousel';

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPrograms } from '../../../redux/reducers/locationReducer'
import { Link } from 'react-router-dom'
import moment from 'moment'
import noImage from "../../../images/noImageNF.png"
import DOMPurify from 'dompurify';

const GraduatesLandingContent = ({ darkMode }) => {

  const dispatch = useDispatch()

  const allPrograms = useSelector(state => state.pro.allPrograms)


  useEffect(() => {
    dispatch(getAllPrograms())
  }, [])

  return (
    <>

      {allPrograms?.filter(pro => pro?.graduates.length !== 0).length === 0 ? <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Programs Graduates To View</h2> :
        <>
          <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Program Graduates</h1>
          {
            allPrograms?.filter(pro => pro?.graduates.length !== 0).map(pro => {
              return (
                <div style={{ background: "rgba(250, 235, 215, 0.960)", width: "98%", margin: "1vh 1vw", padding: "1vh" }} key={crypto.randomUUID()}>

                  <div style={{ display: "flex", width: "96vw", overflowX: "scroll" }}>
                    {pro?.graduates?.filter(grad => grad).reverse().map(grad => {
                                 const baseUrl = 'http://localhost:8080';
                                 const imgSrc = (grad?.gradImageFileId && grad?.gradImageBucketName)
                                 ? `${baseUrl}/upload/image/${grad?.gradImageFileId}?bucketName=${grad?.gradImageBucketName}`
                                 : grad.gradImage || noImage
                      return (
                        <div style={{ margin: "0 1vw", border: 'solid lightGrey', minWidth: '20vw', maxWidth: "20vw" }} key={crypto.randomUUID()}>
                          <h3 style={{ width: "100%", textAlign: "center" }}><span style={{ fontSize: "small" }}>Graduation Date: {moment(grad?.gradDate).format("hh:mm MMM Do YY")}</span></h3>
                          <img src={imgSrc} style={{ minWidth: "100%", maxWidth: "100%", minHeight: "15vw", maxHeight: "15vw" }} />
                          <h5 style={{ width: "100%", textAlign: "center" }}>Congratulations:</h5>
                          <h3 style={{ width: "100%", textAlign: "center" }}>{grad?.firstName} {grad?.lastName}</h3>
                        </div>
                      )
                    })}
                  </div>

                  <h1 style={{ width: "100%", textAlign: "center", whiteSpace: "pre-wrap", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pro?.programName) }} />
                  <h5 style={{ textAlign: "center" }}>Max Capacity: {pro?.maxCapacity}</h5>
                  <h5 style={{ textAlign: "center" }}>Length Of Program: {pro?.lengthOfProgram} Days</h5>
                  <h5 style={{ textAlign: "center" }}>Number of Graduates: {pro?.graduates?.length}</h5>
                  <h6 style={{ textAlign: "center" }}>{pro?.programType === "reg-Program" ? <>Non Vocational</> : <>Vocational Training</>}</h6>


                  <Link to={`/visitProgram/${pro?._id}`} style={{ height: "5vh", width: "100%", color: "black" }}>
                    <button style={{ textAlign: "center", background: "goldenRod", height: "5vh", width: "100%" }} className='rounded'>Visit This Program</button>
                  </Link>
                </div>
              )
            })
          }
        </>}

        {allPrograms.length === 0 ? "" : <>
        <div style={{ width: "100vw", height: "fit-content", position: "relative", border: "10px double black", padding: "1vh 1vw", background: "rgba(211, 211, 211, 0.775)", margin: "2vh 0" }}>
        <h4 style={{ textAlign: "center" }}>Check Out Our Programs:</h4>
        <Carousel>
          {allPrograms.filter(Boolean).reverse().map((pro, index) => {
            return (
              <Carousel.Item key={index}>
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
          })}
        </Carousel>
      </div></>}

    </>
  )
}

export default GraduatesLandingContent
