import React, { useState } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from "react";
import { deleteReply, makeReply } from '../../../../../redux/reducers/replyReducer';
import { deletePost, markPostSeen, resetPostSeen } from '../../../../../redux/reducers/chatRoomReducers';

const AdminStaffCard = ({ post, trigger, setTrigger }) => {

    const MAX_LENGTH = 1500;
    const lastTapRef = useRef(0);

    const [replyToMsg, setReplyToMsg] = useState(false)
    const [reply, setReply] = useState(false)
    const [seen, setSeen] = useState(false)

    const dispatch = useDispatch()

    const user = useSelector(state => state.auth.user)


    const [formData, setFormData] = useState({
        replyMessage: "",
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e, postId) => {
        e.preventDefault();
        // Start with the raw message from state
        let safeReplyMessage = formData.replyMessage;
        // Only sanitize for non-admins

        safeReplyMessage = DOMPurify.sanitize(safeReplyMessage, {
            FORBID_TAGS: [
                "script",
                "iframe",
                "object",
                "embed",
                "form",
                "input",
                "button",
                "link",
                "meta",
                "base",
            ],
            FORBID_ATTR: ["onerror", "onload", "onclick"],
        });

        const payload = {
            replyUserId: user?._id,
            replyMessage: safeReplyMessage,
            postId: postId,
        };
        setTrigger(true)
        setReplyToMsg(false)
        dispatch(makeReply(payload));
        // Clear textarea after submit
        setFormData({ replyMessage: "" });
    };

    const remainingChars = MAX_LENGTH - formData.replyMessage.length;

    const markUserSeenPost = (postId) => {
        setTrigger(true)
        dispatch(markPostSeen({ postId, userId: user?._id, seen: true, }))
    }

    const unSeenMark = (postId) => {
        setTrigger(true)
        dispatch(resetPostSeen({ postId, userId: user?._id }))
    }

    const deleteMe = (postId) => {
        const now = Date.now();
        const delay = 400;
        if (now - lastTapRef.current < delay) {
            setTrigger(true);
            dispatch(deletePost(postId));
        }
        lastTapRef.current = now;
    };

    const deleteMeReply = (replyDelete) => {
        const now = Date.now();
        const delay = 400;
        if (now - lastTapRef.current < delay) {
            setTrigger(true);
            dispatch(deleteReply(replyDelete));
        }
        lastTapRef.current = now;
    };

    return (

        <>
            <div style={{ width: "90vw", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 0", display: "flex", flexDirection: "column", border: "solid antiqueWhite", padding: "1vw" }}>

                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "small" }}>{moment(post?.createdAt).format("hh:mm MMM Do YY")}</span>

                    <span style={{ fontSize: "small" }}><b>Sent By:</b> <Link to={`/messagePage/${post?.userId}`}>{post?.accountName}</Link></span>

                </div>
                {post.recipients.length !== 0 ? (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            overflow: "hidden",
                            background: "white",
                            width: "100%",
                        }}
                        className="scrollBar"
                    >
                        {/* Animated strip */}
                        <div className="scrollBy" style={{ display: "flex" }}>
                            <div style={{ minWidth: "fit-content" }}><b>Other Users In Msg:</b></div>
                            {post.recipients
                                .filter(rep => rep !== user?.accountName)
                                .map(rep => (
                                    <div key={rep} style={{ margin: "0 1vw", minWidth: "fit-content" }}>
                                        {rep}
                                    </div>
                                ))}
                        </div>
                    </div>
                ) : null}


                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post?.postTitle) }} />
                <div style={{ width: "100%", textAlign: "center", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post?.postBody) }} />


                {replyToMsg ? <button style={{ background: "red", margin: "1vh 0", color: "white" }} onClick={() => setReplyToMsg(false)}>Cancel Reply</button> : <button style={{ background: "green", margin: "1vh 0", color: "white" }} onClick={() => setReplyToMsg(true)}>Reply To Msg</button>}

                {replyToMsg ?
                    <form onSubmit={(e) => handleSubmit(e, post?._id)} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: "center", gap: '1rem', }}>
                        <textarea
                            id="replyMessage"
                            name="replyMessage"
                            value={formData.replyMessage}
                            onChange={handleChange}
                            required
                            style={{ border: "solid lightGrey", background: "white", height: "20vh", width: "80%" }}
                            maxLength={MAX_LENGTH}
                        />
                        <div style={{ width: "80%", textAlign: "right", fontSize: "0.85rem", color: "gray" }}>
                            {remainingChars} characters remaining
                        </div>

                        <button type="submit" style={{ background: "green", color: "white", width: "80%", height: "5vh", margin: "1vh 0" }}>Submit Reply</button>
                    </form>
                    : ""}

                {post?.reply.length !== 0 ? <>{!reply ?
                    <button style={{ background: "goldenRod" }} onClick={() => setReply(true)}>See {post?.reply.length <= 1 ? "Reply" : `Replies (${post?.reply.length})`}</button> :
                    <button style={{ background: "goldenRod" }} onClick={() => setReply(false)}>Hide {post?.reply.length <= 1 ? "Reply" : `Replies (${post?.reply.length})`}</button>}</> : ""}

                {reply && post?.reply.filter(reply => reply).length !== 0 ?

                    <div style={{ background: "grey", display: "flex", flexDirection: "column", alignItems: "center", padding: "1vh 0", margin: "1vh 0" }}>
                        {post?.reply.filter(reply => reply).map(reply => {

                            return (
                                <div style={{ width: "90%", background: "rgba(250, 235, 215, 0.960)", margin: "0.5vh 0", display: "flex", flexDirection: "column", border: "solid antiqueWhite", padding: "1vw" }} key={crypto.randomUUID()}>
                                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: "small" }}>{moment(reply?.createdAt).format("hh:mm MMM Do YY")}</span>

                                        <span style={{ fontSize: "small" }}><b>Sent By:</b> <Link to={`/messagePage/${post?.userId}`}>{reply?.replyAccountName}</Link></span>

                                    </div>
                                    <div style={{ width: "100%", textAlign: "center", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply?.replyMessage) }} />
                                    {post?.userId === user?._id || user?.creator || reply?.userId === user?._id || user?.NFadmin ?
                                        <button style={{ background: "red", width: "20%", margin: "0 0.5vw" }} onClick={() => deleteMeReply(reply?._id)}>Delete Me</button>
                                        : ""}
                                </div>
                            )
                        })}

                    </div>

                    : ""}

                <div style={{ margin: "1vh 0" }}>
                    {post?.seen?.some(s => String(s.userId) === String(user?._id) && s.seen === true) ? (
                        <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} className='responsiveButtonCard'>
                            <div>✅ Seen {post?.areaOfPost}</div>
                            <div style={{ width: "40%", display: "flex" }} className='responsiveCardContainer'>
                                <button style={{ background: "lime", width: "70%" }} onClick={() => unSeenMark(post?._id)} className='responsiveButtonCardButton'>Un See Me</button>
                                {post?.userId === user?._id || user?.creator || user?.NFadmin ?
                                    <button style={{ background: "red", width: "20%", margin: "0 0.5vw" }} onClick={() => deleteMe(post?._id)} className='responsiveButtonCardButton'>Delete Me</button> : ""}
                            </div>
                        </div>)
                        :
                        (<div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} className='responsiveButtonCard'>
                            <div>❌ Un Seen {post?.areaOfPost}</div>
                            <div style={{ width: "40%", display: "flex" }} className='responsiveCardContainer'>
                                <button style={{ border: "solid red", width: "70%" }} onClick={post?.seen?.some(s => String(s.userId) === String(user?._id) && s.seen === true) ? undefined : () => markUserSeenPost(post._id)} className='responsiveButtonCardButton'>Mark Me Seen</button>
                                {post?.userId === user?._id || user?.creator || user?.NFadmin ?
                                    <button style={{ background: "red", width: "20%", margin: "0 0.5vw" }} onClick={() => deleteMe(post?._id)} className='responsiveButtonCardButton'>Delete Me</button> : ""}
                            </div>
                        </div>)}
                </div>

            </div>

        </>
    )
}


export default AdminStaffCard
