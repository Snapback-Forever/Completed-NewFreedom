import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReviewerToJobApplication } from "../../../../../redux/reducers/applicationReducers";


const ReviewedApplication = ({ singleJobListing, app, setTrigger, setChangeContent }) => {

  const dispatch = useDispatch();

  const admin = useSelector(state => state.auth.user)
  const successMessage = useSelector(state => state.app.successMessage)

  const [form, setForm] = useState({ 
    userId: admin?._id, 
    comment: ""
 });


  const labelStyle = { width: "100%", textAlign: "center", fontWeight: "bold", display: "flex", justifyContent: "center", gap: "0.5vw" };
  const inputStyle = { border: "solid lightGrey", background: "white", width: "100%" };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const paylod = {
        jobAppId: app?._id,
        form
    }

    dispatch(addReviewerToJobApplication(paylod));
    setTrigger(true)
  };

  useEffect(()=> {
if(successMessage === "Reviewer added successfully!") {
setChangeContent("review")
}
  },[successMessage])

  return (
    <div>
      <form onSubmit={handleSubmit}>

        <label style={labelStyle}>Comment About Application:</label>
        <textarea style={inputStyle} name="comment" value={form.comment} onChange={handleChange} rows="4" />

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button type="submit" style={{ background: "lime", width: "100%" }}>Add Review Of Application</button>
            <button style={{ margin: "0.5vh 0", width: "100%", background: "red" }} onClick={() => setChangeContent("")}>Cancel Review Of Application</button>
            </div>
      </form>
    </div>
  );
};

export default ReviewedApplication;
