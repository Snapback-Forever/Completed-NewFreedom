import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useDispatch, useSelector } from "react-redux";
import {
    makeNewsLetter,
    resetErrorMessage,
    resetSuccessMessage
} from "../../../../redux/reducers/newsLetterReducer";
import CreateMsgModal from "./CreateMsgModal";

const CreateNewsLetter = ({ setChangeContent }) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const successMessage = useSelector(state => state.news.successMessage);

    const baseUrl = "http://localhost:8080";

    const [openModal, setOpenModal] = useState(false);

    const [images, setImages] = useState([]);

    const [imgForm, setImgForm] = useState({
        file: null,
        preview: null,
        link: "",
        description: ""
    });

    const [form, setForm] = useState({
        userId: user?._id || "",
        postTitle: "",
        postBody: "",
        periodStart: "",
        periodEnd: "",
        StoriesThisNews: "",
        status: "draft",
        isFeatured: false
    });

    const labelStyle = { width: "100%", textAlign: "center", fontWeight: "bolder", display: "flex", justifyContent: "center", gap: "0.5vw" };

    const inputStyle = { border: "solid lightGrey", background: "white", width: "100%" };

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleDescriptionKeyDown = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();

            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const tabSpaces = "    ";

            const updatedPostBody =
                form.postBody.substring(0, start) +
                tabSpaces +
                form.postBody.substring(end);

            setForm(prev => ({
                ...prev,
                postBody: updatedPostBody
            }));

            requestAnimationFrame(() => {
                textarea.selectionStart = textarea.selectionEnd =
                    start + tabSpaces.length;
            });
        }
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

    const deleteTheImage = (img) => {
        setImages(prev => prev.filter(i => i !== img));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const sanitizedPostBody = form.postBody
            ? DOMPurify.sanitize(form.postBody, {
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
            : "";

        const sanitizedPostTitle = DOMPurify.sanitize(form.postTitle, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: []
        });

        const sanitizedStories = DOMPurify.sanitize(form.StoriesThisNews, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: []
        });

        const payload = {
            ...form,
            userId: user?._id,
            postTitle: sanitizedPostTitle,
            StoriesThisNews: sanitizedStories,
            postBody: sanitizedPostBody,
            additionalImages: images
        };

        dispatch(makeNewsLetter(payload));
    };

    useEffect(() => {
        if (successMessage === "Newsletter created successfully!") {
            setChangeContent("allNews");
            dispatch(resetErrorMessage());
            dispatch(resetSuccessMessage());
        }
    }, [successMessage]);

    return (

        <div style={{ width: "100vw", minHeight: "84vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "2vh 0" }}>
            <div style={{ width: "90%", minHeight: "90%", display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(250,235,215,0.96)", overflowY: "auto", padding: "1rem" }}>

                <h3>Additional Images</h3>

                {images.length === 0 ? <></> :

                    <div style={{ width: "100%", display: "flex", overflowX: "scroll", maxHeight: "35vh", minHeight: "35vh", background: "white" }}>
                        {images.map((img, i) => {

                            const imgSrc =
                                img?.imageFileId && img?.imageBucketName
                                    ? `${baseUrl}/upload/image/${img.imageFileId}?bucketName=${img.imageBucketName}`
                                    : img?.link || null;

                            return (
                                <div
                                    key={i}
                                    style={{ display: "flex", flexDirection: "column", margin: "1vh 0.5vw", border: "double black", padding: "1vh 1vw", maxWidth: "20vw", minWidth: "20vw", maxHeight: "30vh", minHeight: "30vh" }}>

                                    {imgSrc &&
                                        <img
                                            src={imgSrc}
                                            alt=""
                                            style={{ maxWidth: "18vw", minWidth: "18vw", maxHeight: "20vh", minHeight: "20vh" }}
                                        />
                                    }

                                    {img.imageFileId || img.imageBucketName ?
                                        <div
                                            title="Click me to copy"
                                            onClick={() =>
                                                navigator.clipboard.writeText(
                                                    `imageFileId:${img.imageFileId} imageBucketName:${img.imageBucketName}`
                                                )
                                            }
                                            style={{ cursor: "pointer" }}>

                                            <div><b>imageFileId:</b> {img.imageFileId}</div>
                                            <div><b>imageBucketName:</b> {img.imageBucketName}</div>
                                        </div>
                                        : ""}

                                    {img?.link &&
                                        <div
                                            title="Click to copy full link"
                                            onClick={() => navigator.clipboard.writeText(img.link)}
                                            style={{ cursor: "pointer" }}>

                                            <b>Link:</b> {img.link.length > 30 ? `${img.link.slice(0, 15)}...${img.link.slice(-10)}` : img.link}
                                        </div>
                                    }

                                    <div style={{ display: "flex", justifyContent: "end" }}>
                                        <button
                                            style={{ background: "red", padding: "0 2vw", margin: "1vh 0" }}
                                            onClick={() => deleteTheImage(img)}>

                                            Remove Img
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                }

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", width: "70%" }}>
                    <label style={labelStyle}>Upload An Image</label>

                    <input type="file" onChange={handleUploadImage} style={inputStyle} />

                    <label style={labelStyle}>{!imgForm.link ? "OR" : ""} URL Link To Image</label>

                    <input
                        placeholder="Or URL Link"
                        value={imgForm.link}
                        onChange={(e) => setImgForm(prev => ({ ...prev, link: e.target.value }))}
                        style={inputStyle}
                    />

                    <button style={{ background: "goldenRod", margin: "1vh", width: "100%" }} onClick={addImage}>
                        Add Image
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    style={{ width: "70%", display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>

                    <h2 style={{ textAlign: "center" }}>Create Newsletter</h2>

                    <label style={labelStyle}>Title:</label>

                    <input
                        type="text"
                        name="postTitle"
                        value={form.postTitle}
                        onChange={handleInput}
                        required
                        style={inputStyle}
                        maxLength={100}
                    />

                    <label style={labelStyle}>Brief Description Of NewsLetter:</label>

                    <input
                        type="text"
                        name="StoriesThisNews"
                        value={form.StoriesThisNews}
                        onChange={handleInput}
                        required
                        style={inputStyle}
                        maxLength={200}
                    />

                    <div
                        style={{ background: "goldenRod", width: "100%", textAlign: "center" }}
                        onClick={() => setOpenModal(true)}>

                        (Optional) How Do I Use Special Attributes For This Body?
                    </div>

                    <label style={labelStyle}>Body:</label>

                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <b>* EXAMPLE IMG ➡️ <code>&lt;img src="http://localhost:8080/upload/image/<b style={{ color: "blue" }}>imageFileId</b>?bucketName=<b style={{ color: "blue" }}>imageBucketName</b>" style="max-width: 20vw; max-height: 10vh;" /&gt;</code>*</b>
                    </div>

                    <textarea
                        name="postBody"
                        value={form.postBody}
                        onChange={handleInput}
                        onKeyDown={handleDescriptionKeyDown}
                        required
                        style={{ minHeight: "80vh", ...inputStyle }}
                    />

                    {form.postBody &&
                        <div>
                            <b>Preview Of Body:</b>

                            <div
                                style={{ width: "90%", padding: "2vw", wordBreak: "break-all", background: "white", whiteSpace: "pre-wrap" }}
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form.postBody) }}
                            />
                        </div>
                    }

                    <label style={labelStyle}>Start Date:</label>

                    <input
                        type="date"
                        name="periodStart"
                        value={form.periodStart}
                        onChange={handleInput}
                        style={inputStyle}
                    />

                    <label style={labelStyle}>End Date:</label>

                    <input
                        type="date"
                        name="periodEnd"
                        value={form.periodEnd}
                        onChange={handleInput}
                        style={inputStyle}
                    />

                    <button
                        type="submit"
                        style={{ background: "goldenRod", margin: "1vh", width: "100%" }}>

                        Create Newsletter
                    </button>
                </form>

                <dialog open={openModal}>
                    <CreateMsgModal openModal={openModal} setOpenModal={setOpenModal} />
                </dialog>

            </div>
        </div>
    );
};

export default CreateNewsLetter;