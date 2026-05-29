import React, { useEffect, useState } from "react"
import { addMailUser } from "../../../../redux/reducers/menteeReducers"
import { useDispatch, useSelector } from "react-redux"
import { resetErrorMessage, resetSuccessMessage } from "../../../../redux/reducers/directMsgStaffReducers"

const locationList = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New-Hampshire", "New-Jersey", "New-Mexico", "New-York", "North-Carolina", "North-Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode-Island", "South-Carolina", "South-Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West-Virginia", "Wisconsin", "Wyoming"]

const programStatusList = ["incarcerated", "attendingProgram", "Did-Not-Arrive", "removedFromProgram", "quitProgram", "completedProgram"]

const CreateMenteeUser = ({ setChangeContent }) => {
    const dispatch = useDispatch()
    const successMessage = useSelector(state => state.mentee.successMessage)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        sex: "",
        currentLocation: "",
        dateOfBirth: "",
        currentCharge: "",
        currentInsurance: "",
        lastContact: "",
        inmateNumbers: [{ state: "", number: "" }],
        projectedReleaseDate: "",
        maxReleaseDate: "",
        programStatus: "",
        menteeImage: "",
        menteeImageFile: null,
        menteeImagePreview: null,
        menteeImageFileId: null,
        menteeImageBucketName: null
    })

    const handleInput = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleInmateChange = (field, value) => {
        setFormData(prev => ({ ...prev, inmateNumbers: [{ ...prev.inmateNumbers[0], [field]: value }] }))
    }

    const handleMenteeImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return
        if (formData.menteeImagePreview) URL.revokeObjectURL(formData.menteeImagePreview)
        const previewUrl = URL.createObjectURL(file)
        setFormData(prev => ({ ...prev, menteeImageFile: file, menteeImagePreview: previewUrl }))
    }

    const handleClearUploadImage = (fieldPrefix) => async () => {
        const previewKey = `${fieldPrefix}Preview`
        const fileKey = `${fieldPrefix}File`
        const fileIdKey = `${fieldPrefix}FileId`
        const bucketNameKey = `${fieldPrefix}BucketName`
        const previewUrl = formData[previewKey]
        const fileId = formData[fileIdKey]
        const bucketName = formData[bucketNameKey]
        try {
            if (fileId && bucketName) {
                await fetch(`/upload/image/${fileId}?bucketName=${bucketName}`, { method: "DELETE" })
            }
        } catch (err) {
            console.error("Failed to delete image", err)
        }
        if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
        setFormData(prev => ({ ...prev, [previewKey]: null, [fileKey]: null, [fileIdKey]: null, [bucketNameKey]: null, [fieldPrefix]: "" }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let uploadResult = null
        try {
            if (formData.menteeImageFile) {
                const body = new FormData()
                body.append("image", formData.menteeImageFile)
                const res = await fetch("http://localhost:8080/upload/image", { method: "POST", body })
                if (!res.ok) throw new Error("Image upload failed")
                uploadResult = await res.json()
            }

            const payload = {
                ...formData,
                inmateNumbers: formData.inmateNumbers.filter(entry => entry.state?.trim() || entry.number?.trim()).map(entry => ({ state: entry.state, number: entry.number })),
                menteeImage: uploadResult?.url ?? formData.menteeImage,
                menteeImageFileId: uploadResult?.fileId ?? formData.menteeImageFileId,
                menteeImageBucketName: uploadResult?.bucketName ?? formData.menteeImageBucketName
            }

            delete payload.menteeImageFile
            delete payload.menteeImagePreview

            dispatch(addMailUser(payload))
        } catch (err) {
            console.error("Submit error:", err)
        }
    }

    useEffect(() => {
        if (successMessage === "Mail user created successfully!") {
            setChangeContent("adminMentee")
            dispatch(resetErrorMessage())
            dispatch(resetSuccessMessage())
        }
    }, [successMessage, dispatch, setChangeContent])

    const labelStyle = { width: "100%", textAlign: "center", fontWeight: "bold", display: "flex", justifyContent: "center", gap: "0.5vw" }
    const inputStyle = { border: "solid lightGrey", background: "white", width: "80%" }

    return (
        <div style={{ width: "100vw", display: "flex", justifyContent: "center" }}>
            
            <form onSubmit={handleSubmit} style={{ width: "90%", background: "rgba(250,235,215,0.95)", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <h2 style={{ textAlign: "center" }}>Create A Mentee</h2>
                {formData?.menteeImagePreview === null ? (
                    <>
                        <h4 style={labelStyle}>Image URL</h4>
                        <input type="text" name="menteeImage" value={formData.menteeImage} onChange={handleInput} placeholder="http://example.com/image.jpg" style={inputStyle} />
                    </>
                ) : ""}

                {formData.menteeImage === "" ? (
                    <div style={{ width: "80%", background: "white", display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem" }}>
                        <h4 style={labelStyle}>{formData?.menteeImagePreview === null ? "Or Upload Image" : "Image Ready For Upload"}</h4>
                        <input type="file" accept=".png,.jpg,.jpeg,.gif" onChange={handleMenteeImageUpload} />
                        {formData.menteeImagePreview && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img src={formData.menteeImagePreview} style={{ maxWidth: "120px", marginTop: "10px" }} alt="Mentee preview" />
                                <button type="button" onClick={handleClearUploadImage("menteeImage")} style={{ background: "red", padding: "0 1vw", margin: "1vh 0", width: "fit-content" }}>Cancel Image</button>
                            </div>
                        )}
                    </div>
                ) : ""}


                <label style={labelStyle}>First Name: (Required)</label>
                <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInput} style={inputStyle} required />

                <label style={labelStyle}>Last Name: (Required)</label>
                <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInput} style={inputStyle} required />

                <label style={labelStyle}>Email: (Optional)</label>
                <input name="email" placeholder="Email" value={formData.email} onChange={handleInput} style={inputStyle} />

                <label style={labelStyle}>Phone Number: (Optional)</label>
                <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInput} style={inputStyle} />

                <label style={labelStyle}>Gender: (Required)</label>
                <select name="sex" value={formData.sex} onChange={handleInput} style={inputStyle} required>
                    <option value="">- Select A Gender -</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                <label style={labelStyle}>Date Of Birth: (Required)</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInput} style={inputStyle} required />

                <label style={labelStyle}>Current Charge: (Optional)</label>
                <input name="currentCharge" placeholder="Current Charge" value={formData.currentCharge} onChange={handleInput} style={inputStyle} />

                <label style={labelStyle}>Current Insurance: (Required)</label>
                <input name="currentInsurance" placeholder="Insurance" value={formData.currentInsurance} onChange={handleInput} style={inputStyle} required />

                <label style={labelStyle}>Inmate Number: (Optional)</label>
                <input name="number" placeholder="Inmate Number" value={formData.inmateNumbers[0].number} onChange={(e) => handleInmateChange("number", e.target.value)} style={inputStyle} />

                {formData.inmateNumbers[0].number ? <>
                    <label style={labelStyle}>Inmate State: (Required With Inmate Number)</label>
                    <select name="state" value={formData.inmateNumbers[0].state} onChange={(e) => handleInmateChange("state", e.target.value)} style={inputStyle}>
                        <option value="">- Select A State -</option>
                        {locationList.map(location => <option key={location} value={location}>{location}</option>)}
                    </select></> : ""}

                <label style={labelStyle}>Program Status: (Required)</label>
                <select name="programStatus" value={formData.programStatus} onChange={handleInput} style={inputStyle}>
                    <option value="">- Select A Program Status -</option>
                    {programStatusList.map(status => <option key={status} value={status}>{status}</option>)}
                </select>

                {formData.programStatus === "incarcerated" ? <>
                    <label style={labelStyle}>Projected Release Date: (Required If incarcerated)</label>
                    <input type="date" name="projectedReleaseDate" value={formData.projectedReleaseDate} onChange={handleInput} style={inputStyle} />

                    <label style={labelStyle}>Max Release Date: (Required If incarcerated)</label>
                    <input type="date" name="maxReleaseDate" value={formData.maxReleaseDate} onChange={handleInput} style={inputStyle} />
                </> : ""}


                <button type="submit" style={{ background: "lime", width: "80%", height: "5vh" }}>Create Mentee</button>
            </form>
        </div>
    )
}

export default CreateMenteeUser
