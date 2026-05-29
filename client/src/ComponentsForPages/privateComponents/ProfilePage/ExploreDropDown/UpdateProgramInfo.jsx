import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { updateProgram } from "../../../../redux/reducers/locationReducer";


const UpdateProgramInfo = ({ singleProgram, setTrigger, setAddImage }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    programId: "",
    programName: "",
    descriptionOfProgram: "",
    descriptionOfProgramVideo: "",
    maxCapacity: "",
    openToPublic: false,
  });

  useEffect(() => {
    if (singleProgram) {
      setForm({
        programId: singleProgram._id,
        programName: singleProgram.programName || "",
        descriptionOfProgram: singleProgram.descriptionOfProgram || "",
        descriptionOfProgramVideo:
          singleProgram.descriptionOfProgramVideo || "",
        maxCapacity: singleProgram.maxCapacity || 0,
        openToPublic: singleProgram.openToPublic || false,
      });
    }
  }, [singleProgram]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const nextForm = { ...form };
  
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
  
    nextForm.maxCapacity = Number(nextForm.maxCapacity);
  
    dispatch(updateProgram(nextForm));
    setTrigger(true);
  };
  

  const labelStyle = {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5vw',
  };

  const inputStyle = {
    border: 'solid lightGrey',
    background: 'white',
    width: '80%',
  };

  return (

    <form onSubmit={handleSubmit}>

      <div>
        <label style={labelStyle}>Program Name</label>
        <input
          type="text"
          name="programName"
          value={form.programName}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Description Of Program</label>
        <textarea
          name="descriptionOfProgram"
          value={form.descriptionOfProgram}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Program Video Description</label>
        <textarea
          name="descriptionOfProgramVideo"
          value={form.descriptionOfProgramVideo}
          onChange={handleChange}
             style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Max Capacity</label>
        <input
          type="number"
          name="maxCapacity"
          value={form.maxCapacity}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Open To Public</label>
        <input
          type="checkbox"
          name="openToPublic"
          checked={form.openToPublic}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <button type="submit" style={{ background: "lime", margin: "1vh", width: "100%" }}> Update Program </button>

    </form>
  
  );
};

export default UpdateProgramInfo;
