import React, { useEffect, useState } from "react";
import { addSupporter, resetErrorMessage, resetSuccessMessage } from "../../../../redux/reducers/supporterReducers";
import { useDispatch, useSelector } from "react-redux";


const CreateSupport = ({ setChangeContent, supporterId, setSupporterId }) => {

    const dispatch = useDispatch()

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

    const successMessage = useSelector(state => state.support.successMessage)

    const [formData, setFormData] = useState({
        name: "",
        logoUrl: "",
        logoFileId: null,
        logoBucketName: null,
        shortDescription: "",
        phoneNumber: "",
        email: "",
        contactName: "",
        websiteLink: [""],
        address: [{
            street: "",
            city: "",
            state: "",
            zip: "",
            country: ""
        }],

        tier: "",
        logoFile: null,
        logoPreview: null
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: [{
                ...prev.address[0],
                [name]: value
            }]
        }));
    };

    const handleWebsiteChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            websiteLink: [value]
        }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (formData.logoPreview) {
            URL.revokeObjectURL(formData.logoPreview);
        }
        const previewUrl = URL.createObjectURL(file);
        setFormData(prev => ({
            ...prev,
            logoFile: file,
            logoPreview: previewUrl
        }));
    };

    const handleClearUploadImage = async () => {
        try {
            if (formData.logoFileId && formData.logoBucketName) {
                await fetch(`/upload/image/${formData.logoFileId}?bucketName=${formData.logoBucketName}`, {
                    method: "DELETE"
                });
            }
        } catch (err) {
            console.error("Failed to delete logo", err);
        }
        if (formData.logoPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(formData.logoPreview);
        }
        setFormData(prev => ({
            ...prev,
            logoPreview: null,
            logoFile: null,
            logoFileId: null,
            logoBucketName: null,
            logoUrl: ""
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let uploadResult = null;
        try {
            if (formData.logoFile) {
                const body = new FormData();
                body.append("image", formData.logoFile);
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
                logoUrl: uploadResult?.url ?? formData.logoUrl,
                logoFileId: uploadResult?.fileId ?? formData.logoFileId,
                logoBucketName: uploadResult?.bucketName ?? formData.logoBucketName,
                websiteLink: formData.websiteLink.filter(link => link.trim() !== ""),

            };
            delete payload.logoFile;
            delete payload.logoPreview;
            dispatch(addSupporter(payload));
        } catch (err) {
            console.error("Submit error:", err);
        }
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
    };

    useEffect(() => {
        if (successMessage === "Supporter created successfully!") {
            setChangeContent("addSocial")
            dispatch(resetErrorMessage())
            dispatch(resetSuccessMessage())
        }
    }, [successMessage])

    return (
        <div style={{ width: '100vw', minHeight: '84vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: "2vh 0" }}>

            <div style={{ width: '90%', minHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', background: "rgba(250, 235, 215, 0.960)", overflowY: 'auto', padding: '1rem', }}>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        width: "70%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem"
                    }}
                >

                    <h2 style={{ textAlign: "center" }}>Create A Supporter</h2>

                    <h4>Upload Logo</h4>
                    <input
                        name="logoUrl"
                        placeholder="logoUrl"
                        value={formData.logoUrl}
                        onChange={handleInput}
                        style={inputStyle}
                    />


                    {!formData.logoUrl ? <> <h4>{!formData.logoPreview ? "OR" : ""} Upload Logo</h4>
                        <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.gif,.svg"
                            onChange={handleLogoUpload}
                            style={inputStyle}
                        />
                        {formData.logoPreview && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img
                                    src={formData.logoPreview}
                                    style={{ maxWidth: "120px", marginTop: "10px" }}
                                />
                                <button
                                    type="button"
                                    onClick={handleClearUploadImage}
                                    style={{ background: "red", padding: "0 1vw", margin: "1vh 0", width: "50%" }}
                                >
                                    Cancel Logo
                                </button>
                            </div>
                        )}
                    </> : ""}

                    <h2>Create Support Partner</h2>

                    <label style={labelStyle}>Organization Name:</label>
                    <input
                        name="name"
                        placeholder="Organization Name"
                        value={formData.name}
                        onChange={handleInput}
                        required
                        style={inputStyle}
                    />

                    <label style={labelStyle}>Description Of Organization:</label>
                    <textarea
                        name="shortDescription"
                        placeholder="Short Description"
                        value={formData.shortDescription}
                        onChange={handleInput}
                        style={inputStyle}
                    />

                    <label style={labelStyle}>Contact Name:</label>
                    <input
                        name="contactName"
                        placeholder="Contact Name"
                        value={formData.contactName}
                        onChange={handleInput}
                        style={inputStyle}
                    />

                    <label style={labelStyle}>Organization Phone Number:</label>
                    <input
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleInput}
                        style={inputStyle}
                    />

                    <label style={labelStyle}>Organization Email: </label>
                    <input
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInput}
                        style={inputStyle}
                    />

                    <h4>Website</h4>
                    <input
                        placeholder="Website URL"
                        value={formData.websiteLink[0]}
                        onChange={handleWebsiteChange}
                        style={inputStyle}
                    />

                    <h4>Organization Address:</h4>

                    <label style={labelStyle}>Street:</label>
                    <input
                        name="street"
                        placeholder="Street"
                        value={formData.address[0].street}
                        onChange={handleAddressChange}
                        style={inputStyle}
                    />

                    <label style={labelStyle}>City:</label>
                    <input
                        name="city"
                        placeholder="City"
                        value={formData.address[0].city}
                        onChange={handleAddressChange}
                        style={inputStyle}
                    />

                    <label style={labelStyle}>State:</label>
                    <select
                        name="state"
                        value={formData.address[0].state}
                        onChange={handleAddressChange}
                        style={inputStyle}
                    >
                        <option value="">Select State</option>
                        {locationList.map((state) => (
                            <option key={state} value={state}>
                                {state.replace("-", " ")}
                            </option>
                        ))}
                    </select>

                    <label style={labelStyle}>ZipCode:</label>
                    <input
                        name="zip"
                        placeholder="Zip"
                        value={formData.address[0].zip}
                        onChange={handleAddressChange}
                        style={inputStyle}
                    />

                    <label style={labelStyle}>Country:</label>
                    <input
                        name="country"
                        placeholder="Country"
                        value={formData.address[0].country}
                        onChange={handleAddressChange}
                        style={inputStyle}
                    />

                    <h4>Tier Level Of Support:</h4>
                    <select
                        name="tier"
                        value={formData.tier}
                        onChange={handleInput}
                        style={inputStyle}
                    >
                        <option value="">- Select Level Of Support -</option>
                        <option value="platinum">Platinum</option>
                        <option value="gold">Gold</option>
                        <option value="silver">Silver</option>
                        <option value="bronze">Bronze</option>
                        <option value="supporter">Agencies We Work With</option>
                    </select>


                    <button type="submit" style={{ background: "goldenRod", margin: "1vh", width: "100%" }}> Create Supporter </button>

                </form>

            </div>
        </div>

    );
};

export default CreateSupport;