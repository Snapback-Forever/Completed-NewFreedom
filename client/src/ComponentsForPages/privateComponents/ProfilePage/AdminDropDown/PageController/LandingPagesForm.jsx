import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAdminLanding, getUpdateLanding, removeAdminAdditionalImage } from '../../../../../redux/reducers/adminReducers';
import DOMPurify from 'dompurify';
import { resetErrorMessage, resetSuccessMessage } from '../../../../../redux/reducers/directMsgStaffReducers';
import CreateMsgModal from './CreateMsgModal';
import AddImageModal from './AddImageModal';

const AdminLandingForm = ({ darkMode, user, onSubmitSuccess }) => {

    const dispatch = useDispatch()

    const successMessage = useSelector(state => state.admin.successMessage)
    const adminLandingInfo = useSelector(state => state.admin.adminLanding)

    const baseUrl = "http://localhost:8080";
    const base = "http://localhost:8080";

    const [addImages, setAddImages] = useState(null)
    const [changeFormContent, setChangeFormContent] = useState("")

    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        dispatch(getUpdateLanding())
    }, [successMessage])

    const [form, setForm] = useState({
        // main
        mainContent: '',
        mainVideo: '',
        mainTitle: '',
        subTitle: '',
        heroImage: '',
        heroImgPreview: '',
        heroImgFile: null,
        heroImgFileId: '',
        heroImgBucketName: '',

        // why
        whyMainImg: '',
        whyImgPreview: '',
        whyImgFile: null,
        whyImgFileId: '',
        whyImgBucketName: '',
        whySub: '',
        whyContent: '',
        whyTitle: '',

        // approach
        approachMainImg: '',
        approachSub: "",
        approachImgPreview: '',
        approachImgFile: null,
        approachImgFileId: '',
        approachImgBucketName: '',
        approachContent: '',
        approachTitle: '',

        // inpatient
        inpatientMainImg: '',
        inpatientImgPreview: '',
        inpatientImgFile: null,
        impatientImgFileId: '',
        impatientImgBucketName: '',
        InpatientSub: '',
        InpatientContent: '',
        InpatientTitle: '',

        // outreach
        outreachMainImg: '',
        outreachImgPreview: '',
        outreachImgFile: null,
        outReachImgFileId: '',
        outReachImgBucketName: '',
        outReachSub: '',
        outReachContent: '',
        outReachTitle: '',

        // mentor
        mentorMainImg: '',
        mentorImgPreview: '',
        mentorImgFile: null,
        mentorImgFileId: '',
        mentorImgBucketName: '',
        mentorSub: '',
        mentorContent: '',
        mentorTitle: '',

        // additional images
        mainAdditionalImages: [],
        whyAdditionalImages: [],
        approachAdditionalImages: [],
        inpatientAdditionalImages: [],
        outreachAdditionalImages: [],
        mentorAdditionalImages: []
    })

    useEffect(() => {
        if (!adminLandingInfo) return

        const base = "http://localhost:8080/upload/image"

        setForm(prev => ({
            ...prev,

            mainContent: adminLandingInfo.mainContent || '',
            mainVideo: adminLandingInfo.mainVideo || '',
            mainTitle: adminLandingInfo.mainTitle || '',
            subTitle: adminLandingInfo.subTitle || '',

            heroImgPreview:
                adminLandingInfo.heroImgFileId && adminLandingInfo.heroImgBucketName
                    ? `${base}/${adminLandingInfo.heroImgFileId}?bucketName=${adminLandingInfo.heroImgBucketName}`
                    : '',
            heroImgFileId: adminLandingInfo.heroImgFileId || '',
            heroImgBucketName: adminLandingInfo.heroImgBucketName || '',

            whyMainImg: adminLandingInfo.whyMainImg || '',
            whyImgPreview:
                adminLandingInfo.whyImgFileId && adminLandingInfo.whyImgBucketName
                    ? `${base}/${adminLandingInfo.whyImgFileId}?bucketName=${adminLandingInfo.whyImgBucketName}`
                    : '',
            whyImgFileId: adminLandingInfo.whyImgFileId || '',
            whyImgBucketName: adminLandingInfo.whyImgBucketName || '',
            whySub: adminLandingInfo.whySub || '',
            whyContent: adminLandingInfo.whyContent || '',
            whyTitle: adminLandingInfo.whyTitle || '',

            approachMainImg: adminLandingInfo.approachMainImg || '',
            approachSub: adminLandingInfo.approachSub || '',
            approachImgPreview:
                adminLandingInfo.approachImgFileId && adminLandingInfo.approachImgBucketName
                    ? `${base}/${adminLandingInfo.approachImgFileId}?bucketName=${adminLandingInfo.approachImgBucketName}`
                    : '',
            approachImgFileId: adminLandingInfo.approachImgFileId || '',
            approachImgBucketName: adminLandingInfo.approachImgBucketName || '',
            approachContent: adminLandingInfo.approachContent || '',
            approachTitle: adminLandingInfo.approachTitle || '',

            inpatientMainImg: adminLandingInfo.inpatientMainImg || '',
            inpatientImgPreview:
                adminLandingInfo.impatientImgFileId && adminLandingInfo.impatientImgBucketName
                    ? `${base}/${adminLandingInfo.impatientImgFileId}?bucketName=${adminLandingInfo.impatientImgBucketName}`
                    : '',
            inpatientImgFileId: adminLandingInfo.inpatientImgFileId || '',
            inpatientImgBucketName: adminLandingInfo.inpatientImgBucketName || '',
            InpatientSub: adminLandingInfo.InpatientSub || '',
            InpatientContent: adminLandingInfo.InpatientContent || '',
            InpatientTitle: adminLandingInfo.InpatientTitle || '',

            outreachMainImg: adminLandingInfo.outreachMainImg || '',
            outreachImgPreview:
                adminLandingInfo.outReachImgFileId && adminLandingInfo.outReachImgBucketName
                    ? `${base}/${adminLandingInfo.outReachImgFileId}?bucketName=${adminLandingInfo.outReachImgBucketName}`
                    : '',
            outReachImgFileId: adminLandingInfo.outReachImgFileId || '',
            outReachImgBucketName: adminLandingInfo.outReachImgBucketName || '',
            outReachSub: adminLandingInfo.outReachSub || '',
            outReachContent: adminLandingInfo.outReachContent || '',
            outReachTitle: adminLandingInfo.outReachTitle || '',

            mentorMainImg: adminLandingInfo.mentorMainImg || '',
            mentorImgPreview:
                adminLandingInfo.mentorImgFileId && adminLandingInfo.mentorImgBucketName
                    ? `${base}/${adminLandingInfo.mentorImgFileId}?bucketName=${adminLandingInfo.mentorImgBucketName}`
                    : '',
            mentorImgFileId: adminLandingInfo.mentorImgFileId || '',
            mentorImgBucketName: adminLandingInfo.mentorImgBucketName || '',
            mentorSub: adminLandingInfo.mentorSub || '',
            mentorContent: adminLandingInfo.mentorContent || '',
            mentorTitle: adminLandingInfo.mentorTitle || '',

            mainAdditionalImages: adminLandingInfo.mainAdditionalImages || [],
            whyAdditionalImages: adminLandingInfo.whyAdditionalImages || [],
            approachAdditionalImages: adminLandingInfo.approachAdditionalImages || [],
            inpatientAdditionalImages: adminLandingInfo.inpatientAdditionalImages || [],
            outreachAdditionalImages: adminLandingInfo.outreachAdditionalImages || [],
            mentorAdditionalImages: adminLandingInfo.mentorAdditionalImages || []
        }))
    }, [adminLandingInfo])




    const handleInput = (e) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleUploadImage = (fieldPrefix) => (e) => {

        const file = e.target.files[0]

        if (!file) return

        const previewKey = `${fieldPrefix}Preview`
        const fileKey = `${fieldPrefix}File`

        const previewUrl = URL.createObjectURL(file)

        setForm(prev => ({
            ...prev,
            [previewKey]: previewUrl,
            [fileKey]: file
        }))
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const nextForm = { ...form };
      
        Object.keys(nextForm).forEach((key) => {
          if (typeof nextForm[key] === "string") {
            if (key === "mainContent") {
              nextForm[key] = DOMPurify.sanitize(nextForm[key], {
                ALLOWED_TAGS: [
                  'div', 'span', 'section', 'article', 'main', 'header', 'footer',
                  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                  'p', 'strong', 'em', 'b', 'i', 'u', 'br', 'hr',
                  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
                  'img', 'figure', 'figcaption',
                  'a',
                  'table', 'thead', 'tbody', 'tr', 'th', 'td',
                  'style', 'script',
                  'small', 'sub', 'sup', 'blockquote', 'cite', 'pre', 'code'
                ],
                ALLOWED_ATTR: [
                  // Core attributes
                  'id', 'class', 'style', 'title', 'lang', 'dir',
                  
                  // Links
                  'href', 'target', 'rel',
                  
                  // Images & Media
                  'src', 'alt', 'width', 'height', 'loading', 'srcset', 'sizes',
                  
                  // Common HTML attributes
                  'name', 'value', 'type', 'placeholder',
                  'colspan', 'rowspan', 'scope',
                  'align', 'valign',
                  
                  // Event handlers (in case you need scripts later)
                  'onclick', 'onload', 'onerror', 'onmouseover', 
                  'onmouseout', 'onfocus', 'onblur', 'onchange',
                  
                  // Accessibility
                  'role', 'aria-label', 'aria-describedby', 'aria-hidden',
                  
                  // Data attributes
                  'data-*',
                  
                  // Flexbox / Grid / Styling related (just in case)
                  'data-style', 'data-class'
                ],
                ALLOW_DATA_ATTR: true,
                ADD_TAGS: ['style', 'script'],
                FORBID_TAGS: [],
                FORBID_ATTR: [],
              });
            } else {
              // Normal sanitization for other fields
              nextForm[key] = DOMPurify.sanitize(nextForm[key], {
                FORBID_TAGS: ["iframe", "object", "embed", "form", "input", "button"],
                FORBID_ATTR: ["onerror", "onload", "onclick"],
              });
            }
          }
        });
      
        dispatch(addAdminLanding(nextForm));
      };


    useEffect(() => {
        if (successMessage === 'Admin landing content saved successfully!') {

            setForm(prev => ({
                ...prev,
                mainContent: adminLandingInfo.mainContent || '',
                mainVideo: adminLandingInfo.mainVideo || '',
                mainTitle: adminLandingInfo.mainTitle || '',
                subTitle: adminLandingInfo.subTitle || '',
                heroImgPreview:
                    adminLandingInfo.heroImgFileId && adminLandingInfo.heroImgBucketName
                        ? `${base}/${adminLandingInfo.heroImgFileId}?bucketName=${adminLandingInfo.heroImgBucketName}`
                        : '',
                heroImgFileId: adminLandingInfo.heroImgFileId || '',
                heroImgBucketName: adminLandingInfo.heroImgBucketName || '',
                whyMainImg: adminLandingInfo.whyMainImg || '',
                whyImgPreview:
                    adminLandingInfo.whyImgFileId && adminLandingInfo.whyImgBucketName
                        ? `${base}/${adminLandingInfo.whyImgFileId}?bucketName=${adminLandingInfo.whyImgBucketName}`
                        : '',
                whyImgFileId: adminLandingInfo.whyImgFileId || '',
                whyImgBucketName: adminLandingInfo.whyImgBucketName || '',
                whySub: adminLandingInfo.whySub || '',
                whyContent: adminLandingInfo.whyContent || '',
                whyTitle: adminLandingInfo.whyTitle || '',
                approachMainImg: adminLandingInfo.approachMainImg || '',
                approachSub: adminLandingInfo.approachSub || '',
                approachImgPreview:
                    adminLandingInfo.approachImgFileId && adminLandingInfo.approachImgBucketName
                        ? `${base}/${adminLandingInfo.approachImgFileId}?bucketName=${adminLandingInfo.approachImgBucketName}`
                        : '',
                approachImgFileId: adminLandingInfo.approachImgFileId || '',
                approachImgBucketName: adminLandingInfo.approachImgBucketName || '',
                approachContent: adminLandingInfo.approachContent || '',
                approachTitle: adminLandingInfo.approachTitle || '',
                inpatientMainImg: adminLandingInfo.inpatientMainImg || '',
                inpatientImgPreview:
                    adminLandingInfo.inpatientImgFileId && adminLandingInfo.inpatientImgBucketName
                        ? `${base}/${adminLandingInfo.inpatientImgFileId}?bucketName=${adminLandingInfo.inpatientImgBucketName}`
                        : '',
                inpatientImgFileId: adminLandingInfo.inpatientImgFileId || '',
                inpatientImgBucketName: adminLandingInfo.inpatientImgBucketName || '',
                InpatientSub: adminLandingInfo.InpatientSub || '',
                InpatientContent: adminLandingInfo.InpatientContent || '',
                InpatientTitle: adminLandingInfo.InpatientTitle || '',
                outreachMainImg: adminLandingInfo.outreachMainImg || '',
                outreachImgPreview:
                    adminLandingInfo.outReachImgFileId && adminLandingInfo.outReachImgBucketName
                        ? `${base}/${adminLandingInfo.outReachImgFileId}?bucketName=${adminLandingInfo.outReachImgBucketName}`
                        : '',
                outReachImgFileId: adminLandingInfo.outReachImgFileId || '',
                outReachImgBucketName: adminLandingInfo.outReachImgBucketName || '',
                outReachSub: adminLandingInfo.outReachSub || '',
                outReachContent: adminLandingInfo.outReachContent || '',
                outReachTitle: adminLandingInfo.outReachTitle || '',
                mentorMainImg: adminLandingInfo.mentorMainImg || '',
                mentorImgPreview:
                    adminLandingInfo.mentorImgFileId && adminLandingInfo.mentorImgBucketName
                        ? `${base}/${adminLandingInfo.mentorImgFileId}?bucketName=${adminLandingInfo.mentorImgBucketName}`
                        : '',
                mentorImgFileId: adminLandingInfo.mentorImgFileId || '',
                mentorImgBucketName: adminLandingInfo.mentorImgBucketName || '',
                mentorSub: adminLandingInfo.mentorSub || '',
                mentorContent: adminLandingInfo.mentorContent || '',
                mentorTitle: adminLandingInfo.mentorTitle || '',
                mainAdditionalImages: adminLandingInfo.mainAdditionalImages || [],
                whyAdditionalImages: adminLandingInfo.whyAdditionalImages || [],
                approachAdditionalImages: adminLandingInfo.approachAdditionalImages || [],
                inpatientAdditionalImages: adminLandingInfo.inpatientAdditionalImages || [],
                outreachAdditionalImages: adminLandingInfo.outreachAdditionalImages || [],
                mentorAdditionalImages: adminLandingInfo.mentorAdditionalImages || []
            }))


            dispatch(resetSuccessMessage())
            dispatch(resetErrorMessage())
        }

    }, [successMessage])

    const labelStyle = {
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
        display: "flex",
        justifyContent: "center",
        gap: "0.5vw"
    };

    const inputStyle = {
        border: 'solid lightGrey',
        background: 'white',
        width: '100%',
    };

    const prefixToUrlKey = {
        heroImg: 'heroImage',
        whyImg: 'whyMainImg',
        approachImg: 'approachMainImg',
        inpatientImg: 'inpatientMainImg',
        outreachImg: 'outreachMainImg',
        mentorImg: 'mentorMainImg',
    };

    const handleClearUploadImage = (fieldPrefix) => async () => {
        const previewKey = `${fieldPrefix}Preview`;
        const fileKey = `${fieldPrefix}File`;
        const fileIdKey = `${fieldPrefix}FileId`;
        const bucketNameKey = `${fieldPrefix}BucketName`;
        const urlKey = prefixToUrlKey[fieldPrefix];
        const {
            [previewKey]: previewUrl,
            [fileIdKey]: fileId,
            [bucketNameKey]: bucketName,
        } = form;
        if (fileId && bucketName) {
            try {
                await fetch(`/upload/image/${fileId}?bucketName=${bucketName}`, {
                    method: 'DELETE',
                });
            } catch (err) {
                console.error('Failed to delete file from server', err);
            }
        }
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        const deleteFlagKey = `${fieldPrefix}Deleted`;
        setForm((prev) => ({
            ...prev,
            [previewKey]: '',
            [fileKey]: null,
            [fileIdKey]: '',
            [bucketNameKey]: '',
            ...(urlKey ? { [urlKey]: '' } : {}),
            [deleteFlagKey]: true,
        }));
    };

    const lastTapRef = useRef(0)
    const tapCountRef = useRef(0)

    const handleDeleteImage = (img, section) => {
        const now = Date.now()
        const delay = 400
        if (now - lastTapRef.current < delay) { tapCountRef.current += 1 } else { tapCountRef.current = 1 }
        lastTapRef.current = now
        if (tapCountRef.current === 3) {
            dispatch(removeAdminAdditionalImage({
                section: section,
                imageFileId: img.imageFileId,
                link: img.link
            }))
        }
    }


    return (
        <div style={{ width: '100vw', minHeight: '84vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: "2vh 0" }}>

            <div style={{ width: '90%', minHeight: '84vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', background: "rgba(250, 235, 215, 0.960)", overflowY: 'auto', padding: '1rem', }}>

                <h2 style={{ width: '100%', textAlign: 'center', color: darkMode ? 'white' : 'black' }}>This Is The Content That Shows On Each Landing Page</h2>
                <h6>Depending On What You Leave Blank Or Fill In will Determine The Format Of Some Pages.</h6>
                <div className='lookAtMe' style={{ background: "goldenRod", width: "100%", textAlign: "center", margin: "1vh 0" }} onClick={() => setOpenModal(true)}>How Do I Use Special Attributes For These Pages?</div>

                <dialog open={openModal} >
                    <CreateMsgModal openModal={openModal} setOpenModal={setOpenModal} />
                </dialog>

                <div style={{ border: "solid black", width: "100%", padding: "1vh 1vw" }}>
                    <b style={{ margin: "1vh 1vw" }}>Select A Page To Edit:</b>
                    <button style={{ width: "100%", background: "goldenRod", margin: "0.5vh 0" }} onClick={() => setChangeFormContent("main")}>Main Landing Page</button>

                    <button style={{ width: "100%", background: "goldenRod", margin: "0.5vh 0" }} onClick={() => setChangeFormContent("why")}>Why Landing Page</button>

                    <button style={{ width: "100%", background: "goldenRod", margin: "0.5vh 0" }} onClick={() => setChangeFormContent("approach")}>Approach Landing Page</button>

                    <button style={{ width: "100%", background: "goldenRod", margin: "0.5vh 0" }} onClick={() => setChangeFormContent("inpatient")}>Inpatient Landing Page</button>

                    <button style={{ width: "100%", background: "goldenRod", margin: "0.5vh 0" }} onClick={() => setChangeFormContent("outreach")}>Outreach Landing Page</button>

                    <button style={{ width: "100%", background: "goldenRod", margin: "0.5vh 0" }} onClick={() => setChangeFormContent("mentor")}>Mentor Landing Page</button>

                </div>

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }} >

                    {changeFormContent === "main" ?
                        <>        {/* ------------------------------ Main Landing Page */}
                            <h3 style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', border: "solid black", padding: "1vh 0", background: "lightGrey" }}>Main Landing Page</h3>



                            <div style={{ width: "100%", border: "double black", display: "flex", flexDirection: "column", alignItems: "center", padding: "2vh 0", }} >

                                <div style={{ color: "red", textAlign: "center" }}>If You Leave Img Blank There IS a fallback Image</div>
                                {!form?.heroImgPreview ? (
                                    <>
                                        <label style={labelStyle} htmlFor="heroImage">(Side) Img In Header (URL) (Optional)</label>
                                        <input id="heroImage" name="heroImage" type="text" value={form.heroImage} onChange={handleInput} placeholder="https://..." style={inputStyle} />

                                    </>
                                ) : null}

                                {!form?.heroImage && !form?.heroImgPreview ? <h2>-- OR --</h2> : ""}

                                {!form?.heroImage ? <>
                                    <label style={labelStyle} htmlFor="heroImgFile">(Side) Img In Header (Optional) </label>
                                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }} >

                                        <label htmlFor="heroImgFile" style={{ background: "goldenrod", padding: "1vh 1vw", width: "60%", textAlign: "center", cursor: "pointer" }} > 📷 Choose Img In Header </label>
                                        <input id="heroImgFile" name="heroImgFile" type="file" accept="image/*" style={{ display: "none" }} onChange={handleUploadImage("heroImg")} />

                                        {form.heroImgPreview && (
                                            <div style={{ margin: "1vh 1vw", textAlign: "center" }}>
                                                <img src={form.heroImgPreview} alt="Hero preview" style={{ maxHeight: "10vh", maxWidth: "15vw" }} />
                                                <div>Img selected</div>

                                                <button type="button" onClick={handleClearUploadImage("heroImg")} style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", background: "crimson", color: "white", border: "none", cursor: "pointer", width: "fit-content" }} > Cancel Image</button>
                                            </div>
                                        )}
                                    </div></> : ""}
                                <label style={labelStyle} htmlFor="subTitle">Title In Header <div style={{ color: "red" }}>(Required)</div></label>

                                <input id="subTitle" name="subTitle" type="text" value={form.subTitle} onChange={handleInput} placeholder="Sub title" style={inputStyle} />
                            </div>

                            <label style={labelStyle} htmlFor="mainTitle">Title Of Content <div style={{ color: "red" }}>(Required)</div></label>

                            <input
                                id="mainTitle"
                                name="mainTitle"
                                type="text"
                                value={form?.mainTitle}
                                onChange={handleInput}
                                placeholder="Main title"
                                style={inputStyle}
                            />

                            <button type="button" style={{ background: "goldenRod", width: "100%", margin: "1vh 0" }} onClick={() => setAddImages("mainAdditionalImages")}>
                                Add Main Additional Images
                            </button>

                            <div style={{ display: "flex", overflowX: "scroll", border: "10px double black", width: "100%", padding: "1vh 1vw", background: "white" }}>

                                {adminLandingInfo?.mainAdditionalImages?.length === 0 ? <h6>Currently No Additional Images: </h6> : <>

                                    {adminLandingInfo?.mainAdditionalImages?.filter(img => img).reverse().map(img => {
                                        const imgSrc = img?.imageFileId && img?.imageBucketName ? `${baseUrl}/upload/image/${img?.imageFileId}?bucketName=${img?.imageBucketName}` : img?.imgImage

                                        return (
                                            <div key={img?.imageFileId || img?.link} style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "1vh 1vw", border: "double black", padding: "1vh 1vw" }}>
                                                <img src={imgSrc} style={{ minHeight: "15vh", maxHeight: "15vh", minWidth: "15vw", maxWidth: "15vw", margin: "1vh 1vw", cursor: "pointer" }} />
                                                {img?.imageFileId ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img.imageFileId)} style={{ cursor: "pointer" }}><b>imageFileId: </b><br />{img?.imageFileId}</div> : ""}
                                                {img?.imageBucketName ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img.imageBucketName)} style={{ cursor: "pointer" }}><b>imageBucketName: </b> <br />{img?.imageBucketName}</div> : ""}
                                                {img?.link && (<div title="Click to copy full link" onClick={() => navigator.clipboard.writeText(img?.link)} style={{ cursor: "pointer" }}><b>Link:</b>{img.link?.length > 30 ? `${img.link.slice(0, 15)}...${img?.link.slice(-10)}` : img.link}</div>)}
                                                <button onClick={() => handleDeleteImage(img, "main")} style={{ marginTop: "4px", background: "red", padding: "0 2vw" }}>Triple click image to delete</button>
                                            </div>
                                        )
                                    })}

                                </>}
                            </div>


                            <label style={labelStyle} htmlFor="mainContent">Main Content <div style={{ color: "red" }}>(Required)</div></label>
                            <div className='lookAtMe' style={{ background: "goldenRod", width: "100%", textAlign: "center", margin: "1vh 0" }} onClick={() => setOpenModal(true)}>How Do I Use Special Attributes For These Pages?</div>
                            <code style={{ width: "100%", textAlign: "center" }}>Example Img Link: ➡️ &lt;img src="http://localhost:8080/upload/image/<b style={{ color: "blue" }}>imageFileId</b>?bucketName=<b style={{ color: "blue" }}>imageBucketName</b>" alt="Description" /&gt; ⬅️</code>
                            <textarea
                                id="mainContent"
                                name="mainContent"
                                value={form?.mainContent}
                                onChange={handleInput}
                                placeholder="Main content"
                                style={{ ...inputStyle, minHeight: '40vh', padding: "1vh 1vw" }}
                            />

                            {form?.mainContent ? <div style={{ width: "100%", border: "10px double black", padding: "1vh 1vw" }}>
                                <b>Preview Main Content: </b>
                                <div style={{ background: "white", width: "100%", padding: "2vw", overflowX: "scroll", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form?.mainContent) }} />
                            </div> : ""}
                            <label style={labelStyle} htmlFor="mainVideo">Main Video (URL) (Optional)</label>
                            <input id="mainVideo" name="mainVideo" type="text" value={form?.mainVideo} onChange={handleInput} placeholder="https://..." style={inputStyle} />


                            <button type="submit" style={{ background: 'green', color: 'white', width: '100%', height: '5vh', margin: '1vh 0', }}>Submit Pages</button>

                        </> : ""}


                    {changeFormContent === "why" ? <>

                        {/* ------------------------------------------------- WHY Landing Page */}
                        <h3 style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', border: "solid black", padding: "1vh 0", background: "lightGrey" }}>Why Landing Page</h3>

                        <div
                            style={{
                                width: "100%",
                                border: "double black",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "2vh 0",
                            }}>

                            <div style={{ color: "red", textAlign: "center" }}>If you dont select an image it will use the default imageIf No Image, Or Header Title Is Provided It Changes the format of page. This is The Main Image in the header</div>

                            {!form?.whyImgPreview ? (
                                <>
                                    <label style={labelStyle} htmlFor="whyMainImg">
                                        Why Img (URL) (Optional)
                                    </label>
                                    <input
                                        id="whyMainImg"
                                        name="whyMainImg"
                                        type="text"
                                        value={form?.whyMainImg}
                                        onChange={handleInput}
                                        placeholder="https://..."
                                        style={inputStyle}
                                    />
                                    <h2>-- OR --</h2>
                                </>
                            ) : null}
                            {/* WHY IMAGE UPLOAD + PREVIEW */}
                            <label style={labelStyle} htmlFor="whyImgFile">
                                Select Img (Why page)  (Optional)
                            </label>
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                {/* Button-style label for the hidden file input */}
                                <label
                                    htmlFor="whyImgFile"
                                    style={{
                                        background: "goldenrod",
                                        padding: "1vh 1vw",
                                        width: "60%",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        margin: "1vh 0"
                                    }}
                                > 📷 Choose Why Img</label>

                                <input
                                    id="whyImgFile"
                                    name="whyImgFile"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleUploadImage("whyImg")}
                                />

                                {/* Preview after upload selection */}
                                {form.whyImgPreview && (
                                    <div style={{ margin: "1vh 1vw", textAlign: "center" }}>
                                        <img
                                            src={form?.whyImgPreview}
                                            alt="Why preview"
                                            style={{ maxHeight: "10vh", maxWidth: "15vw" }}
                                        />
                                        <div>Img selected</div>
                                        {/* Cancel / Clear button */}
                                        <button
                                            type="button"
                                            onClick={handleClearUploadImage("whyImg")}
                                            style={{ background: "red", padding: "0 1vw", margin: "1vh 0", width: "fit-content" }}
                                        >
                                            Cancel Image
                                        </button>
                                    </div>
                                )}
                            </div>


                            
                                <>
                                    <label style={labelStyle} htmlFor="whySub">Why Header Title (Required)</label>
                                    <input
                                        id="whySub"
                                        name="whySub"
                                        type="text"
                                        value={form?.whySub}
                                        onChange={handleInput}
                                        placeholder="Why subtitle"
                                        style={inputStyle}
                                    />
                                </> 
                        </div>

                        <button type="button" style={{ background: "goldenRod", width: "100%", margin: "1vh 0" }} onClick={() => setAddImages("whyAdditionalImages")}>
                            Add Why Additional Images
                        </button>

                        <div style={{ display: "flex", overflowX: "scroll", border: "10px double black", width: "100%", padding: "1vh 1vw", background: "white" }}>

                            {adminLandingInfo?.whyAdditionalImages?.length === 0 ? <h6>Currently No Additional Images: </h6> : <>

                                {adminLandingInfo?.whyAdditionalImages?.filter(img => img).reverse().map(img => {

                                    const imgSrc = img?.imageFileId && img?.imageBucketName ? `${baseUrl}/upload/image/${img?.imageFileId}?bucketName=${img?.imageBucketName}` : img?.imgImage

                                    return (
                                        <div key={img.imageFileId || img.link} style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "1vh 1vw", border: "double black", padding: "1vh 1vw" }}>
                                            <img src={imgSrc} style={{ minHeight: "15vh", maxHeight: "15vh", minWidth: "15vw", maxWidth: "15vw", margin: "1vh 1vw", cursor: "pointer" }} />
                                            {img?.imageFileId ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img?.imageFileId)} style={{ cursor: "pointer" }}><b>imageFileId: </b><br />{img?.imageFileId}</div> : ""}
                                            {img?.imageBucketName ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img?.imageBucketName)} style={{ cursor: "pointer" }}><b>imageBucketName: <br /></b>{img?.imageBucketName}</div> : ""}
                                            {img?.link && (<div title="Click to copy full link" onClick={() => navigator.clipboard.writeText(img.link)} style={{ cursor: "pointer" }}><b>Link:</b>{img.link?.length > 30 ? `${img.link.slice(0, 15)}...${img?.link.slice(-10)}` : img?.link}</div>)}
                                            <button onClick={() => handleDeleteImage(img, "why")} style={{ marginTop: "4px", background: "red", padding: "0 2vw" }}>Triple click image to delete</button>
                                        </div>
                                    )
                                })}

                            </>}
                        </div>


                        <label style={labelStyle} htmlFor="whyTitle"> Why Content Title</label>

                        <input
                            id="whyTitle"
                            name="whyTitle"
                            type="text"
                            value={form.whyTitle}
                            onChange={handleInput}
                            placeholder="Why title"
                            style={inputStyle}
                        />

                        <label style={labelStyle} htmlFor="whyContent"> Why Content </label>
                        <div className='lookAtMe' style={{ background: "goldenRod", width: "100%", textAlign: "center", margin: "1vh 0" }} onClick={() => setOpenModal(true)}>How Do I Use Special Attributes For These Pages?</div>
                        <code style={{ width: "100%", textAlign: "center" }}>Example Img Link: ➡️ &lt;img src="http://localhost:8080/upload/image/<b style={{ color: "blue" }}>imageFileId</b>?bucketName=<b style={{ color: "blue" }}>imageBucketName</b>" alt="Description" /&gt; ⬅️</code>
                        <textarea
                            id="whyContent"
                            name="whyContent"
                            value={form?.whyContent}
                            onChange={handleInput}
                            placeholder="Why content"
                            style={{ ...inputStyle, minHeight: '40vh', padding: "1vh 1vw" }}
                        />

                        {form.whyContent ? <div style={{ width: "100%", border: "10px double black", padding: "1vh 1vw" }}>
                            <b>Preview Why Content: </b>
                            <div style={{ background: "white", width: "100%", padding: "2vw", overflowX: "scroll", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form?.whyContent) }} />
                        </div> : ""}

                        <button type="submit" style={{ background: 'green', color: 'white', width: '100%', height: '5vh', margin: '1vh 0', }}>Submit Pages</button>
                    </> : ""}


                    {changeFormContent === "approach" ? <>

                        {/* --------------------------------------------- APPROACH Landing Page */}
                        <h3 style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', border: "solid black", padding: "1vh 0", background: "lightGrey" }}>Approach Landing Page</h3>

                        <div
                            style={{
                                width: "100%",
                                border: "double black",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "2vh 0",
                            }}
                        >

                            <div style={{ color: "red", textAlign: "center" }}>If you dont select an image it will use the default imageIf No Image, Or Header Title Is Provided It Changes the format of page. This is The Main Image in the header</div>

                            {!form?.approachImgPreview ? (
                                <>
                                    <label style={labelStyle} htmlFor="approachMainImg">
                                        Approach Img (URL)
                                    </label>
                                    <input
                                        id="approachMainImg"
                                        name="approachMainImg"
                                        type="text"
                                        value={form?.approachMainImg}
                                        onChange={handleInput}
                                        placeholder="https://..."
                                        style={inputStyle}
                                    />
                                    <h2>-- OR --</h2>
                                </>
                            ) : null}
                            {/* APPROACH IMAGE UPLOAD + PREVIEW */}
                            <label style={labelStyle} htmlFor="approachImgFile">
                                (Approach) Img
                            </label>
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                {/* Button-style label for the hidden file input */}
                                <label
                                    htmlFor="approachImgFile"
                                    style={{
                                        background: "goldenrod",
                                        padding: "1vh 1vw",
                                        width: "60%",
                                        textAlign: "center",
                                        cursor: "pointer",
                                    }}
                                >
                                    📷 Choose Approach Img
                                </label>
                                <input
                                    id="approachImgFile"
                                    name="approachImgFile"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleUploadImage("approachImg")}
                                />
                                {/* Preview after upload selection */}
                                {form?.approachImgPreview && (
                                    <div style={{ margin: "1vh 1vw", textAlign: "center" }}>
                                        <img
                                            src={form?.approachImgPreview}
                                            alt="Approach preview"
                                            style={{ maxHeight: "10vh", maxWidth: "15vw" }}
                                        />
                                        <div>Img selected</div>
                                        {/* Cancel / Clear button */}
                                        <button
                                            type="button"
                                            onClick={handleClearUploadImage("approachImg")}
                                            style={{ background: "red", padding: "0 1vw", margin: "1vh 0", width: "fit-content" }}
                                        >
                                            Cancel Image
                                        </button>
                                    </div>
                                )}
                            </div>

                            
                                <> <label style={labelStyle} htmlFor="approachTitle">Approach Header Title (Required)</label>
                                    <input
                                        id="approachSub"
                                        name="approachSub"
                                        type="text"
                                        value={form?.approachSub}
                                        onChange={handleInput}
                                        placeholder="Header Title"
                                        style={inputStyle}
                                    /></>
                                
                        </div>

                        <label style={labelStyle} htmlFor="approachTitle">Content Title</label>
                        <input
                            id="approachTitle"
                            name="approachTitle"
                            type="text"
                            value={form?.approachTitle}
                            onChange={handleInput}
                            placeholder="Approach title"
                            style={inputStyle}
                        />

                        <button type="button" style={{ background: "goldenRod", width: "100%", margin: "1vh 0" }} onClick={() => setAddImages("approachAdditionalImages")}>
                            Add Approach Additional Images
                        </button>

                        <div style={{ display: "flex", overflowX: "scroll", border: "10px double black", width: "100%", padding: "1vh 1vw", background: "white" }}>

                            {adminLandingInfo?.approachAdditionalImages?.length === 0 ? <h6>Currently No Additional Images: </h6> : <>

                                {adminLandingInfo?.approachAdditionalImages?.filter(img => img).reverse().map(img => {

                                    const imgSrc = img?.imageFileId && img?.imageBucketName ? `${baseUrl}/upload/image/${img?.imageFileId}?bucketName=${img?.imageBucketName}` : img?.imgImage

                                    return (
                                        <div key={img?.imageFileId || img?.link} style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "1vh 1vw", border: "double black", padding: "1vh 1vw" }}>
                                            <img src={imgSrc} style={{ minHeight: "15vh", maxHeight: "15vh", minWidth: "15vw", maxWidth: "15vw", margin: "1vh 1vw", cursor: "pointer" }} />
                                            {img?.imageFileId ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img?.imageFileId)} style={{ cursor: "pointer" }}><b>imageFileId: </b><br />{img?.imageFileId}</div> : ""}
                                            {img?.imageBucketName ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img?.imageBucketName)} style={{ cursor: "pointer" }}><b>imageBucketName: <br /></b>{img?.imageBucketName}</div> : ""}
                                            {img?.link && (<div title="Click to copy full link" onClick={() => navigator.clipboard.writeText(img.link)} style={{ cursor: "pointer" }}><b>Link:</b>{img.link?.length > 30 ? `${img.link.slice(0, 15)}...${img.link.slice(-10)}` : img?.link}</div>)}
                                            <button onClick={() => handleDeleteImage(img, "approach")} style={{ marginTop: "4px", background: "red", padding: "0 2vw" }}>Triple click image to delete</button>
                                        </div>
                                    )
                                })}

                            </>}
                        </div>


                        <label style={labelStyle} htmlFor="approachContent"> Approach Content </label>
                        <div className='lookAtMe' style={{ background: "goldenRod", width: "100%", textAlign: "center", margin: "1vh 0" }} onClick={() => setOpenModal(true)}>How Do I Use Special Attributes For These Pages?</div>
                        <code style={{ width: "100%", textAlign: "center" }}>Example Img Link: ➡️ &lt;img src="http://localhost:8080/upload/image/<b style={{ color: "blue" }}>imageFileId</b>?bucketName=<b style={{ color: "blue" }}>imageBucketName</b>" alt="Description" /&gt; ⬅️</code>
                        <textarea
                            id="approachContent"
                            name="approachContent"
                            value={form?.approachContent}
                            onChange={handleInput}
                            placeholder="Approach content"
                            style={{ ...inputStyle, minHeight: '40vh', padding: "1vh 1vw" }}
                        />

                        {form.approachContent ? <div style={{ width: "100%", border: "10px double black", padding: "1vh 1vw" }}>
                            <b>Preview Approach Content: </b>
                            <div style={{ background: "white", width: "100%", padding: "2vw", overflowX: "scroll", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form?.approachContent) }} />
                        </div> : ""}

                        <label style={labelStyle} htmlFor="approachVideo">
                            Approach Video (URL)
                        </label>
                        <input
                            id="approachVideo"
                            name="approachVideo"
                            type="text"
                            value={form?.approachVideo}
                            onChange={handleInput}
                            placeholder="https://..."
                            style={inputStyle}
                        />

                        <button type="submit" style={{ background: 'green', color: 'white', width: '100%', height: '5vh', margin: '1vh 0', }}>Submit Pages</button>
                    </> : ""}


                    {changeFormContent === "inpatient" ? <>


                        {/* ---------------------------------------------------- INPATIENT Landing Page */}
                        <h3 style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', border: "solid black", padding: "1vh 0", background: "lightGrey" }}>Inpatient Landing Page</h3>

                        <div style={{ width: "100%", border: "double black", display: "flex", flexDirection: "column", alignItems: "center", padding: "2vh 0" }}>
                            {!form?.inpatientImgPreview ?
                                <>
                                    <div style={{ color: "red", textAlign: "center" }}>If you dont select an image it will use the default imageIf No Image, Or Header Title Is Provided It Changes the format of page. This is The Main Image in the header</div>
                                    <label style={labelStyle} htmlFor="inpatientMainImg">Inpatient Img (URL)</label>
                                    <input
                                        id="inpatientMainImg"
                                        name="inpatientMainImg"
                                        type="text"
                                        value={form?.inpatientMainImg}
                                        onChange={handleInput}
                                        placeholder="https://..."
                                        style={inputStyle}
                                    />
                                    <h2>-- OR --</h2>
                                </>

                                : ""}

                            {/* INPATIENT IMAGE UPLOAD + PREVIEW */}
                            <label style={labelStyle} htmlFor="inpatientImgFile">(Inpatient) Img</label>
                            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                {/* Button-style label for the hidden file input */}
                                <label htmlFor="inpatientImgFile" style={{ background: 'goldenrod', padding: "1vh 1vw", width: "60%" }} >📷 Choose Inpatient Img</label>
                                <input
                                    id="inpatientImgFile"
                                    name="inpatientImgFile"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleUploadImage('inpatientImg')}
                                />
                                {/* Preview after upload selection */}
                                {form.inpatientImgPreview && (
                                    <div style={{ margin: "1vh 1vw" }}>
                                        <img
                                            src={form?.inpatientImgPreview}
                                            alt="Inpatient preview"
                                            style={{ maxHeight: "10vh", maxWidth: "15vw" }}
                                        />
                                        <div>Img selected</div>
                                        <button
                                            type="button"
                                            onClick={handleClearUploadImage("inpatientImg")}
                                            style={{ background: "red", padding: "0 1vw", margin: "1vh 0", width: "fit-content" }}
                                        >
                                            Cancel Image
                                        </button>
                                    </div>
                                )}
                            </div>
                            {form?.inpatientImgPreview || form?.inpatientMainImg ?
                                <>
                                    <label style={labelStyle} htmlFor="InpatientTitle">Inpatient Header Title (Required With Image)</label>

                                    <input
                                        id="InpatientSub"
                                        name="InpatientSub"
                                        type="text"
                                        value={form?.InpatientSub}
                                        onChange={handleInput}
                                        placeholder="Inpatient subtitle"
                                        style={inputStyle}
                                    />

                                </>
                                : ""}
                        </div>

                        <label style={labelStyle} htmlFor="InpatientSub">
                            Inpatient Title
                        </label>
                        <input
                            id="InpatientTitle"
                            name="InpatientTitle"
                            type="text"
                            value={form?.InpatientTitle}
                            onChange={handleInput}
                            placeholder="Inpatient title"
                            style={inputStyle}
                        />


                        <button type="button" style={{ background: "goldenRod", width: "100%", margin: "1vh 0" }} onClick={() => setAddImages("inpatientAdditionalImages")}>
                            Add Inpatient Additional Images
                        </button>

                        <div style={{ display: "flex", overflowX: "scroll", border: "10px double black", width: "100%", padding: "1vh 1vw", background: "white" }}>

                            {adminLandingInfo?.inpatientAdditionalImages?.length === 0 ? <h6>Currently No Additional Images: </h6> : <>

                                {adminLandingInfo?.inpatientAdditionalImages?.filter(img => img).reverse().map(img => {

                                    const imgSrc = img?.imageFileId && img?.imageBucketName ? `${baseUrl}/upload/image/${img.imageFileId}?bucketName=${img.imageBucketName}` : img?.imgImage

                                    return (
                                        <div key={img?.imageFileId || img?.link} style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "1vh 1vw", border: "double black", padding: "1vh 1vw" }}>
                                            <img src={imgSrc} style={{ minHeight: "15vh", maxHeight: "15vh", minWidth: "15vw", maxWidth: "15vw", margin: "1vh 1vw", cursor: "pointer" }} />
                                            {img?.imageFileId ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img?.imageFileId)} style={{ cursor: "pointer" }}><b>imageFileId: </b><br />{img?.imageFileId}</div> : ""}
                                            {img?.imageBucketName ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img.imageBucketName)} style={{ cursor: "pointer" }}><b>imageBucketName: <br /></b>{img?.imageBucketName}</div> : ""}
                                            {img?.link && (<div title="Click to copy full link" onClick={() => navigator.clipboard.writeText(img?.link)} style={{ cursor: "pointer" }}><b>Link:</b>{img?.link?.length > 30 ? `${img?.link.slice(0, 15)}...${img.link.slice(-10)}` : img?.link}</div>)}
                                            <button onClick={() => handleDeleteImage(img, "inpatient")} style={{ marginTop: "4px", background: "red", padding: "0 2vw" }}>Triple click image to delete</button>
                                        </div>
                                    )
                                })}

                            </>}
                        </div>


                        <label style={labelStyle} htmlFor="InpatientContent"> Inpatient Content </label>
                        <div className='lookAtMe' style={{ background: "goldenRod", width: "100%", textAlign: "center", margin: "1vh 0" }} onClick={() => setOpenModal(true)}>How Do I Use Special Attributes For These Pages?</div>
                        <code style={{ width: "100%", textAlign: "center" }}>Example Img Link: ➡️ &lt;img src="http://localhost:8080/upload/image/<b style={{ color: "blue" }}>imageFileId</b>?bucketName=<b style={{ color: "blue" }}>imageBucketName</b>" alt="Description" /&gt; ⬅️</code>
                        <textarea
                            id="InpatientContent"
                            name="InpatientContent"
                            value={form?.InpatientContent}
                            onChange={handleInput}
                            placeholder="Inpatient content"
                            style={{ ...inputStyle, minHeight: '40vh', padding: "1vh 1vw" }}
                        />

                        {form?.InpatientContent ? <div style={{ width: "100%", border: "10px double black", padding: "1vh 1vw" }}>
                            <b>Preview Inpatient Content: </b>
                            <div style={{ background: "white", width: "100%", padding: "2vw", overflowX: "scroll", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form?.InpatientContent) }} />
                        </div> : ""}

                        <label style={labelStyle} htmlFor="InpatientVideo">
                            Inpatient Video (URL)
                        </label>
                        <input
                            id="InpatientVideo"
                            name="InpatientVideo"
                            type="text"
                            value={form?.InpatientVideo}
                            onChange={handleInput}
                            placeholder="https://..."
                            style={inputStyle}
                        />

                        <button type="submit" style={{ background: 'green', color: 'white', width: '100%', height: '5vh', margin: '1vh 0', }}>Submit Pages</button>
                    </> : ""}


                    {changeFormContent === "outreach" ? <>



                        {/* ----------------------------------------------------- OUTREACH Landing Page */}
                        <h3 style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', border: "solid black", padding: "1vh 0", background: "lightGrey" }}>Outreach Landing Page</h3>

                        <div style={{ width: "100%", border: "double black", display: "flex", flexDirection: "column", alignItems: "center", padding: "2vh 0" }}>
                            {!form?.outreachImgPreview ?
                                <>
                                    <div style={{ color: "red", textAlign: "center" }}>If you dont select an image it will use the default imageIf No Image, Or Header Title Is Provided It Changes the format of page. This is The Main Image in the header</div>
                                    <label style={labelStyle} htmlFor="outreachMainImg">Outreach Img (URL)</label>
                                    <input
                                        id="outreachMainImg"
                                        name="outreachMainImg"
                                        type="text"
                                        value={form?.outreachMainImg}
                                        onChange={handleInput}
                                        placeholder="https://..."
                                        style={inputStyle}
                                    />
                                    <h2>-- OR --</h2>
                                </>
                                : ""}
                            {/* --------------------------------------------------- OUTREACH IMAGE UPLOAD + PREVIEW */}

                            <label style={labelStyle} htmlFor="outreachImgFile">(Outreach) Img</label>
                            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                {/* Button-style label for the hidden file input */}
                                <label htmlFor="outreachImgFile" style={{ background: 'goldenrod', padding: "1vh 1vw", width: "60%" }} >📷 Choose Outreach Img</label>
                                <input
                                    id="outreachImgFile"
                                    name="outreachImgFile"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleUploadImage('outreachImg')}
                                />
                                {/* Preview after upload selection */}
                                {form?.outreachImgPreview && (
                                    <div style={{ margin: "1vh 1vw" }}>
                                        <img
                                            src={form.outreachImgPreview}
                                            alt="Outreach preview"
                                            style={{ maxHeight: "10vh", maxWidth: "15vw" }}
                                        />
                                        <div>Img selected</div>
                                        <button
                                            type="button"
                                            onClick={handleClearUploadImage("outreachImg")}
                                            style={{ background: "red", padding: "0 1vw", margin: "1vh 0", width: "fit-content" }}
                                        >
                                            Cancel Image
                                        </button>
                                    </div>
                                )}
                            </div>

                           
                                <>
                                    <label style={labelStyle} htmlFor="outReachSub">
                                        Outreach Sub Title (required)
                                    </label>

                                    <input
                                        id="outReachSub"
                                        name="outReachSub"
                                        type="text"
                                        value={form?.outReachSub}
                                        onChange={handleInput}
                                        placeholder="Outreach subtitle"
                                        style={inputStyle}
                                    />
                                </>
                             
                        </div>
                        <label style={labelStyle} htmlFor="outReachTitle">OutReach Header Title (Required With Image)</label>
                        <input
                            id="outReachTitle"
                            name="outReachTitle"
                            type="text"
                            value={form?.outReachTitle}
                            onChange={handleInput}
                            placeholder="Outreach title"
                            style={inputStyle}
                        />

                        <button type="button" style={{ background: "goldenRod", width: "100%", margin: "1vh 0" }} onClick={() => setAddImages("outreachAdditionalImages")}>
                            Add OutReach Additional Images
                        </button>

                        <div style={{ display: "flex", overflowX: "scroll", border: "10px double black", width: "100%", padding: "1vh 1vw", background: "white" }}>

                            {adminLandingInfo?.outreachAdditionalImages?.length === 0 ? <h6>Currently No Additional Images: </h6> : <>

                                {adminLandingInfo?.outreachAdditionalImages?.filter(img => img).reverse().map(img => {

                                    const imgSrc = img?.imageFileId && img?.imageBucketName ? `${baseUrl}/upload/image/${img.imageFileId}?bucketName=${img.imageBucketName}` : img?.imgImage

                                    return (
                                        <div key={img?.imageFileId || img?.link} style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "1vh 1vw", border: "double black", padding: "1vh 1vw" }}>
                                            <img src={imgSrc} style={{ minHeight: "15vh", maxHeight: "15vh", minWidth: "15vw", maxWidth: "15vw", margin: "1vh 1vw", cursor: "pointer" }} />
                                            {img?.imageFileId ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img?.imageFileId)} style={{ cursor: "pointer" }}><b>imageFileId: </b><br />{img?.imageFileId}</div> : ""}
                                            {img?.imageBucketName ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img?.imageBucketName)} style={{ cursor: "pointer" }}><b>imageBucketName: <br /></b>{img?.imageBucketName}</div> : ""}
                                            {img?.link && (<div title="Click to copy full link" onClick={() => navigator.clipboard.writeText(img?.link)} style={{ cursor: "pointer" }}><b>Link:</b>{img?.link?.length > 30 ? `${img.link.slice(0, 15)}...${img.link.slice(-10)}` : img?.link}</div>)}
                                            <button onClick={() => handleDeleteImage(img, "outreach")} style={{ marginTop: "4px", background: "red", padding: "0 2vw" }}>Triple click image to delete</button>
                                        </div>
                                    )
                                })}

                            </>}
                        </div>


                        <label style={labelStyle} htmlFor="outReachContent"> Outreach Content </label>
                        <div className='lookAtMe' style={{ background: "goldenRod", width: "100%", textAlign: "center", margin: "1vh 0" }} onClick={() => setOpenModal(true)}>How Do I Use Special Attributes For These Pages?</div>
                        <code style={{ width: "100%", textAlign: "center" }}>Example Img Link: ➡️ &lt;img src="http://localhost:8080/upload/image/<b style={{ color: "blue" }}>imageFileId</b>?bucketName=<b style={{ color: "blue" }}>imageBucketName</b>" alt="Description" /&gt; ⬅️</code>
                        <textarea
                            id="outReachContent"
                            name="outReachContent"
                            value={form?.outReachContent}
                            onChange={handleInput}
                            placeholder="Outreach content"
                            style={{ ...inputStyle, minHeight: '40vh', padding: "1vh 1vw" }}
                        />

                        {form?.outReachContent ? <div style={{ width: "100%", border: "10px double black", padding: "1vh 1vw" }}>
                            <b>Preview Outreach Content: </b>
                            <div style={{ background: "white", width: "100%", padding: "2vw", overflowX: "scroll", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form?.outReachContent) }} />
                        </div> : ""}


                        <label style={labelStyle} htmlFor="outReachVideo">
                            Outreach Video (URL)
                        </label>
                        <input
                            id="outReachVideo"
                            name="outReachVideo"
                            type="text"
                            value={form?.outReachVideo}
                            onChange={handleInput}
                            placeholder="https://..."
                            style={inputStyle}
                        />

                        <button type="submit" style={{ background: 'green', color: 'white', width: '100%', height: '5vh', margin: '1vh 0', }}>Submit Pages</button>
                    </> : ""}


                    {changeFormContent === "mentor" ? <>

                        {/* ------------------------------------------------ MENTOR Landing Page */}
                        <h3 style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', border: "solid black", padding: "1vh 0", background: "lightGrey" }}>Mentor Landing Page</h3>

                        <div
                            style={{
                                width: "100%",
                                border: "double black",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "2vh 0",
                            }}
                        >
                            {!form?.mentorImgPreview ? (
                                <>
                                    <label style={labelStyle} htmlFor="mentorMainImg">
                                        Mentor Img (URL)
                                    </label>
                                    <input
                                        id="mentorMainImg"
                                        name="mentorMainImg"
                                        type="text"
                                        value={form?.mentorMainImg}
                                        onChange={handleInput}
                                        placeholder="https://..."
                                        style={inputStyle}
                                    />
                                    <h2>-- OR --</h2>
                                </>
                            ) : null}
                            {/* MENTOR IMAGE UPLOAD + PREVIEW */}
                            <label style={labelStyle} htmlFor="mentorImgFile">
                                (Mentor) Img
                            </label>
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                {/* Button-style label for the hidden file input */}
                                <label
                                    htmlFor="mentorImgFile"
                                    style={{
                                        background: "goldenrod",
                                        padding: "1vh 1vw",
                                        width: "60%",
                                        textAlign: "center",
                                        cursor: "pointer",
                                    }}
                                >
                                    📷 Choose Mentor Img
                                </label>
                                <input
                                    id="mentorImgFile"
                                    name="mentorImgFile"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleUploadImage("mentorImg")}
                                />
                                {/* Preview after upload selection */}
                                {form.mentorImgPreview && (
                                    <div style={{ margin: "1vh 1vw", textAlign: "center" }}>
                                        <img
                                            src={form?.mentorImgPreview}
                                            alt="Mentor preview"
                                            style={{ maxHeight: "10vh", maxWidth: "15vw" }}
                                        />
                                        <div>Img selected</div>
                                        {/* Cancel / Clear button */}
                                        <button
                                            type="button"
                                            onClick={handleClearUploadImage("mentorImg")}
                                            style={{ background: "red", padding: "0 1vw", margin: "1vh 0", width: "fit-content" }}
                                        >
                                            Cancel Image
                                        </button>
                                    </div>
                                )}
                            </div>

                            {form?.mentorImgPreview || form?.mentorMainImg ?
                                <>    
                                <label style={labelStyle} htmlFor="mentorSub">Mentor Sub Title</label>
                        <input
                            id="mentorSub"
                            name="mentorSub"
                            type="text"
                            value={form.mentorSub}
                            onChange={handleInput}
                            placeholder="Mentor subtitle"
                            style={inputStyle}
                        />
                                </> : ""}

                        </div>

                      <label style={labelStyle} htmlFor="mentorTitle">Mentor Header Title</label>
                                    <input
                                        id="mentorTitle"
                                        name="mentorTitle"
                                        type="text"
                                        value={form?.mentorTitle}
                                        onChange={handleInput}
                                        placeholder="Mentor title"
                                        style={inputStyle}
                                    />

                        <button type="button" style={{ background: "goldenRod", width: "100%", margin: "1vh 0" }} onClick={() => setAddImages("mentorAdditionalImages")}>
                            Add Mentor Additional Images
                        </button>

                        <div style={{ display: "flex", overflowX: "scroll", border: "10px double black", width: "100%", padding: "1vh 1vw", background: "white" }}>

                            {adminLandingInfo?.mentorAdditionalImages?.length === 0 ? <h6>Currently No Additional Images: </h6> : <>

                                {adminLandingInfo?.mentorAdditionalImages?.filter(img => img).reverse().map(img => {

                                    const imgSrc = img?.imageFileId && img?.imageBucketName ? `${baseUrl}/upload/image/${img?.imageFileId}?bucketName=${img?.imageBucketName}` : img?.imgImage

                                    return (
                                        <div key={img?.imageFileId || img?.link} style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "1vh 1vw", border: "double black", padding: "1vh 1vw" }}>
                                            <img src={imgSrc} style={{ minHeight: "15vh", maxHeight: "15vh", minWidth: "15vw", maxWidth: "15vw", margin: "1vh 1vw", cursor: "pointer" }} />
                                            {img?.imageFileId ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img?.imageFileId)} style={{ cursor: "pointer" }}><b>imageFileId: </b><br />{img?.imageFileId}</div> : ""}
                                            {img?.imageBucketName ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img?.imageBucketName)} style={{ cursor: "pointer" }}><b>imageBucketName: <br /></b>{img?.imageBucketName}</div> : ""}
                                            {img?.link && (<div title="Click to copy full link" onClick={() => navigator.clipboard.writeText(img.link)} style={{ cursor: "pointer" }}><b>Link:</b>{img.link?.length > 30 ? `${img?.link.slice(0, 15)}...${img?.link.slice(-10)}` : img.link}</div>)}
                                            <button onClick={() => handleDeleteImage(img, "mentor")} style={{ marginTop: "4px", background: "red", padding: "0 2vw" }}>Triple click image to delete</button>
                                        </div>
                                    )
                                })}

                            </>}
                        </div>


                        <label style={labelStyle} htmlFor="mentorContent">Mentor Content</label>
                        <div className='lookAtMe' style={{ background: "goldenRod", width: "100%", textAlign: "center", margin: "1vh 0" }} onClick={() => setOpenModal(true)}>How Do I Use Special Attributes For These Pages?</div>
                        <code style={{ width: "100%", textAlign: "center" }}>Example Img Link: ➡️ &lt;img src="http://localhost:8080/upload/image/<b style={{ color: "blue" }}>imageFileId</b>?bucketName=<b style={{ color: "blue" }}>imageBucketName</b>" alt="Description" /&gt; ⬅️</code>
                        <textarea
                            id="mentorContent"
                            name="mentorContent"
                            value={form?.mentorContent}
                            onChange={handleInput}
                            placeholder="Mentor content"
                            style={{ ...inputStyle, minHeight: '40vh', padding: "1vh 1vw" }}
                        />

                        {form?.mentorContent ? <div style={{ width: "100%", border: "10px double black", padding: "1vh 1vw" }}>
                            <b>Preview Mentor Content: </b>
                            <div style={{ background: "white", width: "100%", padding: "2vw", overflowX: "scroll", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form?.mentorContent) }} />
                        </div> : ""}

                        <label style={labelStyle} htmlFor="mentorVideo"> Mentor Video (URL)</label>
                        <input
                            id="mentorVideo"
                            name="mentorVideo"
                            type="text"
                            value={form?.mentorVideo}
                            onChange={handleInput}
                            placeholder="https://..."
                            style={inputStyle}
                        />

                        <button type="submit" style={{ background: 'green', color: 'white', width: '100%', height: '5vh', margin: '1vh 0', }}>Submit Pages</button>
                    </> : ""}



                </form>

                <dialog open={!!addImages}>
                    <AddImageModal
                        section={addImages}
                        form={form}
                        setForm={setForm}
                        setAddImages={setAddImages}
                    />
                </dialog>
            </div>
        </div>
    );
};
export default AdminLandingForm;