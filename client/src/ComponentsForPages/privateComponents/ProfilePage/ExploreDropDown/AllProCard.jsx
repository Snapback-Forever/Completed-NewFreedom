import React, { useRef, useState } from 'react'
import moment from 'moment'
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { deleteProgramImage, removeLocationFromProgram } from '../../../../redux/reducers/locationReducer';
import LocationModal from './LocationModal';
import MenteeModal from './MenteeModal';
import UserModal from './UserModal';
import EditProgram from './EditProgram';
import AddImageModal from './AddImageModal';

const AllProCard = ({ pro, setTrigger, allLocations, allUsers, allMentee }) => {

  const dispatch = useDispatch()

  const clickCountRef = useRef(0);
  const timeoutRef = useRef(null);

  const admin = useSelector(state => state.auth.user)

  const [seeChange, setSeeChange] = useState("")
  const [openModal, setOpenModal] = useState("")
  const [addImage, setAddImage] = useState(false)
  const [hoveredImage, setHoveredImage] = useState(null);


  const user = useSelector(state => state.auth.user)


  const removeThisLocation = (locId) => {
    clickCountRef.current += 1;
    if (clickCountRef.current === 3) {
      clearTimeout(timeoutRef.current);
      const payload = {
        locationId: locId,
        programId: pro?._id
      };
      dispatch(removeLocationFromProgram(payload));
      setTrigger(true);
      clickCountRef.current = 0;
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 400);
  };

  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

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
        programId: pro._id,
        imageFileId: img.imageFileId,
        imageBucketName: img.imageBucketName
      }

      dispatch(deleteProgramImage(payload));
      setTrigger(true)
    }

    lastTapRef.current = now;
  };

  return (
    <div style={{ width: '95vw', height: "fit-content", display: 'flex', flexDirection: 'column', background: "rgba(250, 235, 215, 0.960)", overflowY: 'auto', padding: '1rem 1vw', margin: "1vh 1vw" }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "small" }}>{moment(pro?.createdDate).format("hh:mm MMM Do YY")}</span>
      </div>

      {user?.creator || user?.NFadmin || pro?.teachers.includes(user?._id) ?
        <button style={{ background: "goldenRod", width: "100%", margin: "1vh 0" }} onClick={() => setAddImage(true)}>Add Program Images</button>
        : ""}
      <div style={{ display: "flex", width: "100%", minHeight: "17vh", overflowX: "scroll", padding: "1vh 1vw" }}>
        {pro?.additionalImages.length === 0 ? <h4>No Additional Images</h4> : <>
          {pro?.additionalImages.filter(img => img).reverse().map(img => {
            const baseUrl = 'http://localhost:8080';
            const imgSrc = (img?.imageFileId && img?.imageBucketName)
              ? `${baseUrl}/upload/image/${img?.imageFileId}?bucketName=${img?.imageBucketName}`
              : img?.link;
            return (
              <div key={img?._id || img?.imageFileId || img?.link} style={{ display: "flex", flexDirection: "column",minWidth: "20vw", maxWidth: "20vw", minHeight: "30vh", maxHeight: "30vh", margin: "1vh 1vw", border: "solid black", padding: "1vh 1vw" }}>
                <img
                  src={imgSrc}
                  style={{ minWidth: "95%", maxWidth: "95%", minHeight: "15vh", maxHeight: "15vh", margin: "0 0.5vw" }}
                  onClick={() => setHoveredImage(prev => prev === imgSrc ? null : imgSrc)}
                  className={hoveredImage === imgSrc ? 'drawHover' : ""}
                />
                {img?.imageFileId ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img.imageFileId)} style={{ cursor: "pointer" }}><b>imageFileId: </b><br />{img?.imageFileId}</div> : ""}
                {img?.imageBucketName ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img.imageBucketName)} style={{ cursor: "pointer" }}><b>imageBucketName: </b> <br />{img?.imageBucketName}</div> : ""}
                {img?.link && (<div title="Click to copy full link" onClick={() => navigator.clipboard.writeText(img.link)} style={{ cursor: "pointer" }}><b>Link:</b>{img.link.length > 30 ? `${img.link.slice(0, 15)}...${img.link.slice(-10)}` : img.link}</div>)}
                {admin?.creator || admin?.NFadmin ?

                  <button style={{ background: "red", width: "50%", margin: "0.5vh 0.5vw" }} onClick={() => deleteTheImage(img)}>Delete Image</button>

                  : ""}
              </div>
            )
          })}</>}
      </div>

      <div>
        <h2 style={{ width: "100%", textAlign: "center", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pro?.programName) }} />
        <div style={{ textAlign: "center" }}><b>Open To Public:</b> {pro?.openToPublic ? <span style={{ color: "green" }}>Open-To-Public</span> : <span style={{ color: "red" }}>Not-Public</span> }</div>
        <div style={{ textAlign: "center" }}><b>Program Type:</b> {pro?.programType}</div>
        <div style={{ textAlign: "center" }}><b>Remaining Capacity:</b> {pro?.currentCapacity}</div>
        <h6 style={{ width: "100%", padding: "2vw", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pro?.descriptionOfProgram) }} />

        {pro?.descriptionOfProgramVideo?.startsWith("htt") ? 
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", margin: "1vh 1vw" }}  className='responsiveUserSuccessVideoContainer'>
              <b>Program Video:</b>
                <video src={pro?.descriptionOfProgramVideo} style={{
                    minWidth: "50vw",
                    maxWidth: "50vw",
                    minHeight: "50vh",
                    maxHeight: "50vw",
                    background: "white"
                }} className='responsiveUserSuccessVideo videoMedia'controls></video>
            </div> : "No Video Provided"}
      </div>

      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "flex-start" }}>
          {seeChange === "locations" ?
            <button onClick={() => setSeeChange("")} style={{ margin: "0.5vh 0" }}><b>Hide Location{pro?.location.length > 1 ? "'s" : ""}:</b> ({pro?.location.length})</button> :
            <button onClick={() => setSeeChange("locations")} style={{ margin: "0.5vh 0" }}><b>Attached Location{pro?.location.length > 1 ? "'s" : ""}:</b> ({pro?.location.length})</button>
          }

          {seeChange === "students" ?
            <button onClick={() => setSeeChange("")} style={{ margin: "0.5vh 0" }}><b>Hide Students{pro?.students.length > 1 ? "'s" : ""}:</b> ({pro?.students.length})</button> :
            <button onClick={() => setSeeChange("students")} style={{ margin: "0.5vh 0" }}><b>Students{pro?.students.length > 1 ? "'s" : ""}:</b> ({pro?.students.length})</button>
          }

          {seeChange === "teachers" ?
            <button onClick={() => setSeeChange("")} style={{ margin: "0.5vh 0" }}><b>Hide Teachers{pro?.teachers.length > 1 ? "'s" : ""}:</b> ({pro?.teachers.length})</button> :
            <button onClick={() => setSeeChange("teachers")} style={{ margin: "0.5vh 0" }}><b>Attached Teachers{pro?.teachers.length > 1 ? "'s" : ""}:</b> ({pro?.teachers.length})</button>
          }

          {seeChange === "graduates" ?
            <button onClick={() => setSeeChange("")} style={{ margin: "0.5vh 0" }}><b>Hide Graduates{pro?.graduates.length > 1 ? "'s" : ""}:</b> ({pro?.graduates.length})</button> :
            <button onClick={() => setSeeChange("graduates")} style={{ margin: "0.5vh 0" }}><b>Attached Graduates{pro?.graduates.length > 1 ? "'s" : ""}:</b> ({pro?.graduates.length})</button>
          }
        </div>

        {seeChange === "locations" ?
          <>
            {user?.creator || user?.NFadmin ? <button style={{ background: "goldenRod", padding: "0 2vw", margin: "1vh 0" }} onClick={() => setOpenModal("location")}>Add A Location</button> : ""}
            {pro?.location.length === 0 ? <h4 style={{ background: 'white', padding: "1vh 1vw" }}>Currently No Attached Location</h4> :
              <>
                <h4 style={{ background: 'white', padding: "1vh 1vw" }}>Attached Location</h4>
                {pro?.location.map(loc => {
                  const baseUrl = 'http://localhost:8080';
                  const imgSrc = (loc?.locImageFileId && loc?.locImageBucketName)
                    ? `${baseUrl}/upload/image/${loc.locImageFileId}?bucketName=${loc.locImageBucketName}` : loc.locationImage
                  return (
                    <div>
                      <div style={{ margin: "1vh 0", border: "solid black" }}></div>
                      <div style={{ background: 'white', padding: "1vh 1vw" }}>
                        <img src={imgSrc} style={{ minWidth: "100%", maxWidth: "100%", minHeight: "30vh", maxHeight: "30vh", }} />
                        <span style={{ fontSize: "small" }}>{moment(loc?.createdDate).format("hh:mm MMM Do YY")}</span>
                        <h3 style={{ width: "100%", textAlign: "center", whiteSpace: "pre-wrap"}} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(loc?.locationName) }} />
                        <h5 style={{ width: "100%", textAlign: "center", padding: "2vw", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(loc?.aboutLocation) }} />
                        <h6 >Capacity Remaining: {loc?.currentCapacity}</h6>
                        <h6 >Location Gender: {loc?.facilitySex}</h6>
                        <div style={{ width: "100%", display: 'flex', justifyContent: "space-between" }}>

                          {user?.creator || user?.NFadmin ? <button style={{ background: "red", padding: "0 2vw", margin: "1vh 0" }} onClick={() => removeThisLocation(loc?._id)}>Remove Location</button> : ""}
                        </div>
                      </div>
                    </div>
                  )
                })}</>}
          </> : ""}

        <dialog open={openModal === "location"}>

          <LocationModal setTrigger={setTrigger} allLocations={allLocations} setOpenModal={setOpenModal} pro={pro} />
        </dialog>

        {seeChange === "students" ?
          <>
            {user?.creator || user?.NFadmin ? <button style={{ background: "goldenRod", padding: "0 2vw", margin: "1vh 0" }} onClick={() => setOpenModal("student")}>Add A Student</button> : ""}
            {pro?.students.length === 0 ? <h4 style={{ background: 'white', padding: "1vh 1vw" }}>Currently No Attached students</h4> :
              <>
                <h4 style={{ background: 'white', padding: "1vh 1vw" }}>Attached students</h4>
                <div style={{ width: "100%", display: "flex", overflowY: "scroll" }}>
                  {pro?.students?.map(stud => {
                    const baseUrl = 'http://localhost:8080';
                    const imgSrc = (stud?.mailUser.menteeImageFileId && stud?.mailUser.menteeImageBucketName)
                      ? `${baseUrl}/upload/image/${stud?.mailUser.menteeImageFileId}?bucketName=${stud?.mailUser.menteeImageBucketName}` : stud?.mailUser.studationImage
                    return (
                      <div style={{ minWidth: "20vw", margin: "1vh 1vw" }}>
                        <div style={{ background: 'white', padding: "1vh 1vw" }}>
                          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "space-around" }}>
                            <span style={{ fontSize: "small" }}><b>Start:</b> {moment(stud?.startDate).format("hh:mm MMM Do YY")}</span>
                            <span style={{ fontSize: "small" }}><b>End:</b> {moment(stud?.endDate).format("hh:mm MMM Do YY")}</span>
                          </div>
                          <img src={imgSrc} style={{ minWidth: "100%", maxWidth: "100%", minHeight: "30vh", maxHeight: "30vh", }} />
                          <h3 style={{ width: "100%", textAlign: "center" }}>{stud?.mailUser.firstName} {stud?.mailUser.lastName}</h3>
                          <h6 style={{ width: "100%", textAlign: "center" }}>Gender: {stud?.mailUser.sex}</h6>

                        </div>
                      </div>
                    )
                  })}</div></>}
          </> : ""}

        <dialog open={openModal === "student"}>
          <MenteeModal allMentee={allMentee} setTrigger={setTrigger} setOpenModal={setOpenModal} pro={pro} />
        </dialog>

        {seeChange === "teachers" ?
          <>
            {user?.creator || user?.NFadmin ? <button style={{ background: "goldenRod", padding: "0 2vw", margin: "1vh 0" }} onClick={() => setOpenModal("teachers")}>Add A Teacher</button> : ""}
            {pro?.teachers.length === 0 ? <h4 style={{ background: 'white', padding: "1vh 1vw" }}>Currently No Attached teachers</h4> :
              <>
                <h4 style={{ background: 'white', padding: "1vh 1vw" }}>Attached teachers</h4>
                <div style={{ width: "100%", display: "flex", overflowY: "scroll" }}>
                  {pro?.teachers?.map(teach => {

                    const baseUrl = 'http://localhost:8080';
                    const imgSrc = (teach?.profilePicFileId && teach?.profilePicBucketName)
                      ? `${baseUrl}/upload/image/${teach?.profilePicFileId}?bucketName=${teach?.profilePicBucketName}` : teach?.teachationImage
                    return (
                      <div style={{ minWidth: "20vw", margin: "1vh 1vw" }}>
                        <div style={{ background: 'white', padding: "1vh 1vw" }}>
                          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "space-around" }}>
                            <span style={{ fontSize: "small" }}><b>Start:</b> {moment(teach?.startDate).format("hh:mm MMM Do YY")}</span>
                            <span style={{ fontSize: "small" }}><b>End:</b> {moment(teach?.endDate).format("hh:mm MMM Do YY")}</span>
                          </div>
                          <img src={imgSrc} style={{ minWidth: "100%", maxWidth: "100%", minHeight: "30vh", maxHeight: "30vh", }} />
                          <Link to={`/messagePage/${teach?._id}`}>
                            <h3 style={{ width: "100%", textAlign: "center" }}>{teach?.accountName}</h3>
                          </Link>
                          <h6 style={{ width: "100%", textAlign: "center" }}>Gender: {teach?.sex}</h6>

                        </div>
                      </div>
                    )
                  })}</div></>}
          </> : ""}

        <dialog open={openModal === "teachers"}>
          <UserModal allUsers={allUsers} setTrigger={setTrigger} setOpenModal={setOpenModal} pro={pro} />
        </dialog>

        {seeChange === "graduates" ?
          <>
           
            {pro?.graduates.length === 0 ? <h4 style={{ background: 'white', padding: "1vh 1vw" }}>Currently No Attached graduates</h4> :
              <>
                <h4 style={{ background: 'white', padding: "1vh 1vw" }}>Attached graduates</h4>
                <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
                  {pro?.graduates.map(grad => {
                    const baseUrl = 'http://localhost:8080';
                    const imgSrc = (grad?.gradImageFileId && grad?.gradImageBucketName)
                      ? `${baseUrl}/upload/image/${grad?.gradImageFileId}?bucketName=${grad?.gradImageBucketName}` : grad?.mailUser.gradationImage
                    return (
                      <div style={{ minWidth: "20vw", margin: "1vh 1vw" }}>
                        <div style={{ background: 'white', padding: "1vh 1vw" }}>
                          <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                            <span style={{ fontSize: "small" }}><b>Graduation Date:</b> {moment(grad?.gradDate).format("MMM Do, YYYY")}</span>
                          </div>
                          <img src={imgSrc} style={{ minWidth: "100%", maxWidth: "100%", minHeight: "30vh", maxHeight: "30vh", }} />
                          <h3 style={{ width: "100%", textAlign: "center" }}>{grad?.firstName} {grad?.lastName}</h3>

                        </div>
                      </div>
                    )
                  })}</div></>}
          </> : ""}

        {user?.creator || user?.NFadmin ?
          <>
            {seeChange === "" ? <button style={{ background: "green", padding: "0 2vw", width: "30vw", margin: "1vh 0" }} onClick={() => setSeeChange("editProgram")}>Edit Program</button> : <button style={{ background: "red", padding: "0 2vw", width: "30vw", margin: "1vh 0" }} onClick={() => setSeeChange("")}>Hide Edit Program</button>}
          </> : ""}


        {seeChange === "editProgram" ? <>
          <EditProgram pro={pro} setTrigger={setTrigger} setSeeChange={setSeeChange} />

        </> : ""}

      </div>

      <dialog open={addImage}>
        <AddImageModal singleProgram={pro} setTrigger={setTrigger} setAddImage={setAddImage} />
      </dialog>


    </div>
  )
}

export default AllProCard
