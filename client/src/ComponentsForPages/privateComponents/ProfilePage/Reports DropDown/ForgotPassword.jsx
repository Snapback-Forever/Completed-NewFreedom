import Card from 'react-bootstrap/Card';

import moment from 'moment';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteForgotPassword, updateMessageStatus } from '../../../../redux/reducers/authReducer';


const ForgotPassword = ({ msg, setTrigger }) => {

  const dispatch = useDispatch()

  const user = useSelector(state => state.auth.user)

  const updateStatus1 = () => {
    const payload = {
      id: msg?._id,
      status: "sent-Email",
      adminName: user.accountName,
      emailDate: new Date()
    }

    setTrigger(true)
    dispatch(updateMessageStatus(payload));

  };

  const updateStatus2 = () => {
    const payload = {
      id: msg?._id,
      status: "received-Response",
      adminName: user.accountName,
      emailDate: new Date()

    }
    setTrigger(true)
    dispatch(updateMessageStatus(payload));


  };

  const updateStatus3 = async (msgId) => {

    const payload = {
      id: msg?._id,
      status: "completed-Password-Change",
      adminName: user.accountName,
      emailDate: new Date()
    };

    setTrigger(true);
    await dispatch(updateMessageStatus(payload));
    await dispatch(deleteForgotPassword(msgId));
  };


  const auditDate = moment(msg?.createdAt);
  const today = moment();

  return (

    <>
      <div >

        <Card style={{ width: '95vw', margin: '1vw', padding: '1vh' }}>
          <Card.Body>
            <Card.Title style={{ display: "flex", justifyContent: "space-between" }}>
              Attempted #: {msg?.reportAttempt}
            </Card.Title>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: "small" }}><b>Date Triggered:</b> {moment(msg?.createdAt).format("MMM Do YY")}</div><div><b>Account Name:</b> {msg?.accountName}</div>
            </div>
            <Card.Subtitle className="mb-2 text-muted"><b>Email:</b> {msg?.email}</Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted"><b>FirstName:</b> {msg?.firstName}</Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted"><b>LastName:</b> {msg?.lastName}</Card.Subtitle>
            <h6>Security Questions</h6>
            <Card.Text>{msg?.securityQuestions.map(quest => {

              return (
                <div key={crypto.randomUUID()}>
                  <Card style={{ width: '98%', margin: '1vw', padding: '1vh' }}>
                    <Card.Body>
                      <Card.Title style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: "small" }}><b>Q:</b> {quest?.question}</div> </Card.Title>
                      <Card.Title style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: "small" }}><b>A:</b> {quest?.answer}</div> </Card.Title>
                    </Card.Body>
                  </Card>
                </div>
              )
            })}</Card.Text>
            <h6>Response From Attempt</h6>
            <Card.Text>{msg?.messageToAdmin.filter(response => response).reverse().map(response => {

              return (
                <div key={crypto.randomUUID()}>
                  {response?.status === "incorrect" ?
                    <Card style={{ width: '98%', margin: '1vw', padding: '1vh', border: "solid red" }}>
                      <Card.Body>
                        <Card.Title style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: "small" }}><b>Field:</b> {response?.field}</div> </Card.Title>
                        {response?.expected ?
                          <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: "small" }}><b>Expected:</b> {response?.expected}</div></div>
                          : ""}
                        {response?.provided ? <Card.Title style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: "small" }}><b>Provided:</b> {response?.provided}</div></Card.Title> : ""}
                        <Card.Title style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: "small" }}><b>Status:</b> {response?.status}</div> </Card.Title>
                      </Card.Body>
                    </Card>
                    :
                    <>{response?.field === "secretKey" ?
                      <Card style={{ width: '98%', margin: '1vw', padding: '1vh', border: "solid green" }}>
                        <Card.Body>
                          <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: "small" }}><b>Field:</b> {response?.field}</div> </div>
                          {response?.expected ?
                            <Card.Title style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: "small" }}><b>Expected:</b> {response?.expected}</div></Card.Title>
                            : ""}
                          <Card.Title style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: "small" }}><b>Status:</b> {response?.status}</div> </Card.Title>
                        </Card.Body>
                      </Card>
                      :
                      <Card style={{ width: '98%', margin: '1vw', padding: '1vh', border: "solid green" }}>
                        <Card.Body>
                          <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: "small" }}><b>Field:</b> {response?.field}</div> </div>
                          {response?.expected ?
                            <Card.Title style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: "small" }}><b>Expected:</b> {response?.expected}</div></Card.Title>
                            : ""}
                          <Card.Title style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: "small" }}><b>Provided:</b> {response?.provided}</div></Card.Title>
                          <Card.Title style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: "small" }}><b>Status:</b> {response?.status}</div> </Card.Title>
                        </Card.Body>
                      </Card>}</>
                  }
                </div>
              )
            })}</Card.Text>


          </Card.Body>

          {msg?.messageStatus === "send-email" && msg?.messageStatus !== "sent-Email" && msg?.messageStatus !== "received-Response" && msg?.messageStatus !== "completed-Password-Change" ?
            <button style={{ background: "goldenRod", padding: "0vw 1vw 0vw 1vw", margin: "1vw" }} className='rounded' onClick={updateStatus1}>I Have Msged User, Waiting Response...</button>
            : ""}

          {msg?.messageStatus !== "send-email" && msg?.messageStatus === "sent-Email" && msg?.messageStatus !== "received-Response" && msg?.messageStatus !== "completed-Password-Change" ?
            <><div style={{ display: "flex", justifyContent: "space-around" }}><div><b>Email Sent By:</b> {msg?.adminName}</div> <div><b>Day Sent: </b>{moment(msg?.emailDate).format("MMM Do YYYY")}</div></div>
              {msg?.adminName === user.accountName ? <button style={{ background: "lightBlue", padding: "0vw 1vw 0vw 1vw", margin: "1vw" }} className='rounded' onClick={updateStatus2}>I have received a Response...</button> : <div style={{ background: "tan", textAlign: "center" }}>{msg?.adminName} Is Waiting On A Response...</div>}</>
            : ""}

          {msg?.messageStatus !== "send-email" && msg?.messageStatus !== "sent-Email" && msg?.messageStatus === "received-Response" && msg?.messageStatus !== "completed-Password-Change" ?
            <>
              <div style={{ display: "flex", justifyContent: "space-around" }}><div><b>Email Received By:</b> {msg?.adminName}</div> <div><b>Day Received: </b>{moment(msg?.emailDate).format("MMM Do YYYY")}</div></div>
              {msg?.adminName === user.accountName ? <button style={{ background: "red", padding: "0vw 1vw 0vw 1vw", margin: "1vw", color: "white" }} className='rounded' onClick={() => updateStatus3(msg?._id)}>Delete --- Completed Password Change</button> : <div style={{ background: "tan", textAlign: "center" }}>{msg?.adminName} Has received a Response... Processing...</div>}
            </>
            : ""}

          {!user.creator && today.diff(auditDate, 'days') > 10 ? <h4 style={{ background: "red", marginTop: "1vh", width: "100%", textAlign: "center" }} className='lookAtMe'>It Has Been 10 Days Has Report Not Been Resolved???</h4> : ""}
          {!user.creator && today.diff(auditDate, 'days') > 10 ? <button style={{ background: "red", marginTop: "1vh", color: "white" }} onDoubleClick={() => deleteThisReport(msg?._id)}>If Resolved Double Click To Delete Report</button> : ""}


        </Card>

        <div style={{ width: "65vw", border: "solid black" }}></div>



      </div>
    </>

  )
}

export default ForgotPassword
