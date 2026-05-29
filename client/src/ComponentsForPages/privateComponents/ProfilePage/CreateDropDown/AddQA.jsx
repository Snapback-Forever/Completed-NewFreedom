import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeQuestion } from "../../../../redux/reducers/questionReducers";

const AddQA = () => {
  const dispatch = useDispatch();
  const admin = useSelector(state => state.auth.user);

  const [formData, setFormData] = useState({ body: "", responseToMsg: "", phoneNumber: admin?.yourPhoneNumber || "" });

  const labelStyle = { fontWeight: "bold", margin: "1vh 1vw2" };
  const inputStyle = { border: "solid lightGrey", background: "white", width: "100%", padding: "0.5rem", borderRadius: "6px" };

  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = { title: "QA", body: formData.body, responseToMsg: formData.responseToMsg, firstName: admin?.firstName || "", lastName: admin?.lastName || "", email: admin?.email || "", phoneNumber: formData.phoneNumber && formData.phoneNumber.trim() !== "" ? formData.phoneNumber : undefined, userId: admin?._id };
    dispatch(makeQuestion(form));
    setFormData({ body: "", responseToMsg: "", phoneNumber: admin?.yourPhoneNumber || "" });
  };

  return (
    <div style={{ width: "100%", minHeight: "82vh", display: "flex", justifyContent: "center", padding: "1vh 0" }}>
      <form onSubmit={handleSubmit} style={{ width: "90vw", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "12px", background: "rgba(250, 235, 215, 0.960)" }}>
        <h1 style={{ textAlign: "center", margin: "0 0 0.5rem 0" }}>Create Q&A</h1>
        <div style={{ height: "85%" }}>

        <label style={labelStyle}>Question: </label>
        <textarea style={{ ...inputStyle, minHeight: "30%", resize: "vertical" }} name="body" value={formData.body} onChange={handleChange} placeholder="Enter the question" required />

        <label style={labelStyle}>Response: </label>
        <textarea style={{ ...inputStyle, minHeight: "50%", resize: "vertical" }} name="responseToMsg" value={formData.responseToMsg} onChange={handleChange} placeholder="Enter the response" required />
</div>
        <button type="submit" style={{ padding: "0.7rem 1.2rem", border: "none", borderRadius: "8px", background: "lime", color: "black", fontWeight: "bold", cursor: "pointer", marginTop: "0.25rem" }}>Save QA
            
        </button>
      </form>
    </div>
  );
};

export default AddQA;
