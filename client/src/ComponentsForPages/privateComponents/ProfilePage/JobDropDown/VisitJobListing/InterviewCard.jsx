import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateInterviewToJobApplication } from "../../../../../redux/reducers/applicationReducers";

const toDateTimeLocal = (dateValue) => { if (!dateValue) return ""; const date = new Date(dateValue); const offset = date.getTimezoneOffset(); const localDate = new Date(date.getTime() - offset * 60000); return localDate.toISOString().slice(0, 16); };

const InterviewCard = ({ int, setTrigger, app }) => {
    const admin = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        scheduledAt: "",
        interviewer: "",
        locationId: "",
        type: "",
        notes: "",
        status: "",
    });

    useEffect(() => {
        if (int) {
            setForm({
                scheduledAt: toDateTimeLocal(int?.scheduledAt),
                interviewer: int?.interviewer || "",
                locationId: int?.locationId || "",
                type: int?.type || "onsite",
                notes: int?.notes || "",
                status: int?.status || "scheduled",
            });
        }
    }, [int]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setForm({
            scheduledAt: toDateTimeLocal(int?.scheduledAt),
            interviewer: int?.interviewer || "",
            locationId: int?.locationId || "",
            type: int?.type || "onsite",
            notes: int?.notes || "",
            status: int?.status || "scheduled",
        });
    };

    const handleUpdateClick = async () => {
        const payload = {
            jobAppId: app?._id,
            interviewId: int?._id,
            form: {
                ...form,
                scheduledAt: form.scheduledAt ? new Date(form.scheduledAt) : undefined,
            },
        };

        const result = await dispatch(updateInterviewToJobApplication(payload));

        if (result?.meta?.requestStatus === "fulfilled") {
            setTrigger((prev) => !prev);
            setIsEditing(false);
        }
    };

    const labelStyle = { width: "100%", textAlign: "center", fontWeight: "bold", display: "flex", justifyContent: "center", gap: "0.5vw" };
    const inputStyle = { border: "solid lightGrey", background: "white", width: "100%", margin: "0.5vh 0" };

    return (
        <>
            <div style={{ border: "solid black", padding: "1vh 1vw", margin: "0.5vh 1vw", width: "98%" }}>
                <div style={{ display: "flex", justifyContent: "end" }}>
                    <span style={{ fontSize: "small" }}>
                        <b>Created Date:</b> {moment(int?.createdAt).format("hh:mm MMM Do YY")}
                    </span>
                </div>

                {!isEditing ? (
                    <>
                        <div>
                            <h6>
                                <b>Location:</b> {int?.location}
                            </h6>
                            <h6>
                                <b>Notes:</b> {int?.notes}
                            </h6>
                            <h6>
                                <b>Status:</b> {int?.status}
                            </h6>
                            <h6>
                                <b>Interview Type:</b> {int?.type}
                            </h6>
                        </div>

                        <div style={{ textAlign: "center" }}>
                            <span>
                                <b>Scheduled Date:</b> {moment(int?.scheduledAt).format("hh:mm A MMM Do YY")}
                            </span>
                        </div>
                    </>
                ) : (
                    <div style={{ marginTop: "1rem" }}>
                        <div style={{ marginBottom: "0.75rem" }}>
                            <label style={labelStyle}>
                                <b>Scheduled Date:</b>
                            </label>
                            <input
                                type="datetime-local"
                                name="scheduledAt"
                                value={form.scheduledAt}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "0.75rem" }}>
                            <label style={labelStyle}>
                                <b>Notes:</b>
                            </label>
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "0.75rem" }}>
                            <label style={labelStyle}>
                                <b>Status:</b>
                            </label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="scheduled">scheduled</option>
                                <option value="completed">completed</option>
                                <option value="canceled">canceled</option>
                                <option value="no_show">no_show</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: "0.75rem" }}>
                            <label style={labelStyle}>
                                <b>Interview Type:</b>
                            </label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="phone">phone</option>
                                <option value="video">video</option>
                                <option value="onsite">onsite</option>
                            </select>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <button
                                type="button"
                                onClick={handleUpdateClick}
                                style={{ background: "lime", textAlign: "center", margin: "0.5vh 0", width: "100%" }}
                            >
                                Update
                            </button>

                            <button
                                type="button"
                                onClick={handleCancelClick}
                                style={{ background: "red", textAlign: "center", margin: "0.5vh 0", width: "100%" }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {!isEditing && (
                    admin?._id !== int?.interviewer ? (
                        <Link to={`/messagePage/${int?.interviewer}`}>
                            <button
                                style={{
                                    background: "lightBlue",
                                    width: "100%",
                                    margin: "1vh 0",
                                }}
                            >
                                📨 Interviewer
                            </button>
                        </Link>
                    ) : (
                        <>
                            <div style={{ background: "red", textAlign: "center", margin: "0.5vh 0" }}>
                                Your Interview
                            </div>
                        </>
                    )
                )}

                {admin?._id === int?.interviewer || admin?.creator || admin?.NFadmin ? <>
                    {!isEditing && (
                        <button type="button" onClick={handleEditClick} style={{ background: "green", textAlign: "center", margin: "0.5vh 0", width: "100%" }}>
                            Edit Interview
                        </button>
                    )}
                </> : ""}
            </div>
            <div style={{ border: "solid black", margin: "1vh 0" }}></div>
        </>
    );
};

export default InterviewCard;
