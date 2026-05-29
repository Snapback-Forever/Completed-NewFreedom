import React, { useRef, useState, useEffect } from "react"
import moment from "moment"
import DOMPurify from "dompurify"
import { useDispatch, useSelector } from "react-redux"
import { deleteAdditionalSuccessImage, deleteStory, updateStory } from "../../../../redux/reducers/successStoriesReducer"
import AdditionalSucImageCard from "./AdditionalSucImageCard"
import { Link } from "react-router-dom"

const locationList = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New-Hampshire", "New-Jersey", "New-Mexico", "New-York", "North-Carolina", "North-Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode-Island", "South-Carolina", "South-Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West-Virginia", "Wisconsin", "Wyoming"]

const labelStyle = { width: "100%", textAlign: "center", fontWeight: "bold", display: "flex", justifyContent: "center", gap: "0.5vw" }
const inputStyle = { border: "solid lightGrey", background: "white", width: "100%" }

const SuccessCard = ({ suc, setTrigger, setSucInfo, setAddImage }) => {

  const dispatch = useDispatch()
  const admin = useSelector(s => s.auth.user)

  const tapCountRef = useRef(0)
  const lastTapRef = useRef(0)

  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [formImage, setFormImage] = useState({ storyImagePreview: null, storyImageFile: null })

  const base = "http://localhost:8080"
  const imgSrc = suc?.imageFileId && suc?.imageBucketName ? `${base}/upload/image/${suc?.imageFileId}?bucketName=${suc?.imageBucketName}` : suc?.link

  useEffect(() => {
    if (editing) {
      setFormData({
        title: suc?.title || "",
        storyText: suc?.storyText || "",
        storyVideo: suc?.storyVideo || "",
        programName: suc?.programName || "",
        graduationDate: suc?.graduationDate || "",
        outcomeSummary: suc?.outcomeSummary || "",
        consentToPublish: suc?.consentToPublish || false,
        displayName: suc?.displayName || "",
        email: suc?.email || "",
        firstName: suc?.firstName || "",
        lastName: suc?.lastName || "",
        imageUrl: suc?.imageUrl || "",
        imageFileId: suc?.imageFileId || "",
        imageBucketName: suc?.imageBucketName || "",
        internalNotes: suc?.internalNotes || "",
        location: { city: suc?.location?.city || "", state: suc?.location?.state || "" },
        inmateNumber: { number: suc?.inmateNumber?.number || "", state: suc?.inmateNumber?.state || "" }
      })
    }
  }, [editing, suc])

  const sanitize = v => DOMPurify.sanitize(v, { FORBID_TAGS: ["script", "iframe", "object", "embed", "form"], FORBID_ATTR: ["onerror", "onload", "onclick"] })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(p => ({ ...p, [name]: value }))
  }

  const handleUploadStoryImage = (field) => (event) => {
    const file = event.target.files?.[0]
    if (!file) { setFormImage(p => ({ ...p, [`${field}Preview`]: null, [`${field}File`]: null })); return }
    const reader = new FileReader()
    reader.onloadend = () => setFormImage(p => ({ ...p, [`${field}Preview`]: reader.result, [`${field}File`]: file }))
    reader.readAsDataURL(file)
  }

  const handleSaveStoryImage = (field) => async () => {
    const file = formImage[`${field}File`]
    if (!file) return
    const fd = new FormData()
    fd.append("image", file)
    const hasImage = !!suc.imageFileId && !!suc.imageBucketName
    const uploadUrl = hasImage ? `${base}/upload/image/${suc.imageFileId}?bucketName=${suc.imageBucketName}` : `${base}/upload/image/${suc._id}`
    const res = await fetch(uploadUrl, { method: "PUT", body: fd })
    if (!res.ok) return
    const { fileId, bucketName } = await res.json()
    const httpUrl = `${base}/image/${fileId}?bucketName=${bucketName}`
    await dispatch(updateStory({ id: suc._id, imageUrl: httpUrl, imageFileId: fileId, imageBucketName: bucketName }))
    setFormImage(p => ({ ...p, [`${field}Preview`]: null, [`${field}File`]: null }))
    setTrigger(p => !p)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

    const payload = {
      id: suc._id,
      ...formData,
      imageFileId: formData.imageFileId || undefined,
      imageBucketName: formData.imageBucketName || undefined,
      storyText: DOMPurify.sanitize(formData.storyText || "", {
        FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
        FORBID_ATTR: ["onerror", "onload", "onclick"]
      }),
      outcomeSummary: DOMPurify.sanitize(formData.outcomeSummary || "", {
        FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
        FORBID_ATTR: ["onerror", "onload", "onclick"]
      }),
      internalNotes: `${suc?.internalNotes || ""}\n${date} - ${admin?.accountName}: ${formData.internalNotes || ""}`
    }

    await dispatch(updateStory(payload))

    setEditing(false)
    setTrigger(p => !p)
  }


  const deleteTheImage = img => {
    const now = Date.now()
    const delay = 400
    if (now - lastTapRef.current < delay) { tapCountRef.current += 1 } else { tapCountRef.current = 1 }
    lastTapRef.current = now
    if (tapCountRef.current === 3) {
      dispatch(deleteAdditionalSuccessImage({ id: suc._id, imageFileId: img.imageFileId, imageBucketName: img.imageBucketName, link: img.link }))
      setTrigger(p => !p)
    }
  }

  const deleteThisSuccess = (id) => {
    const now = Date.now()
    const delay = 400
    if (now - lastTapRef.current < delay) { tapCountRef.current += 1 } else { tapCountRef.current = 1 }
    lastTapRef.current = now
    if (tapCountRef.current === 3) {

      dispatch(deleteStory(id))
      setTrigger(p => !p)
    }
  }

  return (
    <div style={{ width: "95vw", background: "rgba(250,235,215,0.96)", padding: "1rem 1vw", margin: "1vh 1vw" }}>

      {editing ?

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>

          <img src={formImage.storyImagePreview || imgSrc} style={{ maxHeight: "30vh" }} />
          <label style={labelStyle}>Change Header Image: </label>
          <input type="file" accept="image/*" onChange={handleUploadStoryImage("storyImage")} style={inputStyle} />

          {formImage.storyImagePreview && <>
            <button type="button" onClick={handleSaveStoryImage("storyImage")} className="lookAtMe">Update Image</button>
            <button type="button" onClick={() => setFormImage({ storyImagePreview: null, storyImageFile: null })} style={{ background: "red" }}>Cancel</button>
          </>}

          <label style={labelStyle}>Title: </label>
          <input style={inputStyle} name="title" value={formData.title || ""} onChange={handleChange} />

          <label style={labelStyle}>Story Video: </label>
          <input style={inputStyle} name="storyVideo" value={formData.storyVideo || ""} onChange={handleChange} />

          <label style={labelStyle}>Program: </label>
          <input style={inputStyle} name="programName" value={formData.programName || ""} onChange={handleChange} />

          <label style={labelStyle}>Graduation Date: </label>
          <input style={inputStyle} name="graduationDate" value={formData.graduationDate || ""} onChange={handleChange} />

          <label style={labelStyle}>Outcome: </label>
          <textarea style={inputStyle} name="outcomeSummary" value={formData.outcomeSummary || ""} onChange={handleChange} />

          {admin?._id === suc?.userId || admin?.creator || admin?.NFadmin ?
            <button style={{ background: "goldenRod", width: "100%", margin: "1vh 0" }} onClick={() => { setSucInfo(suc); setAddImage(true) }}>Add Additional Images</button> : null}
          {suc?.additionalImages?.length > 0 &&
            <div style={{ display: "flex", flexDirection: "column", background: "white", border: "10px double black", padding: "1vh 1vw", margin: "1vh 0" }}>
              <b>Addittional Images:</b>

              <div style={{ display: "flex", overflowX: "scroll", background: "white" }}>
                {suc.additionalImages.map((img, i) => {
                  const src = img?.imageFileId && img?.imageBucketName ? `${base}/upload/image/${img.imageFileId}?bucketName=${img.imageBucketName}` : img?.link
                  return <AdditionalSucImageCard key={i} imgSrc={src} img={img} suc={suc} deleteTheImage={deleteTheImage} />
                })}

              </div>
            </div>}
          <label style={labelStyle}>Story Body: </label>
          <h6 style={{ textAlign: "center" }}>
            Example For Img =
            <code>&lt;img src="http://localhost:8080/upload/image/<b style={{ color: "blue" }}>imageFileId</b>?bucketName=<b style={{ color: "blue" }}>imageBucketName</b>" alt="Description" /&gt;</code>
          </h6>
          <textarea style={{ ...inputStyle, minHeight: "80vh", margin: "2vh 0" }} name="storyText" value={formData.storyText || ""} onChange={handleChange} />

          {formData.storyText ?
            <div style={{ border: "5px double black", background: "white", padding: "1vh 1vw" }}>
              <b>Story Body Preview: </b>
              <h6 style={{ width: "100%", padding: "2vw", whiteSpace: "pre-wrap", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formData.storyText) }} />
            </div>
            : ""}

          <label style={labelStyle}>Email: </label>
          <input style={inputStyle} name="email" value={formData.email || ""} onChange={handleChange} placeholder="example@mail.com" />

          <label style={labelStyle}>First Name: </label>
          <input style={inputStyle} name="firstName" value={formData.firstName || ""} onChange={handleChange} placeholder="John/Jane" />

          <label style={labelStyle}>Last Name: </label>
          <input style={inputStyle} name="lastName" value={formData.lastName || ""} onChange={handleChange} placeholder="Doe" />

          <label style={labelStyle}>City: </label>
          <input style={inputStyle} value={formData.location?.city || ""} onChange={e => setFormData(p => ({ ...p, location: { ...p.location, city: sanitize(e.target.value) } }))} placeholder="City Of Graduation" />

          <label style={labelStyle}>State: </label>
          <select style={inputStyle} value={formData.location?.state || ""} onChange={e => setFormData(p => ({ ...p, location: { ...p.location, state: e.target.value } }))} placeholder="state of Graduation"><option value="">Select</option>{locationList.map(s => <option key={s}>{s}</option>)}</select>

          <label style={labelStyle}>Inmate Number: (optional) </label>
          <input style={inputStyle} value={formData.inmateNumber?.number || ""} onChange={e => setFormData(p => ({ ...p, inmateNumber: { ...p.inmateNumber, number: sanitize(e.target.value) } }))} />

          {formData.inmateNumber?.number ? <><label style={labelStyle}>Inmate State: (Required With Inamte Number)</label>
            <select style={inputStyle} value={formData.inmateNumber?.state || ""} onChange={e => setFormData(p => ({ ...p, inmateNumber: { ...p.inmateNumber, state: e.target.value } }))}><option value="">Select</option>{locationList.map(s => <option key={s}>{s}</option>)}</select>
          </> : ""}

          {admin?.creator || admin?.NFadmin ?
            <>
              <label style={labelStyle}>Approved To Publish:
                <input type="checkbox" style={{ transform: "scale(2, 2)", margin: "0 1vw" }} checked={formData.consentToPublish || false} onChange={e => setFormData(p => ({ ...p, consentToPublish: e.target.checked }))} />
              </label>

              <label style={labelStyle}>Notes: </label>
              <textarea style={inputStyle} name="internalNotes" value={formData.internalNotes || ""} onChange={handleChange} />
            </> : ""}

          <button style={{ background: "green" }} type="submit">Update Story</button>
          <button type="button" onClick={() => setEditing(false)} style={{ background: "red" }}>Cancel Edit</button>

        </form>

        :

        <>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Created: {moment(suc?.createdDate).format("MMM Do YY")}</span>
            <span><b>Graduated:</b> {moment(suc?.graduationDate).format("MMM Do YY")} <b>Program Name:</b> {suc?.programName}</span>
          </div>

          <div>{!suc?.consentToPublish ? "❌ Not Published" : "✅ Published"}</div>

          {suc?.internalNotes ?
          <>
          <b>Notes From Admin:</b>
              <div style={{ width: "100%", maxHeight: "30vh", padding: "2vw", background: "white", whiteSpace: "pre-wrap", overflowY:"scroll" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(suc?.internalNotes) }} />
              </>
            : ""}


          { suc?.imageFileId && suc?.imageBucketName || suc?.link ? <b>Main Image:</b> : <b>No Main Image Provided:</b>}
          <img src={imgSrc} style={{ minHeight: "50vh", maxHeight: "50vh", minWidth: "100%", maxWidth: "100%" }} />

          {admin?._id === suc?.userId || admin?.creator || admin?.NFadmin ?
            <button style={{ background: "goldenRod", width: "100%", margin: "1vh 0" }} onClick={() => { setSucInfo(suc); setAddImage(true) }}>Add Additional Images</button> : null}
          {suc?.additionalImages?.length > 0 &&
            <div style={{ display: "flex", flexDirection: "column", background: "white", border: "10px double black", padding: "1vh 1vw", margin: "1vh 0" }}>
              <b>Addittional Images:</b>
              <div style={{ display: "flex", overflowX: "scroll", background: "white" }}>
                {suc.additionalImages.map((img, i) => {
                  const src = img?.imageFileId && img?.imageBucketName ? `${base}/upload/image/${img.imageFileId}?bucketName=${img.imageBucketName}` : img?.link
                  return <AdditionalSucImageCard key={i} imgSrc={src} img={img} suc={suc} deleteTheImage={deleteTheImage} />
                })}
              </div>
            </div>}

          <div style={{ margin: "1vh 0" }}>
            <h6><b>Display Name:</b> {suc?.displayName}</h6>
            <h6><b>First Name:</b> {suc?.firstName}</h6>
            <h6><b>last Name:</b> {suc?.lastName}</h6>
            <h6><b>Story Email:</b> {suc?.email}</h6>
            <h6><b>Inmate Number:</b> {suc?.inmateNumber.number} <b>State:</b> {suc?.inmateNumber.state}</h6>
            <h6><b>location:</b> {suc?.location.city} <b>State:</b> {suc?.location.state}</h6>
            <div style={{ display: "flex", whiteSpace: "pre-wrap", }}><b>Outcome Summary:</b><div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(suc?.outcomeSummary) }} style={{ margin: "0 0.5vw", }} /></div>
          </div>

          <div style={{ background: "white", padding: "1vh" }}>
            <h2 style={{ textAlign: "center", whiteSpace: "pre-wrap", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(suc?.title) }} />
            <div style={{ whiteSpace: "pre-wrap", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(suc?.storyText) }} />
          </div>

          {suc?.storyVideo?.startsWith("https://") &&
            <video src={suc.storyVideo} controls className='videoMedia' style={{ width: "100%", minHeight: "30vh", margin: '1vh 0' }} />}

          {admin?._id !== suc?.userId ?

            <Link to={`/messagePage/${suc?.userId}`}>
              <button style={{ background: "goldenRod", width: "100%", color: "black" }}>📨 Story Creator</button>
            </Link>

            :

            <>
              <button style={{ background: "red", width: "30%", margin: "0.5vh 0" }}>Your Creator Of Story</button>

            </>
          }

          {(admin?._id === suc?.userId || admin?.creator || admin?.NFadmin) ?
            <div style={{ display: "flex", justifyContent: "space-between", margin: "1vh 0" }}>
              <button style={{ background: "green", width: "40%" }} onClick={() => { setSucInfo(suc); setEditing(true) }}>Edit Story</button>
              <button style={{ background: "red", width: "20%" }} onClick={() => deleteThisSuccess(suc?._id)}>Delete Success Story</button>
            </div> : ""}

        </>}

    </div>
  )
}

export default SuccessCard
