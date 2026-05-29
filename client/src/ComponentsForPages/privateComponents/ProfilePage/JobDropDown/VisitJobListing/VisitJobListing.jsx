import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import moment from "moment";
import DOMPurify from "dompurify";

import EditJobListingDialog from "../JobListingEditDialog";
import {
    getSingleJobListing,
    updateJobListing,
} from "../../../../../redux/reducers/applicationReducers";
import NavBarNotProfile from "../../../Messages/NavBarNotProfile";
import ApplicationCard from "./ApplicationCard";

const VisitJobListing = ({ darkMode, setDarkMode, trigger, setTrigger, allLocations }) => {

    const dispatch = useDispatch();
    const { jobId } = useParams();

    const admin = useSelector((state) => state.auth.user);
    const singleJobListing = useSelector((state) => state.app.singleJobListing);

    const [openModal, setOpenModal] = useState(false);
    const [changeContent, setChangeContent] = useState("");

    const [form, setForm] = useState({
        title: "",
        location: "",
        description: "",
        requirements: "",
        responsibilities: "",
        jobType: "full-time",
        seniority: "junior",
        salaryMin: "",
        salaryMax: "",
        isActive: false,
    });

    useEffect(() => {
        if (jobId) {
            dispatch(getSingleJobListing(jobId));
        }
    }, [dispatch, jobId, trigger]);

    useEffect(() => {
        if (singleJobListing?._id) {
            setForm({
                title: singleJobListing.title || "",
                location: singleJobListing.location || "",
                description: singleJobListing.description || "",
                requirements: Array.isArray(singleJobListing.requirements)
                    ? singleJobListing.requirements.join("\n")
                    : "",
                responsibilities: Array.isArray(singleJobListing.responsibilities)
                    ? singleJobListing.responsibilities.join("\n")
                    : "",
                jobType: singleJobListing.jobType || "full-time",
                seniority: singleJobListing.seniority || "junior",
                salaryMin: singleJobListing.salaryMin || "",
                salaryMax: singleJobListing.salaryMax || "",
                isActive: !!singleJobListing.isActive,
            });
        }
    }, [singleJobListing, trigger]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const sanitizeStrings = (nextForm) => {
        const sanitized = { ...nextForm };

        Object.keys(sanitized).forEach((key) => {
            if (typeof sanitized[key] === "string") {
                sanitized[key] = DOMPurify.sanitize(sanitized[key], {
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

        return sanitized;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!singleJobListing?._id) return;

        const nextForm = sanitizeStrings({
            ...form,
            requirements: form.requirements
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
            responsibilities: form.responsibilities
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
        });

        try {
            const action = await dispatch(
                updateJobListing({
                    jobListingId: singleJobListing._id,
                    form: nextForm,
                })
            );

            setTrigger(true)

            if (action?.error) return;

            setOpenModal(false);

        } catch (error) {
            console.error("Error updating job listing:", error);
        }
    };

    const closeDialog = () => {
        setOpenModal(false);
    };

    if (!singleJobListing?._id) {
        return <div style={{ padding: "2rem" }}>Loading job listing...</div>;
    }

    return (
        <div style={{ padding: "2rem" }}>

            <NavBarNotProfile
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                user={admin}
            />

            <div style={{ width: "95vw", background: "rgba(250,235,215,0.96)", padding: "1rem 1vw", margin: "1vh 1vw" }}>

                <h1 style={{ textAlign: "center" }}>{singleJobListing?.title}</h1>

                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                    <b>Posted:</b>{" "}
                    {moment(singleJobListing?.createdAt).format("hh:mm MMM Do YY")}
                </div>

                <h4 style={{ textAlign: "center" }}>
                    <b>Location:</b> {singleJobListing.location}
                </h4>

                <div
                    style={{ margin: "1rem 0" }}
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(singleJobListing.description || ""),
                    }}
                />

                <div style={{ marginBottom: "1rem" }}>
                    <div>
                        <b>Job Type:</b> {singleJobListing.jobType}
                    </div>

                    <div>
                        <b>Seniority:</b> {singleJobListing.seniority}
                    </div>

                    <div>
                        <b>Minimum Salary:</b> {singleJobListing.salaryMin || "Not Provided"}
                    </div>

                    <div>
                        <b>Maximum Salary:</b> {singleJobListing.salaryMax || "Not Provided"}
                    </div>

                    <div>
                        <b>Status:</b> {singleJobListing.isActive ? "Active" : "Not Active"}
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-around", margin: "1vh 0" }} className="responsiveJob">

                    <div style={{ border: "10px double black", display: "flex", flexDirection: "column", width: "45%", background: "white", padding: "1vh 1vw" }} className="responsiveJob">

                        <b style={{ margin: "1vh 1vw" }}>Posted Requirements:</b>

                        <div style={{ margin: "0.5vh 2vw" }}>
                            {singleJobListing?.requirements?.map((req, idx) => (
                                <div key={`${singleJobListing._id}-req-${idx}`}>{req}</div>
                            ))}
                        </div>

                    </div>

                    <div style={{ border: "10px double black", display: "flex", flexDirection: "column", width: "45%", background: "white", padding: "1vh 1vw" }} className="responsiveJob">

                        <b style={{ margin: "1vh 1vw" }}>Posted Responsibilities:</b>

                        <div style={{ margin: "0.5vh 2vw" }}>
                            {singleJobListing?.responsibilities?.map((res, idx) => (
                                <div key={`${singleJobListing._id}-res-${idx}`}>{res}</div>
                            ))}
                        </div>

                    </div>

                </div>

                <div style={{ display: "flex", flexDirection: "column", margin: "1vh 1vw" }}>

                    {admin?._id !== singleJobListing?.userId?._id ? (
                        <Link to={`/messagePage/${singleJobListing?.userId?._id}`}>
                            <button style={{ background: "goldenRod", width: "100%" }}>
                                Message Job Posting Author
                            </button>
                        </Link>
                    ) : (
                        <button style={{ background: "red", width: "100%" }} disabled>
                            Your Job Posting
                        </button>
                    )}

                    <button
                        style={{ background: "dodgerblue", width: "100%", color: "white", margin: "1vh 0" }}
                        onClick={() => setOpenModal(true)}
                    >
                        Edit Posting
                    </button>

                </div>

                <div style={{ margin: "1vh" }}>
                    <div onClick={() => setChangeContent("")}>
                        <b>Applications Attached: </b> ({singleJobListing.applicationsAttached.length})
                    </div>
                </div>

                {changeContent === "" ?
                    <>
                        {singleJobListing?.applicationsAttached?.slice()?.reverse()?.map(app => {

                            return (
                                <ApplicationCard
                                    key={app?._id}
                                    app={app}
                                    singleJobListing={singleJobListing}
                                    setTrigger={setTrigger}
                                    allLocations={allLocations}
                                />
                            )
                        })}
                    </>
                    : ""}

                <dialog open={openModal}>
                    <EditJobListingDialog
                        selectedJob={singleJobListing}
                        form={form}
                        handleChange={handleChange}
                        handleSubmit={handleUpdate}
                        closeDialog={setOpenModal}
                    />
                </dialog>

            </div>

        </div>
    );
};

export default VisitJobListing;