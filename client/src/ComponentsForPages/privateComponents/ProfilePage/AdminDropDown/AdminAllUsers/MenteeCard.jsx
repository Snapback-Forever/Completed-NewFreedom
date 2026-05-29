import React, { useRef, useState } from 'react'
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { deletePaperwork, removeInmateNumber, removeMentor, removePastCharges, removePendingCharges, updateMailEntry } from '../../../../../redux/reducers/menteeReducers';
import AddInmateNumber from './AddInmateNumber';
import AddMissingPaperWork from './AddMIssingPaperWork';
import AddPastCharges from './AddPastCharges';
import AddPendingCharges from './AddPendingCharges';
import AddProgramToMentee from './AddProgramToMentee';
import GraduateMenteeProgram from './GraduateMenteeProgram';
import AddProgramModal from './AddProgramModal';
import { removeGraduate, removeStudentFromProgram } from '../../../../../redux/reducers/locationReducer';
import MentorMsg from './MentorMsg';

const MenteeCard = ({ mentee, imgSrcMentee, isBirthdayToday, setTrigger, mentor, key, allPrograms }) => {

    const dispatch = useDispatch()
    const timeoutRef = useRef(null);
    const lastTapRef = useRef(0);

    const user = useSelector(state => state.auth.user)
    const admin = useSelector(state => state.auth.user)
    const adminId = useSelector((state) => state.auth.user?._id);

    const baseUrl = "http://localhost:8080";

    const [showMoreMentee, setShowMoreMentee] = useState("");
    const [showMoreMenteeList, setShowMoreMenteeList] = useState("");
    const [addInformation, setAddInformation] = useState("");
    const [confirmStep, setConfirmStep] = useState(false);

    const [addProgramModal, setAddProgramModal] = useState("");

    const [form, setForm] = useState({
        projectedReleaseDate: "",
        maxReleaseDate: "",
        programStatus: ""
    });

    const [state, setState] = useState({
        reason: ""
    });

    const handleChangeState = (e) => {
        const { name, value } = e.target;
        setState(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [editing, setEditing] = useState(false);
    const startEditing = () => {
        setForm({
            projectedReleaseDate: mentee.projectedReleaseDate || "",
            maxReleaseDate: mentee.maxReleaseDate || "",
            programStatus: mentee.programStatus || ""
        });
        setEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Optional: apply frontend rule for non‑custody statuses
        if (
            name === "programStatus" &&
            ["attendingProgram", "Did-Not-Arrive", "removedFromProgram", "quitProgram", "completedProgram"].includes(value)
        ) {
            setForm((prev) => ({
                ...prev,
                programStatus: value,
                projectedReleaseDate: "",
                maxReleaseDate: ""
            }));
            return;
        }
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateDates = async () => {
        // Optional: frontend validation for incarcerated rule
        if (
            form.programStatus === "incarcerated" &&
            (!form.projectedReleaseDate || !form.maxReleaseDate)
        ) {
            // show some UI error instead of sending invalid request
            return;
        }
        const payload = {
            mailId: mentee?._id,
            projectedReleaseDate: form.projectedReleaseDate,
            maxReleaseDate: form.maxReleaseDate,
            programStatus: form.programStatus,
            userId: user?._id
        };

        dispatch(updateMailEntry(payload));
        setEditing(false);
        setTrigger(true)
    };

    const removeMentorFromUser = () => {
        setShowMoreMenteeList("removeMentee")
    }

    const removeAInmateNumber = (numId) => {
        const now = Date.now();
        const delay = 400;
        if (now - lastTapRef.current < delay) {
          const payload = {
            mailId: mentee?._id,
            inmateNumberIds: numId
          };
          dispatch(removeInmateNumber(payload));
          setTrigger(true);
        }
        lastTapRef.current = now;
      };

      const removeThisPaperWork = (paperId) => {
        const now = Date.now();
        const delay = 400;
        if (now - lastTapRef.current < delay) {
          const payload = {
            mailId: mentee?._id,
            paperworkId: paperId
          };
          dispatch(deletePaperwork(payload));
          setTrigger(true);
        }
        lastTapRef.current = now;
      };

      const removeThisPastCharge = (chargeId) => {
        const now = Date.now();
        const delay = 400;
        if (now - lastTapRef.current < delay) {
          const payload = {
            mailId: mentee?._id,
            pastChargeIds: chargeId
          };
          dispatch(removePastCharges(payload));
          setTrigger(true);
        }
        lastTapRef.current = now;
      };

      const removeThisPendingCharge = (chargeId) => {
        const now = Date.now();
        const delay = 400;
        if (now - lastTapRef.current < delay) {
          const payload = {
            mailId: mentee?._id,
            pendingChargeIds: chargeId
          };
          dispatch(removePendingCharges(payload));
          setTrigger(true);
        }
        lastTapRef.current = now;
      };

      const removeThisProgramFromUser = (proId) => {
        const now = Date.now();
        const delay = 400;
        if (now - lastTapRef.current < delay) {
          const payload = {
            programId: mentee.programsEnrolled[0]?._id,
            studentId: mentee?._id,
            currentUserId: user?._id
          };
          dispatch(removeStudentFromProgram(payload));
          setTrigger(true);
        }
        lastTapRef.current = now;
      };
      
      const removeThisGraduationFromUser = (gradId) => {
        const now = Date.now();
        const delay = 400;
        if (now - lastTapRef.current < delay) {
          const payload = {
            programId: gradId,
            mailId: mentee?._id,
            currentUserId: user?._id
          };
          dispatch(removeGraduate(payload));
          setTrigger(true);
        }
        lastTapRef.current = now;
      };

    // State – mentee version of profilePic state
    const [formImage, setFormImage] = useState({
        menteeImagePreview: null,
        menteeImageFile: null,
    });
    // Upload handler – same pattern as handleUploadImage("profilePic")
    const handleUploadMenteeImage = (fieldPrefix) => (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            setFormImage((prev) => ({
                ...prev,
                [`${fieldPrefix}Preview`]: null,
                [`${fieldPrefix}File`]: null,
            }));
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormImage((prev) => ({
                ...prev,
                [`${fieldPrefix}Preview`]: reader.result,
                [`${fieldPrefix}File`]: file,
            }));
        };
        reader.readAsDataURL(file);
    };
    // Save handler – same pattern as handleSaveImage("profilePic")
    const handleSaveMenteeImage = (fieldPrefix) => async () => {
        const fileKey = `${fieldPrefix}File`;
        const file = formImage[fileKey];
        if (!file) return;
        // 1. Upload to GridFS – SAME URL pattern as profile pic
        const fd = new FormData();
        fd.append("image", file); // must match upload.single('image')
        const hasGridFsImage =
            !!mentee.menteeImageFileId && !!mentee.menteeImageBucketName;
        const uploadUrl = hasGridFsImage
            ? `${baseUrl}/upload/image/${mentee.menteeImageFileId}?bucketName=${mentee.menteeImageBucketName}`
            : `${baseUrl}/upload/image/${mentee._id}`;
        const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            body: fd,
        });
        if (!uploadRes.ok) {
            console.error("Mentee image upload failed");
            return;
        }
        const { fileId, bucketName } = await uploadRes.json();
        const httpUrl = `${baseUrl}/image/${fileId}?bucketName=${bucketName}`;
        // 2. Update the mentee document – mentee version of adminUpdateProfile
        const payload = {
            mailId: mentee._id,             // the mentee/mail entry we’re updating
            menteeImage: httpUrl,           // URL to display in frontend
            menteeImageFileId: fileId,
            menteeImageBucketName: bucketName,
            userId: adminId,                // who made the change
        };
        try {
            await dispatch(updateMailEntry(payload)).unwrap?.();
        } catch (err) {
            console.error("updateMailEntry failed:", err);
            return;
        }
        // 3. Reset and trigger parent – same pattern as profilePic
        setFormImage((prev) => ({
            ...prev,
            [`${fieldPrefix}Preview`]: null,
            [`${fieldPrefix}File`]: null,
        }));
        setTrigger && setTrigger((prev) => !prev);
    };

    const inputStyle = {
        border: 'solid lightGrey',
        background: 'white',
        width: '30vw',
        margin: "0 0 1vh 0"
    };


    const handleClick = () => {
        // First click: ask for confirmation
        if (!confirmStep) {
            setConfirmStep(true);
            // Reset back to normal after 3 seconds if user doesn't click again
            timeoutRef.current && clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setConfirmStep(false);
            }, 3000);
            return;
        }
        // Second click within the time window: perform the action
        timeoutRef.current && clearTimeout(timeoutRef.current);
        setConfirmStep(false);
        removeMentorFromUser();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
            const payload = {
                mailId: mentee?._id,
                mentorId: mentor?._id,
                ...state
            }
            dispatch(removeMentor(payload))
            setTrigger(true)
            setShowMoreMenteeList("")
        };

    const [visibleCount, setVisibleCount] = useState(10);
    const visibleMsgs = mentee?.receivedMsgs
        ?.filter((msg) => msg)
        .slice(0, visibleCount);



    return (
        <div key={mentee?._id} style={{ width: "100%", display: "flex", flexDirection: "column", border: "1px solid black", padding: "3vh 1vw", background: "white" }} className='responsiveAllMenteeCards'>

            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "end" }}>

                <button className='responsiveAllMenteeCardButton' style={{ background: "red", border: confirmStep ? "solid darkRed" : "solid red", padding: "0 1vw", width: "30%", color: confirmStep ? "white" : "black" }} onClick={handleClick}>{confirmStep ? "Click again to confirm" : `Remove Mentee From Current Mentor`}</button>

                {showMoreMenteeList === "removeMentee" ?
                    <div style={{ border: "solid black", margin: "1vh 1vw", padding: "1vh 1vw" }}>
                        <h4 style={{ textAlign: "center" }}>Reason For Removal Of Mentee</h4>
                        <form onSubmit={(e) => handleSubmit(e)} style={{ display: "flex", flexDirection: "column" }}>

                            <textarea name="reason" value={state?.reason} onChange={handleChangeState} className="Reason For Removal" style={{ border: "solid lightGrey", background: "white", width: "70vw", minHeight: "10vh" }} />

                            <div style={{ display: "flex" }}>

                                <div style={{ background: "red", color: "white", padding: "0 1vw", width: "30%", margin: "1vh 1vw" }} onClick={() => setShowMoreMenteeList("")}>Cancel</div>

                                <button style={{ background: "green", color: "white", padding: "0 1vw", width: "50%", margin: "1vh 1vw" }} type="submit">Submit Reason </button>

                            </div>
                        </form>
                    </div>
                    : ""}
            </div>

            <div style={{ width: "100%", display: "flex", padding: "1vh 1vw", background: "white" }} className='responsiveAllMenteeCardDiv'>
                <div
                    style={{
                        width: "35vw",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        border: "double black",
                    }}
                     className='responsiveAllMenteeCardImg'
                >
                    <img
                        src={formImage?.menteeImagePreview || imgSrcMentee || noImage}
                        style={{
                            minHeight: "30vh",
                            maxHeight: "30vh",
                            margin: "2vh 1vw",
                            maxWidth: "30vw",
                            minWidth: "30vw",
                        }}
                        className='responsiveAllMenteeCardImage'
                    />
                    {user?._id === adminId || admin?.NFadmin || admin?.creator ? (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <h6>Change Mentee Image</h6>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUploadMenteeImage("menteeImage")}
                                style={inputStyle}
                                className='responsiveAllMenteeCardInput'
                            />
                            {formImage?.menteeImagePreview !== null ? (
                                <button
                                    type="button"
                                    onClick={handleSaveMenteeImage("menteeImage")}
                                    style={{
                                        width: "100%",
                                        background: "lightBlue",
                                        margin: "0 0 1vh 0",
                                    }}
                                >
                                    Update Mentee Image
                                </button>
                            ) : ""}
                        </div>
                    ) : ""}
                </div>


                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                    <h6><b>FirstName:</b> {mentee?.firstName}</h6>
                    <h6><b>LastName:</b> {mentee?.lastName}</h6>
                    <h6><b>Gender:</b> {mentee?.sex}</h6>
                    <h6><b>Date Of Birth:</b> {mentee?.dateOfBirth}</h6>

                    {isBirthdayToday(mentee?.dateOfBirth) ? (
                        <h1 className='happyBirthday' style={{ textAlign: "center" }}>🎈 Happy BirthDay!!! 🎂</h1>
                    ) : ""}

                    {mentee?.livingLocation ? <h6><b>Current Location: </b>{mentee?.currentLocation}</h6> :

                        <h6><b>Attending Location:</b> {mentee?.livingLocation ?
                            <>{mentee?.livingLocation[0]?.locationName}</>
                            : "No Location Set"}</h6>}

                    <div style={{ background: "lightGrey", padding: "0 1vw" }}>
                        <h6>Program Status: {mentee?.programStatus}</h6>
                        {mentee.programStatus === "incarcerated" && (
                            <div>
                                <h6>
                                    Projected Release Date:{" "}
                                    {mentee?.projectedReleaseDate
                                        ? new Date(mentee?.projectedReleaseDate).toLocaleDateString()
                                        : "N/A"}
                                    {mentee?.projectedReleaseDate &&
                                        new Date(mentee?.projectedReleaseDate) < new Date() && (
                                            <span
                                                className="lookAtMe"
                                                style={{ margin: "0 0.5vw", cursor: "pointer" }}
                                                onClick={startEditing}
                                            >
                                                Update
                                            </span>
                                        )}
                                </h6>
                                <h6>
                                    Max Release Date:{" "}
                                    {mentee?.maxReleaseDate
                                        ? new Date(mentee?.maxReleaseDate).toLocaleDateString()
                                        : "N/A"}
                                    {mentee?.maxReleaseDate &&
                                        new Date(mentee?.maxReleaseDate) < new Date() && (
                                            <span
                                                className="lookAtMe"
                                                style={{ margin: "0 0.5vw", cursor: "pointer" }}
                                                onClick={startEditing}
                                            >
                                                Released? Update Status
                                            </span>
                                        )}
                                </h6>
                            </div>
                        )}
                        {editing && (
                            <div style={{ marginTop: "1rem", border: "double red", padding: "2vh 2vw" }}>
                                <div>
                                    <label>Update Program Status:{" "}</label>

                                    <select
                                        name="programStatus"
                                        value={form?.programStatus}
                                        onChange={handleChange}
                                        style={{ background: "white" }}>

                                        <option value="">Select...</option>
                                        <option value="incarcerated">Incarcerated</option>
                                        <option value="attendingProgram">Attending Program</option>
                                        <option value="Did-Not-Arrive">Did Not Arrive</option>

                                    </select>

                                </div>
                                <div>
                                    <label>Update Projected Release Date:{" "}</label>
                                    <input
                                        type="date"
                                        name="projectedReleaseDate"
                                        value={
                                            form?.projectedReleaseDate
                                                ? new Date(form?.projectedReleaseDate).toISOString().slice(0, 10)
                                                : ""
                                        }
                                        onChange={handleChange}
                                    />

                                </div>
                                <div>
                                    <label>Update Max Release Date:{" "}</label>
                                    <input
                                        type="date"
                                        name="maxReleaseDate"
                                        value={
                                            form?.maxReleaseDate
                                                ? new Date(form?.maxReleaseDate).toISOString().slice(0, 10)
                                                : ""
                                        }
                                        onChange={handleChange}
                                    />

                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <button onClick={handleUpdateDates} style={{ width: "100%", background: "lime", margin: "1vh 0" }}>Save</button>
                                    <button onClick={() => setEditing(false)} style={{ width: "100%", background: "red", }}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {mentee?.email ? <h6>Email: {mentee?.email}</h6> : ""}
                    {mentee?.msgSentCount ? <h6>msgSentCount: ({mentee?.msgSentCount})</h6> : ""}


                </div>
            </div>

            {showMoreMentee ?

                <div style={{ width: "100%" }}>
                    <h6><b>Last Contact:</b> {mentee?.lastContact}</h6>

                    {mentee.rejectedAcceptance.isRejected ?
                        <h6><b>Rejected Acceptance:</b> Rejected </h6> :
                        <h6><b> Acceptance:</b>Approved {mentee?.approvedAcceptance.isApproved ? "Approved" : "Processing"}</h6>
                    }

                    <h6><b>Required PaperWork:</b> {mentee?.completedRequiredPaperwork ? "Completed" : "Not Completed"}</h6>

                    {mentee?.inmateNumbers !== 0 ?
                        <div style={{ background: "lightGrey", padding: "0 1vw" }}>

                            {showMoreMenteeList === "inmateNumbers" ? <h6 style={{ width: "100%", textAlign: "center" }} onClick={() => setShowMoreMenteeList("")}>Hide Inmate Numbers</h6> : <h6 style={{ width: "100%", textAlign: "center" }} onClick={() => setShowMoreMenteeList("inmateNumbers")}>View Inmate Numbers</h6>}
                            {mentee?.inmateNumbers?.length === 0 ? "" : ""}

                            {showMoreMenteeList === "inmateNumbers" ? <>
                                <h6>{mentee?.inmateNumbers?.length === 0 ? "No Inmate Numbers" : ""}</h6>
                                {mentee?.inmateNumbers?.map(num => {
                                    return (
                                        <div key={num?._id} style={{ display: "flex", justifyContent: "space-between", margin: "1vh 0", background: "white", padding: "0 1vw" }} className='responsiveAllMenteeContainer'>
                                            <div style={{ display: "flex", gap: "1vw" }} >
                                                <div><b>Num: </b>{num?.number},</div>
                                                <div><b>State: </b>{num?.state}</div>
                                            </div>
                                            <button style={{ background: "red", margin: "0.5vh 0", padding: "0 1vw" }} className='rounded' onClick={() => removeAInmateNumber(num?._id)}>Remove Number</button>
                                        </div>
                                    )
                                })}
                                <div style={{ width: "100%", display: "flex", justifyContent: 'end' }}>

                                    {addInformation === "addInmate" ? <button style={{ background: "red", padding: "0 1vw", margin: "1vh 0" }} className='rounded' onClick={() => setAddInformation("")}>Cancel Add Inmate Number</button> : <button style={{ background: "goldenRod", padding: "0 1vw", margin: "1vh 0" }} className='rounded' onClick={() => setAddInformation("addInmate")}>Add Inmate Number</button>}

                                </div>

                                {addInformation === "addInmate" ?
                                    <AddInmateNumber mentee={mentee} user={user} setTrigger={setTrigger} setAddInformation={setAddInformation} />
                                    :
                                    <></>
                                }

                            </> : ""}


                        </div> : ""}

                    <div style={{ background: "lightGrey", padding: "0 1vw", margin: "1vh 0" }}>

                        {showMoreMenteeList == "paperWork" ? <h6 style={{ width: "100%", textAlign: "center" }} onClick={() => setShowMoreMenteeList("")}>Hide Missing Paperwork:</h6> : <h6 style={{ width: "100%", textAlign: "center" }} onClick={() => setShowMoreMenteeList("paperWork")}>View Missing Paperwork:</h6>}

                        {mentee?.missingPaperwork?.length === 0 ? "" : ""}

                        {showMoreMenteeList === "paperWork" ?
                            <div>
                                <h6>{mentee?.missingPaperwork?.length === 0 ? "No Missing PaperWork" : ""}</h6>
                                {mentee?.missingPaperwork?.map(paper => {
                                    return (
                                        <div key={paper?._id} style={{ display: "flex", justifyContent: "space-between", margin: "1vh 0", background: "white", padding: "0 1vw" }} className='responsiveAllMenteeContainer'>
                                            <div><b>PaperWork Name:</b> {paper?.name}</div>
                                            <div><b>Notes:</b> {paper?.notes}</div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: 'end' }} >
                                                <button style={{ background: "red", margin: "0.5vh 0", padding: "0 1vw" }} className='rounded' onClick={() => removeThisPaperWork(paper?._id)}>Remove PaperWork</button>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div style={{ width: "100%", display: "flex", justifyContent: 'end' }}>
                                    {addInformation === "addMissing" ? <button style={{ background: "red", padding: "0 1vw", margin: "1vh 0" }} className='rounded' onClick={() => setAddInformation("")}>Cancel Add Missing PaperWork</button> : <button style={{ background: "goldenRod", padding: "0 1vw", margin: "1vh 0" }} className='rounded' onClick={() => setAddInformation("addMissing")}>Add Missing PaperWork / Completed Missing Paper Work</button>}
                                </div>
                            </div> : ""}

                        {addInformation === "addMissing" ?
                            <AddMissingPaperWork mentee={mentee} user={user} setTrigger={setTrigger} setAddInformation={setAddInformation} />
                            :
                            <></>}

                    </div>

                    {mentee?.currentCharge ? <h6>Current Charge: {mentee.currentCharge}</h6> : "No Current Charges"}

                    <div style={{ background: "lightGrey", padding: "0 1vw", margin: "1vh 0" }}>

                        {showMoreMenteeList === "pastCharge" ? <h6 style={{ width: "100%", textAlign: "center", margin: "1vh 0" }} onClick={() => setShowMoreMenteeList("")}>Hide Past Charges:</h6> : <h6 style={{ width: "100%", textAlign: "center", margin: "1vh 0" }} onClick={() => setShowMoreMenteeList("pastCharge")}>View Past Charges:</h6>}


                        {showMoreMenteeList === "pastCharge" ?
                            <div >
                                <h6>{mentee?.pastCharges?.length === 0 ? "No Past Charges" : ""}</h6>
                                {mentee?.pastCharges?.map(past => {
                                    return (
                                        <div style={{ margin: "1vh 1vw", background: "white", padding: "1vh 1vw" }} key={past?._id} className='responsiveAllMenteeContainer'>
                                            <div><b>Charge:</b> {past?.charge}</div>
                                            <div><b>City/State:</b> {past?.city}, {past?.state}</div>
                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                                                <div><b>Date Of Charge:</b> {moment(past?.dateOfCharge).format("MMM Do YY")}</div>
                                                {past.releaseDate ? <div><b>Date Of Release:</b> {moment(past?.releaseDate).format("MMM Do YY")}</div> : "No Date Provided"}
                                            </div>
                                            <div><b>Disposition:</b> {past?.disposition}</div>
                                            <div><b>Notes:</b> {past?.notes}</div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: 'end' }}>
                                                <button style={{ background: "red", margin: "0.5vh 0", padding: "0 1vw" }} className='rounded' onClick={() => removeThisPastCharge(past?._id)}>Remove Past Charge</button>
                                            </div>
                                        </div>

                                    )
                                })}
                                <div style={{ width: "100%", display: "flex", justifyContent: 'end' }}>
                                    {addInformation === "addPast" ? <button style={{ background: "red", padding: "0 1vw", margin: "1vh 0" }} className='rounded' onClick={() => setAddInformation("")}>Cancel Add Past Charges</button> : <button style={{ background: "goldenRod", padding: "0 1vw", margin: "1vh 0" }} className='rounded' onClick={() => setAddInformation("addPast")}>Add Past Charges</button>}
                                </div>
                            </div> : ""}

                        {addInformation === "addPast" ?
                            <AddPastCharges mentee={mentee} user={user} setTrigger={setTrigger} setAddInformation={setAddInformation} />
                            :
                            <></>}


                    </div>

                    <div style={{ background: "lightGrey", padding: "0 1vw", margin: "1vh 0" }}>
                        {showMoreMenteeList === "pendingCharge" ? <h6 style={{ width: "100%", textAlign: "center", margin: "1vh 0" }} onClick={() => setShowMoreMenteeList("")}>Hide Pending Charges:</h6> : <h6 style={{ width: "100%", textAlign: "center", margin: "1vh 0" }} onClick={() => setShowMoreMenteeList("pendingCharge")}>View Pending Charges:</h6>}

                        {showMoreMenteeList === "pendingCharge" ?
                            <div>
                                <h6>{mentee?.pendingCharges?.length === 0 ? "No Pending Charges" : ""}</h6>
                                {mentee?.pendingCharges.map(pending => {
                                    return (
                                        <div style={{ margin: "1vh 1vw", background: "white", padding: "1vh 1vw" }} key={pending?._id} className='responsiveAllMenteeContainer'>
                                            <div><b>Charge:</b> {pending?.charge}</div>
                                            <div><b>City/State:</b> {pending?.city}, {pending?.state}</div>
                                            <div><b>Date Of Charge:</b> {moment(pending?.dateOfCharge).format("MMM Do YY")}</div>
                                            <div><b>Disposition:</b> {pending?.disposition}</div>
                                            <div><b>Notes:</b> {pending?.notes}</div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: 'end' }}>
                                                <button style={{ background: "red", margin: "0.5vh 0", padding: "0 1vw" }} className='rounded' onClick={() => removeThisPendingCharge(pending?._id)}>Remove Pending Charge</button>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div style={{ width: "100%", display: "flex", justifyContent: 'end' }}>
                                    {addInformation === "addPending" ? <button style={{ background: "red", padding: "0 1vw", margin: "1vh 0" }} className='rounded' onClick={() => setAddInformation("")}>Cancel Add Pending Charges</button> : <button style={{ background: "goldenRod", padding: "0 1vw", margin: "1vh 0" }} className='rounded' onClick={() => setAddInformation("addPending")}>Add Pending Charges</button>}
                                </div>

                                {addInformation === "addPending" ?
                                    <AddPendingCharges mentee={mentee} user={user} setTrigger={setTrigger} setAddInformation={setAddInformation} />
                                    :
                                    <></>}

                            </div> : ""}

                    </div>

                    <div style={{ background: "lightGrey", padding: "0 1vw", margin: "1vh 0" }}>
                        {showMoreMenteeList === "proEnrolled" ? <h6 style={{ width: "100%", textAlign: "center", margin: "1vh 0" }} onClick={() => setShowMoreMenteeList("")}>Hide Programs Enrolled:</h6> : <h6 style={{ width: "100%", textAlign: "center", margin: "1vh 0" }} onClick={() => setShowMoreMenteeList("proEnrolled")}>View Programs Enrolled:</h6>}

                        {showMoreMenteeList === "proEnrolled" ? (
                            <div className='responsiveAllMenteeContainer' style={{ background: "white" }}>
                                <h6>
                                    {mentee?.programsEnrolled?.length === 0 ? "Not Enrolled In A Program" : ""}
                                </h6>
                                {mentee?.programsEnrolled.map((pro) => {
                                    const menteeId = String(mentee._id);
                                    const studentForMentee = pro?.students?.find(
                                        (s) => String(s.mailUser) === menteeId
                                    );
                                    if (!studentForMentee) {
                                        return null; // or an alternative JSX
                                    }
                                    const startDate = studentForMentee?.startDate
                                        ? new Date(studentForMentee?.startDate)
                                        : null;
                                    const endDate = studentForMentee?.endDate
                                        ? new Date(studentForMentee?.endDate)
                                        : null;
                                    return (
                                        <div style={{ margin: "1vh 1vw" }} key={pro?._id}>
                                            <div>
                                                <b>Program Name:</b> {pro?.programName}
                                            </div>
                                            <div>
                                                <b>Start Date:</b>{" "}
                                                {startDate ? startDate.toLocaleDateString() : "N/A"}
                                            </div>
                                            <div>
                                                <b>End Date:</b>{" "}
                                                {endDate ? endDate.toLocaleDateString() : "N/A"}
                                            </div>
                                            <div style={{ border: "2px solid black" }} />
                                        </div>
                                    );
                                })}
                                <div style={{ width: "100%", display: "flex", justifyContent: 'end' }}>

                                    {mentee.programsEnrolled.length === 0 ? <>
                                        {addInformation === "enrollPro" ? <button style={{ background: "red", padding: "0 1vw", margin: "1vh 0" }} className='rounded' onClick={() => setAddInformation("")}>Cancel Enroll Into Program</button> : <button style={{ background: "goldenRod", padding: "0 1vw", margin: "1vh 0" }} className='rounded' onClick={() => setAddInformation("enrollPro")}>Enroll Into Program</button>}
                                    </> :
                                        <button style={{ background: "red", padding: "0 1vw", margin: "1vh 0" }} className='rounded' onClick={() => removeThisProgramFromUser(mentee.programsEnrolled[0])}>Remove This Mentee From Program</button>
                                    }

                                </div>

                                {addInformation === "enrollPro" ?
                                    <AddProgramToMentee mentee={mentee} user={user} setTrigger={setTrigger} addProgramModal={addProgramModal} setAddProgramModal={setAddProgramModal} allPrograms={allPrograms} />
                                    :
                                    <></>}

                            </div>
                        ) : ("")}


                    </div>

                    <div style={{ background: "lightGrey", padding: "0 1vw", margin: "1vh 0" }}>
                        {showMoreMenteeList === "proGrad" ? (
                            <h6
                                style={{ width: "100%", textAlign: "center", margin: "1vh 0" }}
                                onClick={() => setShowMoreMenteeList("")}
                            >
                                Hide Programs Completed:
                            </h6>
                        ) : (
                            <h6
                                style={{ width: "100%", textAlign: "center", margin: "1vh 0" }}
                                onClick={() => setShowMoreMenteeList("proGrad")}
                            >
                                View Programs Completed:
                            </h6>
                        )}
                        {showMoreMenteeList === "proGrad" ? (
                            <div  className='responsiveAllMenteeContainer'>
                                <h6>
                                    {mentee?.programsCompleted?.length === 0 ? "No Completed Programs" : ""}
                                </h6>
                                {mentee?.programsCompleted?.map((proGrad) => {
                                    const menteeId = String(mentee._id);

                                    const gradRecord = proGrad?.graduates?.find(
                                        (g) => String(g.mailUser) === menteeId
                                    );

                                    if (!gradRecord) {
                                        return null;
                                    }
                                    const gradDate = gradRecord?.gradDate
                                        ? new Date(gradRecord?.gradDate)
                                        : null;

                                    return (
                                        <div style={{ margin: "1vh 1vw", background: "white", padding: "0.5vh 1vw" }} key={proGrad?._id}>
                                            <div>
                                                <b>Program Name:</b> {proGrad?.programName}
                                            </div>
                                            <div>
                                                <b>Date Of Completion:</b>{" "}
                                                {gradDate ? moment(gradDate).format("MMM Do YY") : "N/A"}
                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: 'end' }}>
                                                <button style={{ background: "red", padding: "0 1vw", margin: "1vh 0" }} className='rounded' onClick={() => removeThisGraduationFromUser(proGrad?._id)}>Remove Graduation Record</button>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div style={{ width: "100%", display: "flex", justifyContent: 'end' }}>

                                    {mentee?.programsEnrolled?.length !== 0 ? <> {addInformation === "menteeMsg" ? <button style={{ background: "red", padding: "0 1vw", margin: "1vh 0" }} className='rounded' onClick={() => setAddInformation("")}>Cancel Completed A Program</button> : <button style={{ background: "goldenRod", padding: "0 1vw", margin: "1vh 0" }} className='rounded' onClick={() => setAddInformation("menteeMsg")}>Completed A Program</button>} </> : ""}

                                </div>
                                {addInformation === "menteeMsg" ?
                                    <GraduateMenteeProgram mentee={mentee} user={user} setTrigger={setTrigger} setAddInformation={setAddInformation} />
                                    :
                                    <></>}
                            </div>
                        ) : null}

                    </div>


                    <div style={{ background: "lightGrey", padding: "0 1vw", margin: "1vh 0" }}>

                        {showMoreMenteeList === "mentorMsg" ? <h6 style={{ width: "100%", textAlign: "center", margin: "1vh 0" }} onClick={() => setShowMoreMenteeList("")}>Hide Mentor Msgs:</h6> : <h6 style={{ width: "100%", textAlign: "center", margin: "1vh 0" }} onClick={() => setShowMoreMenteeList("mentorMsg")}>View Mentor Msgs:</h6>}

                        {showMoreMenteeList === "mentorMsg" ?
                            <>
                                {visibleMsgs?.map((msg) => (
                                    <div key={msg?._id}>
                                        <MentorMsg msg={msg} user={user} admin={admin} setTrigger={setTrigger} setAddInformation={setAddInformation} mentee={mentee} />
                                    </div>
                                ))}
                                {mentee?.receivedMsgs?.length > visibleCount && (
                                    <button type="button" onClick={() => setVisibleCount((prev) => prev + 10)} style={{ background: "goldenRod", width: "100%", margin: "1vh 0" }}>Show more Mentor Messages</button>
                                )}
                            </>
                            : ""}

                    </div>


                </div>

                : ""}

            {showMoreMentee ? <button style={{ background: "lightBlue", width: "100%", marginTop: "2vh" }} onClick={() => setShowMoreMentee(false)}>Hide More Mentee</button> : <button style={{ background: "goldenRod", width: "100%", marginTop: "2vh" }} onClick={() => setShowMoreMentee(true)}>Show More Mentee Information</button>}
        </div>
    )
}

export default MenteeCard
