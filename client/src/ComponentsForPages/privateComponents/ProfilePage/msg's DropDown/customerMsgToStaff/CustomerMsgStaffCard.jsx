import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import DOMPurify from 'dompurify'
import { useDispatch, useSelector } from 'react-redux'
import { deleteQuestion, updateQuestion, updateQuestionStatus } from '../../../../../redux/reducers/questionReducers'
import ModalFindUser from './ModalFindUser'
import { Link } from 'react-router-dom'

const CustomerMsgStaffCard = ({ quest, trigger, setTrigger, allUsers }) => {

  const dispatch = useDispatch()

  const textareaRef = useRef(null)
  const lastTapRef = useRef(0)

  const [response, setResponse] = useState(false)
  const [findUser, setFindUser] = useState(false)

  const socketConnection = useSelector((state) => state?.auth?.socketConnection)
  const user = useSelector((state) => state.auth.user)

  const [responseState, setResponseState] = useState({
    responseId: quest?._id,
    id: user?._id,
    responseToMsg: "",
    questionType: "",
  })

  const handleDescriptionKeyDown = (e, fieldName) => {
    if (e.key === "Tab") {
      e.preventDefault()

      const textarea = e.target
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      const newValue =
        responseState[fieldName].substring(0, start) +
        "    " +
        responseState[fieldName].substring(end)

      setResponseState((prev) => ({
        ...prev,
        [fieldName]: newValue,
      }))

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4
      })
    }
  }

  const openResponse = (questId) => {
    if (socketConnection) {
      socketConnection.emit("toggle-responding", {
        _id: questId,
        userId: user?._id,
        isOpening: true,
      })
    }
  }

  const closeResponse = (questId) => {
    if (socketConnection) {
      socketConnection.emit("toggle-responding", {
        _id: questId,
        userId: user?._id,
        isOpening: false,
      })
    }
  }

  useEffect(() => {
    if (!socketConnection) return

    const handleToggleResponseForThisCard = (questReturn) => {
      if (questReturn._id !== quest._id) return
      setTrigger(true)
    }

    socketConnection.on("toggleResponse", handleToggleResponseForThisCard)

    return () => {
      socketConnection.off("toggleResponse", handleToggleResponseForThisCard)
    }
  }, [socketConnection, quest._id])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setResponseState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const payload = {
      id: quest._id,
      responseId: responseState.responseId,
      userId: user?._id,
      responseToMsg: responseState.responseToMsg,
      questionType: responseState.questionType,
    }

    dispatch(updateQuestion(payload))

    setTrigger(true)
    setResponse(false)

    setResponseState((prev) => ({
      ...prev,
      responseToMsg: "",
      questionType: "",
    }))
  }

  const handleComplete = () => {
    const payload = {
      id: quest?._id,
      questionStatus: "completed",
      userId: user?._id,
    }

    dispatch(updateQuestionStatus(payload))
    setTrigger(true)
    setResponse(false)
  }

  const deleteMe = (id) => {
    const now = Date.now()
    const delay = 400

    if (now - lastTapRef.current < delay) {
      dispatch(deleteQuestion(id))
      setTrigger(true)
    }

    lastTapRef.current = now
  }

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

      <h2
        style={{ width: "100%", textAlign: "center", padding: "2vw", wordBreak: "break-all" }}
        className='responsiveGuestMsgDiv'
      >
        {quest?.title}
      </h2>

      <h6
        style={{ width: "100%", textAlign: "center", padding: "2vw", whiteSpace: "pre-wrap" }}
        className='responsiveGuestMsgDiv'
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(quest?.body) }}
      />

      {quest?.questionStatus === "received-msg" && (
        <button
          style={{ background: "goldenRod", width: "100%", height: "5vh", margin: "1vh 0" }}
          onClick={() => openResponse(quest._id)}
        >
          Respond To This Guest
        </button>
      )}

      {((quest?.createdAt && (new Date() - new Date(quest.createdAt)) / (1000 * 60 * 60 * 24) >= 30) || (user?.creator || user?.NFadmin)) && (
        <button
          style={{ background: "red", width: "20%", margin: "0.5vh 0.5vw" }}
          onClick={() => deleteMe(quest?._id)}
          className='responsiveButtonSpam'
        >
          I Am Spam? Delete Me
        </button>
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

                  <h3 style={{ width: "88vw", display: "flex", wordBreak: "break-word", justifyContent: "center", textAlign: "center" }}>
                    <a href={`mailto:${quest.email}`}>{quest.email}</a>
                  </h3>
                </>
              )}

              <button
                style={{ background: "red", width: "100%", height: "5vh", margin: "1vh 0", color: "white" }}
                onClick={() => closeResponse(quest._id)}
              >
                Cancel This Response
              </button>
            </>
          ) : (
            <h4 style={{ background: "lime", width: "100%", margin: "1vh 0", color: "black", padding: "0 1vw" }}>
              NF-Staff - Is Responding ...
            </h4>
          )}
        </>
      )}

      <>
        {quest?.questionStatus === "sent-response" && quest?.response?.length ? (
          String(quest.response.find((res) => String(res.userId) === String(user?._id))?.userId) === String(user?._id) ? (
            <>
              {!response ? (
                <button
                  style={{ background: "goldenRod", width: "100%", height: "5vh", margin: "1vh 0" }}
                  onClick={() => setResponse(true)}
                >
                  Respond To User
                </button>
              ) : (
                <button
                  style={{ background: "red", width: "100%", height: "5vh", margin: "1vh 0", color: "white" }}
                  onClick={() => setResponse(false)}
                >
                  Cancel Response
                </button>
              )}

              {response ? (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}
                >

                  <h4 style={{ color: "black", width: "80%" }}>
                    Another-Response To Guest
                  </h4>

                  <textarea
                    ref={textareaRef}
                    name="responseToMsg"
                    style={{ border: "solid lightGrey", background: "white", width: "100%", minHeight: "20vh", resize: "vertical", whiteSpace: "pre-wrap", overflowWrap: "break-word", tabSize: 4 }}
                    value={responseState.responseToMsg}
                    onChange={handleInputChange}
                    onKeyDown={(e) => handleDescriptionKeyDown(e, "responseToMsg")}
                    required
                  />

                  <div
                    style={{ background: "green", color: "white", width: "100%", height: "5vh", marginTop: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}
                    onClick={() => setFindUser(true)}
                  >
                    Send This Msg To Another User Directly
                  </div>

                  {findUser ? (
                    <dialog open={findUser}>
                      <ModalFindUser
                        allUsers={allUsers}
                        setFindUser={setFindUser}
                        quest={quest}
                        setTrigger={setTrigger}
                        setResponse={setResponse}
                      />
                    </dialog>
                  ) : <></>}

                  <button
                    type="submit"
                    style={{ background: "goldenRod", width: "100%", height: "5vh", marginTop: "0.5rem" }}
                  >
                    Save Response
                  </button>

                </form>
              ) : ""}

              {!response ? (
                <div
                  style={{ background: "green", color: "white", width: "100%", height: "5vh", marginTop: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}
                  onClick={() => handleComplete()}
                >
                  Complete This Msg
                </div>
              ) : ""}

            </>
          ) : (
            <div style={{ border: "solid green", color: "black", width: "100%", height: "5vh", marginTop: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
              A response was sent By:
              <span style={{ margin: "0 0.1vw" }}></span>

              {quest?.userId !== user?._id ? (
                <>
                  <Link to={`/messagePage/${quest?.response[0].userId}`} style={{ margin: "0 1vw" }}>
                    {quest?.response[0].accountName}
                  </Link>

                  <span style={{ fontSize: "small" }}>
                    Response Date: {moment(quest?.response[0].responseDate).format("MMM Do YYYY")}
                  </span>
                </>
              ) : "Your Response"}
            </div>
          )
        ) : null}
      </>

      {quest?.questionStatus === "completed" ? (
        <div style={{ border: "solid lime", color: "black", width: "100%", height: "5vh", marginTop: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
          ✅ Msg Was Completed By:

          {quest.response[0].userId !== user?._id ? (
            <>
              <Link to={`/messagePage/${quest?.response[0].userId}`} style={{ margin: "0 1vw" }}>
                {quest?.response[0].accountName}
              </Link>

              <span style={{ fontSize: "small" }}>
                {moment(quest?.response[0].responseDate).format("hh:mm MMM Do YY")}
              </span>
            </>
          ) : (
            <div style={{ margin: "0 0.5vw" }}>You</div>
          )}
        </div>
      ) : ""}

      <>
        {!response &&
          quest?.questionStatus === "responding" &&
          quest?.responding === user?._id && (

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}
            >

              <h4 style={{ color: "black", width: "80%" }}>
                Response You Sent To Guest
              </h4>

              <textarea
                ref={textareaRef}
                name="responseToMsg"
                style={{ border: "solid lightGrey", background: "white", width: "100%", minHeight: "20vh", resize: "vertical", whiteSpace: "pre-wrap", overflowWrap: "break-word", tabSize: 4 }}
                value={responseState.responseToMsg}
                onChange={handleInputChange}
                onKeyDown={(e) => handleDescriptionKeyDown(e, "responseToMsg")}
                required
              />

              <h4 style={{ color: "black", width: "80%" }}>
                What Type Of Msg Was This
              </h4>

              <h4 style={{ color: "black", width: "100%", textAlign: "center" }}>
                {responseState.questionType === "Q-A" ? "This Will Go To The Q-A Page That All Guest Will See So Be Sure This Is Where You Want To Send This Message!" : ""}
              </h4>

              <h4 style={{ color: "black", width: "100%", textAlign: "center" }}>
                {responseState.questionType === "Success-Story" ? "Please Be Sure To Direct This User To The Proper People That Can Help This Guest Get Their Success Story Uploaded." : ""}
              </h4>

              <h4 style={{ color: "black", width: "100%", textAlign: "center" }}>
                {responseState.questionType === "Msg-To-Admin" ? "This Will Direct This Msg To New Freedom Admin For Review." : ""}
              </h4>

              <h4 style={{ color: "black", width: "100%", textAlign: "center" }}>
                {responseState.questionType === "Msg-To-Mentor" ? "This Will Direct This Msg To New Freedom Mentors. If This User Has A Mentor Then Please Direct Them To Their Mentor Directly." : ""}
              </h4>

              <h4 style={{ color: "black", width: "100%", textAlign: "center" }}>
                {responseState.questionType === "Msg-To-Teacher" ? "This Will Direct This Msg To New Freedom Teachers. If This User Is Seeking A Specific Teacher Then Please Direct Them To Their Teacher Directly." : ""}
              </h4>

              <h4 style={{ color: "black", width: "100%", textAlign: "center" }}>
                {responseState.questionType === "Website-Support" ? "This Will Direct This Message To Website Support. Respond To User And Tell Them Their Msg Has Been Received And Their Request Has Been Forwarded To The Website-Support Team" : ""}
              </h4>

              <select
                name="questionType"
                value={responseState.questionType}
                onChange={handleInputChange}
                style={{ border: "solid lightGrey", background: "white", width: "100%" }}
                required
              >
                <option value="">Select A Type Of Msg</option>
                <option value="Q-A">Q-A</option>
                <option value="Success-Story">Success-Story</option>
                <option value="Msg-To-Admin">Msg-To-Admin</option>
                <option value="Msg-To-Mentor">Msg-To-Mentor</option>
                <option value="Msg-To-Teacher">Msg-To-Teacher</option>
                <option value="Website-Support">Website-Support</option>
                <option value="Subscription-Issues">News-Letter Issues</option>
                <option value="Event-Staff">Event-Staff Issue</option>
              </select>

              <h2 style={{ width: "100%", textAlign: "center" }}>
                OR
              </h2>

              <div
                style={{ background: "green", color: "white", width: "100%", height: "5vh", marginTop: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}
                onClick={() => setFindUser(true)}
              >
                Send This Msg To Another User Directly
              </div>

              {findUser ? (
                <dialog open={findUser}>
                  <ModalFindUser
                    allUsers={allUsers}
                    setFindUser={setFindUser}
                    quest={quest}
                    setTrigger={setTrigger}
                    setResponse={setResponse}
                  />
                </dialog>
              ) : <></>}

              <button
                type="submit"
                style={{ background: "goldenRod", width: "100%", height: "5vh", marginTop: "0.5rem" }}
              >
                Save Response
              </button>

            </form>
          )}
      </>
    </div>
  )
}

export default CustomerMsgStaffCard