import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeDrawing } from "../../../../redux/reducers/drawingReducers";
import { markPostSeen } from "../../../../redux/reducers/chatRoomReducers";

const baseUrl = "http://127.0.0.1:8080";

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
];

const AddDrawing = () => {

  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const [form, setForm] = useState({
    inmateNumber: "",
    state: "",
    notes: "",
    mailingList: ""
  });

  const [imgForm, setImgForm] = useState({
    file: null,
    preview: null,
    link: ""
  });

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setImgForm(prev => ({
      ...prev,
      file,
      preview,
      link: ""
    }));
  };

  const uploadImage = async () => {

    if (!imgForm.file && !imgForm.link) return null;

    let fileId = null;
    let bucketName = null;

    if (imgForm.file) {

      const fd = new FormData();
      fd.append("image", imgForm.file);

      const res = await fetch(`${baseUrl}/upload/image/temp`, {
        method: "PUT",
        body: fd
      });

      if (!res.ok) {
        console.error("Image upload failed");
        return null;
      }

      const data = await res.json();

      fileId = data.fileId;
      bucketName = data.bucketName;
    }

    return {
      imageLink: imgForm.link || "",
      imageFileId: fileId,
      imageBucketName: bucketName
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageData = await uploadImage();

    const payload = {
      uploadedBy: user._id,
      imageLink: imageData?.imageLink || "",
      imageFileId: imageData?.imageFileId || null,
      imageBucketName: imageData?.imageBucketName || null,
      inmateNumber: form.inmateNumber || "",
      state: form.state || "",
      notes: form.notes || "",
      mailingList: form.mailingList || ""
    };

    dispatch(makeDrawing(payload));

    if (imgForm.preview) {
      URL.revokeObjectURL(imgForm.preview);
    }

    setForm({
      inmateNumber: "",
      state: "",
      notes: "",
      mailingList: ""
    });

    setImgForm({
      file: null,
      preview: null,
      link: ""
    });
  };

  const cancelImage = () => {
    if (imgForm.preview) {
      URL.revokeObjectURL(imgForm.preview);
    }
    setImgForm({
      file: null,
      preview: null,
      link: ""
    });
  };

  const labelStyle = {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bolder',
    display: "flex",
    justifyContent: "center",
    gap: "0.5vw"
  };

  const inputStyle = {
    border: 'solid lightGrey',
    background: 'white',
    width: '100%',
    margin: "1vh 0"
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "95vw",
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        background: "rgba(250, 235, 215, 0.960)",
        padding: "1rem 1vw",
        margin: "1vh 1vw"
      }}
    >

      <h3 style={{ textAlign: "center" }}>Add Drawing</h3>

      {!imgForm.link ?
        <><label style={labelStyle}>upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            style={inputStyle}
          />
        </> : ""}

      {!imgForm.preview ?
        <><label style={labelStyle}>{!imgForm.link ? "OR" : ""} URL Link</label>
          <input
            placeholder="Or Image Link"
            value={imgForm.link}
            onChange={(e) =>
              setImgForm(prev => ({
                ...prev,
                link: e.target.value,
                file: null,
                preview: null
              }))
            }
            style={inputStyle}
          /></>
        : ""}

      {imgForm.preview && (
        <><label style={labelStyle}>Img Preview</label>
          <img
            src={imgForm.preview}
            alt="preview"
            style={{
              maxWidth: "20vw",
              margin: "1vh auto"
            }}
          />
          {(imgForm.preview || imgForm.link) && (
            <button
              type="button"
              onClick={cancelImage}
              style={{
                background: "red",
                color: "white",
                padding: "0.5vh 1vw",
                margin: "1vh auto",
                width: "fit-content"
              }}
            >
              Cancel Image
            </button>
          )}
        </>
      )}

      <label style={labelStyle}>Inmate Number (Optional)</label>
      <input
        name="inmateNumber"
        placeholder="Inmate Number (optional)"
        value={form.inmateNumber}
        onChange={handleChange}
        style={inputStyle}
      />

      {form.inmateNumber ?
        <><label style={labelStyle}>Number State (Required With Inmate Number)</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select State (Required With Inamte Number)</option>

            {locationList.map(stateName => (
              <option key={stateName} value={stateName}>
                {stateName.replaceAll("-", " ")}
              </option>
            ))}
          </select>
        </> : ""}

      <label style={labelStyle}>Notes</label>
      <textarea
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
        style={inputStyle}
        maxLength={200}
      />

      <button
        type="submit"
        style={{
          background: "goldenrod",
          padding: "1vh",
          marginTop: "2vh"
        }}
      >
        Add Drawing
      </button>

    </form>
  );
};

export default AddDrawing;
