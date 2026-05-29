import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DOMPurify from "dompurify";
import { updateProgram } from "../../../../redux/reducers/locationReducer";

const EditProgram = ({ pro, setTrigger, setSeeChange }) => {

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    programType: "",
    programName: "",
    descriptionOfProgram: "",
    descriptionOfProgramVideo: "",
    lengthOfProgram: "",
    maxCapacity: ""
  });

  useEffect(() => {
    if (pro) {
      setForm({
        programType: pro.programType || "",
        programName: pro.programName || "",
        descriptionOfProgram: pro.descriptionOfProgram || "",
        descriptionOfProgramVideo: pro.descriptionOfProgramVideo || "",
        lengthOfProgram: pro.lengthOfProgram || "",
        maxCapacity: pro.maxCapacity || ""
      });
    }
  }, [pro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const sanitizedDescription = DOMPurify.sanitize(form.descriptionOfProgram, {
      ALLOWED_TAGS: [
        "div", "span", "section", "article", "main", "header", "footer",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "p", "strong", "em", "b", "i", "u", "br", "hr",
        "ul", "ol", "li", "dl", "dt", "dd",
        "img", "figure", "figcaption",
        "a",
        "table", "thead", "tbody", "tr", "th", "td",
        "style", "small", "sub", "sup", "blockquote", "cite", "pre", "code"
      ],
      ALLOWED_ATTR: [
        "id", "class", "style", "title", "lang", "dir",
        "href", "target", "rel",
        "src", "alt", "width", "height", "loading", "srcset", "sizes",
        "name", "value", "type", "placeholder",
        "colspan", "rowspan", "scope",
        "align", "valign",
        "onclick", "onload", "onerror", "onmouseover",
        "onmouseout", "onfocus", "onblur", "onchange",
        "role", "aria-label", "aria-describedby", "aria-hidden",
        "data-*",
        "data-style", "data-class"
      ],
      ALLOW_DATA_ATTR: true,
      ADD_TAGS: ["style"],
      FORBID_TAGS: [],
      FORBID_ATTR: [],
    });
  
    const payload = {
      ...form,
      programId: pro._id,
      descriptionOfProgram: sanitizedDescription
    };
  
    dispatch(updateProgram(payload));
    setTrigger(true);
    setSeeChange("");
  };
  

  const labelStyle = {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    display: "flex",
    justifyContent: "center",
    margin: "1vh 0"
};

const inputStyle = {
    border: 'solid lightGrey',
    background: 'white',
    width: '90%',
};

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", background: "white", alignItems: "center" }}>
      
      <label style={labelStyle}>Program Name:</label>
      <input
        name="programName"
        value={form.programName}
        onChange={handleChange}
        placeholder="Program Name"
        style={inputStyle}
      />

<label style={labelStyle}>Program Type:</label>
      <select
        name="programType"
        value={form.programType}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="reg-Program">Regular Program</option>
        <option value="vocational">Vocational</option>
      </select>

      <label style={labelStyle}>Program Description:</label>
      <code style={{ width: "100%", textAlign: "center" }}>Example Img Link: ➡️ &lt;img src="http://localhost:8080/upload/image/<b style={{ color: "blue" }}>imageFileId</b>?bucketName=<b style={{ color: "blue" }}>imageBucketName</b>" alt="Description" /&gt; ⬅️</code>
      <textarea
        name="descriptionOfProgram"
        value={form.descriptionOfProgram}
        onChange={handleChange}
        placeholder="Program Description"
        style={{ ...inputStyle, minHeight: "80vh" }}
      />

{form.descriptionOfProgram ?
<div style={{ border: "double black", width: "90%", padding: "1vh 1vw", margin: "1vh 0" }}>
    <h5>Preview Of Description:</h5>
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form?.descriptionOfProgram) }} style={{ whiteSpace: "pre-wrap" }} />
</div> 
: ""}

<label style={labelStyle}>Program Video (URL):</label>
      <input
        name="descriptionOfProgramVideo"
        value={form.descriptionOfProgramVideo}
        onChange={handleChange}
        placeholder="Video URL"
        style={inputStyle}
      />

<label style={labelStyle}>Program Length: </label>
      <input
        name="lengthOfProgram"
        value={form.lengthOfProgram}
        onChange={handleChange}
        placeholder="Length of Program"
        style={inputStyle}
      />

<label style={labelStyle}>Program Max Capacity:</label>
      <input
        type="number"
        name="maxCapacity"
        value={form.maxCapacity}
        onChange={handleChange}
        placeholder="Max Capacity"
        style={inputStyle}
      />

      <button type="submit" style={{ background: "lime", margin: "1vh", width: "100%" }}>Update Program</button>

    </form>
  );
};

export default EditProgram;
