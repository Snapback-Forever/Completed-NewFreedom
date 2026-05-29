import React, { useEffect, useState } from 'react'
import logo from "../../images/newFreedomLogo.png"
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/reducers/authReducer';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = ({ darkMode, setDarkMode, setOpenLogin }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const errorMessage = useSelector(state => state.auth.errorMessage)
    const successMessage = useSelector(state => state.auth.successMessage)

    const [showPassword, setShowPassword] = useState(false);
    const [showSecretKey, setShowSecretKey] = useState(false);

    const securityQuestionOptions = [
        "In one word, What is your Mother's maiden name?",
        "In one word, What was the First name of your first crush?",
        "In one word, What is your Favorite food?",
        "In one word, what City were you born?",
        "In one word, What was your NickName your parents gave you?",
        "In one word, What is the one Place you want to visit most",
        "In one word, Where do you see yourself in 10 years",
    ];

    const [formData, setFormData] = useState({
        // Identity / Names
        accountName: "",
        accountNameNormalized: "",
        firstName: "",
        lastName: "",
        sex: "", // "male" | "female"
        dateOfBirth: "",
        // Contact Info
        yourAddress: "",
        yourPhoneNumber: "",
        email: "",
        // Security & Auth
        password: "",
        password2: "",
        securityQuestions: [
            { question: "", answer: "" },
            { question: "", answer: "" },
            { question: "", answer: "" },
        ],
        secreteKey: "",
        // Roles / Flags
        admin: true,
        NFadmin: false,
        mentor: false,
        teacher: false,
        newsLetter: false,
        hiring: false,
        programDirector: false,
        staffCustomerService: false,
        websiteSupportTeam: false,
        eventStaff: false,
        // Preferences / UI
        darkMode: false,
        // Profile / Metadata
        staffPosition: "",
        profilePic: "",
        profilePicFileId: null,  // for MongoDB / GridFS metadata
        profilePicBucketName: null,
        profilePicFile: null,       // File object (client only, NOT sent to MongoDB)
        profilePicPreview: null,    // preview URL (client only)
    });

    // Generic handler for simple string/boolean fields
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // For file uploads (PNG/JPG/JPEG/GIF)
    const handleProfilePicUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Revoke old preview URL to avoid leaks
        if (formData.profilePicPreview) {
            URL.revokeObjectURL(formData.profilePicPreview);
        }
        const previewUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
            ...prev,
            profilePicFile: file,
            profilePicPreview: previewUrl,
        }));
    };

    const handleSecurityQuestionChange = (index, field, value) => {
        setFormData((prev) => {
            const updatedQuestions = prev.securityQuestions.map((sq, i) =>
                i === index ? { ...sq, [field]: value } : sq
            );
            return {
                ...prev,
                securityQuestions: updatedQuestions,
            };
        });
    };

    const handleClearUploadImage = (fieldPrefix) => async () => {
        const previewKey = `${fieldPrefix}Preview`;
        const fileKey = `${fieldPrefix}File`;
        const fileIdKey = `${fieldPrefix}FileId`;
        const bucketNameKey = `${fieldPrefix}BucketName`;
        const deleteFlagKey = `${fieldPrefix}Deleted`;
        const previewUrl = formData[previewKey];
        const fileId = formData[fileIdKey];
        const bucketName = formData[bucketNameKey];
        try {
            if (fileId && bucketName) {
                const res = await fetch(`/upload/image/${fileId}?bucketName=${bucketName}`, {
                    method: "DELETE",
                });
                if (!res.ok) {
                    console.error("Server failed to delete file");
                }
            }
        } catch (err) {
            console.error("Failed to delete file from server", err);
        }
        // Clean up browser blob preview
        if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }
        // Reset form state
        setFormData((prev) => ({
            ...prev,
            [previewKey]: null,
            [fileKey]: null,
            [fileIdKey]: "",
            [bucketNameKey]: "",
            [deleteFlagKey]: true,
            profilePic: "",
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        let uploadResult = null;
        // 1) If user selected a file, upload it now
        if (formData.profilePicFile) {
            const body = new FormData();
            body.append("image", formData.profilePicFile);
            const res = await fetch("http://localhost:8080/upload/image", {
                method: "POST",
                body,
            });
            if (!res.ok) {
                // handle error or show message
                throw new Error("Image upload failed");
            }
            uploadResult = await res.json(); // { url, fileId, bucketName }
        }
        // 2) Build final payload for registration
        const payload = {
            ...formData,
            profilePic: uploadResult?.url ?? formData.profilePic,
            profilePicFileId: uploadResult?.fileId ?? formData.profilePicFileId,
            profilePicBucketName: uploadResult?.bucketName ?? formData.profilePicBucketName,
        };
        // 3) Dispatch registration with final data
        dispatch(register(payload));
    };

    useEffect(() => {
        if (successMessage === "Registration successful!") {
            navigate("/")
        }
        if (errorMessage === "This email is not allowed to register on this site." || errorMessage === "This email is not authorized to register.") {
            navigate("/")
        }
    }, [successMessage, errorMessage])


    return (
        <div >

            <div style={{ height: "94vh", width: "100vw", overflowY: "scroll" }}>
                <h1 style={{ color: darkMode ? "white" : "black", width: "100%", textAlign: "center" }}>Registration For New Freedom </h1>

                <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

                    {/* Profile Pic URL (manual entry) */}
                    {formData?.profilePicPreview === null && (
                        <>
                            <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>
                                Profile Picture URL:
                            </h4>
                            <input
                                style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                                type="text"
                                name="profilePic"
                                value={formData.profilePic}
                                onChange={handleChange}
                                placeholder="http://localhost:5173/exampleImageLink.com"
                            />
                        </>
                    )}

                    {formData.profilePic === "" ?
                        <div
                            style={{
                                width: "80%",
                                background: "white",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "1vh",
                                marginTop: "1rem",
                            }}
                        >
                            <h4
                                style={{
                                    color: darkMode ? "white" : "black",
                                    width: "80%",
                                    textAlign: "center",
                                }}
                            >
                                {formData?.profilePicPreview ? "Picture Ready For Upload" : "Or Upload a profile picture:"}
                            </h4>
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.gif"
                                onChange={handleProfilePicUpload}
                                style={{ background: "green", width: "80%", color: "white" }}
                            />
                            {formData.profilePicPreview && (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <img
                                        src={formData.profilePicPreview}
                                        style={{ maxWidth: "10vw", margin: "0.5vh" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleClearUploadImage("profilePic")}
                                        style={{ background: "red", padding: "0 1vw", margin: "1vh 0", width: "fit-content" }}
                                    >
                                        Cancel Image
                                    </button>
                                </div>
                            )}
                        </div> : ""}

                    {/* accountName */}
                    <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Account Name:</h4>
                    <input
                        style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                        type="text"
                        name="accountName"
                        value={formData.accountName}
                        onChange={handleChange}
                        placeholder='Snapback-Forever Lover'
                        maxLength={50}
                        required
                    />

                    {/* firstName */}
                    <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>First Name:</h4>
                    <input
                        style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder='Jane/John'
                        maxLength={50}
                        required
                    />

                    {/* lastName */}
                    <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Last Name:</h4>
                    <input
                        style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder='Dow'
                        maxLength={100}
                        required
                    />

                    {/* sex */}
                    <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Sex:</h4>
                    <select
                        style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="male">male</option>
                        <option value="female">female</option>
                    </select>

                    {/* dateOfBirth */}
                    <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Date of Birth:</h4>
                    <input
                        style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />

                    {/* yourAddress */}
                    <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Address:</h4>
                    <input
                        style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                        type="text"
                        name="yourAddress"
                        value={formData.yourAddress}
                        onChange={handleChange}
                        placeholder='1234 Street, Phoenix, Arizona, 123456'
                        maxLength={200}
                    />

                    {/* yourPhoneNumber */}
                    <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Phone Number:</h4>
                    <input
                        style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                        type="tel"
                        name="yourPhoneNumber"
                        value={formData.yourPhoneNumber}
                        onChange={handleChange}
                        placeholder='(555)555-5555'

                    />

                    {/* email */}
                    <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Email:</h4>
                    <input
                        style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='example@mail.com'

                    />

                    {/* Password */}
                    <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>
                        Password:
                    </h4>

                    <div  style={{ width: "80%", display: "flex" }} >
                        <input
                            style={{
                                border: "solid lightGrey",
                                borderRight: "none",
                                background: "white",
                                width: "100%",
                              
                            }}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 8 chars, 1 upper, 1 lower, 1 number"
                        />
                        <div onClick={() => setShowPassword(!showPassword)} >
                            {showPassword ? (
                                <div
                                    style={{ border: "solid lightgray", borderLeft: "none", background: "whiteSmoke" }}
                                    title="Hide Password"
                                >
                                    😲
                                </div>
                            ) : (
                                <div
                                    style={{ border: "solid lightgray", borderLeft: "none", background: "whiteSmoke" }}
                                    title="Show Password"
                                >
                                    😎
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Re-enter Password */}
                    <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>
                        Re-enter Password:
                    </h4>
                    <div style={{ width: "80%", display: "flex" }} >
                        <input
                            style={{
                                border: "solid lightGrey",
                                borderRight: "none",
                                background: "white",
                                width: "100%",
                              
                            }}
                            type={showPassword ? "text" : "password"}
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            placeholder="********"
                        />
                        <div onClick={() => setShowPassword(!showPassword)} >
                            {showPassword ? (
                                <div
                                    style={{ border: "solid lightgray", borderLeft: "none", background: "whiteSmoke" }}
                                    title="Hide Password"
                                >
                                    😲
                                </div>
                            ) : (
                                <div
                                    style={{ border: "solid lightgray", borderLeft: "none", background: "whiteSmoke" }}
                                    title="Show Password"
                                >
                                    😎
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Secret Key */}
                    <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>
                        Secret Key:
                    </h4>
                    <div style={{ width: "80%", display: "flex" }} >
                        <input
                            style={{
                                border: "solid lightGrey",
                                borderRight: "none",
                                background: "white",
                                width: "100%",
                          
                            }}
                            type={showSecretKey ? "text" : "password"}
                            name="secreteKey"
                            value={formData.secreteKey}
                            onChange={handleChange}
                            placeholder="NO ONE HAS ACCESS TO SEE THIS # (MAX LENGTH IS 10)"
                            maxLength={10}
                        />
                        <div onClick={() => setShowSecretKey(!showSecretKey)} >
                            {showSecretKey ? (
                                <div 
                                    style={{ border: "solid lightgray", borderLeft: "none", background: "whiteSmoke" }}
                                    title="Hide Secret"
                                >
                                    😲
                                </div>
                            ) : (
                                <div
                                    style={{ border: "solid lightgray", borderLeft: "none", background: "whiteSmoke" }}
                                    title="Show Secret"
                                >
                                    😎
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ width: "100vw", display: "flex", flexDirection: "column", alignItems: "end" }}>

                        {/* Security Questions (3 required) */}
                        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Security Questions:</h4>
                        {formData.securityQuestions.map((sq, index) => (
                            <div key={index} style={{ width: "80%", marginBottom: "1rem" }}>
                                {/* Question select */}
                                <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Question {index + 1}:</h4>
                                <select
                                    style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                                    value={sq.question}
                                    onChange={(e) =>
                                        handleSecurityQuestionChange(index, "question", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select a question</option>
                                    {securityQuestionOptions.map((q) => (
                                        <option key={q} value={q}>
                                            {q}
                                        </option>
                                    ))}
                                </select>
                                {/* Answer input */}
                                <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Answer {index + 1}:</h4>
                                <input
                                    style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                                    type="text"
                                    value={sq.answer}
                                    onChange={(e) =>
                                        handleSecurityQuestionChange(index, "answer", e.target.value)
                                    }
                                    placeholder='myAnswer'
                                    maxLength={50}
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    <div style={{ width: "100vw", display: "flex", flexDirection: "column", alignItems: "end" }}>
                        <h2 style={{ color: darkMode ? "white" : "black", width: "100%", textAlign: "center" }}>What Are Your Responsibilities:</h2>

                        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Mentor:</h4>
                        <input
                            style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                            type="checkbox"
                            name="mentor"
                            checked={formData.mentor}
                            onChange={handleChange}
                        />

                        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Teacher:</h4>
                        <input
                            style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                            type="checkbox"
                            name="teacher"
                            checked={formData.teacher}
                            onChange={handleChange}
                        />

                        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Newsletter Staff:</h4>
                        <input
                            style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                            type="checkbox"
                            name="newsLetter"
                            checked={formData.newsLetter}
                            onChange={handleChange}
                        />

                        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Hiring Staff:</h4>
                        <input
                            style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                            type="checkbox"
                            name="hiring"
                            checked={formData.hiring}
                            onChange={handleChange}
                        />

                        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Program Director:</h4>
                        <input
                            style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                            type="checkbox"
                            name="programDirector"
                            checked={formData.programDirector}
                            onChange={handleChange}
                        />

                        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Staff Customer Service:</h4>
                        <input
                            style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                            type="checkbox"
                            name="staffCustomerService"
                            checked={formData.staffCustomerService}
                            onChange={handleChange}
                        />

                        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}> Website SupportTeam:</h4>
                        <input
                            style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                            type="checkbox"
                            name="websiteSupportTeam"
                            checked={formData.websiteSupportTeam}
                            onChange={handleChange}
                        />

                        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Event Staff:</h4>
                        <input
                            style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                            type="checkbox"
                            name="eventStaff"
                            checked={formData.eventStaff}
                            onChange={handleChange}
                        />

                    </div>

                    {/* staffPosition */}
                    <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Staff Position:</h4>
                    <input
                        style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                        type="text"
                        name="staffPosition"
                        value={formData.staffPosition}
                        onChange={handleChange}
                        placeholder='NewFreedom Employee'
                        maxLength={100}
                    />


                    <br />
                    <button type="submit" style={{ background: "goldenRod", width: "80%", height: "5vh" }}>Submit</button>

                </form>

            </div>

            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", height: "6vh", background: "white" }} >
                <img src={logo} style={{ height: "6vh", marginLeft: "2vw" }} title="Created By Snapback-Forever" />

            </div>
        </div>
    )
}

export default RegistrationPage
