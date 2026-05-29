import React from 'react'
import { useDispatch } from 'react-redux';
import { addLocationMentees } from '../../../../redux/reducers/locationReducer';


const AddMenteeCard = ({ mentee, setTrigger, pro, setOpenModal }) => {

    const dispatch = useDispatch()

    const baseUrl = "http://localhost:8080";

    const imgSrc =
        mentee?.menteeImageFileId && mentee?.menteeImageBucketName
            ? `${baseUrl}/upload/image/${mentee.menteeImageFileId}?bucketName=${mentee?.menteeImageBucketName}`
            : mentee?.menteeImage;

    const addThisStudent = (menteeId) => {

        const payload = {
            programId: pro?._id,
            mailUser: menteeId
        }

        dispatch(addLocationMentees(payload))
        setTrigger(true)
        setOpenModal(false)
    }
 
    const alreadyStudent = pro?.students?.some(stud => stud.mailUser?._id === mentee?._id);
    const alreadyGraduate = pro?.graduates?.some(grad => grad?.mailUser === mentee?._id);

    return (
        <div key={mentee._id} style={{ minWidth: "20vw", maxWidth: "20vw", minHeight: "30vh", maxHeight: "30vh", background: "rgba(250,235,215,0.96)", margin: "1vh 1vw", padding: "1vh 1vw" }}>

            <img src={imgSrc} alt="" style={{ width: "100%", minWidth: "100%", maxWidth: "100%", minHeight: "20vh", maxHeight: "20vh" }} />
            <h4>{mentee.firstName} {mentee.lastName}</h4>

            {alreadyStudent ?
                <button style={{ background: "red", width: "100%" }}>✅ Already Student</button>
                : ""
            }

            {alreadyGraduate ?
                <button style={{ background: "red", width: "100%" }}>🚫 Already Graduated</button>
                : ""
            }


            {!alreadyGraduate && !alreadyStudent ? <button style={{ background: "lightBlue", width: "100%" }} onClick={() => addThisStudent(mentee?._id)}>Add Student</button> : ""}

        </div>
    )
}

export default AddMenteeCard
