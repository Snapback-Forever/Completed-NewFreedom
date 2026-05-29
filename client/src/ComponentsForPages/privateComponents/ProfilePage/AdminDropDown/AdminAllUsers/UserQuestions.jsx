import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteQuestion } from '../../../../../redux/reducers/questionReducers';
import moment from 'moment'
import DOMPurify from 'dompurify';
import { useRef } from "react";
import { Link } from 'react-router-dom';

const UserQuestions = ({ user, admin, quest }) => {

    const dispatch = useDispatch();
    const lastTapRef = useRef(0);

    const [ showRes, setShowRes ] = useState(false)

    const deleteMe = (id) => {
        const now = Date.now();
        const delay = 400;
        if (now - lastTapRef.current < delay) {
          dispatch(deleteQuestion(id));
          setTrigger(true);
        }
        lastTapRef.current = now;
      };

    return (

        <div>

      
                    <div style={{ width: "100%", background: "white", margin: "1vh 0", display: "flex", flexDirection: "column", border: "solid antiqueWhite" }} className='responsiveUserAllQuestion'>
                        <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                            <span style={{ fontSize: "small" }}>{moment(quest?.createdAt).format("MMM Do YY")}</span>
                            <div>{quest?.questionStatus}</div>
                        </div>

                        <div style={{ width: "100%", display: "flex", justifyContent: 'space-around' }} className='responsiveUserAllQuestion'>
                            <h6><b>FirstName:</b> {quest?.firstName}</h6>
                            <h6><b>LastName:</b> {quest?.lastName}</h6>
                        </div>

                        <div style={{ width: "100%", display: "flex", justifyContent: 'space-around' }}  className='responsiveUserAllQuestion'>
                            <h6><b>Phone Number:</b> {quest?.phoneNumber}</h6>
                            <h6><b>Email:</b> {quest?.email}</h6>
                        </div>

                        <h2 style={{ width: "100%", textAlign: "center", padding: "2vw", wordBreak: "break-all" }}>{quest?.title}</h2>
                        <h6 style={{ width: "100%", textAlign: "center", padding: "2vw", wordBreak: "break-all", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(quest?.body) }} />

                        {quest?.response?.length !== 0 ? <>
                        { showRes ? <button onClick={()=> setShowRes(false)} style={{ background: "red" }}>Hide Show Response{quest?.response.length > 1 ? "'s" : ""}</button> : <button onClick={()=> setShowRes(true)} style={{ background: "goldenRod" }}>Show Response{quest?.response.length > 1 ? "'s" : ""}</button>}</> : ""}

                        { showRes ? 
                        <>
                        {quest?.response?.filter(r => r).map(res => {
                            return (
<>
                                <div style={{ width: "98%", background: "white", margin: "1vh 0", display: "flex", flexDirection: "column", border: "double black", padding: "1vw" }}>
                                    <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }} className='responsiveUserAllQuestionResponse'>
                                        <span style={{ fontSize: "small" }}>{moment(res?.createdAt).format("MMM Do YY")}</span>
                                        <div>{res?.questionType}</div>
                                    </div>

                                    <h5 style={{ textAlign: "center" }}><b>User Whom Responded: {" "}</b> 
                                    {res?.userId === admin?._id ? <Link to={`/messagePage/${res?.userId}`}>{res?.accountName}</Link> : "Your Response"}
                                    </h5>
                                    {res?.responseGuest ? 
                                    <>
                                    <h6 style={{ width: "100%", textAlign: "center", padding: "2vw", wordBreak: 'break-all' }}><b>Re Response From Guest:</b> {res?.responseGuest}</h6>
                                    <div style={{ border: "1px solid black" }}></div>
                                    </> : ""}
                                    <h6 style={{ width: "100%", textAlign: "center", padding: "2vw", wordBreak: 'break-all', }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(res?.responseToMsg) }} />

                                </div>
                                <div style={{ border: "1px solid black", margin: "1vh 1vw" }}></div>
                                </>
                            )
                        })}</> : ""}

                    </div>

        </div>
    )
}

export default UserQuestions
