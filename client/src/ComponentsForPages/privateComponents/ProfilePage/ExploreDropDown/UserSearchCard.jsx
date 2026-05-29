import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addTeacherToProgram } from '../../../../redux/reducers/locationReducer';
import { Link } from 'react-router-dom';

const UserSearchCard = ({ user, pro, setTrigger, setOpenModal }) => {
    
    const dispatch = useDispatch()

    const admin = useSelector(state => state.auth.user)

    const alreadyTeacher = user?.programsTeaching?.some(teach => (teach?._id || teach) === pro?._id);

    const baseUrl = "http://localhost:8080";
    const imgSrc =
      user?.profilePicFileId && user?.profilePicBucketName
        ? `${baseUrl}/upload/image/${user.profilePicFileId}?bucketName=${user.profilePicBucketName}`
        : user?.profilePic;


  const selectThisTeacher = (userId) => {

    const form = {
      programId: pro?._id,
      userId: userId
    }

    dispatch(addTeacherToProgram(form))
    setTrigger(true)
    setOpenModal(false)
  }

  return (
    
    <div key={user?._id} style={{ minWidth: "20vw", maxWidth: "20vw", minHeight: "40vh", maxHeight: "40vh", background: "rgba(250,235,215,0.96)", margin: "1vh 1vw", padding: "1vh 1vw" }}>
    <img src={imgSrc} style={{ width: "100%", minWidth: "100%", maxWidth: "100%", minHeight: "20vh", maxHeight: "20vh" }} />

    <h2 style={{ textAlign: 'center' }}>
      {admin?._id !== user?._id ? <Link to={`/messagePage/${user?._id}`}>{user?.accountName}</Link> : <>{user?.accountName}</>}
    </h2>
    <h6 style={{ textAlign: "center" }}><b>Staff Position:</b> <br />{user?.staffPosition}</h6>

    <h6><b>Gender:</b> {user?.sex}</h6>
    {user?.teacher ? <h6><b>Programs Teaching:</b> ({user?.programsTeaching.length})</h6> : <h6><b>User Is Not A Teacher</b></h6>}

    {alreadyTeacher ?
      <button style={{ background: "red", width: "100%" }}>✅ Already Teacher</button>

      : !user?.teacher ? <button style={{ background: "red", width: "100%" }}>⛔ Not A Teacher</button> 
      :
      <button style={{ background: "lightBlue", width: "100%" }} onClick={() => selectThisTeacher(user?._id)}> Add Teacher</button>
    }

  </div>
  )
}

export default UserSearchCard
