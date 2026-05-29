import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addSocial, deleteSocial } from "../../../../redux/reducers/supporterReducers";

const AddSocialSupporter = ({ setChangeContent, setTrigger }) => {

    const dispatch = useDispatch()

    const supporter = useSelector(state => state?.support?.supporter?.supporter);

    const [socials, setSocials] = useState([]);
 
    const [form, setForm] = useState({
        socialName: "",
        socialLink: "",
        socialTitle: "",
        socialLogo: "", 
        socialFile: null,
        socialFileId: null,
        socialBucketName: null,
        socialPreview: null
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        if (name === "socialName") {
            const titleMap = {
                faceBook: "Facebook Link",
                linkedIn: "LinkedIn Link",
                instagram: "Instagram Link",
                x: "X Link"
            };
            setForm(prev => ({
                ...prev,
                socialName: value,
                socialTitle: value === "other" ? "" : titleMap[value]
            }));
            return;
        }
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpload = (e) => {

        const file = e.target.files[0];
        if (!file) return;

        if (form.socialPreview) {
            URL.revokeObjectURL(form.socialPreview);
        }

        const preview = URL.createObjectURL(file);

        setForm(prev => ({
            ...prev,
            socialFile: file,
            socialPreview: preview
        }));
    };

    const clearUpload = () => {

        if (form.socialPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(form.socialPreview);
        }

        setForm(prev => ({
            ...prev,
            socialFile: null,
            socialPreview: null,
            socialFileId: null,
            socialBucketName: null
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!supporter?._id) return;

        if (socials.length >= 8) return;

        let uploadResult = null;

        try {

            if (form.socialFile) {

                const body = new FormData();
                body.append("image", form.socialFile);

                const res = await fetch(
                    "http://localhost:8080/upload/image",
                    {
                        method: "POST",
                        body
                    }
                );

                if (!res.ok) {
                    throw new Error("Image upload failed");
                }

                uploadResult = await res.json();
            }

            const payload = {
                supporterId: supporter?._id,
                socialName: form.socialName,
                socialLink: form.socialLink,
                socialTitle: form.socialTitle,
                socialLogo: uploadResult?.url ?? form.socialLogo,
                socialFileId: uploadResult?.fileId ?? form.socialFileId,
                socialBucketName: uploadResult?.bucketName ?? form.socialBucketName
            };
            dispatch(addSocial(payload))
            setTrigger(true)

            setSocials(prev => [...prev, payload]);

            setForm({
                socialName: "",
                socialLink: "",
                socialTitle: "",
                socialLogo: "",
                socialFile: null,
                socialFileId: null,
                socialBucketName: null,
                socialPreview: null
            });

        } catch (err) {
            console.error(err);
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
        width: '90%',
    };

    const supSocials = supporter?.social
    const usedSocials = supSocials?.map(s => s?.socialName);

    const deleteThisSocial = (socialId) => {
        const payload = {
            supporterId: supporter?._id,
            socialId: socialId
        }
        dispatch(deleteSocial(payload))
    }

    return (

        <div style={{ width: '100vw', minHeight: '84vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: "2vh 0" }}>

            <div style={{ width: '90%', minHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', background: "rgba(250, 235, 215, 0.960)", overflowY: 'auto', padding: '1rem', }}>

                <div style={{ width: "70%", display: "flex", flexDirection: "column", gap: "1rem" }}>

                    <h2 style={{ textAlign: "center" }}>Add Social Links</h2>

                    <label style={labelStyle}>Select The Link Type:</label>
                    <select
                        name="socialName"
                        value={form.socialName}
                        onChange={handleInput}
                        style={inputStyle}
                    >
                        <option value="">-- Select The Type Of Link --</option>
                        <option value="faceBook" disabled={usedSocials?.includes("faceBook")}>
                            {!usedSocials?.includes("faceBook") ? "Facebook" : "✅ Facebook Link"}
                        </option>
                        <option value="linkedIn" disabled={usedSocials?.includes("linkedIn")}>
                            {!usedSocials?.includes("linkedIn") ? "LinkedIn" : "✅ LinkedIn Link"}
                        </option>
                        <option value="instagram" disabled={usedSocials?.includes("instagram")}>
                            {!usedSocials?.includes("instagram") ? "Instagram" : "✅ Instagram Link"}
                        </option>
                        <option value="x" disabled={usedSocials?.includes("x")}>
                            {!usedSocials?.includes("x") ? "X" : "✅ X Link"}
                        </option>
                        <option value="other">
                            Other Supporter Link
                        </option>
                    </select>

                    {form.socialName === "other" ? <>  <h4>Logo URL (optional)</h4>

                        {!form.socialPreview ? <input
                            name="socialLogo"
                            placeholder="https://example.com/logo.png"
                            value={form.socialLogo}
                            onChange={handleInput}
                            style={inputStyle}
                        /> : ""}

                        {!form.socialLogo ? <>
                            <h4>{!form.socialPreview ? "OR" : ""} Upload Logo</h4>

                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.gif,.svg"
                                onChange={handleUpload}
                                style={inputStyle}
                            />

                            {form.socialPreview && (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <img
                                        src={form.socialPreview}
                                        style={{ maxWidth: "100px", marginTop: "10px" }}
                                    />

                                    <button type="button" onClick={clearUpload} style={{ background: "red", padding: "0 1vw", margin: "1vh 0", width: "fit-content" }} > Cancel Image </button>

                                </div>
                            )}</> : ""}

                        {socials.length >= 8 && (
                            <p>Maximum of 8 social links reached.</p>
                        )}
                    </> : ""}

                    <form
                        onSubmit={handleSubmit}
                        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                    >


                        <label style={labelStyle}></label>
                        <input
                            name="socialLink"
                            placeholder="Social Link"
                            value={form.socialLink}
                            onChange={handleInput}
                            required
                            style={inputStyle}
                        />

                        {form.socialName === "other" ? <>  <label style={labelStyle}></label>
                            <input
                                name="socialTitle"
                                placeholder="Display Title"
                                value={form.socialTitle}
                                onChange={handleInput}
                                style={inputStyle}
                                readOnly={form.socialName !== "other"}
                            />
                        </> : ""}


                        <button type="submit" disabled={socials.length >= 8} style={{ background: "green", margin: "1vh", width: "90%" }}> Add A Social Link </button>

                    </form>

                    <h3>Added Social Links Preview</h3>

                    {supSocials?.map((item, index) => {

                        const baseUrl = "http://localhost:8080";
                        const imgSrc =
                            item?.socialFileId && item?.socialBucketName
                                ? `${baseUrl}/upload/image/${item?.socialFileId}?bucketName=${item?.socialBucketName}`
                                : item?.socialLogo;
                        return (
                            <div key={index} style={{ background: "white", display: 'flex', flexDirection: "column" }}>
                                <div style={{ display: "flex" }}>
                                    {item?.socialName === "other" ?
                                        <img src={imgSrc} style={{ minWidth: "10vw", maxWidth: "10vw", maxHeight: "10vh", minHeight: "10vh" }} />
                                        : ""}

                                    <> {/* Twitter */}
                                        {item?.socialName === "x" ? <div style={{ minWidth: "10vw", maxWidth: "10vw", maxHeight: "10vh", minHeight: "10vh", }}>

                                            <svg style={{ margin: "0 0.5vw", minHeight: "100%", minWidth: "100%", maxHeight: "100%", maxWidth: "100%", color: "blue" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                                            </svg>

                                        </div> : ""}

                                        {item?.socialName === "faceBook" ?
                                            <div style={{ minWidth: "10vw", maxWidth: "10vw", maxHeight: "10vh", minHeight: "10vh" }}>
                                                {/* facebook */}

                                                <svg style={{ margin: "0 0.5vw", minHeight: "100%", minWidth: "100%", maxHeight: "100%", maxWidth: "100%", color: "blue" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clipRule="evenodd" />
                                                </svg>


                                            </div> : ""}


                                        {item?.socialName === "linkedIn" ?
                                            <div style={{ minWidth: "10vw", maxWidth: "10vw", maxHeight: "10vh", minHeight: "10vh" }}>
                                                {/* LinkedIn */}

                                                <svg style={{ margin: "0 0.5vw", minHeight: "100%", minWidth: "100%", maxHeight: "100%", maxWidth: "100%", color: "blue" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clipRule="evenodd" />
                                                    <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                                                </svg>


                                            </div> : ""}


                                        {item?.socialName === "instagram" ?
                                            <div style={{ minWidth: "10vw", maxWidth: "10vw", maxHeight: "10vh", minHeight: "10vh" }}>
                                                {/* INSTAGRAM */}

                                                <svg style={{ margin: "0 0.5vw", minHeight: "100%", minWidth: "100%", maxHeight: "100%", maxWidth: "100%", color: "blue" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path fill="currentColor" fillRule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clipRule="evenodd" />
                                                </svg>

                                            </div> : ""}

                                    </>

                                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                        <h6 style={{ textAlign: "center" }}><b>Name:</b> {item?.socialName}</h6>
                                        <h6 style={{ textAlign: "center" }}><b>Title:</b> {item?.socialTitle}</h6>
                                        <h6 style={{ textAlign: "center" }}><b>Http Link:</b> {item?.socialLink}</h6>
                                    </div>

                                </div>
                                <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
                                    <button style={{ background: "red", padding: "0 2vw", width: "30%", margin: "1vh 1vw" }} onClick={() => deleteThisSocial(item?._id)}>Delete Social</button>
                                </div>
                            </div>
                        )
                    })}

                    <button style={{ background: "goldenRod", margin: "1vh", width: "90%" }} onClick={() => setChangeContent("")}>Completed Social Links</button>
                </div>

            </div>
        </div >
    );
};

export default AddSocialSupporter;
