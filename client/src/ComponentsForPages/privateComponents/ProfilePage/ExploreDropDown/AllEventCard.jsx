// AllEventCard.jsx

import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import DOMPurify from 'dompurify'

import {
    addOrUpdateAttendee,
    deleteAdditionalEventImage,
    deleteEvent,
    removeEventFromLocation,
    updateAttendeeStatus,
    updateEvent,
    updateEventStatus
} from '../../../../redux/reducers/eventReducers'

import AddLocModal from './AddLocModal'
import AddeventImageModal from './AddeventImageModal'
import { Link } from 'react-router-dom'

const AllEventCard = ({ setTrigger, event, allLocations }) => {

    const dispatch = useDispatch()

    const admin = useSelector(state => state.auth.user)

    const [changeContent, setChangeContent] = useState("")
    const [selectedStatus, setSelectedStatus] = useState(event?.status || "")
    const [addLocation, setAddLocation] = useState(false)
    const [addImage, setAddImage] = useState(false)

    const [form, setForm] = useState({
        title: event?.title || "",
        description: event?.description || "",
        startDate: event?.startDate || "",
        endDate: event?.endDate || "",
        capacity: event?.capacity || ""
    })

    const [attendeeForm, setAttendeeForm] = useState({
        email: "",
        firstName: "",
        lastName: "",
        statusOnAttendence: "requested",
        bringingAlongEmails: [""]
    })

    const inputStyle = { border: "solid lightgrey", background: "white", width: "100%", margin: "0 0 1vh 0" }

    const labelStyle = { width: "100%", fontWeight: "bold", gap: "0.5vw" }

    const lastTapRef = useRef(0)

    const baseUrl = "http://localhost:8080"

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {

        e.preventDefault()

        const payload = { ...form }

        if (payload.description) {

            payload.description = DOMPurify.sanitize(payload.description, {
                FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input", "button", "link", "meta", "base"],
                FORBID_ATTR: ["onerror", "onload", "onclick"]
            })
        }

        dispatch(updateEvent({
            id: event?._id,
            ...payload
        }))

        setTrigger(prev => !prev)

        setChangeContent("")
    }

    const handleAttendeeChange = (e) => {

        setAttendeeForm({
            ...attendeeForm,
            [e.target.name]: e.target.value
        })
    }

    const handleGuestEmailChange = (index, value) => {

        const updated = [...attendeeForm.bringingAlongEmails]

        updated[index] = value

        setAttendeeForm({
            ...attendeeForm,
            bringingAlongEmails: updated
        })
    }

    const addGuestField = () => {

        setAttendeeForm({
            ...attendeeForm,
            bringingAlongEmails: [
                ...attendeeForm.bringingAlongEmails,
                ""
            ]
        })
    }

    const removeGuestField = (index) => {

        const updated = attendeeForm.bringingAlongEmails.filter((_, i) => i !== index)

        setAttendeeForm({
            ...attendeeForm,
            bringingAlongEmails: updated.length ? updated : [""]
        })
    }

    const handleSubmitAttendee = async (e) => {

        e.preventDefault()

        if (!attendeeForm.email) return

        const cleanedGuests = attendeeForm.bringingAlongEmails.filter(email => email?.trim())

        await dispatch(addOrUpdateAttendee({
            eventId: event._id,
            form: {
                ...attendeeForm,
                bringingAlongEmails: cleanedGuests
            }
        }))

        setTrigger(prev => !prev)

        setChangeContent("attendees")

        setAttendeeForm({
            email: "",
            firstName: "",
            lastName: "",
            statusOnAttendence: "requested",
            bringingAlongEmails: [""]
        })
    }

    const updateAttendeeStatusHandler = async (email, status) => {

        await dispatch(updateAttendeeStatus({
            eventId: event._id,
            email,
            statusOnAttendence: status
        }))

        setTrigger(prev => !prev)

        setChangeContent("attendees")
    }

    const removeThisLocation = (locId) => {

        const now = Date.now()

        if (now - lastTapRef.current < 400) {

            dispatch(removeEventFromLocation({
                locationId: locId,
                eventId: event?._id
            }))

            setTrigger(true)
        }

        lastTapRef.current = now
    }

    const deleteThisEvent = (eventId) => {

        const now = Date.now()

        if (now - lastTapRef.current < 400) {

            dispatch(deleteEvent(eventId))

            setTrigger(true)
        }

        lastTapRef.current = now
    }

    const deleteTheImage = (img) => {

        const now = Date.now()

        if (now - lastTapRef.current < 400) {

            dispatch(deleteAdditionalEventImage({
                id: event._id,
                imageFileId: img.imageFileId,
                imageBucketName: img.imageBucketName,
                link: img.link
            }))

            setTrigger(prev => !prev)
        }

        lastTapRef.current = now
    }

    const handleCopy = (text) => {

        const now = Date.now()

        if (now - lastTapRef.current < 400) {
            navigator.clipboard.writeText(text)
        }

        lastTapRef.current = now
    }

    const changeStatus = (status) => {

        dispatch(updateEventStatus({
            eventId: event?._id,
            status
        }))

        setTrigger(true)
    }

    return (

        <div style={{ width: "95vw", height: "fit-content", display: "flex", flexDirection: "column", background: "rgba(250, 235, 215, 0.960)", overflowY: "auto", padding: "1rem 1vw", margin: "1vh 1vw" }}>

            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "small" }}>{moment(event?.createdAt).format("hh:mm MMM Do YY")}</span>
            </div>

            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "small" }}><b>Start Date:</b> {moment(event?.startDate).format("hh:mm MMM Do YY")}</span>
                <span style={{ fontSize: "small" }}><b>End Date:</b> {moment(event?.endDate).format("hh:mm MMM Do YY")}</span>
            </div>

            <button style={{ background: "goldenrod", margin: "1vh 0" }} onClick={() => setAddImage(true)}>
                Add Additional Images
            </button>

            <div style={{ border: "solid black", display: "flex", maxHeight: "40vh", overflowX: "scroll", margin: "1vh 0" }}>

                {event?.additionalImages?.length === 0
                    ? <h4 style={{ textAlign: "center" }}>Currently No Additional Images</h4>

                    : <>
                        {event?.additionalImages?.filter(add => add).slice().reverse().map(add => {

                            const addImgSrc = add?.imageFileId && add?.imageBucketName
                                ? `${baseUrl}/upload/image/${add.imageFileId}?bucketName=${add.imageBucketName}`
                                : add?.link

                            return (

                                <div key={add._id || add.imageFileId || add.link} style={{ display: "flex", flexDirection: "column", padding: "1vh 1vw", minWidth: "20vw" }}>

                                    <img src={addImgSrc} style={{ maxHeight: "15vh", minHeight: "15vh", maxWidth: "100%", minWidth: "100%", margin: "0.5vh 0.5vw 0 0.5vw" }} />

                                    {add?.imageFileId
                                        ? <div title="Double Click To Copy" onClick={() => handleCopy(add?.imageFileId)} style={{ cursor: "pointer" }}>
                                            <b>imageFileId:</b><br />{add?.imageFileId}
                                        </div>
                                        : ""}

                                    {add?.imageBucketName
                                        ? <div title="Double Click To Copy" onClick={() => handleCopy(add?.imageBucketName)} style={{ cursor: "pointer" }}>
                                            <b>imageBucketName:</b><br />{add?.imageBucketName}
                                        </div>
                                        : ""}

                                    {add?.link
                                        ? <div title="Double Click To Copy" onClick={() => handleCopy(add?.link)} style={{ cursor: "pointer" }}>
                                            <b>Link:</b>{add.link?.length > 30 ? `${add?.link.slice(0, 15)}...${add.link.slice(-10)}` : add?.link}
                                        </div>
                                        : ""}

                                    <button style={{ background: "red", margin: "0.5vh 0.5vw" }} onClick={() => deleteTheImage(add)}>
                                        Delete Image
                                    </button>

                                </div>
                            )
                        })}
                    </>
                }

            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>

                <h3 style={{ textAlign: "center" }}>{event?.title}</h3>

                <h6 style={{ textAlign: "center" }}>
                    <b>Remaining Capacity:</b> {event?.capacityRemaining}
                </h6>

                <h6 style={{ textAlign: "center" }} onClick={() => setChangeContent("attendees")}>
                    <b>Current Attendees:</b> ({event?.attendees.length})
                </h6>

                {changeContent === "attendees" && (

                    <div style={{ border: "solid lightgray", padding: "1rem", margin: "1vh 0", background: "white", maxHeight: "50vh", overflowY: "auto" }}>

                        <button style={{ background: "red", width: "100%", marginBottom: "1vh" }} onClick={() => setChangeContent("")}>
                            Hide Attendees
                        </button>

                        {event?.attendees?.length === 0
                            ? <h4 style={{ textAlign: "center" }}>No Attendees Yet</h4>

                            : event.attendees.map((attendee, index) => {

                                const statusColor =
                                    attendee.statusOnAttendence === "approved"
                                        ? "limegreen"
                                        : attendee.statusOnAttendence === "denied"
                                            ? "red"
                                            : "orange"

                                return (

                                    <div key={index} style={{ border: "solid lightgray", padding: "1rem", marginBottom: "1vh", background: "rgba(240,240,240,0.7)" }}>

                                        <div style={{ fontWeight: "bold" }}>
                                            {attendee.firstName} {attendee.lastName}
                                        </div>

                                        <div style={{ margin: "0.5vh 0", wordBreak: "break-all" }}>
                                            {attendee.email}
                                        </div>



                                        <div style={{ marginBottom: "1vh" }}>
                                            <b>Guests:</b> {attendee?.bringingAlongEmails?.length || 0}
                                        </div>

                                        <div style={{ border: "solid lightgray", padding: "0.5rem", background: "white", marginBottom: "1vh" }}>

                                            <b>Guest Emails</b>

                                            {attendee?.bringingAlongEmails?.length > 0
                                                ? attendee.bringingAlongEmails.map((guest, i) => (
                                                    <div key={i} style={{ marginTop: "0.3vh", fontSize: "0.9rem" }}>
                                                        • {guest}
                                                    </div>
                                                ))
                                                : <div style={{ marginTop: "0.5vh", fontSize: "0.9rem" }}>
                                                    No guests yet
                                                </div>
                                            }

                                            {attendee.statusOnAttendence === "requested" && (

                                                <div style={{ marginTop: "1vh", borderTop: "solid lightgray", paddingTop: "1vh" }}>

                                                    <input
                                                        type="email"
                                                        placeholder="Add Guest Email"
                                                        style={{ width: "100%", padding: "0.5rem", border: "solid lightgray", marginBottom: "0.5vh" }}
                                                        onKeyDown={(e) => {

                                                            if (e.key !== "Enter") return

                                                            e.preventDefault()

                                                            const value = e.target.value?.trim()

                                                            if (!value) return

                                                            dispatch(addOrUpdateAttendee({
                                                                eventId: event._id,
                                                                form: {
                                                                    email: attendee.email,
                                                                    statusOnAttendence: attendee.statusOnAttendence,
                                                                    bringingAlongEmails: [
                                                                        ...(attendee?.bringingAlongEmails || []),
                                                                        value
                                                                    ]
                                                                }
                                                            }))

                                                            e.target.value = ""

                                                            setTrigger(prev => !prev)
                                                        }}
                                                    />

                                                    <div style={{ fontSize: "0.8rem", color: "gray" }}>
                                                        Press Enter To Add Guest
                                                    </div>

                                                </div>
                                            )}

                                        </div>

                                        <div style={{ color: statusColor, fontWeight: "bold", marginBottom: "1vh" }}>
                                            Status: {attendee.statusOnAttendence}
                                        </div>
                                        {attendee.statusOnAttendence === "approved" ? <b>To Add more Guest switch status back to requested.</b> : ""}
                                        <select
                                            value={attendee.statusOnAttendence}
                                            onChange={(e) => updateAttendeeStatusHandler(attendee.email, e.target.value)}
                                            style={{ width: "100%", padding: "0.5rem", border: "solid lightgray", background: "white" }}
                                        >
                                            <option value="requested">Requested</option>
                                            <option value="approved">Approved</option>
                                            <option value="denied">Denied</option>
                                        </select>

                                    </div>
                                )
                            })
                        }

                    </div>
                )}

                <h6 style={{ textAlign: "center" }} onClick={() => setChangeContent("loc")}>
                    <b>Attached Locations:</b> ({event?.upcomingEvent.length})
                </h6>

                {changeContent === "status"
                    ? <h6 style={{ textAlign: "center", cursor: "pointer", background: "red" }} onClick={() => setChangeContent("")}>
                        Hide Event Status: {event?.status}
                    </h6>

                    : <>
                        {admin?.creator || admin?.NFadmin
                            ? <h6 style={{ textAlign: "center", cursor: "pointer" }} onClick={() => setChangeContent("status")}>
                                <b>Event Status:</b> {event?.status === "published"
                                    ? "✅ Published"
                                    : event?.status === "draft"
                                        ? "Draft Of Event"
                                        : event?.status === "cancelled"
                                            ? "❌ CANCELED EVENT"
                                            : ""}
                            </h6>
                            : ""}
                    </>
                }

                {changeContent === "status" && (

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                        <div style={{ border: "solid black", margin: "1vh 0", width: "100%" }}></div>

                        <label style={labelStyle}>Select New Event Status:</label>

                        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ ...inputStyle }}>

                            <option value="">Change Status</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="cancelled">Cancelled</option>

                        </select>

                        <button style={{ marginTop: "1vh", padding: "0.5vh 2vw", background: "goldenrod" }} onClick={() => changeStatus(selectedStatus)}>
                            Update Status
                        </button>

                        <div style={{ border: "solid black", margin: "1vh 0", width: "100%" }}></div>

                    </div>
                )}


                <div style={{ width: "100%", padding: "2vw", background: "white", whiteSpace: "pre-wrap", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event?.description) }} />


            </div>

            {changeContent === "edit"
                ? (
                    <>
                        <div style={{ border: "solid black", margin: "1vh 0" }}></div>

                        <form onSubmit={handleSubmit}>

                            <label style={labelStyle}>Event Title:</label>

                            <input type="text" name="title" value={form.title} onChange={handleChange} style={inputStyle} />

                            <div style={{ textAlign: "center" }}>
                                <code>&lt;img src="http://localhost:8080/upload/image/<b style={{ color: "blue" }}>imageFileId</b>?bucketName=<b style={{ color: "blue" }}>imageBucketName</b>" alt="Description" /&gt;</code>
                            </div>
                            <label style={labelStyle}>Event Description:</label>

                            <textarea name="description" value={form.description} onChange={handleChange} style={{ ...inputStyle, minHeight: "50vh" }} />

                            {form.description
                                ? <div style={{ border: "double black", margin: "1vh 0", padding: "1vh 1vw", background: "white" }}>
                                    <b>Preview Of Description:</b>
                                    <div style={{ whiteSpace: "pre-wrap", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form.description) }} />
                                </div>
                                : ""
                            }

                            <label style={labelStyle}>Start Date:</label>

                            <input type="datetime-local" name="startDate" value={form.startDate?.slice(0, 16)} onChange={handleChange} style={inputStyle} />

                            <label style={labelStyle}>End Date:</label>

                            <input type="datetime-local" name="endDate" value={form.endDate?.slice(0, 16)} onChange={handleChange} style={inputStyle} />

                            <label style={labelStyle}>Capacity:</label>

                            <input type="number" name="capacity" value={form.capacity} onChange={handleChange} style={inputStyle} />

                            <button type="submit" style={{ background: "lime", width: "100%", margin: "0.5vh 0" }}>
                                Update Event
                            </button>

                            <button type="button" style={{ background: "red", width: "100%", margin: "0.5vh 0" }} onClick={() => setChangeContent("")}>
                                Cancel Edit
                            </button>

                        </form>

                        <div style={{ border: "solid black", margin: "1vh 0" }}></div>
                    </>
                )
                : ""
            }

            <dialog open={addImage}>
                <AddeventImageModal event={event} setTrigger={setTrigger} setAddImage={setAddImage} />
            </dialog>

            <dialog open={addLocation}>
                <AddLocModal setAddLocation={setAddLocation} event={event} allLocations={allLocations} setTrigger={setTrigger} />
            </dialog>

            {changeContent === "loc"
                ? <button onClick={() => setChangeContent("")} style={{ background: "red", margin: "1vh 0" }}>
                    Hide Locations
                </button>

                : <button onClick={() => setChangeContent("loc")} style={{ background: "lightblue", margin: "1vh 0" }}>
                    View Locations
                </button>
            }

            {changeContent === "loc" && (

                <div style={{ border: "solid lightgray", padding: "1rem", background: "white", margin: "1vh 0" }}>

                    <button style={{ background: "goldenrod", width: "100%", marginBottom: "1vh" }} onClick={() => setAddLocation(true)}>
                        Add Location
                    </button>

                    <div style={{ display: "flex", overflowX: "scroll", maxWidth: "100%" }}>
                        {event?.upcomingEvent?.length === 0
                            ? <h4 style={{ textAlign: "center" }}>No Locations Attached</h4>

                            : event.upcomingEvent.map((loc, index) => {
                                
                                const baseUrl = "http://localhost:8080";
                                const imgSrc =
                                    loc?.locImageFileId && loc?.locImageBucketName
                                        ? `${baseUrl}/upload/image/${loc.locImageFileId}?bucketName=${loc.locImageBucketName}`
                                        : loc?.profilePic;
                                return (

                                    <div key={index} style={{ border: "solid lightgray", padding: "1rem", margin: "0.5vh 0.5vw", background: "rgba(240,240,240,0.7)" }}>

                                        <div>
                                            <img src={imgSrc} style={{ minWidth: "100%", maxWidth: "100%", minHeight: "20vh", maxHeight: "20vh" }} />
                                            <div style={{ display: 'flex', flexDirection: "column" }}>
                                                <b>{loc?.locationName}</b>
                                                <b>Gender: {loc?.facilitySex}</b>
                                            </div>
                                        </div>

                                        <button style={{ background: "red", marginTop: "1vh", padding: "0 2vw" }} onClick={() => removeThisLocation(loc?._id)}>
                                            Remove Location
                                        </button>

                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )}

            {changeContent === "addAttendee"
                ? <button onClick={() => setChangeContent("")} style={{ background: "red", margin: "1vh 0" }}>
                    Hide Attendee To Event
                </button>

                : <button onClick={() => setChangeContent("addAttendee")} style={{ background: "goldenrod", margin: "1vh 0" }}>
                    Add A Attendee To Event
                </button>
            }

            {changeContent === "addAttendee" && (

                <div style={{ border: "solid lightgray", padding: "1rem", margin: "1vh 0", display: "flex", flexDirection: "column", gap: "0.5rem", background: "white" }}>

                    <form onSubmit={handleSubmitAttendee}>

                        <label style={labelStyle}>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={attendeeForm.email}
                            onChange={handleAttendeeChange}
                            style={inputStyle}
                            required
                        />

                        <label style={labelStyle}>First Name</label>

                        <input
                            type="text"
                            name="firstName"
                            value={attendeeForm.firstName}
                            onChange={handleAttendeeChange}
                            style={inputStyle}
                        />

                        <label style={labelStyle}>Last Name</label>

                        <input
                            type="text"
                            name="lastName"
                            value={attendeeForm.lastName}
                            onChange={handleAttendeeChange}
                            style={inputStyle}
                        />

                        <label style={labelStyle}>Attendance Status</label>

                        <select
                            name="statusOnAttendence"
                            value={attendeeForm.statusOnAttendence}
                            onChange={handleAttendeeChange}
                            style={inputStyle}
                        >
                            <option value="requested">Requested</option>
                            <option value="approved">Approved</option>
                            <option value="denied">Denied</option>
                        </select>

                        <div style={{ border: "solid lightgray", padding: "0.5rem", margin: "1vh 0", background: "rgba(240,240,240,0.6)" }}>

                            <b>Guest Emails</b>

                            {attendeeForm.bringingAlongEmails.map((guest, index) => (

                                <div key={index} style={{ display: "flex", gap: "0.5rem", margin: "0.5vh 0" }}>

                                    <input
                                        type="email"
                                        value={guest}
                                        placeholder="Guest Email"
                                        onChange={(e) => handleGuestEmailChange(index, e.target.value)}
                                        style={inputStyle}
                                    />

                                    <button
                                        type="button"
                                        style={{ background: "red", color: "white", minWidth: "3rem" }}
                                        onClick={() => removeGuestField(index)}
                                    >
                                        X
                                    </button>

                                </div>
                            ))}

                            <button
                                type="button"
                                style={{ background: "lightblue", width: "100%", marginTop: "0.5vh" }}
                                onClick={addGuestField}
                            >
                                Add Guest Email
                            </button>

                        </div>

                        <button type="submit" style={{ background: "lime", width: "100%", marginTop: "1vh", padding: "0.8rem", fontWeight: "bold" }}>
                            Submit Attendee
                        </button>

                    </form>

                </div>
            )}

            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>

                {changeContent === "edit"
                    ? <button style={{ background: "red", padding: "0 4vw", margin: "0.5vh 0.5vw", width: "40%" }} onClick={() => setChangeContent("")}>
                        Hide Edit
                    </button>

                    : <button style={{ background: "lightBlue", padding: "0 4vw", margin: "0.5vh 0.5vw", width: "40%" }} onClick={() => setChangeContent("edit")}>
                        Edit Event
                    </button>
                }

                <button style={{ background: "red", padding: "0 4vw", margin: "0.5vh 0.5vw", minWidth: "20%", maxWidth: "fit-content" }} onClick={() => deleteThisEvent(event?._id)}>
                    Delete Event
                </button>

            </div>

        </div>
    )
}

export default AllEventCard