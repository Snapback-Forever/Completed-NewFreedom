import React, { useEffect, useState } from 'react'
import { useRef } from "react";
import moment from 'moment'
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { deleteQuestion, toggleRespondingStatus, updateQuestion, updateQuestionStatus } from '../../../../../redux/reducers/questionReducers';
import ModalFindUser from './ModalFindUser';
import { Link } from 'react-router-dom';

const CustomerMsgSuccessNewsCard = ({ quest, trigger, setTrigger, allUsers }) => {

  const dispatch = useDispatch();

  const lastTapRef = useRef(0);

  const [response, setResponse] = useState(false);
  const [findUser, setFindUser] = useState(false);
  const [questIdReturn, setQuestIdReturn] = useState("");

  const socketConnection = useSelector((state) => state?.auth?.socketConnection);

  const user = useSelector((state) => state.auth.user);

  const [responseState, setResponseState] = useState({
    responseId: quest?._id,
    id: user?._id,
    responseToMsg: "",
    responseGuest: "",
    questionType: quest?.questionType,
  });

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      const newValue =
        responseState[e.target.name].substring(0, start) +
        "    " +
        responseState[e.target.name].substring(end);

      setResponseState((prev) => ({
        ...prev,
        [e.target.name]: newValue,
      }));

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const openResponse = (questId) => {
      if (socketConnection) {
          socketConnection.emit("toggle-responding-sent", {
              _id: questId,
              userId: user?._id,
              isOpening: true,
          });
      }
  };

  const closeResponse = (questId) => {
      if (socketConnection) {
          socketConnection.emit("toggle-responding-sent", {
              _id: questId,
              userId: user?._id,
              isOpening: false,
          });
      }
  };

  useEffect(() => {
      if (!socketConnection) return;
      const handleToggleResponseForThisCard = (questReturn) => {
          if (questReturn._id !== quest._id) return;
          setTrigger(true);
      };
      socketConnection.on("toggleResponse", handleToggleResponseForThisCard);
      return () => {
          socketConnection.off("toggleResponse", handleToggleResponseForThisCard);
      };
  }, [socketConnection, quest._id]);

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
        id: quest._id,
        responseId: responseState.responseId,
        userId: user?._id,
        responseToMsg: responseState.responseToMsg,
        responseGuest: responseState.responseGuest,
        questionType: responseState.questionType,
    };
    dispatch(updateQuestion(payload));
    setTrigger(true);
    setResponse(false);

    setResponseState((preve) => {
      return {
          ...preve,
          responseId: quest?._id,
          id: user?._id,
          responseToMsg: "",
          responseGuest: "",
          questionType: quest?.questionType,
      }
  })
};

  const handleComplete = () => {
      const payload = {
          id: quest?._id,
          questionStatus: "completed",
          userId: user?._id,
      };
      dispatch(updateQuestionStatus(payload));
      setTrigger(true);
      setResponse(false);
  };

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
      <div style={{ width: "90vw", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 0", display: "flex", flexDirection: "column", border: "solid antiqueWhite", padding: "1vw" }} className='responsiveGuestMsg'>
    <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
      <span style={{ fontSize: "small" }}>{moment(quest?.createdAt).format("hh:mm MMM Do YY")}</span>
      <div>
        New {
          Array.isArray(quest?.response) &&
          quest.response.length > 0 &&
          quest.response[quest.response.length - 1]?.questionType &&
          `${quest.response[quest.response.length - 1].questionType}`
        } Msg
      </div>
    </div>

    <h2 style={{ width: "100%", textAlign: "center", padding: "2vw" }}>{quest?.title}</h2>
    <h6 style={{ width: "100%", textAlign: "center", padding: "2vw", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(quest?.body) }} />

    <div>
      {quest?.response.filter(quest => quest).map(quest => {
        return (
          <div style={{ width: "100%", background: "lightGrey", margin: "1vh 0", padding: "1vh 1vw" }} key={quest?._id}>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
              <span style={{ fontSize: "small" }}>{moment(quest?.createdAt).format("hh:mm MMM Do YY")}</span>
              <span style={{ fontSize: "small" }}> { quest?.userId !== user?._id ? 
            <Link to={`/messagePage/${quest?.userId}`}>📨 {quest?.accountName}</Link> 
            : "Your Response"}</span>
            </div>

            <div style={{ width: "100%", margin: "1vh 0" }} >
              <h6>Response:</h6>

              <h6 style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{quest?.responseToMsg}</h6>

              {quest?.responseGuest ? 
              <>
              <h6 style={{ width: "100%", textAlign: "center", background: "white" }}><b>Guest Re-Response:</b></h6>

              <h6 style={{ width: "100%", textAlign: "center", background: "white", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{quest?.responseGuest}</h6>

              </> : ""}
            </div>

            { quest?.userId !== user?._id ? 
            <Link to={`/messagePage/${quest?.userId}`}>📨 {quest?.accountName}</Link> 
            : ""}
          </div>
        )
      })}
    </div>

    {quest?.questionStatus === "sent-response" &&
      (!quest?.responding || quest?.responding !== user?._id) &&
      !(
        Array.isArray(quest?.response) &&
        quest.response.length > 1 &&
        quest.response
          .slice(1)
          .some((r) => String(r.userId) === String(quest.responding))
      ) && (
        <button
          style={{
            background: "goldenRod",
            width: "100%",
            height: "5vh",
            margin: "1vh 0",
          }}
          onClick={() => openResponse(quest._id)}
        >
          Respond To This Guest
        </button>
      )}

{(quest?.createdAt && (new Date() - new Date(quest.createdAt)) / (1000 * 60 * 60 * 24) >= 30) || (user?.creator || user?.NFadmin) && (
        <button style={{ background: "red", width: "20%", margin: "0.5vh 0.5vw" }} onClick={() => deleteMe(quest?._id)} className='responsiveButtonSpam'>I Am Spam? Delete Me</button>
      )}

    {quest?.questionStatus === "responding" && (
      <>
        {quest?.responding === user?._id ? (
          <>
            {quest?.email && (
              <>
                <h4 style={{ width: "100%", textAlign: "center" }}>
                  Guest Email:
                </h4>
                <h3
                  style={{
                    width: "88vw",
                    display: "flex",
                    wordBreak: "break-word",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <a href={`mailto:${quest.email}`}>{quest.email}</a>
                </h3>
              </>
            )}
            <button
              style={{
                background: "red",
                width: "100%",
                height: "5vh",
                margin: "1vh 0",
                color: "white",
              }}
              onClick={() => closeResponse(quest._id)}
            >
              Cancel This Response
            </button>
          </>
        ) : (
          <h4
            style={{
              background: "lime",
              width: "100%",
              margin: "1vh 0",
              color: "black",
              padding: "0 1vw",
            }}
          >
            NF Staff - {quest.response[0].accountName} - Is Responding...
          </h4>
        )}
      </>
    )}

    <>
      {quest?.questionStatus === "sent-response" &&
        Array.isArray(quest?.response) &&
        quest.response.length > 1 &&
        quest.response
          .slice(1)
          .some((r) => String(r.userId) === String(quest.responding)) && (
          quest?.responding === user?._id ? (
            <>
              {!response ? (
                <button
                  style={{
                    background: "goldenRod",
                    width: "100%",
                    height: "5vh",
                    margin: "1vh 0",
                  }}
                  onClick={() => setResponse(true)}
                >
                  Respond To User
                </button>
              ) : (
                <button
                  style={{
                    background: "red",
                    width: "100%",
                    height: "5vh",
                    margin: "1vh 0",
                    color: "white",
                  }}
                  onClick={() => setResponse(false)}
                >
                  Cancel This Response
                </button>
              )}

              {response && (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  <h4 style={{ color: "black", width: "80%" }}>
                    New Response From Guest
                  </h4>

                  <textarea
                    name="responseGuest"
                    style={{ border: "solid lightGrey", background: "white", width: "100%" }}
                    value={responseState.responseGuest}
                    onChange={handleInputChange}
                    onKeyDown={handleDescriptionKeyDown}
                    required
                  />

                  <h4 style={{ color: "black", width: "80%" }}>
                    Another-Response To Guest
                  </h4>

                  <textarea
                    name="responseToMsg"
                    style={{ border: "solid lightGrey", background: "white", width: "100%" }}
                    value={responseState.responseToMsg}
                    onChange={handleInputChange}
                    onKeyDown={handleDescriptionKeyDown}
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
                      <ModalFindUser allUsers={allUsers} setFindUser={setFindUser} quest={quest} setTrigger={setTrigger} setResponse={setResponse} />
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
              )}

              {!response && (
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
                  onClick={() => handleComplete()}
                >
                  Complete This Msg
                </div>
              )}

              <div></div>
            </>
          ) : (
            <div
            style={{ border: "solid green", color: "black", width: "100%", height: "5vh", marginTop: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center" }} >
            A response was sent By:<span style={{ margin: "0 0.1vw" }}></span> {quest?.userId !== user?._id ? <>
              <Link to={`/messagePage/${quest?.response[0].userId}`} style={{ margin: "0 1vw" }}> {quest?.response[0].accountName}</Link>
              <span style={{ fontSize: "small" }}>Response Date: {moment(quest?.response[0].responseDate).format("MMM Do YYYY")}</span>
            </> : "Your Response"}
          </div>
          )
        )}
    </>

    {quest?.questionStatus === "completed" ? <div style={{ border: "solid lime", color: "black", width: "100%", height: "5vh", marginTop: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}>✅ Msg Was Completed By:
    {quest.response[0].userId !== user?._id ? <>
      <Link to={`/messagePage/${quest?.response[0].userId}`} style={{ margin: "0 1vw" }}> {quest?.response[0].accountName}</Link> 
      <span style={{ fontSize: "small" }}>{moment(quest?.response[0].responseDate).format("hh:mm MMM Do YY")}</span>
      </>
      : <div style={{ margin: "0 0.5vw" }}>You</div>}
    </div> : ""}

    <>
      {!response && quest?.questionStatus === "responding" &&
        quest?.responding === user?._id && (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginTop: "1rem",
            }}
          >
            <h4 style={{ color: "black", width: "80%" }}>Response You Sent To Guest</h4>

            <textarea
              name="responseToMsg"
              style={{ border: "solid lightGrey", background: "white", width: "100%" }}
              value={responseState.responseToMsg}
              onChange={handleInputChange}
              onKeyDown={handleDescriptionKeyDown}
              required
            />

            <h2 style={{ width: "100%", textAlign: "center" }}>OR</h2>

            <div style={{ background: "green", color: "white", width: "100%", height: "5vh", marginTop: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => setFindUser(true)}>Send This Msg To Another User Directly</div>

            {findUser ?
              <dialog open={findUser}>
                <ModalFindUser allUsers={allUsers} setFindUser={setFindUser} quest={quest} setTrigger={setTrigger} setResponse={setResponse} />
              </dialog>
              :
              <></>
            }

            <button type="submit" style={{ background: "goldenRod", width: "100%", height: "5vh", marginTop: "0.5rem", }} > Save Response </button>

          </form>
        )}
    </>
  </div>
  )
}

export default CustomerMsgSuccessNewsCard