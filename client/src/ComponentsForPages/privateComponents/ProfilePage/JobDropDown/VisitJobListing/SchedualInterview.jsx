import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addInterviewToJobApplication } from "../../../../../redux/reducers/applicationReducers";
import LocationModal from "./LocationModal";

const SchedualInterview = ({ singleJobListing, app, setTrigger, allLocations, setChangeContent }) => {

    const dispatch = useDispatch();

    console.log("allLocations", allLocations);
    const admin = useSelector(state => state.auth.user)
    const successMessage = useSelector(state => state.app.successMessage)
    console.log(successMessage)

    const [showLocationModal, setShowLocationModal] = useState(false);
    const [form, setForm] = useState({
        scheduledAt: "",
        interviewer: admin?._id,
        location: "",
        locationId: "",
        type: "onsite",
        notes: "",
        status: "scheduled",
    });

    const labelStyle = { width: "100%", textAlign: "center", fontWeight: "bold", display: "flex", justifyContent: "center", gap: "0.5vw" };
    const inputStyle = { border: "solid lightGrey", background: "white", width: "100%", margin: "0.5vh 0" };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectLocation = (location) => {
        setForm((prev) => ({
            ...prev,
            locationId: location?._id || "",
            location: location?.locationName || location?.name || "",
        }));
        setShowLocationModal(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addInterviewToJobApplication({ jobAppId: app?._id, form }));
      
    };

    useEffect(()=> {
if(successMessage === "Interview added successfully!") {
    setChangeContent("interview") 
     setTrigger(true);
}
    },[successMessage])

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label style={labelStyle}>Interview Date:</label>
                <input style={inputStyle}  type="datetime-local" name="scheduledAt" value={form?.scheduledAt} onChange={handleChange} required />

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={labelStyle}>Location:</label>
                    <input style={inputStyle} type="text" name="location" value={form.location} readOnly placeholder="Select a location" required />
                    <button type="button" onClick={() => setShowLocationModal(true)} style={{ background: "green" }}>All Locations</button>
                </div>

                <label style={labelStyle}>Type:</label>
                <select style={inputStyle} name="type" value={form.type} onChange={handleChange}><option value="phone">phone</option><option value="video">video</option><option value="onsite">onsite</option></select>

                <label style={labelStyle}>Notes:</label>
                <textarea style={inputStyle} name="notes" value={form.notes} onChange={handleChange} rows="4" />

                <h3 style={{ textAlign: "center", width: "100%" }}><b><u>* Before You Submit, EMAIL The Applicant With The Interview Date *</u></b></h3>
                <div style={{ textAlign: "center", marginTop: "1rem", background: "lime" }}><button type="submit">Schedule Interview</button></div>
            </form>

            {showLocationModal ?
                <LocationModal allLocations={allLocations} onSelectLocation={handleSelectLocation} onClose={() => setShowLocationModal(false)} />
                : null}
        </div>
    );
};

export default SchedualInterview;
