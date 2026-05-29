import React, { useEffect, useState } from 'react'
import moment from 'moment'
import DOMPurify from 'dompurify';
import { useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { deleteStory, getStoryById, updateStory } from '../../../../../redux/reducers/successStoriesReducer';

const UserSuccessStories = ({ suc, admin, user, setTrigger }) => {

    const locationList = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
        "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
        "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
        "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
        "Montana", "Nebraska", "Nevada", "New-Hampshire", "New-Jersey", "New-Mexico",
        "New-York", "North-Carolina", "North-Dakota", "Ohio", "Oklahoma", "Oregon",
        "Pennsylvania", "Rhode-Island", "South-Carolina", "South-Dakota", "Tennessee",
        "Texas", "Utah", "Vermont", "Virginia", "Washington", "West-Virginia",
        "Wisconsin", "Wyoming"
    ];

    const dispatch = useDispatch()

    const lastTapRef = useRef(0);

    const adminId = useSelector(state => state.auth.user?._id)
    const storyById = useSelector(state => state.success.storyById)

    const [formImage, setFormImage] = useState({
        sucImagePreview: null,
        sucImageFile: null,
    });

    const [form, setForm] = useState({
        userId: "",
        mailingUser: "",
        inmateNumber: {
            number: "",
            state: "",
        },
        firstName: "",
        lastName: "",
        email: "",
        title: "",
        storyText: "",
        storyVideo: "",
        programName: "",
        graduationDate: "",
        outcomeSummary: "",
        consentToPublish: false,
        displayName: "",
        location: {
            city: "",
            state: "",
        },
        internalNotes: "",
        // NO imageUrl / imageFileId / imageBucketName here
    });

    const [isEditing, setIsEditing] = useState(false);

    const baseUrl = "http://localhost:8080";
    const imgSrc =
        formImage.sucImagePreview ||
        (suc?.imageFileId && suc?.imageBucketName
            ? `${baseUrl}/upload/image/${suc.imageFileId}?bucketName=${suc.imageBucketName}`
            : suc?.imageUrl);

    // Upload handler – same pattern as handleUploadImage("profilePic") / handleUploadMenteeImage("menteeImage")
    const handleUploadSucImage = (fieldPrefix) => (event) => {
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
    // Save handler – now using updateStory
    const handleSaveSucImage = (fieldPrefix) => async () => {
        const fileKey = `${fieldPrefix}File`;
        const file = formImage[fileKey];
        if (!file) return;
        // 1. Upload to GridFS – SAME URL pattern as your other images
        const fd = new FormData();
        fd.append("image", file); // must match upload.single('image')
        const hasGridFsImage =
            !!suc?.imageFileId && !!suc?.imageBucketName;
        const uploadUrl = hasGridFsImage
            ? `${baseUrl}/upload/image/${suc.imageFileId}?bucketName=${suc.imageBucketName}`
            : `${baseUrl}/upload/image/${suc._id}`;
        const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            body: fd,
        });
        if (!uploadRes.ok) {
            console.error("Suc image upload failed");
            return;
        }
        const { fileId, bucketName } = await uploadRes.json();
        const httpUrl = `${baseUrl}/image/${fileId}?bucketName=${bucketName}`;
        // 2. Call updateStory thunk – payload shape matches your controller
        const payload = {
            id: suc._id,          // used in the URL: /success/updateStory/:id/story
            // Only fields you actually want to update need to be included.
            // If you want to *only* update image fields, just send these:
            imageUrl: httpUrl,
            imageFileId: fileId,
            imageBucketName: bucketName,

        };
        try {
            await dispatch(updateStory(payload)).unwrap?.();
        } catch (err) {
            console.error("updateStory (image) failed:", err);
            return;
        }
        // 3. Reset and trigger parent – same pattern as before
        setFormImage((prev) => ({
            ...prev,
            [`${fieldPrefix}Preview`]: null,
            [`${fieldPrefix}File`]: null,
        }));
        setTrigger && setTrigger((prev) => !prev);
    };

    const labelStyle = {
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5vw',
    };

    const inputStyle = {
        border: 'solid lightGrey',
        background: 'white',
        width: '96.5%',
    };

    // 3a. Flat field handler (strings)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    // 3b. Nested: location.{city,state}
    const handleLocationChange = (e) => {
        const { name, value } = e.target; // "city" or "state"
        setForm((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                [name]: value,
            },
        }));
    };
    // 3c. Nested: inmateNumber.{number,state}
    const handleInmateNumberChange = (e) => {
        const { name, value } = e.target; // "number" or "state"
        setForm((prev) => ({
            ...prev,
            inmateNumber: {
                ...prev.inmateNumber,
                [name]: value,
            },
        }));
    };
    // 3d. Boolean: consentToPublish checkbox
    const handleConsentChange = (e) => {
        const { checked } = e.target;
        setForm((prev) => ({
            ...prev,
            consentToPublish: checked,
        }));
    };
    // 4. Submit: sanitize and call updateStory with ALL non-image fields
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const nextForm = { ...form };
      
        Object.keys(nextForm).forEach((key) => {
          if (typeof nextForm[key] === "string") {
            nextForm[key] = DOMPurify.sanitize(nextForm[key], {
              FORBID_TAGS: [
                "script",
                "iframe",
                "object",
                "embed",
                "form",
                "input",
                "button",
                "link",
                "meta",
                "base",
              ],
              FORBID_ATTR: ["onerror", "onload", "onclick"],
            });
          }
        });
      
        const payload = {
          id: suc._id,
          userId: nextForm.userId,
          mailingUser: nextForm.mailingUser,
          inmateNumber: nextForm.inmateNumber,
          firstName: nextForm.firstName,
          lastName: nextForm.lastName,
          email: nextForm.email,
          title: nextForm.title,
          storyText: nextForm.storyText,
          storyVideo: nextForm.storyVideo,
          programName: nextForm.programName,
          graduationDate: nextForm.graduationDate,
          outcomeSummary: nextForm.outcomeSummary,
          consentToPublish: nextForm.consentToPublish,
          displayName: nextForm.displayName,
          location: nextForm.location,
          internalNotes: nextForm.internalNotes,
        };
      
        dispatch(updateStory(payload));
        setTrigger(true);
        setIsEditing(false);
      };
      

    useEffect(() => {
        if (storyById) {
            setForm({
                userId: storyById.userId || "",
                mailingUser: storyById.mailingUser || "",
                inmateNumber: storyById.inmateNumber || { number: "", state: "" },
                firstName: storyById.firstName || "",
                lastName: storyById.lastName || "",
                email: storyById.email || "",
                title: storyById.title || "",
                storyText: storyById.storyText || "",
                storyVideo: storyById.storyVideo || "",
                programName: storyById.programName || "",
                graduationDate: storyById.graduationDate || "",
                outcomeSummary: storyById.outcomeSummary || "",
                consentToPublish:
                    typeof storyById.consentToPublish === "boolean"
                        ? storyById.consentToPublish
                        : false,
                displayName: storyById.displayName || "",
                location: storyById.location || { city: "", state: "" },
                internalNotes: storyById.internalNotes || "",
            });
        }
    }, [storyById]);

    const editingThisStory = (sucId) => {
        setIsEditing(true)
        setTrigger(true)
        dispatch(getStoryById(sucId))
    }

    const deleteThisStory = (sucId) => {
        const now = Date.now();
        const delay = 400;
        if (now - lastTapRef.current < delay) {
          dispatch(deleteStory(sucId));
          setTrigger(true);
        }
        lastTapRef.current = now;
      };

    return (

        <div style={{ width: "100%", background: "lightGrey", padding: '1vh 1vw' }}>

            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} className='responsiveUserSuccess'>
                <span style={{ fontSize: "small" }}>{moment(suc?.createdAt).format("hh:mm MMM Do YY")}</span>
                <span>{suc?.displayName} (<b>Inmate #:</b> {suc?.inmateNumber ? <><span>{suc?.inmateNumber?.number}, {suc?.inmateNumber?.state}</span></> : ""})</span>
            </div>


            <div style={{ display: "flex", margin: "1vh 1vw" }} className='responsiveUserSuccess'>

                <div className='responsiveUserSuccessImage'>
                    <img
                        src={imgSrc}
                        style={{
                            minWidth: "30vw",
                            maxWidth: "30vw",
                            minHeight: "30vh",
                            maxHeight: "30vh",
                        }}
                         className='responsiveUserSuccessImage'
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadSucImage("sucImage")}
                        style={inputStyle}

                    />

                    {formImage?.sucImagePreview !== null ? (
                        <button
                            type="button"
                            onClick={handleSaveSucImage("sucImage")}
                            className='lookAtMe'
                            style={{
                                width: "100%",
                                background: "lightBlue",
                                margin: "0 0 1vh 0",
                            }}>Update Image </button>

                    ) : (
                        ""
                    )}

                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "70%" }} className='responsiveUserSuccessInfo'>
                    <h6 style={{ width: "100%", textAlign: "center", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(suc?.title) }} />
                    <h6 style={{ width: "100%", textAlign: "center", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(suc?.outcomeSummary) }} />
                    <h6 >{suc?.consentToPublish ? "✅ Authorized To Publish" : <div><b>Story Progress: </b><div style={{ color: "red" }}> In Development</div></div>}</h6>
                    <h6 style={{ width: "100%", textAlign: "center" }}>{suc?.storyText}</h6>
                </div>

            </div>

            {suc?.storyVideo?.startsWith("htt") ? 
            <div style={{ display: "flex", justifyContent: "center", width: "100%", margin: "1vh 1vw" }}  className='responsiveUserSuccessVideoContainer'>
                <video src={suc?.storyVideo} style={{
                    minWidth: "50vw",
                    maxWidth: "50vw",
                    minHeight: "50vh",
                    maxHeight: "50vw",
                    background: "white"
                }} className='responsiveUserSuccessVideo videoMedia'controls></video>
            </div> : "No Video Provided"}

            {/* Existing Notes display */}
            <div style={{ background: "white", padding: "1vh 1vw" }}>
                <b>Notes:</b>
                <h6
                    style={{ width: "100%", textAlign: "center", }}
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(suc?.internalNotes),
                    }}
                />
            </div>

            {!isEditing ? <button style={{ background: "lightBlue", padding: "0 2vw", margin: "1vh 0" }} onClick={() => editingThisStory(suc?._id)}>Update Story</button> :
                <button style={{ background: "red", padding: "0 2vw", margin: "1vh 0" }} onClick={() => setIsEditing(false)}>Cancel Update</button>
            }

            {isEditing && (

                <form onSubmit={handleSubmit} style={{ marginTop: "1vh", border: "double black", padding: "1vh 1vw", display: "flex", flexDirection: 'column' }}>

                    <label style={labelStyle}>Edit Notes:</label>
                    <textarea
                        name="internalNotes"
                        value={form.internalNotes}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder='- Currently No Notes -'
                    />

                    <label style={labelStyle}>Title:</label>

                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder='- Currently No Title -'
                    />

                    <div style={{ border: form.storyText ? "double black" : "", padding: "1vh 1vw", margin: "1vh 0" }}>
                        <label style={labelStyle}>Story Text:</label>

                        <textarea
                            name="storyText"
                            value={form.storyText}
                            onChange={handleChange}
                            style={{ ...inputStyle, minHeight: "30vh" }}
                            placeholder='- Currently No Story Text -'
                        />
                        {form.storyText ?

                            <div style={{ width: "100%", background: "white", margin: "1vh 0" }}>
                                <p>Preview Of Story Text: </p>
                                <h6 style={{ width: "100%", padding: "2vw", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form?.storyText) }} />
                            </div>

                            : ""}
                    </div>

                    <label style={labelStyle}>Story Video URL:</label>

                    <input
                        type="text"
                        name="storyVideo"
                        value={form?.storyVideo}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder='- Currently No Video URL Link -'
                    />

                    <label style={labelStyle}>Program Completed:</label>

                    <input
                        type="text"
                        name="programName"
                        value={form?.programName}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder='- Currently No Program Name -'
                    />


                    <label style={labelStyle}>Graduation Date:</label>

                    <input
                        type="date"
                        name="graduationDate"
                        value={
                            form?.graduationDate
                                ? moment(form?.graduationDate).format("YYYY-MM-DD")
                                : ""
                        }
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <label style={labelStyle}>Outcome Summary:</label>

                    <textarea
                        name="outcomeSummary"
                        value={form?.outcomeSummary}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder='- Currently No Summary -'
                    />

                    {admin?.creator || admin?.NFadmin ?
                        <div style={{ display: "flex", width: '100%', height: "5vh", justifyContent: "center", alignItems: "center" }}>
                            <label style={labelStyle}>Admin Consent to Publish
                                <input
                                    type="checkbox"
                                    checked={form?.consentToPublish}
                                    onChange={handleConsentChange}
                                    style={{ transform: "scale(2,2)", margin: "1vh 1vw" }}
                                /></label>
                        </div>
                        : ""}


                    <label style={labelStyle}>First Name:</label>

                    <input
                        type="text"
                        name="firstName"
                        value={form?.firstName}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder='- Currently No First Name -'
                    />


                    <label style={labelStyle}>Last Name:</label>

                    <input
                        type="text"
                        name="lastName"
                        value={form?.lastName}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder='- Currently No Last Name -'
                    />


                    <label style={labelStyle}>Guest Email:</label>

                    <input
                        type="email"
                        name="email"
                        value={form?.email}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder='- Currently No Guest Email -'
                    />

                    <label style={labelStyle}>City Of Story:</label>

                    <input
                        type="text"
                        name="city"
                        value={form?.location?.city}
                        onChange={handleLocationChange}
                        style={inputStyle}
                        placeholder='- Currently No City -'
                    />


                    <label style={labelStyle}>State Of Story:</label>

                    <select
                        name="state"
                        value={form?.location?.state}
                        onChange={handleLocationChange}
                        style={inputStyle}
                    >
                        <option value="">Select a state</option>
                        {locationList?.map((loc) => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                    </select>

                    <div style={{ border: "double black", padding: "1vh 1vw", margin: "1vh 0" }}>
                        <label style={labelStyle}> Inmate Number:  </label>

                        <input
                            type="text"
                            name="number"
                            value={form?.inmateNumber?.number}
                            onChange={handleInmateNumberChange}
                            style={inputStyle}
                            placeholder='- Currently No Inmate Number -'
                        />


                        <label style={labelStyle}>Inmate State: </label>

                        <select
                            name="state"
                            value={form?.inmateNumber?.state}
                            onChange={handleInmateNumberChange}
                            style={inputStyle}
                        >
                            <option value="">Select a state</option>
                            {locationList.map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" style={{ background: "lime", margin: "1vh 0" }}>Save Changes</button>

                </form>
            )}

            <h4 style={{ width: "100%", textAlign: "center" }}>User Email: <br /> {suc?.email}</h4>
            {/* Existing bottom row display – unchanged */}
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                }}
                className='responsiveUserSuccessBottom'
            >
                <span> <b>Program Completed:</b> {suc?.programName}</span>

                <span style={{ fontSize: "small" }}> <b>Graduation Date:</b> {moment(suc?.graduationDate).format("MMM Do YY")}</span>
            </div>

            {admin?.creator || admin?.NFadmin || admin?._id === suc?.userId ?
                <button style={{ background: "red", padding: '0 2vw' }} onClick={() => deleteThisStory(suc?._id)}>Delete This Story</button> : ""}

        </div>

    )
}

export default UserSuccessStories
