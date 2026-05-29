import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import moment from "moment";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { useDispatch, useSelector } from "react-redux";
import { getSingleReceivedMsg, updateReceivedMsg } from "../../../../../redux/reducers/menteeReducers";

const MentorMsg = ({ msg, user, admin, setTrigger, setAddInformation, mentee }) => {

  const dispatch = useDispatch();

  const [update, setUpdate] = useState(false);

  const singleReceivedMsg = useSelector(state => state.mentee.singleReceivedMsg);
  const [form, setForm] = useState({
    msgBody: msg?.msgBody || "",
    msgResponse: msg?.msgResponse || "",
  });

  const updateMsg = recId => {
    setUpdate(true);
    const payload = { mailId: mentee?._id, msgId: recId };
    dispatch(getSingleReceivedMsg(payload));
  };

  useEffect(() => {
    if (singleReceivedMsg) {
      setForm({
        msgBody: singleReceivedMsg.msgBody || "",
        msgResponse: singleReceivedMsg.msgResponse || "",
      });
    }
  }, [singleReceivedMsg]);

  const handleInput = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const payload = {
      mailId: mentee?._id,
      msgId: msg?._id,   
      msgBody: form.msgBody,
      msgResponse: form.msgResponse,
    };

    dispatch(updateReceivedMsg(payload))
   setTrigger(true)
   setUpdate(false)
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
    width: '100%',
};


  return (
    <>
      <Card style={{ width: "100%", margin: "1vh 0", padding: "1vh 1vw" }}>
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} className='responsiveAllMenteeContainer'>
          <span style={{ fontSize: "small" }}>{moment(msg?.createdAt).format("hh:mm MMM Do YY")}</span>
          <span><b>Msg Type:</b> {msg?.channel}</span>
        </div>
        <div>
          {msg?.msgBody ? (
            <div>
              <b>Mentor Msg:</b>
              <div
                style={{ width: "100%", textAlign: "center", padding: "2vw", }}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg?.msgBody) }}
              />
            </div>
          ) : ""}
          {msg?.msgResponse ? (
            <>
              <div style={{ border: "1px solid black", width: "100%" }}></div>
              <div>
                <b>Mentee Response:</b>
                <div style={{ width: "100%", textAlign: "center", padding: "2vw", wordBreak: "break-all" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg?.msgResponse) }} />
              </div>
            </>
          ) : ""}
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <span>
            {admin?._id !== msg?.createdBy ? (
              <Link to={`/messagePage/${msg?.createdBy}`}>📨 Mentor</Link>
            ) : (
              "Your Msg"
            )}
          </span>
          <span>
            {admin?._id === msg?.createdBy || admin?.creator || admin?.NFadmin ? (
             <>{!update ? <button style={{ background: "lightBlue", padding: "0 2vw" }} onClick={() => updateMsg(msg?._id)}>Update Msg</button> : <button style={{ background: "red", padding: "0 2vw" }} onClick={() => setUpdate(false)}>Cancel Update</button>}</>
            ) : (
              ""
            )}
          </span>
        </div>
      </Card>

      {update && (
        <form onSubmit={handleSubmit} style={{ width: "100%", margin: "1vh 1vw", padding: "1vh 1vw", border: "1px solid black" }} >
          
            <label style={labelStyle}>Mentor Msg</label>
              <textarea
                name="msgBody"
                value={form?.msgBody}
                onChange={handleInput}
                rows={3}
                style={inputStyle}
                placeholder="Add A Msg"
              />
        
            <label  style={labelStyle}>Mentee Response</label>
              <textarea
                name="msgResponse"
                value={form?.msgResponse}
                onChange={handleInput}
                rows={3}
                style={inputStyle}
                placeholder="Add A Response"
              />
            
          <button type="submit"  style={{ background: "green", padding: "0 2vw", marginRight: "1vw" }}>Update Msg</button>

        </form>
      )}

      <div style={{ border: "solid black", width: "100%" }}></div>
    </>
  );
};

export default MentorMsg;