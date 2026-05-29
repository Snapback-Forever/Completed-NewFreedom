import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useDispatch, useSelector } from "react-redux";
import CreateMsgModal from "./CreateMsgModal";
import { addStory, resetErrorMessage, resetSuccessMessage } from "../../../../redux/reducers/successStoriesReducer";

const CreateSuccessStory = ({ setChangeContent }) => {

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

    const baseUrl = "http://localhost:8080";

    const [openModal, setOpenModal] = useState(false);

    const user = useSelector(state => state.auth.user);
    const successMessage = useSelector(state => state.success.successMessage);

    const [formData, setFormData] = useState({
        userId: user?._id || "",
        title: "",
        storyText: "",
        storyVideo: "",
        programName: "",
        graduationDate: "",
        outcomeSummary: "",
        consentToPublish: false,
        displayName: "",
        firstName: "",
        lastName: "",
        email: "",
        inmateNumber: {
            number: "",
            state: ""
        },
        location: {
            city: "",
            state: ""
        },
        imageUrl: "",
        imageFileId: null,
        imageBucketName: null,
        imageFile: null,
        imagePreview: null
    });

    const [images, setImages] = useState([]);

    const [imgForm, setImgForm] = useState({
        file: null,
        preview: null,
        link: "",
        description: ""
    });

    const handleInput = (e) => {

        const { name, value, type, checked } = e.target;

        if (name.includes(".")) {

            const [parent, child] = name.split(".");

            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));

            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

    };

    const handleImageUpload = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        if (formData.imagePreview) {
            URL.revokeObjectURL(formData.imagePreview);
        }

        const previewUrl = URL.createObjectURL(file);

        setFormData(prev => ({
            ...prev,
            imageFile: file,
            imagePreview: previewUrl
        }));

    };

    const handleClearUploadImage = async () => {

        try {

            if (formData.imageFileId && formData.imageBucketName) {

                await fetch(`/upload/image/${formData.imageFileId}?bucketName=${formData.imageBucketName}`, {
                    method: "DELETE"
                });

            }

        } catch (err) {
            console.error("Failed to delete image", err);
        }

        if (formData.imagePreview?.startsWith("blob:")) {
            URL.revokeObjectURL(formData.imagePreview);
        }

        setFormData(prev => ({
            ...prev,
            imagePreview: null,
            imageFile: null,
            imageFileId: null,
            imageBucketName: null,
            imageUrl: ""
        }));

    };

    const handleAdditionalImageUpload = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        if (imgForm.preview) {
            URL.revokeObjectURL(imgForm.preview);
        }

        const preview = URL.createObjectURL(file);

        setImgForm(prev => ({
            ...prev,
            file,
            preview
        }));

    };

    const addImage = async () => {

        if (!imgForm.file && !imgForm.link) return;

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
                return;
            }

            const data = await res.json();

            fileId = data.fileId;
            bucketName = data.bucketName;

        }

        const newImage = {
            link: imgForm.link || "",
            description: imgForm.description || "",
            imageFileId: fileId,
            imageBucketName: bucketName
        };

        setImages(prev => [...prev, newImage]);

        if (imgForm.preview) {
            URL.revokeObjectURL(imgForm.preview);
        }

        setImgForm({
            file: null,
            preview: null,
            link: "",
            description: ""
        });

    };

    const deleteTheImage = async (img) => {

        try {

            if (img.imageFileId && img.imageBucketName) {

                await fetch(`${baseUrl}/upload/image/${img.imageFileId}?bucketName=${img.imageBucketName}`, {
                    method: "DELETE"
                });

            }

        } catch (err) {
            console.error("Failed to delete image", err);
        }

        setImages(prev => prev.filter(i => i !== img));

    };

    const handleDescriptionKeyDown = (e) => {

        if (e.key === "Tab") {

            e.preventDefault();

            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const tabSpaces = "    ";

            const updatedStoryText =
                formData.storyText.substring(0, start) +
                tabSpaces +
                formData.storyText.substring(end);

            setFormData(prev => ({
                ...prev,
                storyText: updatedStoryText
            }));

            requestAnimationFrame(() => {
                textarea.selectionStart = textarea.selectionEnd = start + tabSpaces.length;
            });

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        let uploadResult = null;

        try {

            if (formData.imageFile) {

                const body = new FormData();
                body.append("image", formData.imageFile);

                const res = await fetch("http://localhost:8080/upload/image", {
                    method: "POST",
                    body
                });

                if (!res.ok) {
                    throw new Error("Image upload failed");
                }

                uploadResult = await res.json();

            }

            const payload = {

                ...formData,

                storyText: DOMPurify.sanitize(formData.storyText, {
                    FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
                    FORBID_ATTR: ["onerror", "onload", "onclick"]
                }),

                imageUrl: uploadResult?.url ?? formData.imageUrl,
                imageFileId: uploadResult?.fileId ?? formData.imageFileId,
                imageBucketName: uploadResult?.bucketName ?? formData.imageBucketName,

                additionalImages: images

            };

            delete payload.imageFile;
            delete payload.imagePreview;

            dispatch(addStory(payload));

        } catch (err) {
            console.error("Submit error:", err);
        }

    };

    const labelStyle = { width: "100%", textAlign: "center", fontWeight: "bolder", display: "flex", justifyContent: "center", gap: "0.5vw" };

    const inputStyle = { border: "solid lightGrey", background: "white", width: "100%" };

    useEffect(() => {

        if (successMessage === "Success story created successfully!") {

            setChangeContent("");
            dispatch(resetErrorMessage());
            dispatch(resetSuccessMessage());

        }

    }, [successMessage]);

    return (
        <div style={{ width: '100vw', minHeight: '84vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: "2vh 0" }}>

            <div style={{ width: '90%', minHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', background: "rgba(250, 235, 215, 0.960)", overflowY: 'auto', padding: '1rem' }}>

                <form onSubmit={handleSubmit} style={{ width: "70%", display: "flex", flexDirection: "column", gap: "1rem" }}>

                    <h2 style={{ textAlign: "center" }}>Create Success Story</h2>

                    {!formData.imagePreview ? <>
                        <h4>Image URL Header Link</h4>

                        <input
                            type="text"
                            name="imageUrl"
                            placeholder="http://example.com"
                            value={formData.imageUrl}
                            onChange={handleInput}
                            style={inputStyle}
                        />
                    </> : ""}

                    {!formData.imageUrl ? <>
                        <h4>{!formData.imagePreview ? "OR" : ""} Upload Header Image</h4>

                        <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.gif"
                            onChange={handleImageUpload}
                            style={inputStyle}
                        />

                        {formData.imagePreview && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                                <img
                                    src={formData.imagePreview}
                                    style={{ maxWidth: "140px", minWidth: "140px", maxHeight: "140px", minHeight: "140px", objectFit: "cover", marginTop: "10px" }}
                                />

                                <button
                                    type="button"
                                    onClick={handleClearUploadImage}
                                    style={{ background: "red", padding: "0 1vw", margin: "1vh 0", width: "fit-content" }}
                                >
                                    Cancel Image
                                </button>

                            </div>
                        )}
                    </> : ""}

                    

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1vh 1vw" }}>

<div style={{ border: "solid black", width: "90vw" }}></div>

                        <label style={{ ...labelStyle, display: "flex", justifyContent: "start" }}>Additional Images:</label>

                        {images.length > 0 &&
                            <div style={{ width: "88vw", display: "flex", overflowX: "auto", maxHeight: "40vh", minHeight: "38vh", background: "white", margin: "1vh 0" }}>

                                {images.map((img, i) => {

                                    const imgSrc =
                                        img?.imageFileId && img?.imageBucketName
                                            ? `${baseUrl}/upload/image/${img.imageFileId}?bucketName=${img.imageBucketName}`
                                            : img?.link || null;

                                    return (
                                        <div key={img.imageFileId || img.link || i} style={{ display: "flex", flexDirection: "column", margin: "1vh 0.5vw", border: "double black", padding: "1vh 1vw", maxWidth: "20vw", minWidth: "20vw", maxHeight: "35vh", minHeight: "35vh" }}>

                                            <img src={imgSrc} style={{ maxWidth: "18vw", minWidth: "18vw", maxHeight: "20vh", minHeight: "20vh", objectFit: "cover" }} />

                                            {img?.imageFileId ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img.imageFileId)} style={{ cursor: "pointer" }}><b>imageFileId: </b>{img?.imageFileId}</div> : ""}

                                            {img?.imageBucketName ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img.imageBucketName)} style={{ cursor: "pointer" }}><b>imageBucketName: </b>{img?.imageBucketName}</div> : ""}

                                            {img?.link && (
                                                <div title="Click to copy full link" onClick={() => navigator.clipboard.writeText(img.link)} style={{ cursor: "pointer" }}>
                                                    <b>Link:</b> {img.link.length > 30 ? `${img.link.slice(0, 15)}...${img.link.slice(-10)}` : img.link}
                                                </div>
                                            )}

                                            <div style={{ display: "flex", justifyContent: "end" }}>
                                                <button type="button" style={{ background: "red", padding: "0 2vw", margin: "1vh 0" }} onClick={() => deleteTheImage(img)}>Delete Img</button>
                                            </div>

                                        </div>
                                    );
                                })}
                                
                            </div>
                        }

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", width: "90%" }}>

                          {!imgForm.link ? <>  <label style={labelStyle}>Upload a Image</label>

                            <input
                                type="file"
                                onChange={handleAdditionalImageUpload}
                                style={inputStyle}
                            />
                            </> : ""}

                            {imgForm.preview && (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", margin: "1vh 0" }}>

                                    <img
                                        src={imgForm.preview}
                                        alt="Preview"
                                        style={{ maxWidth: "20vw", minWidth: "20vw", maxHeight: "25vh", minHeight: "25vh", objectFit: "cover", border: "solid lightgrey", background: "white" }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {

                                            if (imgForm.preview?.startsWith("blob:")) {
                                                URL.revokeObjectURL(imgForm.preview);
                                            }

                                            setImgForm({
                                                file: null,
                                                preview: null,
                                                link: "",
                                                description: ""
                                            });

                                        }}
                                        style={{ background: "red", color: "white", padding: "0.5vh 1vw", marginTop: "1vh", border: "none", cursor: "pointer" }}
                                    >
                                        Cancel Preview
                                    </button>

                                </div>
                            )}

                           {!imgForm.preview ? <> <label style={labelStyle}>OR URL Link To Image</label>

                            <input
                                placeholder="Or URL Link"
                                value={imgForm.link}
                                onChange={(e) => setImgForm(prev => ({ ...prev, link: e.target.value }))}
                                style={inputStyle}
                            />
                            </> : ""}

                            <button
                                type="button"
                                style={{ background: "lime", margin: "1vh", width: "100%" }}
                                onClick={addImage}
                            >
                                Add Image
                            </button>

                        </div>
                        <div style={{ border: "solid black", width: "90vw" }}></div>
                    </div>

                    <label to={labelStyle}><b>Success Story Video (URL) (Optional) Link:</b></label>

                    <input
                        type="text"
                        name="storyVideo"
                        placeholder="Story Video URL (YouTube, Vimeo, etc.)"
                        value={formData.storyVideo}
                        onChange={handleInput}
                        style={inputStyle}
                    />

                    <label to={labelStyle}><b>Story About First Name:</b></label>

                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInput}
                        style={inputStyle}
                        required
                    />

                    <label to={labelStyle}><b>Story About Last Name:</b></label>

                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInput}
                        style={inputStyle}
                        required
                    />

                    <label to={labelStyle}><b>Story About Email:</b></label>

                    <input
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInput}
                        style={inputStyle}
                    />

                    <div style={{ border: "double black", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "1vh 1vw" }}>

                        <h4><b>Inmate Information (Optional)</b></h4>

                        <input
                            type="text"
                            name="inmateNumber.number"
                            placeholder="Inmate Number"
                            value={formData.inmateNumber.number}
                            onChange={handleInput}
                            style={{ ...inputStyle, margin: "1vh 0" }}
                        />

                        <select
                            name="inmateNumber.state"
                            value={formData.inmateNumber.state}
                            onChange={handleInput}
                            style={inputStyle}
                        >
                            <option value="">Select State</option>

                            {locationList.map((state) => (
                                <option key={state} value={state}>
                                    {state.replace("-", " ")}
                                </option>
                            ))}
                        </select>

                    </div>

                    <label to={labelStyle}><b>Title:</b></label>

                    <input
                        name="title"
                        placeholder="Story Title"
                        value={formData.title}
                        onChange={handleInput}
                        required
                        style={inputStyle}
                    />

                    <label to={labelStyle}><b>Summary Of Story (Optional):</b></label>

                    <input
                        name="outcomeSummary"
                        placeholder="Outcome Summary"
                        value={formData.outcomeSummary}
                        onChange={handleInput}
                        style={inputStyle}
                    />

                    <div style={{ background: "goldenRod", width: "100%", textAlign: "center" }} onClick={() => setOpenModal(true)}>
                        (Optional) How Do I Use Special Attributes For This Body & Title?
                    </div>

                    <label to={labelStyle}><b>Story Body:</b></label>

                    <h6 style={{ textAlign: "center" }}>
                        Example For Img =
                        <code>&lt;img src="http://localhost:8080/upload/image/<b style={{ color: "blue" }}>imageFileId</b>?bucketName=<b style={{ color: "blue" }}>imageBucketName</b>" alt="Description" /&gt;</code>
                    </h6>

                    <textarea
                        name="storyText"
                        placeholder="Write the success story..."
                        value={formData.storyText}
                        onChange={handleInput}
                        onKeyDown={handleDescriptionKeyDown}
                        rows="40"
                        required
                        style={inputStyle}
                    />

                    {formData.storyText ?
                        <div>
                            <b>Preview Of Body:</b>

                            <div
                                style={{ width: "90%", padding: "2vw", wordBreak: "break-all", background: "white", whiteSpace: "pre-wrap", }}
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formData.storyText) }}
                            />
                        </div>
                        : ""}

                    <label to={labelStyle}><b>Graduated Program Name:</b></label>

                    <input
                        name="programName"
                        placeholder="Program Name"
                        value={formData.programName}
                        onChange={handleInput}
                        style={inputStyle}
                        required
                    />

                    <label to={labelStyle}><b>Graduation Date:</b></label>

                    <input
                        name="graduationDate"
                        type="date"
                        placeholder="Graduation Date"
                        value={formData.graduationDate}
                        onChange={handleInput}
                        style={inputStyle}
                        required
                    />

                    <label to={labelStyle}><b>Graduation City:</b></label>

                    <input
                        name="location.city"
                        placeholder="City"
                        value={formData.location.city}
                        onChange={handleInput}
                        style={inputStyle}
                        required
                    />

                    <label to={labelStyle}><b>Graduation State:</b></label>

                    <select
                        name="location.state"
                        value={formData.location.state}
                        onChange={handleInput}
                        style={inputStyle}
                        required
                    >

                        <option value="">Select State</option>

                        {locationList.map((state) => (
                            <option key={state} value={state}>
                                {state.replace("-", " ")}
                            </option>
                        ))}

                    </select>

                    <button type="submit" style={{ background: "goldenRod", margin: "1vh", width: "100%" }}>
                        Submit Story
                    </button>

                </form>

            </div>

            <dialog open={openModal}>
                <CreateMsgModal openModal={openModal} setOpenModal={setOpenModal} />
            </dialog>

        </div>
    );
};

export default CreateSuccessStory;