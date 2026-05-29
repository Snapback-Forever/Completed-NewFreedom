import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import {
  addEvent,
  resetErrorMessage,
  resetSuccessMessage,
} from "../../../../redux/reducers/eventReducers";

const CreateNewEvent = ({ setChangeContent }) => {
  const dispatch = useDispatch();

  const successMessage = useSelector(
    (state) => state.event.successMessage
  );

  const user = useSelector((state) => state.auth.user);

  const labelStyle = {
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    gap: "0.5vw",
  };

  const inputStyle = {
    border: "solid lightGrey",
    background: "white",
    width: "100%",
    padding: "0.6rem",
    borderRadius: "0.3rem",
    fontSize: "1rem",
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    maxCapacity: "",
    location: "",
    status: "draft",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const tabSpaces = "    ";

      const updatedDescription =
        formData.description.substring(0, start) +
        tabSpaces +
        formData.description.substring(end);

      setFormData((prev) => ({
        ...prev,
        description: updatedDescription,
      }));

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd =
          start + tabSpaces.length;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const sanitizedDescription = formData.description
      ? DOMPurify.sanitize(formData.description, {
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
        })
      : "";

    const payload = {
      ...formData,
      createdBy: user?._id,
      description: sanitizedDescription,
    };

    dispatch(addEvent(payload));
  };

  useEffect(() => {
    if (successMessage === "Event created successfully!") {
      setChangeContent("");

      dispatch(resetErrorMessage());
      dispatch(resetSuccessMessage());
    }
  }, [successMessage, dispatch, setChangeContent]);

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "84vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "2vh 0",
      }}
    >
      <div
        style={{
          width: "90%",
          minHeight: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          background: "rgba(250, 235, 215, 0.960)",
          overflowY: "auto",
          padding: "1rem",
          borderRadius: "0.5rem",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: "60%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1vh",
          }}
        >
          <h2 style={{ textAlign: "center" }}>Create A Event</h2>

          <label style={labelStyle}>Event Title</label>

          <input
            name="title"
            value={formData.title}
            onChange={handleInput}
            placeholder="Event Title"
            style={inputStyle}
          />

          <label style={labelStyle}>Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleInput}
            onKeyDown={handleDescriptionKeyDown}
            placeholder="Event Description"
            style={{
              border: "solid lightGrey",
              background: "white",
              width: "100%",
              minHeight: "50vh",
              fontFamily: "inherit",
              padding: "0.8rem",
              borderRadius: "0.3rem",
              fontSize: "1rem",
              resize: "vertical",
            }}
          />

          <label style={labelStyle}>Start Date & Time</label>

          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleInput}
            style={inputStyle}
          />

          <label style={labelStyle}>End Date & Time</label>

          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleInput}
            style={inputStyle}
          />

          <label style={labelStyle}>Max Capacity</label>

          <input
            type="number"
            name="maxCapacity"
            value={formData.maxCapacity}
            onChange={handleInput}
            placeholder="Max Capacity"
            style={inputStyle}
          />

          <h4 style={{ textAlign: "center" }}>
            After you create the event you will be allowed to upload additional
            Images & Make the event stand out more.
          </h4>

          <button
            type="submit"
            style={{
              background: "goldenRod",
              width: "80%",
              height: "5vh",
              border: "none",
              borderRadius: "0.4rem",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewEvent;