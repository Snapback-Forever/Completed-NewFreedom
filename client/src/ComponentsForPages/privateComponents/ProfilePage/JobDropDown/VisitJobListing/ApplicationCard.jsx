import React, { useState } from 'react'

import moment from "moment";
import DOMPurify from "dompurify";
import { useDispatch, useSelector } from 'react-redux';
import { toggleJobApplicationSeenStatus } from '../../../../../redux/reducers/applicationReducers';
import ReviewedApplication from './ReviewedApplication';
import { Link } from 'react-router-dom';
import SchedualInterview from './SchedualInterview';
import InterviewCard from './InterviewCard';

const ApplicationCard = ({ app, singleJobListing, setTrigger, allLocations }) => {



    const dispatch = useDispatch()

    const admin = useSelector(state => state.auth.user)

    const [showImage, setShowImage] = useState(false)
    const [changeContent, setChangeContent] = useState("")

    const baseUrl = "http://localhost:8080";
    const fileUrl = app?.resumeFileId && app?.resumeBucketName ? `${baseUrl}/upload/image/${app.resumeFileId}?bucketName=${app.resumeBucketName}` : app?.resumeUrl;
    const isImage = app?.resumeBucketName === "images";



    const makeMeSeen = (applicationId) => {


        dispatch(toggleJobApplicationSeenStatus(applicationId))
        setTrigger(true)
    }



    return (

        <div style={{ border: "10px double black", margin: "1vh 1vw", padding: "1vh 1vw", background: "white" }}>
            <div style={{ display: "flex", justifyContent: "end" }}>
                <span style={{ fontSize: "small" }}><b>Created Date:</b> {moment(app?.createdAt).format("hh:mm MMM Do YY")} </span>
            </div>
            <h3><b>FirstName:</b> {app?.firstName}</h3>
            <h3><b>LastName:</b> {app?.lastName}</h3>
            <h6><b>Email:</b> {app?.email}</h6>
            <h6><b>Phone Number:</b> {app?.phone}</h6>

            <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>

                {app?.resumeFileId && app?.resumeBucketName ? (
                    <div style={{ display: "flex" }}>
                        <h3>Resume File:</h3>
                        {app?.resumeBucketName === "images" ? (
                            <img
                                src={fileUrl}
                                style={{ minWidth: "50vw", maxWidth: "50vw", minHeight: "50vh", maxHeight: "50vh", margin: "0 0.5vw" }}
                                className={showImage ? "drawHover" : ""}
                                onClick={() => setShowImage((prev) => !prev)}
                                alt="Resume"
                            />
                        ) : (
                            <a style={{ fontSize: "1.5em", margin: "0 0.5vw" }} href={fileUrl} target="_blank" rel="noreferrer">Open / Download Resume</a>
                        )}
                    </div>
                ) : null}



                {app.resume.education.length !== 0 ?
                    <>
                        <div style={{ border: "solid black", display: "flex", flexDirection: "column", alignItems: "center", margin: "0.5vh 0" }}>
                            <label><b>Education:</b> </label>
                            <h6>{app.resume?.education.map(ed => {
                                return (
                                    <h6 key={ed}>{ed}</h6>
                                )
                            })}</h6>
                        </div></> : ""}

                {app.resume.experience?.length !== 0 ?
                    <>
                        <div style={{ border: "solid black", display: "flex", flexDirection: "column", alignItems: "center", margin: "0.5vh 0" }}>
                            <label><b>Experience:</b> </label><h6>{app.resume.experience?.map(ex => {
                                return (
                                    <h6>{ex}</h6>
                                )
                            })}</h6>
                        </div>
                    </>
                    : ""}

                {app.resume.skills.length !== 0 ?
                    <>
                        <div style={{ border: "solid black", display: "flex", flexDirection: "column", alignItems: "center", margin: "0.5vh 0" }}>
                            <label><b>Skills:</b> </label><h6>{app.resume.skills?.map(skill => {
                                return (
                                    <h6 key={skill}>{skill}</h6>
                                )
                            })}</h6>
                        </div>
                    </>
                    : ""}

            </div>

            {changeContent === "review" ? <h3 onClick={() => setChangeContent("")} style={{ margin: "1vh 1vw" }}><b>❌ Application Reviewed By: </b> ({app?.reviewedBy.length})</h3> : <h3 onClick={() => setChangeContent("review")} style={{ margin: "1vh 1vw" }}><b>Application Reviewed By: </b> ({app?.reviewedBy.length})</h3>}

            <div style={{ display: "flex", flexWrap: "wrap" }}>

                {changeContent === "interview" ? <h3 onClick={() => setChangeContent("")} style={{ margin: "1vh 0.5vw" }}><b>❌ Interviews Scheduled: </b> ({app?.interviews.length})</h3> : <h3 onClick={() => setChangeContent("interview")} style={{ margin: "1vh 0.5vw" }}><b>Interviews Scheduled: </b> ({app?.interviews.length})</h3>}

                {app?.interviews.length === 0 ? <h3><button style={{ margin: "1vh 0.5vw", width: "fit-content", background: "lime", padding: "0 1vw" }} className='rounded' onClick={() => setChangeContent("reviewed")}>Submit A Review To Schedule Interview.</button></h3> : ""}
            </div>

            {changeContent === "review" ?
                <div style={{ border: "10px double black", padding: "1vh 1vw", margin: "1vh 1vw", width: "100%" }}>
                    <b>Reviews From Users: </b>
                    {app?.reviewedBy.length === 0 ?
                        <h4>Currently Not Reviewed</h4> : <>
                            {app?.reviewedBy?.map(rev => {

                                return (

                                    <>
                                        <div style={{ border: "solid black", padding: "1vh 1vw", margin: "0.5vh 1vw", width: "98%" }} key={rev?._id}>
                                            <h4 style={{ textAlign: "center" }}>Account Name: {rev?.name}</h4>
                                            <h6 style={{ textAlign: "center" }}><b>Role:</b> {rev?.role}</h6>
                                            <h6><b>Comment:</b> {rev?.comment}</h6>

                                            {rev?.userId !== admin?._id ?
                                                <Link to={`/messagePage/${rev?.userId}`} style={{ width: "100%" }}>
                                                    <button style={{ background: "lightBlue" }}>Message Reviewer</button>
                                                </Link> :
                                                <div style={{ background: "red", width: "100%", textAlign: "center" }}>Your Review
                                                    {app?.interviews.length === 0 ?
                                                        <button style={{ background: "goldenRod", margin: "0.5vh 0", width: "100%" }} className='lookAtMe' onClick={() => setChangeContent("makeInterview")}>Scheduled An Interview?</button>
                                                        : ""}
                                                </div>
                                            }

                                        </div>

                                        <div style={{ border: "solid black", margin: "1vh 0" }}></div>

                                    </>
                                )
                            })}
                        </>}
                </div>
                : ""}

            {changeContent === "makeInterview" ?
                <div style={{ border: "10px double black", padding: "1vh 1vw", margin: "1vh 1vw" }}>
                    <SchedualInterview singleJobListing={singleJobListing} app={app} setTrigger={setTrigger} allLocations={allLocations} setChangeContent={setChangeContent} />

                </div>
                : ""}

            {changeContent === "interview" ?
                <div style={{ border: "10px double black", padding: "1vh 1vw", margin: "1vh 1vw" }}>
                    <b>Interviews For This Application:</b>
                    {app?.interviews?.map(int => {

                        return (
                            <InterviewCard int={int} setTrigger={setTrigger} key={int?._id} app={app} />
                        )
                    })
                    }

                </div>
                : ""}


            {singleJobListing?.userId._id === admin?._id ? <> {!app?.seenByAuthor ?
                <button style={{ background: "lime", width: "100%", margin: "0.5vh 0" }} onClick={() => makeMeSeen(app?._id)}>Mark Seen</button>
                :
                <>
                    <div style={{ display: "flex", flexDirection: "column", padding: "1vh 1vw", background: "lightGrey" }}>
                        <span><b>Seen Date:</b> {moment(app?.seenAt).format("hh:mm MMM Do YY")} </span>
                        <button style={{ background: "red", width: "100%", margin: "0.5vh 0" }} onClick={() => makeMeSeen(app?._id)}>Un See Me</button>
                    </div>
                </>
            }
            </> : ""
            }

            {changeContent === "reviewed" ?
                <button style={{ margin: "0.5vh 0", width: "100%", background: "red", height: "5vh" }} onClick={() => setChangeContent("")}>
                    Cancel Review Of Application
                </button> :
                <button style={{ margin: "0.5vh 0", width: "100%", background: "goldenRod", height: "5vh" }} onClick={() => setChangeContent("reviewed")}>
                    Submit A Review Of Application
                </button>
            }

     


            {changeContent === "reviewed" ?
                <div style={{ border: "10px double black", padding: "1vh 1vw", margin: "1vh 1vw" }}>

                    <ReviewedApplication singleJobListing={singleJobListing} app={app} setTrigger={setTrigger} setChangeContent={setChangeContent} />

                </div>
                : ""}







        </div>
    )
}

export default ApplicationCard
