import React, { useRef, useState } from "react"
import moment from "moment"
import DOMPurify from "dompurify"
import { useDispatch, useSelector } from "react-redux"
import { deleteSocial, deleteSupporter, updateSupporter } from "../../../../redux/reducers/supporterReducers"
import AddSocialSupporter from "./AddSocialSupporter"


const SupportersCard = ({ setTrigger, sup }) => {

    const dispatch = useDispatch()
    const admin = useSelector(s => s.auth.user)

    const supSocials = sup?.social
    const usedSocials = supSocials?.map(s => s?.socialName);

    const base = "http://localhost:8080"

    const tapCountRef = useRef(0)
    const lastTapRef = useRef(0)

    const [editing, setEditing] = useState(false)
    const [addSocial, setAddSocial] = useState(false)

    const [formData, setFormData] = useState({
        name: sup?.name || "",
        shortDescription: sup?.shortDescription || "",
        contactName: sup?.contactName || "",
        email: sup?.email || "",
        phoneNumber: sup?.phoneNumber || "",
        websiteLink: sup?.websiteLink || "",
        tier: sup?.tier || "supporter",
        address: sup?.address || []
    })

    const [formImage, setFormImage] = useState({
        logoPreview: null,
        logoFile: null
    })

    const labelStyle = {
        width: "100%",
        fontWeight: "bold",
        gap: "0.5vw"
    }

    const inputStyle = {
        border: "solid lightGrey",
        background: "white",
        width: "100%"
    }

    const src =
        sup?.logoFileId && sup?.logoBucketName
            ? `${base}/upload/image/${sup.logoFileId}?bucketName=${sup.logoBucketName}`
            : sup?.logoUrl

    function getTierBackground(tier) {
        const tierColors = {
            platinum: "rgba(229,228,226,0.9)",
            gold: "rgba(255,215,0,0.9)",
            silver: "rgba(192,192,192,0.9)",
            bronze: "rgba(205,127,50,0.9)",
            supporter: "rgba(250,235,215,0.96)"
        }

        return tierColors[tier] || "rgba(250,235,215,0.96)"
    }

    const background = getTierBackground(sup?.tier)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(p => ({ ...p, [name]: value }))
    }

    const handleAddressChange = (index, field, value) => {
        const updated = [...formData.address]
        updated[index][field] = value
        setFormData(p => ({ ...p, address: updated }))
    }

    const handleUploadLogo = (event) => {

        const file = event.target.files?.[0]

        if (!file) {
            setFormImage({ logoPreview: null, logoFile: null })
            return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
            setFormImage({
                logoPreview: reader.result,
                logoFile: file
            })
        }

        reader.readAsDataURL(file)
    }

    const handleSaveLogo = async () => {

        const file = formImage.logoFile
        if (!file) return

        const fd = new FormData()
        fd.append("image", file)

        const hasImage = !!sup.logoFileId && !!sup.logoBucketName

        const uploadUrl = hasImage
            ? `${base}/upload/image/${sup.logoFileId}?bucketName=${sup.logoBucketName}`
            : `${base}/upload/image/${sup._id}`

        const res = await fetch(uploadUrl, {
            method: "PUT",
            body: fd
        })

        if (!res.ok) return

        const { fileId, bucketName } = await res.json()

        const httpUrl = `${base}/image/${fileId}?bucketName=${bucketName}`

        await dispatch(updateSupporter({
            supporterId: sup._id,
            form: {
                logoUrl: httpUrl,
                logoFileId: fileId,
                logoBucketName: bucketName
            }
        }))

        setFormImage({ logoPreview: null, logoFile: null })

        setTrigger(true)
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        const payload = {
            supporterId: sup._id,
            form: {
                ...formData,
                shortDescription: DOMPurify.sanitize(
                    formData.shortDescription || "",
                    {
                        FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
                        FORBID_ATTR: ["onerror", "onload", "onclick"]
                    }
                )
            }
        }

        setTrigger(true)
        setEditing(false)
        await dispatch(updateSupporter(payload))

    }

    const deleteThisSupporter = (supporterId) => {
        const now = Date.now()
        const delay = 400

        if (now - lastTapRef.current < delay) {
            tapCountRef.current += 1
        } else {
            tapCountRef.current = 1
        }

        lastTapRef.current = now

        if (tapCountRef.current === 3) {
            setTrigger(true)
            dispatch(deleteSupporter(supporterId))
        }
    }

    const deleteThisSocial = (socialId) => {
        const now = Date.now()
        const delay = 400

        if (now - lastTapRef.current < delay) {
            tapCountRef.current += 1
        } else {
            tapCountRef.current = 1
        }

        lastTapRef.current = now

        if (tapCountRef.current === 3) {
        const payload = {
            supporterId: sup?._id,
            socialId
        }
        dispatch(deleteSocial(payload))
        setTrigger(true)
    }
    }

    return (
        <div
            style={{
                width: "97vw",
                background: background,
                padding: "1rem 1vw",
                margin: "1vh 1vw"
            }}
        >

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Created: {moment(sup?.createdAt).format("MMM Do YY")}</span>
                <span><b>Donation Tier:</b> {sup?.tier}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>

                <img src={formImage?.logoPreview || src} style={{ minHeight: "40vh", maxHeight: "60vh", minWidth: "fit-content", maxWidth: "fit-content" }} />

                {editing && (
                    <>
                        <label style={labelStyle}>Change Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadLogo}
                            style={inputStyle}
                        />

                        {formImage.logoPreview && (
                            <>
                                <button onClick={handleSaveLogo} style={{ background: "lime", margin: "0.5vh 0" }}>Update Logo</button>
                                <button
                                    onClick={() =>
                                        setFormImage({ logoPreview: null, logoFile: null })
                                    }
                                    style={{ background: "red", margin: "0.5vh 0" }}
                                > Cancel</button>
                            </>
                        )}
                    </>
                )}

                <div style={{ padding: "1vh 1vw", background: "white", margin: "1vh 0" }}>

                    {editing ? (
                        <form onSubmit={handleSubmit}>

                            <label style={labelStyle}>Name</label>
                            <input
                                name="name"
                                value={formData?.name}
                                onChange={handleChange}
                                style={inputStyle}
                            />

                            <label style={labelStyle}>Description</label>
                            <textarea
                                name="shortDescription"
                                value={formData?.shortDescription}
                                onChange={handleChange}
                                style={inputStyle}
                            />

                            <label style={labelStyle}>Contact Name</label>
                            <input
                                name="contactName"
                                value={formData?.contactName}
                                onChange={handleChange}
                                style={inputStyle}
                            />

                            <label style={labelStyle}>Email</label>
                            <input
                                name="email"
                                value={formData?.email}
                                onChange={handleChange}
                                style={inputStyle}
                            />

                            <label style={labelStyle}>Phone</label>
                            <input
                                name="phoneNumber"
                                value={formData?.phoneNumber}
                                onChange={handleChange}
                                style={inputStyle}
                            />

                            <label style={labelStyle}>Website</label>
                            <input
                                name="websiteLink"
                                value={formData?.websiteLink}
                                onChange={handleChange}
                                style={inputStyle}
                            />

                            <label style={labelStyle}>Tier</label>
                            <select
                                name="tier"
                                value={formData?.tier}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="platinum">Platinum</option>
                                <option value="gold">Gold</option>
                                <option value="silver">Silver</option>
                                <option value="bronze">Bronze</option>
                                <option value="supporter">Supporter</option>
                            </select>

                            {formData.address.map((addr, i) => (
                                <div key={i}>
                                    <label style={labelStyle}>Street</label>
                                    <input
                                        value={addr.street}
                                        onChange={(e) =>
                                            handleAddressChange(i, "street", e.target.value)
                                        }
                                        style={inputStyle}
                                    />

                                    <label style={labelStyle}>City</label>
                                    <input
                                        value={addr.city}
                                        onChange={(e) =>
                                            handleAddressChange(i, "city", e.target.value)
                                        }
                                        style={inputStyle}
                                    />

                                    <label style={labelStyle}>State</label>
                                    <input
                                        value={addr?.state}
                                        onChange={(e) =>
                                            handleAddressChange(i, "state", e.target.value)
                                        }
                                        style={inputStyle}
                                    />

                                    <label style={labelStyle}>Zip</label>
                                    <input
                                        value={addr?.zip}
                                        onChange={(e) =>
                                            handleAddressChange(i, "zip", e.target.value)
                                        }
                                        style={inputStyle}
                                    />
                                </div>
                            ))}

                            <button type="submit" style={{ background: "lime", width: "100%", margin: "1vh 0" }}>Update Supporter</button>

                        </form>
                    ) : (
                        <>
                            <h4 style={{ textAlign: "center" }}>{sup?.name}</h4>
                            <h5 style={{ margin: "1vh 1vw" }}>{sup?.shortDescription}</h5>
                            <h6><b>Contact Name:</b> {sup?.contactName}</h6>
                            <h6><b>Email:</b> {sup?.email}</h6>
                            <h6><b>Phone:</b> {sup?.phoneNumber}</h6>
                            <h6><b>Website:</b> {sup?.websiteLink}</h6>
                        </>
                    )}

                </div>

                <div style={{ border: "5px double black", padding: "1vh 1vw", background: "white", margin: "1vh 0" }}>

                    <b>Address:</b>

                    {sup?.address?.map((add, i) => (
                        <div key={i}>
                            <h6>{add?.street}</h6>
                            <div style={{ display: "flex" }}>
                                <h6>{add?.city},</h6>
                                <h6 style={{ margin: "0 0.5vw" }}>{add?.state}</h6>
                            </div>
                            <h6>{add?.zip}</h6>
                        </div>
                    ))}

                </div>

                { admin?.creator || admin?.NFadmin ? <button style={{ background: "goldenRod" }} onClick={() => setAddSocial(true)} >Add Social Media</button> : ""}

                <div style={{ display: "flex", overflowX: "scroll" }}>

                    {supSocials?.map((item, index) => {

                        const baseUrl = "http://localhost:8080";
                        const imgSrc =
                            item?.socialFileId && item?.socialBucketName
                                ? `${baseUrl}/upload/image/${item?.socialFileId}?bucketName=${item?.socialBucketName}`
                                : item?.socialLogo;
                        return (
                            <div key={index} style={{ background: "white", display: 'flex', flexDirection: "column", padding: "1vh 1vw", margin: "1vh 1vw" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    {item?.socialName === "other" ?
                                        <img src={imgSrc} style={{ minWidth: "100%", maxWidth: "100%", maxHeight: "20vh", minHeight: "20vh" }} />
                                        : ""}

                                    <> {/* Twitter */}
                                        {item?.socialName === "x" ? <div style={{ minWidth: "100%", maxWidth: "100%", maxHeight: "20vh", minHeight: "20vh" }}>

                                            <svg style={{ margin: "0 0.5vw", minWidth: "100%", maxWidth: "100%", maxHeight: "20vh", minHeight: "20vh", color: "blue" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                                            </svg>

                                        </div> : ""}

                                        {item?.socialName === "faceBook" ?
                                            <div style={{ minWidth: "100%", maxWidth: "100%", maxHeight: "20vh", minHeight: "20vh" }}>
                                                {/* facebook */}

                                                <svg style={{ margin: "0 0.5vw", minWidth: "100%", maxWidth: "100%", maxHeight: "20vh", minHeight: "20vh", color: "blue" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clipRule="evenodd" />
                                                </svg>


                                            </div> : ""}


                                        {item?.socialName === "linkedIn" ?
                                            <div style={{ minWidth: "100%", maxWidth: "100%", maxHeight: "20vh", minHeight: "20vh" }}>
                                                {/* LinkedIn */}

                                                <svg style={{ margin: "0 0.5vw", minWidth: "100%", maxWidth: "100%", maxHeight: "20vh", minHeight: "20vh", color: "blue" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clipRule="evenodd" />
                                                    <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                                                </svg>


                                            </div> : ""}


                                        {item?.socialName === "instagram" ?
                                            <div style={{ minWidth: "100%", maxWidth: "100%", maxHeight: "20vh", minHeight: "20vh" }}>
                                                {/* INSTAGRAM */}

                                                <svg style={{ margin: "0 0.5vw", minWidth: "100%", maxWidth: "100%", maxHeight: "20vh", minHeight: "20vh", color: "blue" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
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
                                    <button style={{ background: "red", padding: "0 2vw", width: "fit-content", margin: "1vh 1vw" }} onClick={() => deleteThisSocial(item?._id)}>Delete Social</button>
                                </div>

                            </div>
                        )
                    })}
                </div>

                {editing ? <button style={{ background: "red", margin: "1vh 0" }} onClick={() => setEditing(p => !p)}>Cancel</button> : 
                <>{ admin?.creator || admin?.NFadmin ? <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button style={{ background: "green", width: "50%", margin: "1vh 0" }} onClick={() => setEditing(p => !p)}>Edit</button>
                <button style={{ background: "red", width: "fit-content", margin: "1vh 0", padding: "0 2vw" }} onClick={() => deleteThisSupporter(sup?._id)}>Delete supporter</button>
                </div> : ""}</>}

                <dialog open={addSocial} >
                    <AddSocialSupporter sup={sup} setTrigger={setTrigger} setAddSocial={setAddSocial} />
                </dialog>

            </div>
        </div>
    )
}

export default SupportersCard
