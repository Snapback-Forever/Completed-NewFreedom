import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DOMPurify from "dompurify"
import { addAdditionalSuccessImages } from '../../../../redux/reducers/successStoriesReducer'

const AddSucImageModal = ({ sucInfo, setSucInfo, setTrigger, setAddImage }) => {

    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)

    const [form, setForm] = useState({
        programImagePreview: null,
        programImageFile: null,
        link: "",
        description: ""
    })

    const baseUrl = "http://127.0.0.1:8080"

    const inputStyle = {
        border: 'solid lightGrey',
        background: 'white',
        width: '90%',
        margin: "0 0 1vh 0"
    }

    const handleUploadImage = (fieldPrefix) => (e) => {

        const file = e.target.files[0]

        if (!file) return

        const previewKey = `${fieldPrefix}Preview`
        const fileKey = `${fieldPrefix}File`

        setForm((prev) => {

            if (prev[previewKey]) {
                URL.revokeObjectURL(prev[previewKey])
            }

            return {
                ...prev,
                [previewKey]: URL.createObjectURL(file),
                [fileKey]: file,
                link: ""
            }
        })
    }

    const cancelImage = () => {

        if (form.programImagePreview) {
            URL.revokeObjectURL(form.programImagePreview)
        }

        setForm({
            programImagePreview: null,
            programImageFile: null,
            link: "",
            description: ""
        })
    }

    const handleSaveImage = (fieldPrefix) => async (e) => {

        e.preventDefault()

        const fileKey = `${fieldPrefix}File`
        const previewKey = `${fieldPrefix}Preview`
        const file = form[fileKey]

        if (!file && !form.link.trim()) {
            alert("Please select an image or provide an image link")
            return
        }

        if (!form.description.trim()) {
            alert("Image description is required")
            return
        }

        let fileId = null
        let bucketName = null

        try {

            if (file) {

                const fd = new FormData()

                fd.append("image", file)

                const uploadUrl = `${baseUrl}/upload/image/${sucInfo?._id}`

                const uploadRes = await fetch(uploadUrl, {
                    method: "PUT",
                    body: fd,
                })

                if (!uploadRes.ok) {
                    console.error("Image upload failed")
                    return
                }

                const uploadData = await uploadRes.json()

                fileId = uploadData.fileId
                bucketName = uploadData.bucketName
            }

            let cleanDescription = form.description

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
            })

            const payload = {
                id: sucInfo?._id,
                additionalImages: [
                    {
                        link: form.link || "",
                        imageFileId: fileId,
                        imageBucketName: bucketName,
                        description: cleanDescription
                    }
                ]
            }

            await dispatch(addAdditionalSuccessImages(payload)).unwrap?.()

            setTrigger((prev) => !prev)

            if (form[previewKey]) {
                URL.revokeObjectURL(form[previewKey])
            }

            setForm({
                programImagePreview: null,
                programImageFile: null,
                link: "",
                description: ""
            })

        } catch (err) {

            console.error("addProgramImage failed:", err)

        }
    }

    return (
        <div className="addImageProModal scrollBar">

            <button
                type="button"
                style={{ fontSize: "2rem" }}
                onClick={() => setAddImage(false)}
            >
                ❎
            </button>

            <h2 style={{ textAlign: "center" }}>
                Add Images To Success Story
            </h2>

            <form
                onSubmit={handleSaveImage("programImage")}
                style={{ display: "flex", flexDirection: "column", width: "100%", height: "83%", justifyContent: "center", alignItems: "center" }}
            >

                <label style={{ textAlign: 'center' }}>
                    <b>Select An Image:</b>
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImage("programImage")}
                    style={inputStyle}
                />

                {form.programImagePreview && (

                    <div style={{ border: "double black", width: "60%", display: "flex", flexDirection: "column", alignItems: "center", padding: "1vh 0" }}>

                        <label style={{ textAlign: 'center' }}>
                            <b>Image Preview:</b>
                        </label>

                        <img
                            src={form.programImagePreview}
                            alt="preview"
                            style={{ width: "200px", marginTop: "10px", margin: '1vh 0', maxHeight: "20vh" }}
                        />

                        <button
                            type="button"
                            style={{ width: "60%", background: "red" }}
                            onClick={cancelImage}
                        >
                            Cancel Image
                        </button>

                    </div>
                )}

                <label style={{ textAlign: 'center' }}>
                    <b>OR Image Link:</b>
                </label>

                <input
                    type="text"
                    placeholder="Paste image URL"
                    value={form.link}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            link: e.target.value,
                            programImageFile: null,
                            programImagePreview: null
                        }))
                    }
                    style={inputStyle}
                />

                <label style={{ textAlign: 'center' }}>
                    <b>Description Of Image:</b>
                </label>

                <textarea
                    placeholder="Image description"
                    value={form.description}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            description: e.target.value
                        }))
                    }
                    style={inputStyle}
                    rows={6}
                    required
                />

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>

                    <button
                        type="submit"
                        style={{ background: "goldenRod", margin: "1vh 0", width: '90%' }}
                    >
                        Save Image
                    </button>

                    <button
                        type="button"
                        onClick={() => setAddImage(false)}
                        style={{ background: "red", width: '90%' }}
                    >
                        Done Adding Images
                    </button>

                </div>

            </form>

        </div>
    )
}

export default AddSucImageModal