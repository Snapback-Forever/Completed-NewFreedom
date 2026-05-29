import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from 'dompurify'
import { addProgramImage } from "../../../../redux/reducers/locationReducer";


const AddImageModal = ({ singleProgram, setTrigger, setAddImage }) => {

    const dispatch = useDispatch();
 
    const user = useSelector(state => state.auth.user)

    const [form, setForm] = useState({
        programImagePreview: null,
        programImageFile: null,
        link: "",
        description: ""
    });
    
    const baseUrl = "http://127.0.0.1:8080";
    const handleUploadImage = (fieldPrefix) => (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const previewKey = `${fieldPrefix}Preview`;
        const fileKey = `${fieldPrefix}File`;
        setForm((prev) => {
            const prevUrl = prev[previewKey];
            if (prevUrl) URL.revokeObjectURL(prevUrl);
            return prev;
        });
        const previewUrl = URL.createObjectURL(file);
        setForm((prev) => ({
            ...prev,
            [previewKey]: previewUrl,
            [fileKey]: file,
        }));
    };

    const handleSaveImage = (fieldPrefix) => async () => {
   
        const fileKey = `${fieldPrefix}File`;
        const previewKey = `${fieldPrefix}Preview`;
        const file = form[fileKey];
        if (!file) return;
        const fd = new FormData();
        fd.append("image", file);
        const uploadUrl = `${baseUrl}/upload/image/${singleProgram._id}`;
        const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            body: fd,
        });
        if (!uploadRes.ok) {
            console.error("Image upload failed");
            return;
        }
        const { fileId, bucketName } = await uploadRes.json();
        // sanitize description for non-admins
        let cleanDescription = form.description;
        if (cleanDescription) {
            cleanDescription = DOMPurify.sanitize(cleanDescription, {
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
        const payload = {
            programId: singleProgram._id,
            imageFileId: fileId,
            imageBucketName: bucketName,
            link: form.link,
            description: cleanDescription
        };
        try {
            await dispatch(addProgramImage(payload)).unwrap?.();
        } catch (err) {
            console.error("addProgramImage failed:", err);
            return;
        }
        setTrigger((prev) => !prev);
        if (form[previewKey]) {
            URL.revokeObjectURL(form[previewKey]);
        }
        setForm({
            programImagePreview: null,
            programImageFile: null,
            link: "",
            description: ""
        });
    };

    const cancelImage = ()=> {
        setForm({
            programImagePreview: null,
            programImageFile: null,
            link: "",
            description: ""
        });
    }

    const inputStyle = {
        border: 'solid lightGrey',
        background: 'white',
        width: '90%',
        margin: "0 0 1vh 0"
    };

    return (
        <div className="addImageProModal scrollBar" >
            <button style={{ fontSize: "2rem" }} onClick={() => setAddImage(false)}>
                ❎
            </button>

            <h2 style={{ textAlign: "center" }}>Add Images To Program</h2>
            <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "73%", justifyContent: "center", alignItems: "center" }}>

                {!form.link ? <>
                    <label style={{ textAlign: 'center' }}><b>{!form.programImagePreview ? "OR" : ""} Select A Image:</b></label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImage("programImage")}
                        style={inputStyle}
                    />

                    {form.programImagePreview && (
                        <div style={{ border: "double black", width: "60%", display: "flex", flexDirection: "column", alignItems: "center", padding:"1vh 0" }}>
                            <label style={{ textAlign: 'center' }}><b>Image Preview:</b></label>
                            <img
                                src={form.programImagePreview}
                                alt="preview"
                                style={{ width: "200px", marginTop: "10px", margin: '1vh 0' }}
                            />
                            <button style={{ width: "60%", background: "red" }}  onClick={cancelImage}>Cancel Image</button>
                        </div>
                    )}
                  
                </>
                    : ""}

                <label style={{ textAlign: 'center' }}><b>Description Of Image:</b></label>
                <textarea
                    placeholder="Image description"
                    value={form.description}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    style={inputStyle}
                    rows={20}
                    required
                />

            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <button onClick={handleSaveImage("programImage")} style={{ background: "goldenRod", margin: "1vh 0", width: '90%' }}>Save Image</button>
                <button onClick={() => setAddImage(false)} style={{ background: "red", width: '90%' }}>Done Adding Images</button>
            </div>
        </div>
    );
};
export default AddImageModal;