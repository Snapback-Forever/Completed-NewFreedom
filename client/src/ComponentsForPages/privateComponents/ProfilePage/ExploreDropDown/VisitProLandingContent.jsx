
import React, { useRef, useState } from 'react'
import DOMPurify from 'dompurify';
import moment from 'moment'
import { Link } from 'react-router-dom'

import noImage from "../../../../images/noImageNF.png"
import AddImageModal from './AddImageModal';
import { useDispatch, useSelector } from 'react-redux';
import AddLocationModal from './AddLocationModal';
import AddTeacherModal from './AddTeacherModal';
import { deleteProgramImage, removeGraduate, removeLocationFromProgram, removeTeacherFromProgram } from '../../../../redux/reducers/locationReducer';
import UpdateProgramInfo from './UpdateProgramInfo';

const VisitProLandingContent = ({ darkMode, singleProgram, data, setData, setTrigger, allLocations, allUsers }) => {

  const [addImage, setAddImage] = useState(false)
  const [addLocation, setAddLocation] = useState(false)
  const [addTeacher, setAddTeacher] = useState(false)
  const [editPro, setEditPro] = useState(false)

  const dispatch = useDispatch()

  const user = useSelector(state => state.auth.user)

  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  const removeTeacherFromPro = (staffId) => {
    const now = Date.now();
    const delay = 400;

    if (now - lastTapRef.current < delay) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }

    if (tapCountRef.current === 3) {
      const payload = {
        programId: singleProgram?._id,
        userId: staffId
      };

      dispatch(removeTeacherFromProgram(payload));
      setTrigger(true);
      tapCountRef.current = 0;
    }

    lastTapRef.current = now;
  };

  const removeLocationFromPro = (locationId) => {
    const now = Date.now();
    const delay = 400;

    if (now - lastTapRef.current < delay) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }

    if (tapCountRef.current === 3) {
      const payload = {
        locationId: locationId,
        programId: singleProgram?._id
      }

      dispatch(removeLocationFromProgram(payload))
      setTrigger(true);
      tapCountRef.current = 0;
    }

    lastTapRef.current = now;
  }

  const removeGraduateFromPro = (mailUser) => {
    const now = Date.now();
    const delay = 400;

    if (now - lastTapRef.current < delay) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }

    if (tapCountRef.current === 3) {
      const payload = {
        mailId: mailUser,
        programId: singleProgram?._id,
        currentUserId: user?._id
      }

      dispatch(removeGraduate(payload))
      setTrigger(true);
      tapCountRef.current = 0;
    }

    lastTapRef.current = now;
  }

  const deleteTheImage = (img) => {
    const now = Date.now();
    const delay = 400;

    if (now - lastTapRef.current < delay) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }

    if (tapCountRef.current === 3) {
    const payload = {
      programId: singleProgram._id,
      imageFileId: img.imageFileId,
      imageBucketName: img.imageBucketName
    }

    dispatch(deleteProgramImage(payload));
    setTrigger(true)
  }

  lastTapRef.current = now;
  };


  return (

    <div style={{ minHeight: "38%", display: "flex", flexDirection: "column", alignItems: "center" }}  >

      <div style={{ background: "white", width: "100%", display: "flex", justifyContent: "space-evenly", padding: "1vh 0" }}>
        {data === "images" ?
          <button className='rounded' style={{ background: "lightGrey", border: "solid goldenrod", padding: "0 1vw", margin: "0 1vw", width: "25%" }}>Images</button>
          :
          <button className='rounded' style={{ background: "goldenRod", padding: "0 1vw", margin: "0 1vw", width: "25%" }} onClick={() => setData("images")}>Images</button>
        }

        {data === "locations" ?
          <button className='rounded' style={{ background: "lightGrey", border: "solid goldenrod", padding: "0 1vw", margin: "0 1vw", width: "25%" }}>locations</button>
          :
          <button className='rounded' style={{ background: "goldenRod", padding: "0 1vw", margin: "0 1vw", width: "25%" }} onClick={() => setData("locations")}>Locations</button>
        }

        {data === "staff" ?
          <button className='rounded' style={{ background: "lightGrey", border: "solid goldenrod", padding: "0 1vw", margin: "0 1vw", width: "25%" }}>Teachers</button>
          :
          <button className='rounded' style={{ background: "goldenRod", padding: "0 1vw", margin: "0 1vw", width: "25%" }} onClick={() => setData("staff")}>Teachers</button>
        }

        {data === "Graduates" ?
          <button className='rounded' style={{ background: "lightGrey", border: "solid goldenrod", padding: "0 1vw", margin: "0 1vw", width: "25%" }}>Graduates</button>
          :
          <button className='rounded' style={{ background: "goldenRod", padding: "0 1vw", margin: "0 1vw", width: "25%" }} onClick={() => setData("Graduates")}>Graduates</button>
        }

      </div>

      {data === "" ?
        <>
          {user?.creator || user?.NFadmin || singleProgram?.teachers.includes(user?._id) ?
            <button style={{ background: "goldenRod", width: "100%", height: "5vh", margin: "1vh 0" }} onClick={() => setEditPro(true)}>Update Program Information</button>
            : ""}

          <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "2vh 0" }}>

            <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black", margin: "1vh 0" }}>{singleProgram?.programName}</h1>

            {singleProgram?.descriptionOfProgramVideo?.startsWith("htt") ?
              <video className='videoMedia' controls style={{ width: "60%", height: "50vh" }} aria-label="Welcome To New Freedom Video" title='Welcome To New Freedom Video'>
                <source src={singleProgram?.descriptionOfProgramVideo} type="video/mp4" />
              </video> : ""}
          </div>

          <div>
            <h3 style={{ color: darkMode ? "white" : "black", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(singleProgram?.descriptionOfProgram) }} />
          </div>

        </>
        : ""}

      <dialog open={editPro}>
        <UpdateProgramInfo singleProgram={singleProgram} setTrigger={setTrigger} setAddImage={setAddImage} />
      </dialog>

      {data === "images" ?
        <>
          {user?.creator || user?.NFadmin || singleProgram?.teachers.includes(user?._id) ?
            <button style={{ background: "goldenRod", width: "100%", height: "5vh", margin: "1vh 0" }} onClick={() => setAddImage(true)}>Add Program Images</button>
            : ""}

          {singleProgram?.additionalImages?.filter(img => img).length === 0 ? 
          <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Images Attached To Program</h1> : <>
            <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Images From Program</h1>
            {singleProgram?.additionalImages?.filter(img => img).reverse().map(img => {
              const baseUrl = 'http://localhost:8080';
              const imgSrc = (img?.imageFileId && img?.imageBucketName)
                ? `${baseUrl}/upload/image/${img.imageFileId}?bucketName=${img.imageBucketName}` : img.link || noImage
              return (
                <div style={{ width: "90%", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 0", display: "flex", flexDirection:"column", border: "solid antiqueWhite", }} key={crypto?.randomUUID()} >
                  <div style={{ display: "flex" }} className='responsiveImageCard'>
                    <img src={imgSrc} style={{ minHeight: "20vh", maxHeight: "35vh", minWidth: "20vw", maxWidth: "40vw", border: "solid lightGrey" }}  className='responsiveImageDiv'/>
                  {img?.description ? <h2 style={{ width: "65%", textAlign: "center" }} className='responsiveImageDiv'><b>Description Of Image:<br /></b>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(img?.description) }} />
                  </h2> : <div style={{ width: "65%", textAlign: "center" }} className='responsiveImageDiv'><b>No Description Of Image Provided</b></div>
                  }</div>
                 { user?.creator || user?.NFadmin ? <button onClick={() => deleteTheImage(img)} style={{ background: "red", width: "10)%" }}>Delete This Image</button> : ""}
                </div>
              )
            })}</>}
        </>
        : ""}

      <dialog open={addImage}>
        <AddImageModal singleProgram={singleProgram} setTrigger={setTrigger} setAddImage={setAddImage} />
      </dialog>

      {data === "locations" ?
        <>

          {user?.creator || user?.NFadmin ? <button style={{ background: "goldenRod", width: "100%", height: "5vh", margin: "1vh 0" }} onClick={() => setAddLocation(true)}>Add Program To A Location</button> : ""}

          {singleProgram?.location?.filter(loc => loc).length === 0 ? <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Locations Attached To Program</h1> : <>
            <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Program Locations</h1>
            {singleProgram?.location?.filter(loc => loc).map(loc => {

              return (
                <div style={{ width: "91.5%", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 0", display: "flex", flexDirection: "column", border: "solid antiqueWhite", }} key={crypto.randomUUID()}>
                  <div style={{ width: "89vw", display: "flex", overflowX: "scroll" }}>
                    {loc?.additionalImages.filter(img => img).map(img => {
                      const baseUrl = 'http://localhost:8080';
                      const imgSrc = (img?.imageFileId && img?.imageBucketName)
                        ? `${baseUrl}/upload/image/${img.imageFileId}?bucketName=${landingContent.imageBucketName}` : img.link || noImage
                      return (
                        <div key={crypto.randomUUID()}>
                          <img src={imgSrc} style={{ margin: "0 0.5vw", border: "solid lightGrey", minWidth: "15vw" }} /></div>
                      )
                    })}</div>
                  <h1 style={{ textAlign: "center", color: "black" }}>{loc?.locationName}</h1>
                  <h6 style={{ textAlign: "center", color: "black" }}>{loc?.mailingAddress.street}</h6>
                  <div style={{ display: "flex", justifyContent: 'center' }}>
                    <h6 style={{ color: "black" }}>{loc?.mailingAddress.city}</h6>
                    <h6 style={{ color: "black" }}>, {loc?.mailingAddress.state}</h6>
                  </div>
                  <h6 style={{ textAlign: "center", color: "black", margin: "1vh 0" }}>{loc?.mailingAddress.zipCode}</h6>
                  <Link to={`/viewLocation/${loc?._id}`} style={{ width: "89.5vw", color: "black", height: "5vh" }} >
                    <button style={{ background: "goldenRod", height: "5vh", width: "100%" }}>Visit This Location</button>
                  </Link>
                  <button style={{ background: "red", height: "5vh", width: "100%", margin: "1vh 0" }} onClick={() => removeLocationFromPro(loc?._id)}>Remove From Location</button>
                </div>
              )
            })}</>}
        </>
        : ""}

      <dialog open={addLocation}>
        <AddLocationModal singleProgram={singleProgram} setTrigger={setTrigger} setAddLocation={setAddLocation} allLocations={allLocations} />
      </dialog>

      {data === "staff" ? <>
        {user?.creator || user?.NFadmin ? <button style={{ background: "goldenRod", width: "100%", height: "5vh", margin: "1vh 0" }} onClick={() => setAddTeacher(true)}>Add Teacher To Program</button> : ""}

        {singleProgram?.teachers?.filter(staff => staff).length === 0 ? <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Teachers To View</h2>
          : <>
            <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Teachers For Program</h1>
            <div style={{ display: "flex", flexWrap: "wrap", width: "97vw" }}>
              {singleProgram?.teachers?.filter(staff => staff?.teacher).map(staff => {
                const baseUrl = 'http://localhost:8080';
                const imgSrc = (staff?.profilePicFileId && staff?.profilePicBucketName)
                  ? `${baseUrl}/upload/image/${staff.profilePicFileId}?bucketName=${staff.profilePicBucketName}` : staff.profilePic || noImage
                return (
                  <div style={{ background: "rgba(250, 235, 215, 0.960)", width: "30%", margin: "1vh 1vw", padding: "1vh", display: "flex", flexDirection: "column" }} key={crypto.randomUUID()} className='responsiveTeacherCard'>

                    <div style={{ minHeight: "35vh", maxHeight: "35vh", minWidth: "100%", maxWidth: "100%" }}>
                      <img src={imgSrc} style={{ minHeight: "35vh", maxHeight: "35vh", minWidth: "100%", maxWidth: "100%" }} />
                    </div>

                    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>

                      <div style={{ width: "90%", height: "80%", display: "flex", flexDirection: "column" }}>
                        <h1 style={{ width: "100%", textAlign: "center" }}>{staff?.firstName} {staff?.lastName}</h1>
                        {staff.mentor ? <h6>Mentor</h6> : ""}
                        {staff.teacher ? <h6>Teacher</h6> : ""}

                      </div>

                      <Link to={`/messagePage/${staff?._id}`} style={{ height: "5vh", width: "100%", color: "black" }}>
                        <button style={{ textAlign: "center", background: "goldenRod", height: "3.5vh", width: "100%" }} className='rounded'>Msg Staff Directly</button>
                      </Link>
                      <button style={{ background: "red", height: "5vh", width: "100%" }} onClick={() => removeTeacherFromPro(staff?._id)}>Remove From Program</button>

                    </div>
                  </div>
                )
              })}
            </div>
          </>} </> : ""}

      <dialog open={addTeacher}>
        <AddTeacherModal singleProgram={singleProgram} setTrigger={setTrigger} setAddTeacher={setAddTeacher} allUsers={allUsers} />

      </dialog>


      {data === "Graduates" ? <>
        {singleProgram?.graduates?.filter(grad => grad).length === 0 ? <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Graduates</h1> :
          <div style={{ display: "flex", flexWrap: "wrap", width: "97vw" }}>
            <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Current Program Graduates</h1>
            {singleProgram?.graduates?.filter(grad => grad).map(grad => {
              // console.log(grad)
              const baseUrl = 'http://localhost:8080';
              const imgSrc = (grad?.gradImageFileId && grad?.gradImageBucketName)
                ? `${baseUrl}/upload/image/${grad.gradImageFileId}?bucketName=${grad.gradImageBucketName}` : grad.gradImage || noImage
              return (

                <div style={{ background: "rgba(250, 235, 215, 0.960)", width: "22%", margin: "1vh 1vw", padding: "1vh", display: "flex", flexDirection: "column" }} key={crypto.randomUUID()}>

                  <img src={imgSrc} style={{ minWidth: "20vw", maxWidth: "20vw", minHeight: "20vh", maxHeight: "20vh" }} />
                  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <h3 style={{ width: "100%", textAlign: "center" }}><span style={{ fontSize: "small" }}>Graduation Dateasdf: {moment(grad?.gradDate).format("hh:mm MMM Do YY")}</span></h3>
                    <h5 style={{ width: "100%", textAlign: "center" }}>Congratulations:</h5>
                    <h3 style={{ width: "100%", textAlign: "center" }}>{grad?.firstName} {grad?.lastName}</h3>
                  </div>


                  <button style={{ background: "red", height: "5vh", width: "100%" }} onClick={() => removeGraduateFromPro(grad?.mailUser)}>Remove From Program</button>
                </div>
              )
            })}
          </div>}
      </> : <></>
      }

    </div>
  )
}

export default VisitProLandingContent
