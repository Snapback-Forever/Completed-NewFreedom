import React from "react";
import { useDispatch } from "react-redux";
import { addMentorAttached } from "../../../../../redux/reducers/menteeReducers";


const SearchUserCard = ({ user, mentee, setAddMentorModal, setTrigger }) => {

  const dispatch = useDispatch();

  const handleAttachMentor = (userId) => {

    const payload = {
        mailId: mentee?._id,
        mentorId: userId
    }

    dispatch(addMentorAttached(payload));
    setTrigger(true)
    setAddMentorModal(false)
  };

  const baseUrl = "http://localhost:8080";
  const imgSrc =
  user?.profilePicFileId && user?.profilePicBucketName
    ? `${baseUrl}/upload/image/${user.profilePicFileId}?bucketName=${user.profilePicBucketName}`
    : user?.profilePic;

  return (

    <div>
      <div>
      <img src={imgSrc} style={{ minHeight: "20vh", maxHeight: "20vh", margin: "2vh 1vw", maxWidth: "90%", minWidth: "90%" }} />

        <strong style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>{user?.accountName}</strong>
      </div>
      <div><b>Gender:</b> {user?.sex}</div>
      <div><b>Current Amount Of Mentee's:</b> ({user?.currentMentee?.length})</div>

      {user.sex === mentee?.sex && user?.mentor ? <button style={{ marginTop: "0.5vh", background: "goldenrod", padding: "0.5vh 1vw", width: "100%" }} onClick={()=> handleAttachMentor(user?._id)}>Attach Mentor</button> : ""}

      {user.sex !== mentee?.sex ? <button style={{ marginTop: "0.5vh", background: "red", padding: "0.5vh 1vw", width: "100%" }}>Gender Does Not Match</button> : ""}

      {!user?.mentor ? <button style={{ marginTop: "0.5vh", background: "red", padding: "0.5vh 1vw", width: "100%" }}>User Is Not A Mentor</button> : ""}

    </div>

  );
};
export default SearchUserCard;
