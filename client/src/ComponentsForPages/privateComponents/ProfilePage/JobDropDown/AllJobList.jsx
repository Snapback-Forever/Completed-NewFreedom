import React, { useMemo, useState } from "react";
import moment from "moment";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EditJobListingDialog from "./JobListingEditDialog";
import { searchJobs, updateJobListing } from "../../../../redux/reducers/applicationReducers";
import JobListingCard from "./VisitJobListing/JobListingCard";

// import your thunk from the correct file
// import { updateJobListing } from "../store/yourSlice";

const AllJobList = ({ allJobListings, setTrigger, darkMode }) => {
    const dispatch = useDispatch();
    const admin = useSelector((state) => state.auth.user);
    const searchedJobs = useSelector((state) => state?.app?.searchedJobs || []);
    const [openModal, setOpenModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [changeContent, setChangeContent] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

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

    const [showCount, setShowCount] = useState(5);

    const allJobs = useMemo(() => {
        return (allJobListings || []).filter(Boolean);
    }, [allJobListings]);

    const yourJobs = useMemo(() => {
        return (allJobListings || []).filter((job) => admin?._id === job?.userId?._id);
    }, [allJobListings, admin?._id]);

    const sanitizeStrings = (nextForm) => {
        const sanitized = { ...nextForm };

        Object.keys(sanitized).forEach((key) => {
            if (typeof sanitized[key] === "string") {
                sanitized[key] = DOMPurify.sanitize(sanitized[key], {
                    FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input", "button", "link", "meta", "base"],
                    FORBID_ATTR: ["onerror", "onload", "onclick"],
                });
            }
        });

        return sanitized;
    };

    const openEditModal = (job) => {
        setSelectedJob(job);

        setForm({
            title: job?.title || "",
            location: job?.location || "",
            description: job?.description || "",
            requirements: Array.isArray(job?.requirements) ? job.requirements.join("\n") : "",
            responsibilities: Array.isArray(job?.responsibilities) ? job.responsibilities.join("\n") : "",
            jobType: job?.jobType || "full-time",
            seniority: job?.seniority || "junior",
            salaryMin: job?.salaryMin || "",
            salaryMax: job?.salaryMax || "",
            isActive: !!job?.isActive,
        });

        setOpenModal(true);
    };

    const closeDialog = () => {
        setOpenModal(false);
        setSelectedJob(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!selectedJob?._id) return;

        const nextForm = sanitizeStrings({
            ...form,
            requirements: form.requirements.split("\n").map((item) => item.trim()).filter(Boolean),
            responsibilities: form.responsibilities.split("\n").map((item) => item.trim()).filter(Boolean),
        });

        try {
            const action = await dispatch(updateJobListing({ jobListingId: selectedJob._id, form: nextForm }));
            setTrigger(true);

            if (action?.error) return;

            closeDialog();
        } catch (error) {
            console.error("Error updating job listing:", error);
        }
    };

    const handleSearch = () => {
        const value = searchInput.trim();
        setHasSearched(true);
        setShowCount(5);
        if (!value) return;
        dispatch(searchJobs(value));
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        if (value.trim() === "") {
            setHasSearched(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    const displayedJobs = searchInput.trim() !== "" && hasSearched ? searchedJobs : (changeContent === "you" ? yourJobs : allJobs);
    const visibleJobs = displayedJobs?.slice(0, showCount) || [];
    const noResults = searchInput.trim() !== "" && hasSearched && displayedJobs.length === 0;

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", width: "99vw" }}>
                <button style={{ background: "goldenRod", margin: "0.5vh 0", width: "100%" }} onClick={() => setChangeContent("you")}>Your Job Listings</button>
                <button style={{ background: "goldenRod", margin: "0.5vh 0", width: "100%" }} onClick={() => setChangeContent("")}>All Job Listings</button>
            </div>

            <div style={{ width: "100%", textAlign: "center", margin: "1vh 0", background: 'lightGrey', padding: "1vh 0" }}>
            <input
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search Job Postings..."
              style={{ width: "60%", height: "4vh", border: "solid black", background: "white", margin: "1vh 0" }}
            />
            <div onClick={handleSearch} style={{ background: "goldenRod", height: "4vh", padding: "0 2vw" }}>🔍 Search</div>
          </div>

            {changeContent === "" ? (
                <>
                    <h2 style={{ textAlign: "center", background: "rgba(255, 255, 255, 0.845)" }}>All Job Listings</h2>

                    {noResults ? (
                        <h2 style={{ textAlign: "center", color: darkMode ? "white" : "black" }}>No Job Listings Found</h2>
                    ) : (
                        visibleJobs.map((job) => (
                            <JobListingCard key={job._id} job={job} allJobListings={allJobListings} openEditModal={openEditModal} setTrigger={setTrigger} />
                        ))
                    )}

                    <div style={{ textAlign: "center", marginTop: "8px" }}>
                        {showCount < displayedJobs.length && (
                            <button onClick={() => setShowCount((prev) => prev + 10)} style={{ width: "100%", margin: "1vh 0", backgroundColor: "goldenrod", color: "black", marginRight: "6px" }}>
                                Show (5) More JobListings
                            </button>
                        )}

                        {showCount > 10 && (
                            <button onClick={() => setShowCount((prev) => Math.max(prev - 10, 10))} style={{ width: "100%", margin: "1vh 0", backgroundColor: "maroon", color: "white" }}>
                                Show (-5) Fewer JobListings
                            </button>
                        )}
                    </div>
                </>
            ) : null}

            {changeContent === "you" ? (
                <>
                    <h2 style={{ textAlign: "center",  background: "rgba(255, 255, 255, 0.845)" }}>Your Job Listings</h2>

                    {noResults ? (
                        <h2 style={{ textAlign: "center", color: darkMode ? "white" : "black" }}>No Job Listings Found</h2>
                    ) : (
                        visibleJobs.map((job) => (
                            <JobListingCard key={job._id} job={job} allJobListings={allJobListings} openEditModal={openEditModal} />
                        ))
                    )}

                    <div style={{ textAlign: "center", marginTop: "8px" }}>
                        {showCount < displayedJobs.length && (
                            <button onClick={() => setShowCount((prev) => prev + 10)} style={{ width: "100%", margin: "1vh 0", backgroundColor: "goldenrod", color: "black", marginRight: "6px" }}>
                                Show (5) More JobListings
                            </button>
                        )}

                        {showCount > 10 && (
                            <button onClick={() => setShowCount((prev) => Math.max(prev - 10, 10))} style={{ width: "100%", margin: "1vh 0", backgroundColor: "maroon", color: "white" }}>
                                Show (-5) Fewer JobListings
                            </button>
                        )}
                    </div>
                </>
            ) : null}

            <dialog open={openModal}>
                <EditJobListingDialog selectedJob={selectedJob} form={form} handleChange={handleChange} handleSubmit={handleUpdate} closeDialog={setOpenModal} setTrigger={setTrigger} />
            </dialog>
        </div>
    );
};

export default AllJobList;
