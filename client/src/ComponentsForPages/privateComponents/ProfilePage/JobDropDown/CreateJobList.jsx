import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useDispatch, useSelector } from "react-redux";
import { addJobListing } from "../../../../redux/reducers/applicationReducers";

const CreateJobList = ({ darkMode, setDarkMode, trigger, setTrigger, setChangeContent }) => {
  
  const dispatch = useDispatch();

const admin = useSelector(state => state.auth.user)
const successMessage = useSelector(state => state.app.successMessage)


  const [form, setForm] = useState({
    userId: admin?._id,
    title: "",
    location: "",
    description: "",
    requirements: "",
    responsibilities: "",
    jobType: "full-time",
    seniority: "junior",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "USD",
    isActive: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextForm = {
      ...form,
      requirements: form.requirements
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      responsibilities: form.responsibilities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    Object.keys(nextForm).forEach((key) => {
      if (typeof nextForm[key] === "string") {
        nextForm[key] = DOMPurify.sanitize(nextForm[key], {
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

    // If you're using Redux thunk:
    dispatch(addJobListing(nextForm));
    setTrigger(true)

  };

  useEffect(() => {
if(successMessage === "Job listing created successfully!"){
// setChangeContent("allJobList")
}
  },[successMessage])

  const labelStyle = {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    display: "flex",
    justifyContent: "center",
    gap: "0.5vw"
};

const inputStyle = {
    border: 'solid lightGrey',
    background: 'white',
    width: '100%',
};


  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>

    <div style={{ width: "90vw", height: "90vh", background: "white", padding: "1vh 1vw" }}>
      <h1 style={{ textAlign: "center", margin: "1vh 0" }}>Create Job Listing</h1>

      <form onSubmit={handleSubmit}>
       

        <div>
          <label style={labelStyle}>Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            style={inputStyle}
            required
            placeholder="Job Title"
          />
        </div>

        <div>
          <label style={labelStyle}>Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            style={inputStyle}
            required
             placeholder="Job Location"
          />
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={inputStyle}
            rows="5"
            required
              placeholder="Job Description"
          />
        </div>

        <div>
          <label style={labelStyle}>
            Requirements <span >(comma-separated)</span>
          </label>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            style={inputStyle}
            rows="3"
            placeholder="onTime, Works hard, ect..."
          />
        </div>

        <div>
          <label style={labelStyle}>
            Responsibilities <span >(comma-separated)</span>
          </label>
          <textarea
            name="responsibilities"
            value={form.responsibilities}
            onChange={handleChange}
            style={inputStyle}
            rows="3"
            placeholder="Cleaning Rooms, Cooking, ect..."
          />
        </div>

        <div>
          <label style={labelStyle}>Job Type</label>
          <select
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="volunteer">volunteer</option>
            <option value="temporary">Temporary</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Seniority</label>
          <select
            name="seniority"
            value={form.seniority}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>

   { form?.jobType !== "volunteer" ? <>

          <div>
            <label style={labelStyle}>Salary Min</label>
            <input
              type="text"
              name="salaryMin"
              value={form.salaryMin}
              onChange={handleChange}
              style={inputStyle}
              placeholder="50000"
            />
          </div>

          <div>
            <label style={labelStyle}>Salary Max</label>
            <input
              type="text"
              name="salaryMax"
              value={form.salaryMax}
              onChange={handleChange}
              style={inputStyle}
              placeholder="80000"
            />
          </div>

     </> : ""}

        <div>
          <label style={labelStyle}>Salary Currency</label>
          <input
            type="text"
            name="salaryCurrency"
            value={form.salaryCurrency}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={{ margin: "1vh 1vw", display: "flex", justifyContent: "center" }}>
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            style={{ scale: (2,3), margin: "1vh 1vw" }}
          />
          <label style={{ margin: "1vh 1vw" }}><b>Check If Job Listing Active?</b></label>
        </div>

        <button type="submit" style={{ background: "lime", width: '100%', margin: "1vh 0" }}>Create Job Listing</button>

      </form>
    </div>
    
    </div>
  );
};

export default CreateJobList;

