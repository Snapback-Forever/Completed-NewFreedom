import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import DOMPurify from 'dompurify'
import { useDispatch, useSelector } from 'react-redux'
import AddLocImageModal from './AddLocImageModal'
import { deleteLocation, removeAdditionalImages, removeLocationFromProgram, removeLocationMentee, removeLocationStaff, updateLocation } from '../../../../redux/reducers/locationReducer'
import { Link } from 'react-router-dom'
import AddMenteeModal from './AddMenteeModal'
import AddStaffModal from './AddStaffModal'
import { removeEventFromLocation } from '../../../../redux/reducers/eventReducers'

const AllLocationCard = ({ loc, setTrigger, allMentee, allUsers, allPrograms, allEvents }) => {

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

    const admin = useSelector(state => state.auth.user)

    const [onHover, setOnHover] = useState(false)
    const [hoveredImage, setHoveredImage] = useState(null)
    const [addImage, setAddImage] = useState(false)
    const [changeContent, setChangeContent] = useState("")

    const [editingMainImage, setEditingMainImage] = useState(false)
    const [mainImagePreview, setMainImagePreview] = useState(null)
    const [mainImageFile, setMainImageFile] = useState(null)

    const [form, setForm] = useState({
        locationName: loc?.locationName || "",
        aboutLocation: loc?.aboutLocation || "",
        aboutLocationVideo: loc?.aboutLocationVideo || "",
        locationPhoneNumber: loc?.locationPhoneNumber || "",
        maxCapacity: loc?.maxCapacity || "",
        facilitySex: loc?.facilitySex || "",
        mailingAddress: {
            street: loc?.mailingAddress?.street || "",
            city: loc?.mailingAddress?.city || "",
            state: loc?.mailingAddress?.state || "",
            zipCode: loc?.mailingAddress?.zipCode || ""
        }
    });

    useEffect(() => {
        if (loc) {
            setForm({
                locationName: loc.locationName || "",
                aboutLocation: loc.aboutLocation || "",
                aboutLocationVideo: loc.aboutLocationVideo || "",
                locationPhoneNumber: loc.locationPhoneNumber || "",
                maxCapacity: loc.maxCapacity || "",
                facilitySex: loc.facilitySex || "",
                mailingAddress: {
                    street: loc?.mailingAddress?.street || "",
                    city: loc?.mailingAddress?.city || "",
                    state: loc?.mailingAddress?.state || "",
                    zipCode: loc?.mailingAddress?.zipCode || ""
                }
            });
        }
    }, [loc]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            mailingAddress: {
                ...prev.mailingAddress,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nextForm = { ...form };
        if (nextForm.aboutLocation) {
            nextForm.aboutLocation = DOMPurify.sanitize(nextForm.aboutLocation, {
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
        const payload = {
            id: loc._id,
            locationName: nextForm.locationName,
            aboutLocation: nextForm.aboutLocation,
            aboutLocationVideo: nextForm.aboutLocationVideo,
            locationPhoneNumber: nextForm.locationPhoneNumber,
            maxCapacity: nextForm.maxCapacity,
            facilitySex: nextForm.facilitySex,
            mailingAddress: nextForm.mailingAddress
        };
        dispatch(updateLocation(payload));
        setTrigger(true)
        setChangeContent("")
    };

    const baseUrl = "http://localhost:8080"

    const imgSrc = loc?.locImageFileId && loc?.locImageBucketName
        ? `${baseUrl}/upload/image/${loc.locImageFileId}?bucketName=${loc.locImageBucketName}`
        : loc?.locationImage

    const tapCountRef = useRef(0)
    const lastTapRef = useRef(0)

    const deleteTheImage = (img) => {
        const now = Date.now()
        const delay = 400

        if (now - lastTapRef.current < delay) {
            tapCountRef.current += 1
        } else {
            tapCountRef.current = 1
        }

        lastTapRef.current = now

        if (tapCountRef.current === 3) {
            const payload = {
                id: loc._id,
                imageFileId: img.imageFileId,
                imageBucketName: img.imageBucketName,
                link: img.link
            }

            dispatch(removeAdditionalImages(payload))
            setTrigger(prev => !prev)
        }
    }

    const handleUploadMainImage = (e) => {

        const file = e.target.files[0]
        if (!file) return

        const previewUrl = URL.createObjectURL(file)

        setMainImagePreview(previewUrl)
        setMainImageFile(file)
    }

    const handleSaveMainImage = async () => {

        if (!mainImageFile) return

        const fd = new FormData()
        fd.append("image", mainImageFile)

        const hasGridFsImage =
            !!loc.locImageFileId && !!loc.locImageBucketName

        const uploadUrl = hasGridFsImage
            ? `${baseUrl}/upload/image/${loc.locImageFileId}?bucketName=${loc.locImageBucketName}`
            : `${baseUrl}/upload/image/${loc._id}`

        const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            body: fd
        })

        if (!uploadRes.ok) {
            console.error("Image upload failed")
            return
        }

        const { fileId, bucketName } = await uploadRes.json()

        const payload = {
            id: loc._id,
            locImageFileId: fileId,
            locImageBucketName: bucketName
        }

        await dispatch(updateLocation(payload))

        setEditingMainImage(false)
        setMainImagePreview(null)
        setMainImageFile(null)

        setTrigger(prev => !prev)
    }

    const inputStyle = {
        border: 'solid lightGrey',
        background: 'white',
        width: '100%',
        margin: "0 0 1vh 0"
    };

    const labelStyle = {
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
        display: "flex",
        justifyContent: "center",
        gap: "0.5vw"
    };

    const clickCountRef = useRef(0);
    const timeoutRef = useRef(null);

    const deleteThisLocation = (locationId) => {
        clickCountRef.current += 1;
        if (clickCountRef.current === 3) {
            clearTimeout(timeoutRef.current);

            setTrigger(true);
            dispatch(deleteLocation(locationId));
            clickCountRef.current = 0;
            return;
        }
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            clickCountRef.current = 0;
        }, 400);
    }

    const removeThisMentee = (mailId) => {
        clickCountRef.current += 1;
        if (clickCountRef.current === 3) {
            clearTimeout(timeoutRef.current);

            const form = {
                locationId: loc?._id,
                mailId
            }
            setTrigger(true);
            dispatch(removeLocationMentee(form))
            clickCountRef.current = 0;
            return;
        }
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            clickCountRef.current = 0;
        }, 400);
    }

    const removeThisStaff = (staffId) => {
        clickCountRef.current += 1;
        if (clickCountRef.current === 3) {
            clearTimeout(timeoutRef.current);

            const form = {
                locationId: loc?._id,
                userIds: staffId
            }
            setTrigger(true);
            dispatch(removeLocationStaff(form))
            clickCountRef.current = 0;
            return;
        }
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            clickCountRef.current = 0;
        }, 400);
    }

    const removeThisProgram = (programId) => {
        clickCountRef.current += 1;
        if (clickCountRef.current === 3) {
            clearTimeout(timeoutRef.current);

            const payload = {
                locationId: loc?._id,
                programId
            }
            setTrigger(true);
            dispatch(removeLocationFromProgram(payload))
            clickCountRef.current = 0;
            return;
        }
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            clickCountRef.current = 0;
        }, 400);
    }

    const removeThisEvent = (eventId) => {
        clickCountRef.current += 1;
        if (clickCountRef.current === 3) {
            clearTimeout(timeoutRef.current);

            const form = {
                locationId: loc?._id,
                eventId
            }
            setTrigger(true);
            dispatch(removeEventFromLocation(form))
            clickCountRef.current = 0;
            return;
        }
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            clickCountRef.current = 0;
        }, 400);
    }


    return (
        <div style={{ width: '95vw', height: "fit-content", display: 'flex', flexDirection: 'column', background: "rgba(250, 235, 215, 0.960)", overflowY: 'auto', padding: '1rem 1vw', margin: "1vh 1vw" }}>

            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "small" }}>
                    {moment(loc?.createdAt).format("hh:mm MMM Do YY")}
                </span>
            </div>

            <img
                src={mainImagePreview || imgSrc}
                style={{ maxHeight: "50vh", minHeight: "50vh", maxWidth: "100%", minWidth: "100%" }}
                onClick={() => setOnHover(prev => !prev)}
                className={onHover ? 'drawHover' : ""}
            />

            <div>

                {admin?.creator || admin?.NFadmin ?
                    <>
                        {!editingMainImage ?
                            <button style={{ background: "lightBlue", margin: "0.5vh 0", padding: "0 2vw" }} onClick={() => setEditingMainImage(true)}>Edit Location Image</button> : <button style={{ background: "red", margin: "0.5vh 0", padding: "0 2vw" }} onClick={() => setEditingMainImage(false)}>Cancel Edit</button>
                        }
                    </> : ""}

                {editingMainImage && (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label><b>Select New Location Image</b></label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadMainImage}
                            style={inputStyle}
                        />

                        {mainImagePreview && (
                            <button
                                style={{ background: "lime", margin: "0.5vh 0" }}
                                onClick={handleSaveMainImage}
                                className="lookAtMe"
                            >Update Image</button>
                        )}

                    </div>
                )}

            </div>

            <div style={{ border: "solid black", display: "flex", maxHeight: "40vh", overflowX: "scroll" }}>
                {loc?.additionalImages.length === 0 ? <h4 style={{ textAlign: "center" }}>Currently No Additional Images</h4> : <>
                    {loc?.additionalImages
                        ?.filter(add => add)
                        .slice()
                        .reverse()
                        .map(add => {

                            const addImgSrc = add?.imageFileId && add?.imageBucketName
                                ? `${baseUrl}/upload/image/${add.imageFileId}?bucketName=${add.imageBucketName}`
                                : add?.link

                            return (

                                <div
                                    key={add._id || add.imageFileId || add.link}
                                    style={{ display: "flex", flexDirection: "column", padding: "1vh 1vw" }}
                                >

                                    <img
                                        src={addImgSrc}
                                        style={{
                                            maxHeight: "15vh",
                                            minHeight: "15vh",
                                            maxWidth: "20vh",
                                            minWidth: "20vh",
                                            margin: "0.5vh 0.5vw 0 0.5vw"
                                        }}
                                        onClick={() => setHoveredImage(prev => prev === addImgSrc ? null : addImgSrc)}
                                        className={hoveredImage === addImgSrc ? 'drawHover' : ""}
                                    />

                                    {add?.imageFileId ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(add?.imageFileId)} style={{ cursor: "pointer" }}><b>imageFileId: </b><br />{add?.imageFileId}</div> : ""}
                                    {add?.imageBucketName ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(add?.imageBucketName)} style={{ cursor: "pointer" }}><b>imageBucketName: <br /></b>{add?.imageBucketName}</div> : ""}
                                    {add?.link && (<div title="Click to copy full link" onClick={() => navigator.clipboard.writeText(add?.link)} style={{ cursor: "pointer" }}><b>Link:</b>{add.link?.length > 30 ? `${add?.link.slice(0, 15)}...${add.link.slice(-10)}` : add?.link}</div>)}

                                    <button
                                        style={{ background: "red", margin: "0.5vh 0.5vw" }}
                                        onClick={() => deleteTheImage(add)}
                                    >Delete Image</button>

                                </div>
                            )
                        })}</>}

            </div>

            <div>
                <button style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0" }} onClick={() => setAddImage(true)}>Add Additional Image</button>

            </div>

            <div>
                <h3 style={{ textAlign: "center" }}>{loc?.locationName}</h3>
                <h6><b>Location Gender:</b> {loc?.facilitySex}</h6>
                <h6><b>Remaining Capacity:</b> ({loc?.currentCapacity})</h6>
                <h4><b>Phone Number:</b> {loc?.locationPhoneNumber}</h4>

                <div style={{ border: "double black", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "1vh 0" }}>
                    <b>Address:</b>
                    <h3>{loc?.mailingAddress.street}</h3>
                    <div style={{ display: "flex" }}>
                        <h3>{loc?.mailingAddress.city},</h3>
                        <h3 style={{ margin: "0 0.5vw" }}>{loc?.mailingAddress.state}</h3>
                    </div>
                    <h3 style={{ margin: "0 0.5vw" }}>{loc?.mailingAddress.zipCode}</h3>
                </div>

                {loc?.aboutLocationVideo?.startsWith("http") ?
                    <video src={loc?.aboutLocationVideo} controls className='videoMedia'></video>
                    : ""}

                <h4 style={{ width: "100%", padding: "2vw", whiteSpace: "pre-wrap", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(loc?.aboutLocation) }} />
            </div>

            <div>
                {changeContent === "mentee" ? <h6 onClick={() => setChangeContent("")} style={{ background: "red", padding: "0 2vw" }}>Hide Attached Mentee: ({loc?.locationMentee?.length})</h6> : <h6 onClick={() => setChangeContent("mentee")}>Attached Mentee: ({loc?.locationMentee?.length})</h6>}

                {changeContent === "staff" ? <h6 onClick={() => setChangeContent("")} style={{ background: "red", padding: "0 2vw" }}>Hide Attached Staff: ({loc?.locationStaff?.length})</h6> : <h6 onClick={() => setChangeContent("staff")}>Attached Staff: ({loc?.locationStaff?.length})</h6>}

                {changeContent === "pro" ? <h6 onClick={() => setChangeContent("")} style={{ background: "red", padding: "0 2vw" }}>Hide Attached Programs: ({loc?.programs?.length})</h6> : <h6 onClick={() => setChangeContent("pro")}>Attached Programs: ({loc?.programs?.length})</h6>}


                {changeContent === "event" ? <h6 onClick={() => setChangeContent("")} style={{ background: "red", padding: "0 2vw" }}>Hide Attached Events: ({loc?.upcomingEvent?.length})</h6> : <h6 onClick={() => setChangeContent("event")}>Attached Events: ({loc?.upcomingEvent?.length})</h6>}


            </div>

            <dialog open={addImage}>
                <AddLocImageModal
                    loc={loc}
                    setTrigger={setTrigger}
                    setAddImage={setAddImage}
                />
            </dialog>

            <div style={{ display: "flex", justifyContent: "space-between" }} >

            </div>

            {changeContent === "edit" ? (
                <>
                    <div style={{ border: "solid black", margin: "1vh 0" }}></div>
                    <div>
                        <h5>Edit This Location</h5>
                        <form onSubmit={handleSubmit}>

                            <label style={labelStyle}>Location Name:</label>
                            <input
                                type="text"
                                name="locationName"
                                placeholder="Location Name"
                                value={form.locationName}
                                onChange={handleChange}
                                style={inputStyle}
                            />

                            <label style={labelStyle}>About Location:</label>
                            <textarea
                                name="aboutLocation"
                                placeholder="About Location"
                                value={form.aboutLocation}
                                onChange={handleChange}
                                style={{ ...inputStyle, height: "50vh" }}

                            />

                            {form.aboutLocation ?
                                <div style={{ border: "double black", margin: "1vh 0", padding: "1vh 1vw" }}>
                                    <b>Preview Of About Location</b>
                                    <h6 style={{ width: "100%", padding: "2vw", wordBreak: 'break-all', }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form.aboutLocation) }} />
                                </div>
                                : ""}

                            <label style={labelStyle}></label>
                            <input
                                type="text"
                                name="aboutLocationVideo"
                                placeholder="Video URL"
                                value={form.aboutLocationVideo}
                                onChange={handleChange}
                                style={inputStyle}
                            />

                            <label style={labelStyle}></label>
                            <input
                                type="text"
                                name="locationPhoneNumber"
                                placeholder="Phone Number"
                                value={form.locationPhoneNumber}
                                onChange={handleChange}
                                style={inputStyle}
                            />

                            <label style={labelStyle}></label>
                            <input
                                type="number"
                                name="maxCapacity"
                                placeholder="Max Capacity"
                                value={form.maxCapacity}
                                onChange={handleChange}
                                style={inputStyle}
                            />

                            <label style={labelStyle}></label>
                            <select
                                name="facilitySex"
                                value={form.facilitySex}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="men">Men</option>
                                <option value="women">Women</option>
                                <option value="coed">Coed</option>
                            </select>

                            <h6>Mailing Address</h6>

                            <label style={labelStyle}></label>
                            <input
                                type="text"
                                name="street"
                                placeholder="Street"
                                value={form.mailingAddress.street}
                                onChange={handleAddressChange}
                                style={inputStyle}
                            />

                            <label style={labelStyle}></label>
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={form.mailingAddress.city}
                                onChange={handleAddressChange}
                                style={inputStyle}
                            />

                            <label style={labelStyle}></label>
                            <select
                                name="state"
                                value={form.mailingAddress.state}
                                onChange={handleAddressChange}
                                style={inputStyle}
                            >
                                <option value="">Select State</option>
                                {locationList.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>

                            <label style={labelStyle}></label>
                            <input
                                type="text"
                                name="zipCode"
                                placeholder="Zip Code"
                                value={form.mailingAddress.zipCode}
                                onChange={handleAddressChange}
                                style={inputStyle}
                            />

                            <button type="submit" style={{ background: "lime", width: "100%", margin: "0.5vh 0" }}>Update Location</button>
                            <button style={{ background: "red", padding: "0 4vw", width: "100%", margin: "0.5vh 0" }} onClick={() => setChangeContent("")}>Cancel Edit</button>
                        </form>
                    </div>
                </>
            ) : ""}


            {changeContent === "mentee" ?
                <>
                    <div style={{ border: "solid black", margin: "1vh 0" }}></div>

                    <div>
                        <button style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0" }} onClick={() => setChangeContent("addMentee")}>Add Mentee</button>
                    </div>
                    <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>

                        {loc?.locationMentee.length === 0 ? <h5>Currently No Mentee Attached To Location</h5> : <>
                            {loc?.locationMentee.filter(ment => ment).map(ment => {

                                const imgSrc =
                                    ment?.menteeImageFileId && ment?.menteeImageBucketName
                                        ? `${baseUrl}/upload/image/${ment.menteeImageFileId}?bucketName=${ment?.menteeImageBucketName}`
                                        : ment?.menteeImage;
                                return (
                                    <div style={{ background: "white", minWidth: "15vw", maxWidth: "15vw", minHeight: "30vh", maxHeight: "fit-content", margin: "1vh 0.5vw", padding: "1vh 1vw" }}>
                                        <span style={{ fontSize: "small" }}>{moment(ment?.createdAt).format("hh:mm MMM Do YY")}</span>
                                        <img src={imgSrc} alt="" style={{ width: "100%", minWidth: "100%", maxWidth: "100%", minHeight: "20vh", maxHeight: "20vh" }} />

                                        <h6><b>FirstName:</b> {ment?.firstName}</h6>
                                        <h6><b>LastName:</b> {ment?.lastName}</h6>
                                        <h6><b>Gender:</b> {ment?.sex}</h6>

                                        <div style={{ display: "flex", justifyContent: "end" }}>
                                            <button style={{ background: 'red', padding: "0 2vw" }} onClick={() => removeThisMentee(ment?._id)}>Remove Mentee</button>
                                        </div>


                                    </div>
                                )

                            })
                            }</>}

                    </div>
                    <div style={{ border: "solid black", margin: "1vh 0" }}></div></> : ""}


            <dialog open={changeContent === "addMentee"}>
                <AddMenteeModal setChangeContent={setChangeContent} loc={loc} setTrigger={setTrigger} allMentee={allMentee} />
            </dialog>

            {changeContent === "staff" ?
                <>
                    <div style={{ border: "solid black", margin: "1vh 0" }}></div>

                    <div>
                        <button style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0" }} onClick={() => setChangeContent("addStaff")}>Add Staff</button>
                    </div>

                    <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>
                        {loc?.locationStaff.length === 0 ? <h5>Currently No Staff Attached To Location</h5> : <>
                            {loc?.locationStaff.filter(staff => staff).map(staff => {

                                const imgSrc =
                                    staff?.profilePicFileId && staff?.profilePicBucketName
                                        ? `${baseUrl}/upload/image/${staff.profilePicFileId}?bucketName=${staff?.profilePicBucketName}`
                                        : staff?.profilePic;
                                return (
                                    <div style={{ background: "white", minWidth: "15vw", maxWidth: "15vw", minHeight: "30vh", maxHeight: "fit-=content", margin: "1vh 0.5vw", padding: "1vh 1vw" }}>
                                        <span style={{ fontSize: "small" }}>{moment(staff?.createdAt).format("hh:mm MMM Do YY")}</span>
                                        <img src={imgSrc} alt="" style={{ width: "100%", minWidth: "100%", maxWidth: "100%", minHeight: "20vh", maxHeight: "20vh" }} />

                                        <h6><b>Account Name:</b> {staff?.accountName}</h6>
                                        {admin?._id !== staff?._id ? <>
                                            <Link to={`/messagePage/${staff?._id}`}>
                                                <button style={{ background: "lightBlue", width: "100%" }}>📨 Staff</button>
                                            </Link></> : <button style={{ background: "red", width: "100%" }}>Your Card</button>}

                                        <div style={{ display: "flex", justifyContent: "end", margin: "1vh 0" }}>
                                            <button style={{ background: 'red', padding: "0 2vw" }} onClick={() => removeThisStaff(staff?._id)}>Remove Staff</button>
                                        </div>
                                    </div>
                                )

                            })
                            }</>}

                    </div>
                    <div style={{ border: "solid black", margin: "1vh 0" }}></div></> : ""}

            <dialog open={changeContent === "addStaff"}>
                <AddStaffModal setChangeContent={setChangeContent} loc={loc} setTrigger={setTrigger} allUsers={allUsers} />
            </dialog>

            {changeContent === "pro" ?
                <>
                    <div style={{ border: "solid black", margin: "1vh 0" }}></div>

                    <div style={{ display: "flex", width: "100%", flexWrap: "wrap", padding: "1vh 0" }}>

                        {loc?.programs.length === 0 ? <h5>Currently No Programs Attached To Location</h5> : <>
                            {loc?.programs.filter(pro => pro).map(pro => {

                                return (
                                    <div style={{ background: "white", minWidth: "20vw", maxWidth: "20vw", minHeight: "30vh", maxHeight: "fit-content", margin: "1vh 0.5vw", padding: "1vh 1vw" }}>
                                        <span style={{ fontSize: "small", }}>{moment(pro?.createdAt).format("hh:mm MMM Do YY")}</span>
                                        <div style={{ margin: "1vh 0", height: "fit-content", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1vh 1vw" }}>
                                            <h5>{pro?.programName}</h5>
                                            <h6><b>Type:</b> {pro?.programType}</h6>
                                            <h6><b>Length:</b> {pro?.lengthOfProgram} Days</h6>
                                            <h6><b>Remaining Capacity:</b> {pro?.currentCapacity}</h6>
                                            <h6><b>Current Graduates:</b> ({pro?.graduates.length})</h6>
                                            <h6><b>Current Students:</b> ({pro?.students.length})</h6>
                                            <h6><b>Current Teachers:</b> ({pro?.teachers.length})</h6>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "end" }}>
                                            <button style={{ background: 'red', padding: "0 2vw" }} onClick={() => removeThisProgram(pro?._id)}>Remove Program</button>
                                        </div>
                                    </div>
                                )

                            })}</>}

                    </div>
                    <div style={{ border: "solid black", margin: "1vh 0" }}></div></> : ""}

            {changeContent === "event" ?
                <>
                    <div style={{ border: "solid black", margin: "1vh 0" }}></div>
                    <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>
                        {loc?.programs.length === 0 ? <h5>Currently No Events Attached To Location</h5> : <>
                            {loc?.upcomingEvent?.filter(event => event).map(event => {

                                return (
                                    <div style={{ background: "white", minWidth: "20vw", maxWidth: "20vw", minHeight: "30vh", maxHeight: "30vh", margin: "1vh 0.5vw", padding: "1vh 1vw" }}>
                                        <span style={{ fontSize: "small", }}>{moment(event?.createdAt).format("hh:mm MMM Do YY")}</span>
                                        <div style={{ margin: "1vh 0", height: "95%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <h5><b>Event Name:</b><br /> {event?.title}</h5>
                                            <div><b>StartDate:</b> <span style={{ fontSize: "small", }}>{moment(event?.startDate).format("hh:mm MMM Do YY")}</span></div>
                                            <div><b>EndDate:</b> <span style={{ fontSize: "small", }}>{moment(event?.endDate).format("hh:mm MMM Do YY")}</span></div>

                                            <h6><b>Event Status:</b> {event?.status}</h6>
                                            <h6><b>capacityRemaining:</b> ({event?.capacityRemaining})</h6>
                                            <h6><b>Current Attendees:</b> ({event?.attendees?.length})</h6>

                                        </div>
                                        {admin?._id !== event?.createdBy ? <>
                                            <Link to={`/messagePage/${event?.createdBy}`}>
                                                <button style={{ background: "lightBlue", width: "100%" }}>📨 Coordinator</button>
                                            </Link></> : <button style={{ background: "red", width: "100%" }}>Your Event</button>}

                                        <div style={{ display: "flex", justifyContent: "end" }}>
                                            <button style={{ background: 'red', padding: "0 2vw" }} onClick={() => removeThisEvent(event?._id)}>Remove Event</button>
                                        </div>
                                    </div>
                                )

                            })}</>}

                    </div>
                    <div style={{ border: "solid black", margin: "1vh 0" }}></div></> : ""}

            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>

                {changeContent === "edit" ?
                    <button style={{ background: "red", padding: "0 4vw", margin: "0.5vh 0.5vw", width: "40%" }} onClick={() => setChangeContent("")}>Hide Edit</button> :
                    <button style={{ background: "lightBlue", padding: "0 4vw", margin: "0.5vh 0.5vw", width: "40%" }} onClick={() => setChangeContent("edit")}>Edit Location</button>
                }

                <button style={{ background: "red", padding: "0 4vw", margin: "0.5vh 0.5vw", minWidth: "20%", maxWidth: "fit-content" }} onClick={() => deleteThisLocation(loc?._id)}>Delete Location</button>

            </div>



        </div>
    )

}

export default AllLocationCard
