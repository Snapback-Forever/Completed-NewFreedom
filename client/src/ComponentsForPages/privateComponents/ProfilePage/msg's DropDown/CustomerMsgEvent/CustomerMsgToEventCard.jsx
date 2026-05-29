import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { deleteQuestion, updateQuestion, updateQuestionStatus } from '../../../../../redux/reducers/questionReducers';
import ModalFindUser from './ModalFindUser';
import { Link } from 'react-router-dom';

const CustomerMsgToEventCard = ({ quest, trigger, setTrigger, allUsers }) => {

  const dispatch = useDispatch();

  const lastTapRef = useRef(0);

  const [response, setResponse] = useState(false);
  const [findUser, setFindUser] = useState(false);

  const socketConnection = useSelector((state) => state?.auth?.socketConnection);

  const user = useSelector((state) => state.auth.user);

  const [responseState, setResponseState] = useState({
    responseId: quest?._id,
    id: user?._id,
    responseToMsg: "",
    responseGuest: "",
    questionType: quest?.questionType,
  });

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

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const tabSpaces = "    ";

      const updatedValue =
        textarea.value.substring(0, start) +
        tabSpaces +
        textarea.value.substring(end);

      setResponseState((prev) => ({
        ...prev,
        [textarea.name]: updatedValue,
      }));

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + tabSpaces.length;
      });
    }
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
        <span style={{ fontSize: "small" }}>
          {moment(quest?.createdAt).format("hh:mm MMM Do YY")}
        </span>

        <div>
          New {
            Array.isArray(quest?.response) &&
            quest.response.length > 0 &&
            quest.response[quest.response.length - 1]?.questionType &&
            `${quest.response[quest.response.length - 1].questionType}`
          } Msg
        </div>
      </div>

      <h2 style={{ width: "100%", textAlign: "center", padding: "2vw" }}>
        {quest?.title}
      </h2>

      <h6
        style={{ width: "100%", textAlign: "center", padding: "2vw", whiteSpace: "pre-wrap" }}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(quest?.body) }}
      />

      <div>
        {quest?.response.filter(quest => quest).map(quest => {
          return (
            <div style={{ width: "100%", background: "lightGrey", margin: "1vh 0", padding: "1vh 1vw" }} key={quest?._id}>

              <div style={{ display: 'flex', justifyContent: "space-between" }}>
                <span style={{ fontSize: "small" }}>
                  {moment(quest?.createdAt).format("hh:mm MMM Do YY")}
                </span>

                <span style={{ fontSize: "small" }}>
                  {quest?.userId !== user?._id ?
                    <Link to={`/messagePage/${quest?.userId}`}>📨 {quest?.accountName}</Link>
                    : "Your Response"}
                </span>
              </div>

              <div style={{ width: "100%", margin: "1vh 0" }}>
                <h6>Response:</h6>

                <h6>{quest?.responseToMsg}</h6>

                {quest?.responseGuest ?
                  <>
                    <h6 style={{ width: "100%", textAlign: "center", background: "white" }}>
                      <b>Guest Re-Response:</b>
                    </h6>

                    <h6 style={{ width: "100%", textAlign: "center", background: "white" }}>
                      {quest?.responseGuest}
                    </h6>
                  </>
                  : ""}
              </div>

              {quest?.userId !== user?._id ?
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
          quest.response.slice(1).some((r) => String(r.userId) === String(quest.responding))
        ) && (
          <button
            style={{ background: "goldenRod", width: "100%", height: "5vh", margin: "1vh 0" }}
            onClick={() => openResponse(quest._id)}
          >
            Respond To This Guest
          </button>
        )}

      {(quest?.createdAt && (new Date() - new Date(quest.createdAt)) / (1000 * 60 * 60 * 24) >= 30) || (user?.creator || user?.NFadmin) && (
        <button style={{ background: "red", width: "20%", margin: "0.5vh 0.5vw" }} onClick={() => deleteMe(quest?._id)} className='responsiveButtonSpam'>
          I Am Spam? Delete Me
        </button>
      )}

      {!response && quest?.questionStatus === "responding" && quest?.responding === user?._id && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>

          <h4 style={{ color: "black", width: "80%" }}>
            Response You Sent To Guest
          </h4>

          <textarea
            name="responseToMsg"
            style={{ border: "solid lightGrey", background: "white", width: "100%" }}
            value={responseState.responseToMsg}
            onChange={handleInputChange}
            onKeyDown={handleDescriptionKeyDown}
            required
          />

          <h2 style={{ width: "100%", textAlign: "center" }}>
            OR
          </h2>

          <div
            style={{ background: "green", color: "white", width: "100%", height: "5vh", marginTop: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}
            onClick={() => setFindUser(true)}
          >
            Send This Msg To Another User Directly
          </div>

          {findUser ?
            <dialog open={findUser}>
              <ModalFindUser
                allUsers={allUsers}
                setFindUser={setFindUser}
                quest={quest}
                setTrigger={setTrigger}
                setResponse={setResponse}
              />
            </dialog>
            :
            <></>
          }

          <button type="submit" style={{ background: "goldenRod", width: "100%", height: "5vh", marginTop: "0.5rem" }}>
            Save Response
          </button>

        </form>
      )}

    </div>
  )
}

export default CustomerMsgToEventCard