import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { addJobApplicationToJob, getSingleJobListing } from '../../../redux/reducers/applicationReducers'
import DOMPurify from 'dompurify';

const ApplicationContent = ({ darkMode, setDarkMode }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { jobId } = useParams()

    const singleJob = useSelector((state) => state.app.singleJobListing)
    const successMessage = useSelector((state) => state.app.successMessage)

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        resumeUrl: "",
        resumeFileId: null,      // better: null when “no file”
        resumeBucketName: null,  // better: null when “no file”
    });

    // generic top-level handler
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("image", file); // must match upload.single('image')
        try {
            const res = await fetch("http://localhost:8080/upload/image", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setForm((prev) => ({
                ...prev,
                resumeFileId: data.fileId,
                resumeBucketName: data.bucketName,
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            jobId: singleJob?._id,
            ...form,   // spread the form fields into payload
        };
        dispatch(addJobApplicationToJob(payload));
    };

    useEffect(() => {
        if (successMessage === 'Job application created successfully!') {
            // reset
            setForm({
                jobId: singleJob?._id,
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                resumeUrl: '',
                coverLetter: '',

            })
            navigate('/')
        }

    }, [successMessage])

    useEffect(() => {
        dispatch(getSingleJobListing(jobId))
    }, [])


    return (
        <div
            style={{
                width: '100vw',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: !darkMode
                    ? "linear-gradient(to right, lightBlue 30%, blue"
                    : "linear-gradient(to right, black, blue)",
                padding: '2rem',
            }}
        >

            <div style={{ background: "white", width: "98%", padding: "2vh 1vw", margin: "1vh 0" }}>
            <div style={{ color: darkMode ? "white" : "black", width: "80%" }}><b>Job Your Applying For:</b></div>
                <h3 style={{ width: "100%", textAlign: "center" }}>{singleJob?.title}</h3>
                <div style={{ width: "100%", textAlign: "center", whiteSpace: "pre-wrap", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(singleJob?.description) }} />

                <div style={{ border: "1px solid black" }}></div>
                <div style={{ display: "flex" }}>

                    <h6 style={{ width: "100%", textAlign: "center" }}>Volunteer Work</h6>
                    <h6 style={{ width: "100%", textAlign: "center" }}>Hours: {singleJob?.jobType}</h6>
                    <h6 style={{ width: "100%", textAlign: "center" }}>Job Location: {singleJob?.location}</h6>
                </div>

                <div>
                    <div style={{ border: "1px solid black" }}></div>
                    <h4 style={{ width: "100%", textAlign: "center" }}><u>Experience Needed</u></h4>
                    {singleJob?.requirements.map(req => {
                        return (
                            <ul>
                                <li>💠 {req}</li>
                            </ul>
                        )
                    })}
                    <div style={{ border: "1px solid black" }}></div>
                </div>

                <div style={{ width: "100%" }}>
                    <h4 style={{ width: "100%", textAlign: "center" }}><u>Expected Responsibilities</u></h4>
                    {singleJob?.responsibilities.map(res => {
                        return (
                            <ul>
                                <li>✔️ {res}</li>
                            </ul>
                        )
                    })}
                    <div style={{ border: "1px solid black" }}></div>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                }}
            >
                <h2 style={{ color: darkMode ? "white" : "black", width: "100%", textAlign: "center" }}> Applying For {singleJob?.title} Job:</h2>

                <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>First Name:</h4>
                <input
                    type="text"
                    name="firstName"
                    placeholder="Jane/John"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                    maxLength={50}
                />

                <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Last Name:</h4>
                <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                    maxLength={100}
                />

                <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Email:</h4>
                <input
                    type="email"
                    name="email"
                    placeholder="example@mail.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                />

                <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Phone Number:</h4>
                <input
                    type="tel"
                    name="phone"
                    placeholder="(555)555-5555"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    style={{ border: "solid lightGrey", background: "white", width: "80%" }}

                />
                <div style={{ width: "80%", background: "white", display: "flex", flexDirection: "column", alignItems: "center", padding: "1vh" }}>
                    <h4 style={{ color: "black", width: "80%", textAlign: 'center' }}>Resume URL Link:</h4>
                    
                    <input
                        type="url"
                        name="resumeUrl"
                        placeholder="Resume URL http://localhost:5173/example/resume"
                        value={form.resumeUrl}
                        onChange={handleChange}
                        style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                    />

                    <h2 style={{ color: "black", width: "80%", textAlign: 'center' }}>OR</h2>

                    <div style={{ width: "80%", background: "white", display: "flex", flexDirection: "column", alignItems: "center", padding: "1vh" }}>
                        <h4 style={{ color:"black", width: "80%", textAlign: 'center' }}>upload your resume:</h4>
                        <h6><b>Allowed File Types:</b> .pdf, .doc, .docx, .odt, .rtf, .txt, .xls, .xlsx, .ppt, .pptx</h6>
                        <input
                            type="file"
                            accept="image/*,.pdf,.doc,.docx,.odt,.rtf,.txt,.xls,.xlsx,.ppt,.pptx"
                            onChange={handleResumeUpload}
                            style={{ background: "lightGrey", width: "100%", padding: "1vh 1vw" }}
                        />

                    </div>
                </div>

                {/* SUBMIT */}
                {successMessage !== 'Job application created successfully!' ? (
                    <button type="submit" className="responsiveButton rounded" style={{ background: 'goldenRod', width: '80%', height: '5vh' }}>Submit Your Application</button>
                ) : (
                    <div className="responsiveButton rounded" style={{ background: 'lime', width: '80%', height: '5vh', color: 'black', display: "flex", justifyContent: 'center', alignItems: "center" }}>Thank You For Submitting Your Application</div>
                )}
            </form>
        </div>
    )
}
export default ApplicationContent
