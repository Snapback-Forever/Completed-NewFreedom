import React, { useState } from "react";
import DOMPurify from "dompurify";
import { useDispatch, useSelector } from "react-redux";
import { addStory } from "../../../redux/reducers/successStoriesReducer";

const SubmitLandingContent = ({ darkMode, setDarkMode }) => {

  const MAX_STORY_LENGTH = 10000;

  const dispatch = useDispatch()
  const successMessage = useSelector(state => state.success.successMessage)


  const locationList = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
    "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
    "Montana", "Nebraska", "Nevada", "New-Hampshire", "New-Jersey", "New-Mexico",
    "New-York", "North-Carolina", "North-Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode-Island", "South-Carolina", "South-Dakota", "Tennessee",
    "Texas", "Utah", "Vermont", "Virginia", "Washington", "West-Virginia",
    "Wisconsin", "Wyoming"
  ]

  const [formData, setFormData] = useState({
    title: "",
    storyText: "",
    storyVideo: "",
    programName: "",
    graduationDate: "",
    outcomeSummary: "",
    email: "",
    // consentToPublish omitted; backend default is used
    location: {
      city: "",
      state: "",
    },
    imageUrl: "",
    internalNotes: "",
    inmateNumber: {
      number: "",
      state: "",
    },
    firstName: "",
    lastName: "",
  });

  const handleInmateNumberChange = (e) => {
    const { name, value } = e.target; // "number" or "state"
    setFormData((prev) => ({
      ...prev,
      inmateNumber: {
        ...prev.inmateNumber,
        [name]: value,
      },
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target; // "city" or "state"
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // works for top-level keys only
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sanitize storyText (or any other rich-text fields) here
    const sanitizedStoryText = DOMPurify.sanitize(formData.storyText, {
      ALLOWED_TAGS: ["br"],
      ALLOWED_ATTR: [],
    });

    const payload = {
      ...formData,
      storyText: sanitizedStoryText,
    };

    dispatch(addStory(payload))

  }

  return (
    <div style={{ height: "84.1vh", overflow: "scroll", display: "flex", flexDirection: "column", alignItems: "center" }}  >

      <form onSubmit={handleSubmit} style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center",
        gap: '1rem',

      }}>
        <h2 style={{ color: darkMode ? "white" : "black", width: "100%", textAlign: "center" }}>Submit Your Success Story</h2>

        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Your First name:</h4>
        <input
          type="text"
          name="firstName"
          placeholder="Jane/John"
          value={formData.firstName}
          onChange={handleChange}
          required
          style={{ border: "solid lightGrey", background: "white", width: "80%" }}
          maxLength={50}
        />

        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Your Last name:</h4>
        <input
          type="text"
          name="lastName"
          placeholder="Doe"
          value={formData.lastName}
          onChange={handleChange}
          required
          maxLength={50}
          style={{ border: "solid lightGrey", background: "white", width: "80%" }}
        />

        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Your Email:</h4>
        <input
          type="text"
          name="email"
          placeholder="example@mail.com"
          value={formData.email}
          onChange={handleChange}
          required
          maxLength={150}
          style={{ border: "solid lightGrey", background: "white", width: "80%" }}
        />

        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Story title:</h4>
        <input
          type="text"
          name="title"
          placeholder="My Success Story..."
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={100}
          style={{ border: "solid lightGrey", background: "white", width: "80%" }}
        />

        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Summary of Story:</h4>
        <input
          type="text"
          name="outcomeSummary"
          placeholder="New Freedom Helped Me Succeed."
          value={formData.outcomeSummary}
          onChange={handleChange}
          maxLength={150}
          required
          style={{ border: "solid lightGrey", background: "white", width: "80%" }}
        />

        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Your story:</h4>
        <textarea
          name="storyText"
          placeholder="New Freedom Helped Me ... ..."
          value={formData.storyText}
          onChange={handleChange}
          rows={30}
          maxLength={MAX_STORY_LENGTH}
          required
          style={{ border: "solid lightGrey", background: "white", width: "80%" }}
        />

        <h5
          style={{
            width: "80%",
            textAlign: "right",
            color: darkMode ? "white" : "gray",
            marginTop: "4px",
          }}
        >
          {MAX_STORY_LENGTH - formData.storyText.length} characters remaining
        </h5>

        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Program name:</h4>
        <input
          type="text"
          name="programName"
          placeholder="Peer-Support Program"
          value={formData.programName}
          onChange={handleChange}
          maxLength={50}
          required
          style={{ border: "solid lightGrey", background: "white", width: "80%" }}
        />

        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Graduation date:</h4>
        <input
          type="date"
          name="graduationDate"
          placeholder="Graduation date"
          value={formData.graduationDate}
          onChange={handleChange}
          required
          style={{ border: "solid lightGrey", background: "white", width: "80%" }}
        />

        <div style={{ width: "80%", display: "flex", flexDirection: "column", alignItems: "center", border: "solid white", padding: "1vh 0" }}>
          <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>City, State You Attended Program:</h4>
          <input
            type="text"
            name="city"
            placeholder="Phoenix"
            value={formData.location.city}
            onChange={handleLocationChange}
            maxLength={50}
            required
            style={{ border: "solid lightGrey", background: "white", width: "80%", margin: "1vh" }}
          />

          {/* Location state (from locationList) */}
          <select
            name="state"
            value={formData.location.state}
            onChange={handleLocationChange}
            style={{ border: "solid lightGrey", background: "white", width: "80%" }}
            required
          >
            <option value="">-- Select A State --</option>
            {locationList.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div style={{ width: "80%", display: "flex", flexDirection: "column", alignItems: "center", border: "solid white", padding: "1vh 0" }}>
          <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Inmate Number & State: (Optional)</h4>
          {/* Inmate number */}
          <input
            type="text"
            name="number"
            placeholder="123456"
            value={formData.inmateNumber.number}
            onChange={handleInmateNumberChange}
            maxLength={20}
            style={{ border: "solid lightGrey", background: "white", width: "80%", margin: "1vh" }}
          />

          <select
            name="state"
            value={formData.inmateNumber.state}
            onChange={handleInmateNumberChange}
            style={{ border: "solid lightGrey", background: "white", width: "80%" }}
          >
            <option value="">-- Select State *Required With Inmate Number* --</option>
            {locationList.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {successMessage !== "Success story created successfully!" ? <button type="submit" className='responsiveButton rounded' style={{ background: "goldenRod", width: "80%", height: "5vh" }} >
          Submit A Success Story
        </button> : <div className='responsiveButton rounded' style={{ background: 'lime', width: '80%', height: '5vh', color: 'black', display: "flex", justifyContent: 'center', alignItems: "center" }} >
          Thank You For Submitting Your Success Story
        </div>}

      </form>


    </div>

  );
};

export default SubmitLandingContent;
