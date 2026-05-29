import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMailEntry } from "../../../../../redux/reducers/menteeReducers";

const EditMenteeModal = ({ mentee, setTrigger, setEditMentee }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        currentLocation: "",
        sex: "",
        dateOfBirth: "",
        projectedReleaseDate: "",
        maxReleaseDate: "",
        currentCharge: "",
        currentInsurance: "",
        lastContact: "",
        status: "",
        programStatus: ""
    });

    useEffect(() => {
        if (mentee) {
            setForm({
                firstName: mentee.firstName || "",
                lastName: mentee.lastName || "",
                email: mentee.email || "",
                phoneNumber: mentee.phoneNumber || "",
                currentLocation: mentee.currentLocation || "",
                sex: mentee.sex || "",
                dateOfBirth: mentee.dateOfBirth ? mentee.dateOfBirth.slice(0, 10) : "",
                projectedReleaseDate: mentee.projectedReleaseDate ? mentee.projectedReleaseDate.slice(0, 10) : "",
                maxReleaseDate: mentee.maxReleaseDate ? mentee.maxReleaseDate.slice(0, 10) : "",
                currentCharge: mentee.currentCharge || "",
                currentInsurance: mentee.currentInsurance || "",
                lastContact: mentee.lastContact || "",
                status: mentee.status || "",
                programStatus: mentee.programStatus || ""
            });
        }
    }, [mentee]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            mailId: mentee?._id,
            userId: user?._id,
            ...form   // 🔥 FIX: FLATTENED (THIS IS THE IMPORTANT FIX)
        };

        dispatch(updateMailEntry(payload));
        setTrigger(true);
        setEditMentee(false);
    };

    if (!mentee) return null;

    const labelStyle = { width: "80%", fontWeight: "bold", display: "flex", margin: "1vh 0" };
    const inputStyle = { border: "solid lightGrey", background: "white", width: "80%" };

    return (
        <div className="editMenteeModal">
            <button style={{ fontSize: "2rem" }} onClick={() => setEditMentee(false)}>❎</button>

            <form
                onSubmit={handleSubmit}
                style={{ width: "100%", height: "80vh", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                <h1 style={{ textAlign: "center" }}>Edit Mentee User</h1>

                <label style={labelStyle}>First Name:</label>
                <input name="firstName" value={form?.firstName} onChange={handleChange} style={inputStyle} />

                <label style={labelStyle}>Last Name:</label>
                <input name="lastName" value={form?.lastName} onChange={handleChange} style={inputStyle} />

                <label style={labelStyle}>Email:</label>
                <input name="email" value={form?.email} onChange={handleChange} style={inputStyle} />

                <label style={labelStyle}>Phone Number:</label>
                <input name="phoneNumber" value={form?.phoneNumber} onChange={handleChange} style={inputStyle} />

                <label style={labelStyle}>Current Location</label>
                <input name="currentLocation" value={form?.currentLocation} onChange={handleChange} style={inputStyle} />

                <label style={labelStyle}>Gender:</label>
                <select name="sex" value={form?.sex} onChange={handleChange} style={inputStyle}>
                    <option value="">-- Select Sex --</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                <label style={labelStyle}>Date Of Birth</label>
                <input type="date" name="dateOfBirth" value={form?.dateOfBirth} onChange={handleChange} style={inputStyle} />

                <label style={labelStyle}>Current Charge:</label>
                <input name="currentCharge" value={form?.currentCharge} onChange={handleChange} style={inputStyle} />

                <label style={labelStyle}>Current Insurance:</label>
                <input name="currentInsurance" value={form?.currentInsurance} onChange={handleChange} style={inputStyle} />

                <label style={labelStyle}>Program Status:</label>
                <select name="programStatus" value={form?.programStatus} onChange={handleChange} style={inputStyle}>
                    <option value="">Program Status</option>
                    <option value="incarcerated">Incarcerated</option>
                    <option value="attendingProgram">Attending Program</option>
                    <option value="Did-Not-Arrive">Did Not Arrive</option>
                    {user?.creator || user?.NFadmin ? <option value="removedFromProgram">Removed</option> : ""}
                    <option value="quitProgram">Quit</option>
                    <option value="completedProgram">Completed</option>
                </select>

                {form.programStatus === "incarcerated" && (
                    <>
                        <label style={labelStyle}>Projected Release Date</label>
                        <input type="date" name="projectedReleaseDate" value={form?.projectedReleaseDate} onChange={handleChange} style={inputStyle} />

                        <label style={labelStyle}>Max Release Date</label>
                        <input type="date" name="maxReleaseDate" value={form?.maxReleaseDate} onChange={handleChange} style={inputStyle} />
                    </>
                )}

                <button type="submit" style={{ background: "lime", margin: "2vh 0", width: "90%" }}>
                    Update Mentee
                </button>
            </form>
        </div>
    );
};

export default EditMenteeModal;