import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllJobListings, searchJobs } from "../../../redux/reducers/applicationReducers";
import VoulunteerCard from "./VoulunteerCard";
import PaidJobCard from "./PaidJobCard";

const JoinLandingContent = ({ darkMode, setDarkMode, data, setData }) => {

    const dispatch = useDispatch();

    const allJobs = useSelector(state => state.app.allJobs);
    const searchedJobs = useSelector(state => state?.app?.searchedJobs || []);

    const [searchInput, setSearchInput] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [showCount, setShowCount] = useState(5);

    useEffect(() => {
        dispatch(getAllJobListings());
    }, [dispatch]);

    const activeJobs = useMemo(() => {
        return (allJobs || []).filter(job => job?.isActive);
    }, [allJobs]);

    const volunteerJobs = useMemo(() => {
        return activeJobs.filter(job => job?.jobType === "volunteer");
    }, [activeJobs]);

    const paidJobs = useMemo(() => {
        return activeJobs.filter(job => job?.jobType !== "volunteer");
    }, [activeJobs]);

    const searchedVolunteerJobs = useMemo(() => {
        return (searchedJobs || []).filter(job => job?.isActive && job?.jobType === "volunteer");
    }, [searchedJobs]);

    const searchedPaidJobs = useMemo(() => {
        return (searchedJobs || []).filter(job => job?.isActive && job?.jobType !== "volunteer");
    }, [searchedJobs]);

    const searchedAllJobs = useMemo(() => {
        return (searchedJobs || []).filter(job => job?.isActive);
    }, [searchedJobs]);

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

    const displayedJobs = useMemo(() => {

        if (searchInput.trim() !== "" && hasSearched) {

            if (data === "Volunteer") return searchedVolunteerJobs;

            if (data === "paid") return searchedPaidJobs;

            return searchedAllJobs;
        }

        if (data === "Volunteer") return volunteerJobs;

        if (data === "paid") return paidJobs;

        return activeJobs;

    }, [searchInput, hasSearched, data, searchedVolunteerJobs, searchedPaidJobs, searchedAllJobs, volunteerJobs, paidJobs, activeJobs]);

    const visibleJobs = displayedJobs?.slice(0, showCount) || [];

    const noResults = searchInput.trim() !== "" && hasSearched && displayedJobs.length === 0;

    const highlightText = (text) => {

        if (!searchInput.trim()) return text;

        const term = searchInput.trim();
        const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const parts = String(text || "").split(new RegExp(`(${safe})`, "gi"));

        return parts.map((part, index) =>
            part.toLowerCase() === term.toLowerCase()
                ? <span key={index} style={{ background: "purple", fontWeight: "bold", color: "white" }}>{part}</span>
                : part
        );
    };

    return (
        <div style={{ height: "84.1vh", overflow: "scroll", display: "flex", flexDirection: "column", alignItems: "center" }} className={darkMode ? "scrollBar QADark" : "scrollBar QAWhite"}>

            <div style={{ background: "white", width: "100%", display: "flex", justifyContent: "space-evenly", alignItems: "center", padding: "1vh 0" }}>

                <button className='rounded' style={{ background: data === "" ? "lightGrey" : "goldenRod", border: data === "" ? "solid goldenrod" : "none", padding: "0 1vw", margin: "0 1vw", width: "25%" }} onClick={() => { setData(""); setShowCount(5); }}>
                    All
                </button>

                <button className='rounded' style={{ background: data === "Volunteer" ? "lightGrey" : "goldenRod", border: data === "Volunteer" ? "solid goldenrod" : "none", padding: "0 1vw", margin: "0 1vw", width: "25%" }} onClick={() => { setData("Volunteer"); setShowCount(5); }}>
                    Volunteer
                </button>

                <button className='rounded' style={{ background: data === "paid" ? "lightGrey" : "goldenRod", border: data === "paid" ? "solid goldenrod" : "none", padding: "0 1vw", margin: "0 1vw", width: "25%" }} onClick={() => { setData("paid"); setShowCount(5); }}>
                    Jobs
                </button>

            </div>

            <div style={{ width: "100%", textAlign: "center", margin: "1vh 0", background: "lightGrey", padding: "1vh 0" }}>

                <input
                    type="text"
                    value={searchInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search Job Postings..."
                    style={{ width: "60%", height: "4vh", border: "solid black", background: "white", margin: "1vh 0" }}
                />

                <div onClick={handleSearch} style={{ background: "goldenRod", height: "4vh", padding: "0 2vw", width: "60%", margin: "0 auto", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
                    🔍 Search
                </div>

            </div>

            <h1 style={{ width: "100%", textAlign: "center", background: "rgba(255, 255, 255, 0.845)" }}>
                {data === "Volunteer" ? "Volunteer Job Postings" : data === "paid" ? "Job Postings" : "All Job Postings"}
            </h1>

            {noResults ? (
                <h2 style={{ width: "100%", textAlign: "center", background: "rgba(255, 255, 255, 0.845)", color: "black" }}>
                    No Job Postings Found
                </h2>
            ) : visibleJobs.length === 0 ? (
                <h2 style={{ width: "100%", textAlign: "center", background: "rgba(255, 255, 255, 0.845)", color: "black" }}>
                    No Active Job Postings
                </h2>
            ) : (
                visibleJobs.map(job => {

                    if (job?.jobType === "volunteer") {
                        return <VoulunteerCard key={job._id} job={job} highlightText={highlightText} />;
                    }

                    return <PaidJobCard key={job._id} job={job} highlightText={highlightText} />;

                })
            )}

            <div style={{ width: "100%", textAlign: "center", marginTop: "1vh" }}>

                {showCount < displayedJobs.length && (
                    <button onClick={() => setShowCount(prev => prev + 5)} style={{ width: "100%", margin: "1vh 0", backgroundColor: "goldenrod", color: "black" }}>
                        Show (5) More Job Postings
                    </button>
                )}

                {showCount > 5 && (
                    <button onClick={() => setShowCount(prev => Math.max(prev - 5, 5))} style={{ width: "100%", margin: "1vh 0", backgroundColor: "maroon", color: "white" }}>
                        Show (-5) Fewer Job Postings
                    </button>
                )}

            </div>

        </div>
    );
};

export default JoinLandingContent;