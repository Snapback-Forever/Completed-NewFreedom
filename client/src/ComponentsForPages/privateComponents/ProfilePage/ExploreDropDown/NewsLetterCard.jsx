import React, { useRef, useState } from 'react'
import moment from 'moment'
import DOMPurify from 'dompurify'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAdditionalImage, deleteNewsLetter, updateNewsLetter, updateNewsLetterStatus } from '../../../../redux/reducers/newsLetterReducer'


const NewsLetterCard = ({ news, setTrigger, setAddImage, addImage, setNewsInfo }) => {

    const dispatch = useDispatch()
    const admin = useSelector(state => state.auth.user)

    const [editing, setEditing] = useState(false)
    const [editingStatus, setEditingStatus] = useState(false);
    const [status, setStatus] = useState(news?.status);

    const [form, setForm] = useState({
        postTitle: news?.postTitle || "",
        postBody: news?.postBody || "",
        periodStart: news?.periodStart || "",
        periodEnd: news?.periodEnd || ""
    })

    const openModal = (newsInfo) => {
        setNewsInfo(newsInfo)
        setAddImage(true)
    }

    const tapCountRef = useRef(0);
    const lastTapRef = useRef(0);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const sanitizedForm = { ...form }

        sanitizedForm.postTitle = DOMPurify.sanitize(form.postTitle, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: []
        })

        sanitizedForm.postBody = DOMPurify.sanitize(form.postBody, {
            FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
            FORBID_ATTR: ["onerror", "onload", "onclick"]
        })

        dispatch(updateNewsLetter({
            id: news._id,
            ...sanitizedForm
        }))

        setEditing(false)
        setTrigger(prev => !prev)
    }

    const deleteTheImage = (img) => {
        console.log("img", img);
        const now = Date.now();
        const delay = 400;

        if (now - lastTapRef.current < delay) {
            tapCountRef.current += 1;
        } else {
            tapCountRef.current = 1;
        }

        lastTapRef.current = now;

        if (tapCountRef.current === 3) {
            dispatch(deleteAdditionalImage({
                id: news._id,
                imageFileId: img.imageFileId,
                imageBucketName: img.imageBucketName,
                link: img.link
            }))
            setTrigger(prev => !prev);
        }
    };


    const deleteThisNews = (id) => {
        const now = Date.now();
        const delay = 400;

        if (now - lastTapRef.current < delay) {
            tapCountRef.current += 1;
        } else {
            tapCountRef.current = 1;
        }

        lastTapRef.current = now;

        if (tapCountRef.current === 3) {
            dispatch(deleteNewsLetter(id))
            setTrigger(true)
        }
    }

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
        margin: "1vh 0"
    };

    const updateThisStatus = (id) => {
        const payload = {
            id,
            status
        }
        dispatch(updateNewsLetterStatus(payload))
        setTrigger(true)
        setEditingStatus(false)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ width: '95vw', height: "fit-content", display: 'flex', flexDirection: 'column', background: "rgba(250, 235, 215, 0.960)", overflowY: 'auto', padding: '1rem 1vw', margin: "1vh 1vw" }}>

                {admin?.creator || admin?.NFadmin || admin?._id === news?.userId ? <button style={{ background: "goldenRod", width: "100%", margin: '1vh 0' }} onClick={() => openModal(news)}>Add Images</button> : ""}

                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <div style={{ fontSize: "small" }}>{moment(news?.createdAt).format("hh:mm MMM Do YY")}</div>
                        <div>
                            <b>NewsLetter Status: </b>
                            {admin?.creator || admin?.NFadmin ? <> {editingStatus ? (
                                <div style={{ background: "lightGrey", padding: '1vh 1vw' }}>
                                    <b>Change Status</b>
                                    <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ ...inputStyle }}>
                                        <option value="draft">draft</option>
                                        <option value="published">published</option>
                                        <option value="rejected">rejected</option>
                                    </select>
                                    <button style={{ background: "goldenrod", width: "100%", margin: '0.5vh 0' }} onClick={() => updateThisStatus(news?._id)}>Update</button>
                                    <button style={{ background: "red", width: "100%", margin: '0.5vh 0' }} onClick={() => { setStatus(news?.status); setEditingStatus(false); }}>Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    {news?.status === "draft" ? <div style={{ border: "solid lightBlue", textAlign: "center" }} onClick={() => setEditingStatus(true)}>👁️‍🗨️ Draft</div> : ""}
                                    {news?.status === "reviewed" ? <div style={{ border: "solid green", textAlign: "center" }} onClick={() => setEditingStatus(true)}>😁 Reviewed</div> : ""}
                                    {news?.status === "published" ? <div style={{ border: "solid Lime", textAlign: "center" }} onClick={() => setEditingStatus(true)}>✅ Published</div> : ""}
                                    {news?.status === "rejected" ? <div style={{ border: "solid red", textAlign: "center" }} onClick={() => setEditingStatus(true)}>⛔ Rejected</div> : ""}
                                </div>
                            )}</>
                                :
                                <div>
                                    {news?.status === "draft" ? <div style={{ border: "solid lightBlue", textAlign: "center" }} onClick={() => setEditingStatus(true)}>👁️‍🗨️ Draft</div> : ""}
                                    {news?.status === "reviewed" ? <div style={{ border: "solid green", textAlign: "center" }} onClick={() => setEditingStatus(true)}>😁 Reviewed</div> : ""}
                                    {news?.status === "published" ? <div style={{ border: "solid Lime", textAlign: "center" }} onClick={() => setEditingStatus(true)}>✅ Published</div> : ""}
                                    {news?.status === "rejected" ? <div style={{ border: "solid red", textAlign: "center" }} onClick={() => setEditingStatus(true)}>⛔ Rejected</div> : ""}
                                </div>
                            }
                        </div>
                    </span>
                </div>

                {news?.additionalImages?.length === 0 ? <h4> Currently No Additional Images</h4> : <>
                    <b>Additional Images: </b>
                    <div style={{ width: "100%", display: "flex", overflowX: "scroll", maxHeight: "40vh", minHeight: "40vh", background: "white" }}>
                        {news?.additionalImages.filter(img => img).reverse().map(img => {
                            const baseUrl = "http://localhost:8080";
                            const imgSrc = img?.imageFileId && img?.imageBucketName
                                ? `${baseUrl}/upload/image/${img?.imageFileId}?bucketName=${img?.imageBucketName}`
                                : img?.imgImage;

                            return (
                                <div key={img.imageFileId || img.link} style={{ display: "flex", flexDirection: "column", margin: "1vh 0.5vw", border: "double black", padding: "1vh 1vw", maxWidth: "20vw", minWidth: "20vw", maxHeight: "35vh", minHeight: "35vh" }}>
                                    <img src={imgSrc} style={{ maxWidth: "18vw", minWidth: "18vw", maxHeight: "20vh", minHeight: "20vh" }} />

                                    {img?.imageFileId ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img.imageFileId)} style={{ cursor: "pointer" }}><b>imageFileId: </b>{img?.imageFileId}</div> : ""}

                                    {img?.imageBucketName ? <div title="Click to copy" onClick={() => navigator.clipboard.writeText(img.imageBucketName)} style={{ cursor: "pointer" }}><b>imageBucketName: </b>{img?.imageBucketName}</div> : ""}

                                    {img?.link && (
                                        <div title="Click to copy full link" onClick={() => navigator.clipboard.writeText(img.link)} style={{ cursor: "pointer" }}>
                                            <b>Link:</b> {img.link.length > 30 ? `${img.link.slice(0, 15)}...${img.link.slice(-10)}` : img.link}
                                        </div>
                                    )}


                                    {admin?.creator || admin?.NFadmin || admin?._id === news?.userId ? <div style={{ display: "flex", justifyContent: "end" }}>
                                        <button style={{ background: "red", padding: "0 2vw", margin: "1vh 0" }} onClick={() => deleteTheImage(img)}>Delete Img</button>
                                    </div>
                                        : ""}

                                </div>
                            )
                        })}
                    </div>
                </>}

                <div>

                    {editing ? (
                        <>
                            <label style={labelStyle}>News Title:</label>
                            <input
                                name="postTitle"
                                value={form.postTitle}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </>
                    ) : (
                        <h2 style={{ margin: "1vh 0", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news?.postTitle) }} />
                    )}

                    {editing ? (
                        <div style={{ border: "10px double black", padding: "1vh 1vw" }}>
                            <label style={labelStyle}>News Body:</label>
                            <textarea
                                name="postBody"
                                value={form.postBody}
                                onChange={handleChange}
                                style={{ ...inputStyle, height: "100vh" }}
                            />

                            <h4>News Preview:</h4>
                            <div style={{ width: "100%", padding: "2vw", borderTop: "1px solid black", marginTop: "1vh", background: "white" }}>

                                <div style={{ whiteSpace: "pre-wrap" }}
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(form.postBody, {
                                            FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
                                            FORBID_ATTR: ["onerror", "onload", "onclick"]
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <h6
                            style={{ ...inputStyle, whiteSpace: "pre-wrap" }}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(news?.postBody)
                            }}
                        />
                    )}
                    {editing && (
                        <button
                            type="submit"
                            style={{ background: "lime", width: "100%", margin: '1vh 0' }}
                        >Update Newsletter</button>
                    )}


                    <span>
                        <b>Start Date: </b>{moment(news?.periodStart).format("MMM YYYY")}
                        <br />
                        {news?.periodEnd ? <> <b>End Date: </b>{moment(news?.periodEnd).format("MMM YYYY")}</> : ""}
                    </span>


                    <div>
                        <b>Created By:</b> {admin?._id !== news?.userId ? <Link to={`/messagePage/${news?.userId}`}>Email author</Link> : "Your News Letter"}
                    </div>


                    <div style={{ width: "100%", display: "flex" }}>
                        {!editing ?
                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>

                                {admin?._id === news?.userId || admin?.creator || admin?.NFadmin ?
                                    <button
                                        style={{ background: "lightblue", width: "30%", margin: '1vh 0' }}
                                        onClick={() => setEditing(prev => !prev)}
                                    >Edit Newsletter</button>
                                    : ""}

                                {admin?.creator || admin?.NFadmin || admin?._id === news?.userId ?
                                    <>
                                        <button
                                            style={{ background: "red", width: "20%", margin: '1vh 0' }}
                                            onClick={() => deleteThisNews(news?._id)}
                                        >Delete News Letter</button>
                                    </>
                                    : ""}

                            </div>
                            :
                            <button
                                style={{ background: "red", width: "30%", margin: '1vh 0' }}
                                onClick={() => setEditing(prev => !prev)}
                            >Cancel Edit Newsletter</button>}
                    </div>

                </div>

            </div>
        </form>
    )
}

export default NewsLetterCard
