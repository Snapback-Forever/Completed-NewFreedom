import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStudentToProgram } from "../../../../redux/reducers/locationReducer";

const AllMenteeCard = ({ mentee, setTrigger, pro, setChangeContent }) => {
  const dispatch = useDispatch();

  const baseUrl = "http://localhost:8080";

  const imgSrc =
    mentee?.menteeImageFileId && mentee?.menteeImageBucketName
      ? `${baseUrl}/upload/image/${mentee.menteeImageFileId}?bucketName=${mentee?.menteeImageBucketName}`
      : mentee?.menteeImage;

  const addThisStudent = (menteeId) => {
    const payload = {
      programId: pro?._id,   // ⚠️ IMPORTANT: loc is actually your PROGRAM
      mailUser: menteeId,    // or mentee.email if backend requires email
    };

    dispatch(addStudentToProgram(payload));

    setTrigger(true);
    setChangeContent("mentee");
  };

  const alreadyStudent = pro?.programMentees?.some(
    (m) => m._id === mentee?._id
  );

  return (
    <div
      style={{
        minWidth: "20vw",
        maxWidth: "20vw",
        minHeight: "30vh",
        maxHeight: "30vh",
        background: "rgba(250,235,215,0.96)",
        margin: "1vh 1vw",
        padding: "1vh 1vw",
      }}
    >
      <img
        src={imgSrc}
        alt=""
        style={{
          width: "100%",
          minHeight: "20vh",
          maxHeight: "20vh",
        }}
      />

      <h4>
        {mentee.firstName} {mentee.lastName}
      </h4>

      {alreadyStudent ? (
        <button style={{ background: "red", width: "100%" }}>
          ✅ Already Student
        </button>
      ) : (
        <button
          style={{ background: "lightBlue", width: "100%" }}
          onClick={() => addThisStudent(mentee?._id)}
        >
          Add Student
        </button>
      )}
    </div>
  );
};

export default AllMenteeCard;