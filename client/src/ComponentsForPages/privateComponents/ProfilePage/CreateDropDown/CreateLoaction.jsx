import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { makeLocation, resetErrorMessage, resetSuccessMessage } from "../../../../redux/reducers/locationReducer";


const CreateLocation = ({ setChangeContent }) => {

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

  const dispatch = useDispatch();

const successMessage = useSelector(state => state.pro.successMessage)

  const [formData, setFormData] = useState({
    locationName: "",
    locationPhoneNumber: "",
    locationImage: "",
    locImageFile: null,
    locImagePreview: null,
    locImageFileId: null,
    locImageBucketName: null,
    aboutLocation: "",
    aboutLocationVideo: "",
    maxCapacity: "",
    facilitySex: "",
    mailingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    }
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name in formData.mailingAddress) {
      setFormData(prev => ({
        ...prev,
        mailingAddress: {
          ...prev.mailingAddress,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLocationImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (formData.locImagePreview) {
      URL.revokeObjectURL(formData.locImagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      locImageFile: file,
      locImagePreview: previewUrl
    }));
  };

  const handleClearUploadImage = () => async () => {
    const previewUrl = formData.locImagePreview;
    const fileId = formData.locImageFileId;
    const bucketName = formData.locImageBucketName;
    try {
      if (fileId && bucketName) {
        await fetch(`/upload/image/${fileId}?bucketName=${bucketName}`, {
          method: "DELETE"
        });
      }
    } catch (err) {
      console.error("Failed to delete image", err);
    }
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setFormData(prev => ({
      ...prev,
      locImagePreview: null,
      locImageFile: null,
      locImageFileId: null,
      locImageBucketName: null,
      locationImage: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadResult = null;
    try {
      if (formData.locImageFile) {
        const body = new FormData();
        body.append("image", formData.locImageFile);
        const res = await fetch("http://localhost:8080/upload/image", {
          method: "POST",
          body
        });
        if (!res.ok) throw new Error("Image upload failed");
        uploadResult = await res.json();
      }
      const payload = {
        ...formData,
         
        locationImage: uploadResult?.url ?? formData.locationImage,
        locImageFileId: uploadResult?.fileId ?? formData.locImageFileId,
        locImageBucketName:
          uploadResult?.bucketName ?? formData.locImageBucketName,
        aboutLocation: formData.aboutLocation
          ? DOMPurify.sanitize(formData.aboutLocation, {
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
              "base"
            ],
            FORBID_ATTR: ["onerror", "onload", "onclick"]
          })
          : ""
      };
      delete payload.locImageFile;
      delete payload.locImagePreview;
      dispatch(makeLocation(payload));
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  useEffect(() => {
    if (successMessage === "Location created successfully!") {
      setChangeContent("")
      dispatch(resetErrorMessage())
      dispatch(resetSuccessMessage())
    }
  }, [successMessage])

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
    width: '80%',
    margin: "1vh 0"
  };

  return (

    <div style={{ width: '100vw', minHeight: '84vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: "2vh 0" }}>

      <div style={{ width: '90%', minHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', background: "rgba(250, 235, 215, 0.960)", overflowY: 'auto', padding: '1rem', }}>

        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

          <h2 style={{ textAlign: "center" }}>Create Location</h2>


          <div style={{ border: "double black", width: "80%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "1vh 0" }}>
            {formData.locImagePreview === null && (

              <><h4>Location Image URL</h4>
                <input
                  type="text"
                  name="locationImage"
                  placeholder="Image URL"
                  value={formData.locationImage}
                  onChange={handleInput}
                  style={inputStyle}
                />
              </>
            )}

            {formData.locationImage === "" && (
              <div style={{ margin: "1vh 0", width: '100%', display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: 'center' }}>
                <h4>{formData.locImagePreview === null && "OR"} Select A Image</h4>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.gif"
                  onChange={handleLocationImageUpload}
                  style={inputStyle}
                />

                {formData.locImagePreview && (
                  <>
                    <img
                      src={formData.locImagePreview}
                      style={{ maxWidth: "120px", marginTop: "10px" }}
                    />
                    <button
                      type="button"
                      onClick={handleClearUploadImage()}
                      style={{ background: "red", padding: "0 1vw", margin: "1vh 0", width: "fit-content" }}
                    > Cancel Image </button>
                  </>
                )}
              </div>
            )}
          </div>

          <label style={labelStyle} >Location Name</label>
          <input
            name="locationName"
            placeholder="Location Name"
            value={formData.locationName}
            onChange={handleInput}
            style={inputStyle}
            required
          />

          <label style={labelStyle} >Phone Number</label>
          <input
            name="locationPhoneNumber"
            placeholder="Phone Number"
            value={formData.locationPhoneNumber}
            onChange={handleInput}
            style={inputStyle}
            required
          />

          <label style={labelStyle} >About Location:</label>
          <textarea
            name="aboutLocation"
            placeholder="About Location"
            value={formData.aboutLocation}
            onChange={handleInput}
            style={{...inputStyle, height: "50vh"}}
            required
          />

          <label style={labelStyle} >Video URL Link: (Optional)</label>
          <input
            name="aboutLocationVideo"
            placeholder="Video URL"
            value={formData.aboutLocationVideo}
            onChange={handleInput}
            style={inputStyle}
          />

          <label style={labelStyle} >Max Capacity:</label>
          <input
            type="number"
            name="maxCapacity"
            placeholder="Max Capacity"
            value={formData.maxCapacity}
            onChange={handleInput}
            style={inputStyle}
            required
          />


          <div style={{ border: "double black", width: "80%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "1vh 0" }}>

            <h4 style={{ textAlign: "center" }}>Address</h4>

            <label style={labelStyle} >Street:</label>
            <input
              name="street"
              placeholder="Street"
              value={formData.mailingAddress.street}
              onChange={handleInput}
              style={inputStyle}
              required
            />

            <label style={labelStyle} >City: </label>
            <input
              name="city"
              placeholder="City"
              value={formData.mailingAddress.city}
              onChange={handleInput}
              style={inputStyle}
              required
            />

            <label style={labelStyle} >State: </label>
            <select
              name="state"
              value={formData.mailingAddress.state}
              onChange={handleInput}
              style={inputStyle}
              required

            >
              <option value="">Select State</option>
              {locationList.map((state) => (
                <option key={state} value={state}>
                  {state.replaceAll("-", " ")}
                </option>
              ))}
            </select>

            <label style={labelStyle} >Zip Code:</label>
            <input
              name="zipCode"
              placeholder="Zip Code"
              value={formData.mailingAddress.zipCode}
              onChange={handleInput}
              style={inputStyle}
              required
            />
          </div>

          <label style={labelStyle} >Location Gender:</label>
          <select
            name="facilitySex"
            value={formData.facilitySex}
            onChange={handleInput}
            style={inputStyle}
            required
          >
            <option value="">- Select Gender For Location -</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="coed">Coed</option>
          </select>

<h3 style={{ textAlign: "center" }}><u>After You Create The Location</u>, You Can Explore The Location And Beef It Up To Look Better. By Adding Images/Staff/Events & Programs For This Locations.</h3>

          <button type="submit" style={{ background: "goldenRod", width: "80%", height: "5vh" }}>Create Location</button>

        </form>
      </div>
    </div>

  );
};
export default CreateLocation;
