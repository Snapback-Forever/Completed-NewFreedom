import React, { useState } from 'react'
import moment from 'moment'
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addReview } from '../../../../../redux/reducers/newsLetterReducer';


const UserNews = ({ news, admin, user, setTrigger }) => {

    const dispatch = useDispatch()

    const [makeReview, SetMakeReview] = useState()

    const hasReviewByAdmin = news?.reviewedBy?.some(
        (review) => review.userId === admin?._id
    );

    const [form, setForm] = useState({
        reviewStatus: "",
        reviewSuggestion: "",
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            userId: admin?._id,
            id: news?._id
        }

        dispatch(addReview(payload))
        setTrigger(true)
        SetMakeReview(false)
    };

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
        width: '80%',
    };


    return (

        <div style={{ background: "white", padding: "1vh 1vw" }} className='responsiveUserNews'>

            <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                <span style={{ fontSize: "small" }}>{moment(news?.createdAt).format("hh:mm MMM Do YY")}</span>
                <h6>{news?.status}</h6>
            </div>

            <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }} className='responsiveUserNews'>
                <span style={{ fontSize: "small" }}><b>Start Date:</b> {moment(news?.periodStart).format("MMM Do YY")}</span>
                <span style={{ fontSize: "small" }}><b>End Date:</b> {moment(news?.endDate).format("MMM Do YY")}</span>
            </div>

            <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
               
                <h5 style={{ width: "100%", textAlign: "center", padding: "2vw", wordBreak: "break-all", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news?.postTitle) }} />
                <h6 style={{ width: "100%", textAlign: "center", padding: "2vw", wordBreak: "break-all", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news?.postBody) }} />
            </div>

            {news?.reviewedBy?.length !== 0 ? <>

                <div style={{ width: "100%", display: "flex", flexDirection: "column", border: "solid black", padding: "1vh 1vw" }}>
                    {!hasReviewByAdmin ? <button style={{ background: "lightBlue", margin: "1vh 1vw", padding: "0 2vw" }}>Make A Review</button> : ""}
                    {news?.reviewedBy?.filter(review => review).map(rev => {
                        return (
                            <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>

                                <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                                    <span style={{ fontSize: "small" }}>{moment(rev?.reviewedAt).format("hh:mm MMM Do YY")}</span>
                                    <h5>{rev?.reviewStatus}</h5>
                                </div>

                                <div style={{ background: "lightGrey" }}><b>Suggestion: </b><h6 style={{ width: "100%", textAlign: "center", padding: "2vw", wordBreak: "break-all", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(rev?.reviewSuggestion) }} /></div>

                                {rev.userId !== admin?._id ? <Link to={`/messagePage/${rev?.userId}`}>Msg Reviewer</Link> : <span>✅ Your Review</span>}

                                <div style={{ border: "1px solid black", margin: "1vh 0" }}></div>
                            </div>

                        )
                    })}

                </div></> : <button style={{ background: "lightBlue", margin: "1vh 1vw", padding: "0 2vw" }} onClick={() => SetMakeReview(true)}>Make A Review</button>}

            {makeReview ?
                <div style={{ background: "lightGrey", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>

                    <button style={{ background: "red", margin: "1vh 1vw", padding: "0 2vw" }} onClick={() => SetMakeReview(false)}>Cancel Review</button>
                    <form onSubmit={handleSubmit} style={{ background: "lightGrey", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>

                        <label style={labelStyle}>Status</label>
                        <select
                            name="reviewStatus"
                            value={form?.reviewStatus}
                            onChange={handleInput}
                            style={inputStyle}
                        >
                            <option value="">Select status</option>
                            <option value="approved">approved</option>
                            <option value="denied">denied</option>
                            <option value="needs editing">needs editing</option>
                        </select>

                        <label style={labelStyle}>Suggestion</label>
                        <textarea
                            name="reviewSuggestion"
                            value={form?.reviewSuggestion}
                            onChange={handleInput}
                            rows={4}
                            style={inputStyle}
                        />

                        <button type="submit" style={{ background: "green", margin: "1vh 1vw", padding: "0 2vw", width: "80%" }} >Submit Review </button>
                    </form>

                </div>
                : ""}

            <div style={{ border: "solid black", margin: "1vh 0" }}></div>



        </div>

    )
}

export default UserNews
