import React, { useEffect, useRef, useState } from 'react'
import moment from "moment";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { deleteJobListingAndApplications } from '../../../../../redux/reducers/applicationReducers';

const JobListingCard = ({ job, allJobListings, openEditModal, setTrigger }) => {

    const dispatch = useDispatch()

    const admin = useSelector((state) => state.auth.user);

    const clickCountRef = useRef(0);
    const clickTimerRef = useRef(null);

    const deleteThisJob = (jobId) => {
        clickCountRef.current += 1;

        if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

        clickTimerRef.current = setTimeout(() => {
            clickCountRef.current = 0;
        }, 700);

        if (clickCountRef.current === 3) {
            dispatch(deleteJobListingAndApplications(jobId));
            setTrigger(true);
            clickCountRef.current = 0;
            clearTimeout(clickTimerRef.current);
        }
    };

    const [badgeText, setBadgeText] = useState("New");

    useEffect(() => {

        const jobs = allJobListings?.filter(job => admin?._id === job?.userId?._id) || [];

        const hasNewApplications = jobs.some(job =>
            job?.applicationsAttached?.some(app => app?.seenByAuthor === false)
        );

        const hasTodayInterview = jobs.some(job =>
            job?.applicationsAttached?.some(app =>
                app?.interviews?.some(interview =>
                    new Date(interview?.scheduledAt).toDateString() === new Date().toDateString()
                )
            )
        );

        if (!hasNewApplications && !hasTodayInterview) {
            setBadgeText("");
            return;
        }

        // only new applications
        if (hasNewApplications && !hasTodayInterview) {
            setBadgeText("New App");
            return;
        }

        // only interviews today
        if (!hasNewApplications && hasTodayInterview) {
            setBadgeText("Interview Today");
            return;
        }

        // both exist
        const interval = setInterval(() => {
            setBadgeText(prev => prev === "New App" ? "Interview Today" : "New App");
        }, 2500);

        return () => clearInterval(interval);

    }, [allJobListings, admin]);

    return (
        <div key={job?._id} style={{ width: "96vw", background: "rgba(250,235,215,0.96)", padding: "1rem 1vw", margin: "1vh 1vw" }}>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "small" }}>
                    {moment(job?.createdAt).format("hh:mm MMM Do YY")}
                </span>
                <span>
                    <b>Job Type:</b> {job?.jobType}
                </span>
            </div>

            <div>
                <h2 style={{ textAlign: "center" }}>{job?.title}</h2>

                <h6 style={{ textAlign: "center" }}>
                    <b>Posting Location:</b> {job?.location}
                </h6>

                <div
                    style={{ width: "100%", padding: "2vw" }}
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(job?.description || ""),
                    }}
                />

                <div style={{ display: "flex", flexDirection: "column", margin: "1vh 1vw" }}>
                    <div>
                        <b>Minimum Salary:</b>{" "}
                        {job?.salaryMin !== "" ? job?.salaryMin : "Not Provided"}
                    </div>

                    <div>
                        <b>Max Salary:</b>{" "}
                        {job?.salaryMax !== "" ? job?.salaryMax : "Not Provided"}
                    </div>

                    <div>
                        <b>Seniority:</b>{" "}
                        {job?.seniority !== "" ? job?.seniority : "Not Provided"}
                    </div>

                    <div>
                        <b>Posting Status:</b> {job?.isActive ? "Active" : "Not Active"}
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-around", margin: "1vh 0" }} className="responsiveJob">

                    <div
                        style={{ border: "10px double black", display: "flex", flexDirection: "column", width: "45%", background: "white", padding: "1vh 1vw" }}
                        className="responsiveJob"
                    >
                        <b style={{ margin: "1vh 1vw" }}>Posted Requirements:</b>

                        <div style={{ margin: "0.5vh 2vw" }}>
                            {job?.requirements?.map((req, idx) => (
                                <div key={`${job._id}-req-${idx}`}>{req}</div>
                            ))}
                        </div>
                    </div>

                    <div
                        style={{ border: "10px double black", display: "flex", flexDirection: "column", width: "45%", background: "white", padding: "1vh 1vw" }}
                        className="responsiveJob"
                    >
                        <b style={{ margin: "1vh 1vw" }}>Posted Responsibilities:</b>

                        <div style={{ margin: "0.5vh 2vw" }}>
                            {job?.responsibilities?.map((res, idx) => (
                                <div key={`${job._id}-res-${idx}`}>{res}</div>
                            ))}
                        </div>
                    </div>

                </div>

                <div style={{ display: "flex", flexDirection: "column", margin: "1vh 1vw" }}>

                    {admin?._id !== job?.userId?._id ? (
                        <Link to={`/messagePage/${job?.userId?._id}`} style={{ width: "100%", color: "black" }}>
                            <button style={{ background: "goldenRod", width: "100%" }}>
                                Message Job Posting Author
                            </button>
                        </Link>
                    ) : (
                        <div style={{ background: "red", width: "100%", textAlign: "center" }} disabled>
                            Your Job Posting
                        </div>
                    )}

                    {admin?._id === job?.userId?._id || admin?.creator || admin?.NFadmin ? (
                        <button
                            style={{ background: "dodgerblue", width: "100%", margin: "1vh 0" }}
                            onClick={() => openEditModal(job)}
                        >
                            Edit Job Posting
                        </button>
                    ) : ""}

                </div>

                {job?.applicationsAttached?.length ? (
                    <Link to={`/visitJobListing/${job?._id}`}>
                        <button style={{ background: "green", width: "100%", margin: "1vh 0", color: "white", padding: "1vh 0" }}>
                            See Applications Attached ({job.applicationsAttached.length}){" "}
                            {allJobListings?.filter(job => admin?._id === job?.userId?._id).some(job => job?.applicationsAttached?.some(app => app?.seenByAuthor === false || app?.interviews?.some(interview => new Date(interview?.scheduledAt).toDateString() === new Date().toDateString()))) ? (
                                <span className="lookAtMe">{badgeText}</span>
                            ) : null}
                        </button>
                    </Link>
                ) : (
                    <b>No Applications Attached</b>
                )}

            </div>

            <div style={{ display: "flex", justifyContent: "end" }}>
                {job?.userId._id === admin?._id || admin?.creator || admin?.NFadmin ?
                    <button style={{ background: "red", padding: "0 2vw" }} onClick={() => deleteThisJob(job?._id)}>
                        Delete JobListing
                    </button>
                    : ""}
            </div>

        </div>
    )
}

export default JobListingCard