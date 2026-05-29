import React, { useState } from 'react'
import { useRef } from "react";
import moment from 'moment'
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import ModalFindUser from './ModalFindUser';
import { deleteDirectMsg, updateDirectMsg } from '../../../../../redux/reducers/directMsgStaffReducers';
import { Link } from 'react-router-dom';

const DirectMsgCard = ({ trigger, setTrigger, allDirectMsg, allUsers, msg }) => {

    const dispatch = useDispatch()
const lastTapRef = useRef(0);

    const [openResponse, setOpenResponse] = useState(true)
    const [findUser, setFindUser] = useState(false);

    const [showAllResponses, setShowAllResponses] = useState(false);
    const responsesToShow = showAllResponses
        ? msg?.response ?? []
        : (msg?.response ?? []).slice(0, 5);

    const user = useSelector((state) => state.auth.user);

    const [responseState, setResponseState] = useState({
        directMsgId: msg?._id,
        userId: user?._id,
        accountName: user?.accountName,
        responseToMsg: "",
        guestResponse: "",
        questionStatus: "sent-response",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setResponseState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            directMsgId: responseState.directMsgId,
            userId: user?._id,
            accountName: responseState.accountName,
            responseToMsg: responseState.responseToMsg,
            guestResponse: responseState.guestResponse,
            questionType: responseState.questionType,
        };
        dispatch(updateDirectMsg(payload));
        setTrigger(true);
        setOpenResponse(true)
        setResponseState((preve) => {
            return {
                ...preve,
                directMsgId: msg?._id,
                userId: user?._id,
                id: user?._id,
                accountName: user?.accountName,
                responseToMsg: "",
                guestResponse: "",
                questionType: "sent-response",
            }
        })
    };

    const completeMsg = (msgId) => {
        const payload = {
            directMsgId: msgId,
            userId: user?._id,
            questionStatus: "completed"
        }
        dispatch(updateDirectMsg(payload))
        setTrigger(true);
    }

    const deleteMe = (directMsgId) => {
        const now = Date.now();
        const delay = 400;
        if (now - lastTapRef.current < delay) {
          dispatch(deleteDirectMsg(directMsgId));
          setTrigger(true);
        }
        lastTapRef.current = now;
      };

    return (
        <div style={{ width: "90vw", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 0", display: "flex", flexDirection: "column", border: "solid black", padding: "1vh 1vw" }} className='responsiveGuestMsg'>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                <span style={{ fontSize: "small" }}>{moment(msg?.createdAt).format("hh:mm MMM Do YY")}</span>
                <h5 style={{ wordBreak: "break-word", maxWidth: "30vw" }}>Guest Email: <a href={`mailto:${msg?.email}`}>{msg?.email}</a></h5>
            </div>

            <div>
                <h3 style={{ textAlign: "center" }}>{msg?.title}</h3>
                <h6 style={{ textAlign: "center" }}>{msg?.firstName} {msg?.lastName}</h6>
                <h6 style={{ width: "100%", textAlign: "center", padding: "2vw", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg?.msgBody) }} />
                <h6 style={{ textAlign: "center" }}>{msg?.phoneNumber}</h6>
            </div>

            <>
                {responsesToShow.map(res => (
                    <div
                        key={res._id}
                        style={{ background: "white", padding: "1vh 1vw", margin: "1vh 0" }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-around" }}>
                            <span
                                style={{ fontSize: "small", display: "flex", justifyContent: "end", margin: "1vh 1vw" }}
                            >
                                {moment(res?.createdAt).format("hh:mm MMM Do YY")}
                            </span>
                            <span
                                style={{ fontSize: "small", display: "flex", justifyContent: "end", margin: "1vh 1vw" }}
                            >
                                <Link to={`/messagePage/${res?.userId[0]}`}>
                                    {res?.accountName !== user?.accountName
                                        ? <>Response By: {res?.accountName}</>
                                        : ""}
                                </Link>
                            </span>
                        </div>
                        <div>
                            {res?.guestResponse ? (
                                <span
                                    style={{ width: "100%", textAlign: "center", display: "flex", flexDirection: "column" }}
                                >
                                    <b>Guest Re-Response:</b>
                                    <h6 style={{ whiteSpace: "pre-wrap" }}
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(res?.guestResponse),
                                        }}
                                    />
                                </span>
                            ) : (
                                ""
                            )}
                            <span>
                                <b>Response:</b>
                                <h6
                                    style={{ width: "100%", padding: "2vw", whiteSpace: "pre-wrap" }}
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(res?.responseToMsg),
                                    }}
                                />
                            </span>
                        </div>
                    </div>
                ))}
                {/* Show button only if there are more than 5 responses */}
                {msg?.response?.length > 5 && !showAllResponses && (
                    <button
                        type="button"
                        style={{ marginTop: "1vh", background: "green", width: "100%", color: "white" }}
                        onClick={() => setShowAllResponses(true)}
                    >
                        Show more responses
                    </button>
                )}
                {msg?.response?.length > 5 && showAllResponses && (
                    <button
                        type="button"
                        style={{ marginTop: "1vh", background: "red", width: "100%", }}
                        onClick={() => setShowAllResponses(false)}
                    >
                        Show fewer responses
                    </button>
                )}
            </>

            <div>
                {!openResponse ?
                    <button style={{ background: "goldenRod", width: "100%", color: "black" }} onClick={() => setOpenResponse(true)}>Cancel Response</button> :
                    <button style={{ background: "goldenRod", width: "100%", color: "black" }} onClick={() => setOpenResponse(false)}>Responded To Guest</button>
                }

                {!openResponse ? (
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                            marginTop: "1rem",
                        }}
                    >
                        {msg?.response?.some(resp => resp.userId?.includes(user?._id)) ? <><h4 style={{ color: "black", width: "80%" }}>
                            New Response From Guest
                        </h4>
                            <textarea
                                name="guestResponse"
                                style={{
                                    border: "solid lightGrey",
                                    background: "white",
                                    width: "100%",
                                }}
                                value={responseState.guestResponse}
                                onChange={handleInputChange}
                                required
                            /> </> : ""}

                        {msg?.response?.some(resp => resp.userId?.includes(user?._id)) ? <h4 style={{ color: "black", width: "80%" }}>
                            Another Response To Guest
                        </h4> : <h4 style={{ color: "black", width: "80%" }}>
                            Response To Guest
                        </h4>}
                        <textarea
                            name="responseToMsg"
                            style={{
                                border: "solid lightGrey",
                                background: "white",
                                width: "100%",
                            }}
                            value={responseState.responseToMsg}
                            onChange={handleInputChange}
                            required
                        />
                        <div
                            style={{
                                background: "green",
                                color: "white",
                                width: "100%",
                                height: "5vh",
                                marginTop: "0.5rem",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onClick={() => setFindUser(true)}
                        >
                            Send This Msg To Another User Directly
                        </div>

                        {findUser ?
                            <dialog open={findUser}>
                                <ModalFindUser allUsers={allUsers} setFindUser={setFindUser} msg={msg} setTrigger={setTrigger} />
                            </dialog>
                            :
                            <></>
                        }

                        <button
                            type="submit"
                            style={{
                                background: "goldenRod",
                                width: "100%",
                                height: "5vh",
                                marginTop: "0.5rem",
                            }}
                        >
                            Save Response
                        </button>
                    </form>
                ) : ""}


                {msg?.response?.some(resp => resp.userId?.includes(user?._id))
                    ? <button style={{ background: "green", width: "100%", color: "white", margin: "1vh 0" }} onClick={() => completeMsg(msg?._id)}>Completed </button>
                    : ""}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                {msg?.response?.some(resp => resp.userId?.includes(user?._id)) ?
                    <h6 style={{ border: "solid lime", color: "black", padding: "0 1vw", width: "20%" }}>✅ Responded</h6> : <h6 style={{ border: "solid red", color: "black", padding: "0 1vw", width: "20%" }}>❌ New Msg From Guest</h6>}
                {msg?.createdAt && (new Date() - new Date(msg.createdAt)) / (1000 * 60 * 60 * 24) >= 30 && (
                    <button style={{ background: "red", width: "20%", margin: "0.5vh 0.5vw" }} onClick={() => deleteMe(msg?._id)}>Delete Me</button>
                )}
            </div>


        </div>
    )
}

export default DirectMsgCard
