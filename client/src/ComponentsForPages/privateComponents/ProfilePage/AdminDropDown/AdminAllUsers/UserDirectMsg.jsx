import React, { useState } from 'react'
import moment from 'moment'
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';

const UserDirectMsg = ({ user, admin, msg }) => {

  const [showRes, setShowRes] = useState(false)
  const [showAllRes, setShowAllRes] = useState(false);
  const responses = msg?.response?.filter(r => r) ?? [];
  const responsesToShow = showAllRes ? responses : responses.slice(0, 5)


  return (
    <div>

      <>
        <div style={{ width: "100%", background: "white", margin: "1vh 0", display: "flex", flexDirection: "column", border: admin?._id !== msg?.userId ? "solid black" : "solid antiqueWhite", padding: "1vw" }}>
          <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
            <span style={{ fontSize: "small" }}>{moment(msg?.createdAt).format("hh:mm MMM Do YY")}</span>
            <h6>{
              msg?.questionStatus === "completed" ? <b>✅ Completed</b> : <div>{msg?.questionStatus}</div>}</h6>
          </div>

          <div style={{ width: "100%", display: "flex", justifyContent: 'space-around' }} className='responsiveUserDirectMsg'>
            <h6><b>FirstName:</b> {msg?.firstName}</h6>
            <h6><b>LastName:</b> {msg?.lastName}</h6>
          </div>

          <div style={{ width: "100%", display: "flex", justifyContent: 'space-around' }} className='responsiveUserDirectMsg'>
            <h6><b>Phone Number:</b> {msg?.phoneNumber}</h6>
            <h6><b>Email:</b> {msg?.email}</h6>
          </div>

          <h2 style={{ width: "100%", textAlign: "center", padding: "2vw", wordBreak: "break-all" }}>{msg?.title}</h2>
          <h6 style={{ width: "100%", textAlign: "center", padding: "2vw", wordBreak: 'break-all', }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg?.body) }} />

          {msg?.response.length !== 0 ? <>
            {showRes ? <button onClick={() => setShowRes(false)} style={{ background: "red" }}>Hide Show Response{msg?.response.length > 1 ? "'s" : ""}</button> : <button onClick={() => setShowRes(true)} style={{ background: "goldenRod" }}>Show Response{msg?.response?.length > 1 ? "'s" : ""}</button>}</> : ""}

          {showRes ? (
            <>
              {responsesToShow?.map(res => (
                <div key={res._id}>
                  <div
                    style={{
                      width: "100%",
                      background: "white",
                      margin: "1vh 0",
                      display: "flex",
                      flexDirection: "column",
                      border: "double black",
                      padding: "1vw",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <span style={{ fontSize: "small" }}>
                        {moment(res?.responseDate).format("hh:mm MMM Do YY")}
                      </span>
                      <div>{res?.questionType}</div>
                    </div>
                    <h5 style={{ textAlign: "center" }}>
                      <b>User Whom Responded: </b>
                      {res?.accountName !== admin?.accountName ? (
                        <Link to={`/messagePage/${res?.userId}`}>
                          {res?.accountName}
                        </Link>
                      ) : (
                        "Your Response"
                      )}
                    </h5>
                    {res?.responseGuest ? (
                      <>
                        <h6
                          style={{
                            width: "100%",
                            textAlign: "center",
                            padding: "2vw",
                          }}
                        >
                          <b>Re Response From Guest:</b> {res?.guestResponse}
                        </h6>
                        <div style={{ border: "1px solid black" }}></div>
                      </>
                    ) : (
                      ""
                    )}
                    <h6 style={{ width: "100%", textAlign: "center", padding: "2vw", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(res?.responseToMsg) }} />
                  </div>
                  <div
                    style={{ border: "1px solid black", margin: "1vh 1vw" }}
                  ></div>
                </div>
              ))}
              {/* Toggle buttons only if there are more than 5 responses */}
              {responses?.length > 5 && !showAllRes && (
                <button
                  type="button"
                  style={{ marginTop: "1vh", background: "green", width: "100%", color: "white" }}
                  onClick={() => setShowAllRes(true)}
                >
                  Show more responses
                </button>
              )}
              {responses?.length > 5 && showAllRes && (
                <button
                  type="button"
                  style={{ marginTop: "1vh", background: "red", width: "100%", }}
                  onClick={() => setShowAllRes(false)}
                >
                  Show fewer responses
                </button>
              )}
            </>
          ) : (
            ""
          )}


        </div>
        <div style={{ border: "1px solid black", margin: "1vh 1vw" }}></div>
      </>


    </div>
  )
}

export default UserDirectMsg
