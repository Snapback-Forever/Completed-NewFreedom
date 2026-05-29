import React from "react";
import { useDispatch } from "react-redux";
import { addTeacherToProgram } from "../../../../redux/reducers/locationReducer";

const AddTeacherModal = ({ singleProgram, setTrigger, setAddTeacher, allUsers }) => {

  const dispatch = useDispatch();

 
  const handleAttach = async (userId) => {
    const payload = {
      userId,
      programId: singleProgram._id
    };

    try {
      await dispatch(addTeacherToProgram(payload)).unwrap?.();
      setTrigger(true);
    } catch (err) {
      console.error("Attach teacher failed:", err);
    }
  };

  return (

    <div className="addTeacherToPro scrollBar">
      <button style={{ fontSize: "2rem" }} onClick={() => setAddTeacher(false)}>❎</button>

      {allUsers?.filter(user =>
        user?.teacher &&
        !singleProgram?.teachers?.some(t => t?._id?.toString() === user?._id?.toString())
      ).length === 0 ? (
        <h2 style={{ textAlign: "center" }}>No Teachers Available To Add</h2>
      ) :
        <>
          <h2 style={{ textAlign: "center" }}>Add Teacher To Program</h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1vw", width: "100%", height: "87%", overflowY: "auto" }}>
            {allUsers
              ?.filter(user =>
                user?.teacher &&
                !singleProgram?.teachers?.some(t => t?._id?.toString() === user?._id?.toString())
              )
              .map((user) => {
                const baseUrl = "http://localhost:8080";
                const imgSrc =
                  user?.profilePicFileId && user?.profilePicBucketName
                    ? `${baseUrl}/upload/image/${user.profilePicFileId}?bucketName=${user.profilePicBucketName}`
                    : user?.profilePic;
                return (

                  <div key={user?._id} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", gap: "1vw", width: "20%", height: "40vh", padding: "0.6vw 1vw", border: "1px solid #ccc", borderRadius: "8px", background: "#f9f9f9", margin: "1vh 0.5vw" }}>

                    <img src={imgSrc} style={{ minHeight: "20vh", maxHeight: "20vh", margin: "2vh 1vw", maxWidth: "90%", minWidth: "90%" }} />
                    <span>{user.firstName} {user.lastName}</span>
                    <span>Programs Teaching: ({user.programsTeaching.length})</span>

                    <button style={{ background: "goldenrod", width: "100%", border: "none", cursor: "pointer" }} onClick={() => handleAttach(user?._id)}>Attach</button>
                  </div>
             
                )
              })}
          </div>
        </>}
        <button style={{ width: "100%", background: "red" }} onClick={() => setAddTeacher(false)}>Done Adding Teachers</button>
    </div>

  );
};

export default AddTeacherModal;
