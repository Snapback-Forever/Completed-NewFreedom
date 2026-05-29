import React, { useEffect, useState } from 'react'
import moment from 'moment'
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateAttendeeStatus } from '../../../../../redux/reducers/eventReducers';

const UserEvents = ({ event, admin, user, setTrigger }) => {

    const dispatch = useDispatch()

    const [viewAttendees, setViewAttendees] = useState(false)

    const [showAllAttendees, setShowAllAttendees] = useState(false);

    const attendeeList =
        (event?.attendees?.filter(att => att) ?? []).slice().reverse();
    const attendeesToShow = showAllAttendees
        ? attendeeList
        : attendeeList.slice(0, 5);


    const approveGuest = (eventId, email) => {
        const payload = {
            eventId: eventId,
            statusOnAttendence: "approved",
            email: email
        }
        dispatch(updateAttendeeStatus(payload))
        setTrigger(true)
    }

    const deniedGuest = (eventId, email) => {
        const payload = {
            eventId: eventId,
            statusOnAttendence: "denied",
            email: email
        }
        dispatch(updateAttendeeStatus(payload))
        setTrigger(true)
    }

    // console.log(event);

    return (
        <>

            <div style={{ width: "100%", background: "white", margin: "1vh 0", display: "flex", flexDirection: "column", border: "solid black", padding: "1vw" }}>

                <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }} className='responsiveUserEvent'>
                    <span style={{ fontSize: "small" }}>{moment(event?.createdAt).format("hh:mm MMM Do YY")}</span>
                    <h6><b>Event Title:</b> {event?.titleChecked}</h6>
                    <h6><b>Remaining Capacity:</b> ({event?.capacityRemaining})</h6>
                </div>

                <div style={{ width: "100%" }}>

                    <div style={{ width: "100%", textAlign: "center", padding: "2vw", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event?.description) }} />

                </div>


                <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}  className='responsiveUserEvent'>
                    <span style={{ fontSize: "small" }}><b>Start Date:</b> {moment(event?.startDate).format("hh:mm MMM Do YY")}</span>
                    <span style={{ fontSize: "small" }}><b>End Date:</b> {moment(event?.endDate).format("hh:mm MMM Do YY")}</span>

                </div>

                <div style={{ display: "flex" }}>

                    <Link to={`/viewEvent/${event?._id}`}>
                        <button style={{ background: "goldenRod", padding: "0 2vw", margin: "1vh 0", color: "black" }}>View Event</button>
                    </Link>

                    {attendeesToShow?.length !== 0 ? <>
                        {viewAttendees ? <button style={{ background: "red", padding: "0 2vw", margin: "1vh 1vw", color: "black" }} onClick={() => setViewAttendees(false)}>Hide Attendees</button> :
                            <>{event?.attendees?.some(att => att?.statusOnAttendence === "requested") ? <button style={{ background: "goldenRod", padding: "0 2vw", margin: "1vh 1vw", color: "black" }} onClick={() => setViewAttendees(true)}>View Attendees <span className='lookAtMe'>Event Request</span></button> :
                                <button style={{ background: "goldenRod", padding: "0 2vw", margin: "1vh 1vw", color: "black" }} onClick={() => setViewAttendees(true)}>View Attendees</button>}</>

                        }</> : ""}

                </div>

                {viewAttendees ? (

                    <div style={{ display: "flex", flexDirection: "column", border: "double black", width: "100%" }}>

                        <div> {attendeesToShow?.map(att => (
                            <>
                                <div key={att._id} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "1vh 1vw", margin: "1vh 0", background: "lightGrey" }}>

                                    <span style={{ flex: "1" }}><b>First Name: </b> {att.firstName}</span>
                                    <span style={{ flex: "1" }}><b>Last Name: </b> {att.lastName}</span>

                                    {att?.statusOnAttendence === "approved" ? <span ><b>Status For Coming:</b> {att?.statusOnAttendence === "approved" ? "✅ Approved" : ""}</span> : ""}

                                    {att?.statusOnAttendence === "requested" ? <span ><b>Status For Coming:</b> {att?.statusOnAttendence === "requested" ? "❔ Requested" : ""}</span> : ""}

                                    {att?.statusOnAttendence === "denied" ? <span ><b>Status For Coming:</b> {att?.statusOnAttendence === "denied" ? "❌ Denied" : ""}</span> : ""}

                                    <span ><b>Email:</b> {att?.email}</span>

                                    <span ><b>Bringing:</b> ({att?.bringingAlongEmails?.length})</span>
                                    <div ><b>Bringing Along Emails:</b>

                                        <div style={{ background: "white", width: "80vw", display: 'flex', flexDirection: 'column' }}>
                                            {att?.bringingAlongEmails?.map(bring => {
                                                return (
                                                    <span key={bring} style={{ margin: "0.5vh 1vw" }}>{bring}</span>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {att?.statusOnAttendence === "requested" ?
                                        <div style={{ display: "flex", margin: "1vh 0" }}>
                                            <button style={{ background: "green", padding: "0 2vw", margin: "0 1vw", color: "white" }} onClick={() => approveGuest(event?._id, att?.email)}>Approve Attendance</button>
                                            <button style={{ background: "red", padding: "0 2vw", color: "white" }} onClick={() => deniedGuest(event?._id, att?.email)}>Reject Approval</button>
                                        </div>
                                        : ""}

                                    {att?.statusOnAttendence === "approved" ?
                                        <div style={{ display: "flex", margin: "1vh 0", color: "white" }}>
                                            <button style={{ background: "red", padding: "0 2vw" }} onClick={() => deniedGuest(event?._id, att?.email)}>Remove Approval</button>
                                        </div>
                                        : ""}

                                </div>

                                <div style={{ border: "solid black", width: "100%", margin: "1vh" }}></div>
                            </>

                        ))}

                        </div>
                        <div>

                            {attendeeList?.length > 5 && !showAllAttendees && (
                                <button type="button" style={{ marginTop: "1vh", background: "green", width: "100%", color: "white", padding: "0.5rem", border: "none", cursor: "pointer", display: "inline-block", whiteSpace: "nowrap" }} onClick={() => setShowAllAttendees(true)}>Show more Attendees</button>
                            )}

                            {attendeeList?.length > 5 && showAllAttendees && (
                                <button type="button" style={{ marginTop: "1vh", background: "red", width: "100%", color: "white", padding: "0 2vw", border: "none", cursor: "pointer", display: "inline-block", whiteSpace: "nowrap" }} onClick={() => setShowAllAttendees(false)}>Show fewer Attendees</button>
                            )}
                        </div>

                    </div>) : ("")}




            </div>


        </>
    )
}

export default UserEvents
