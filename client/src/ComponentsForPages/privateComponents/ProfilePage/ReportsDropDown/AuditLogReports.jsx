import React, { useState } from 'react'
import LogCard from './LogCard'
import LogMessage from './LogMessage'

const AuditLogReports = ({ darkMode, setDarkMode, trigger, setTrigger, allLogs }) => {
  const [changeLocation, setChangeLocation] = useState("")

  const filterActions = {
    user: [
      "Removed from website",
      "User-Registered - Account Name",
      "Updated Profile",
    ],
    security: [
      "UPDATE_SECURITY_ACCESS_LEVELS",
      "GRANTED_NFADMIN",
      "REVOKED_NFADMIN",
      "UPDATE_SECURITY_ACCESS_LEVELS_CREATOR",
    ],
    allowed: [
      "Added Allowed Email",
      "Removed Allowed Email",
    ],
    notAllowed: [
      "Added Not Allowed Email",
      "Removed Not Allowed Email",
    ],
    mentee: [
      "REMOVE_USER_FROM_PROGRAM",
      "REDUCE_MAIL_USER",
      "DELETE_MAIL_USER",
    ],
    program: [
      "REMOVE_STUDENT_FROM_PROGRAM",
      "REMOVE_GRADUATE",
      "DELETE_PROGRAM",
    ],
    direct: [
      "Direct-msg-completed",
    ],
    question: [
      "QA_RESPONSE_ADDED",
      "QA_RESPONSE_UPDATED",
      "QUESTION_COMPLETED",
    ],
  }

  const labelMap = {
    user: "User",
    security: "Security Access",
    allowed: "Allowed",
    notAllowed: "Not Allowed",
    mentee: "Mentee",
    program: "Program",
    direct: "Direct Msg",
    question: "Question Msg",
  }

  const filteredLogs = changeLocation
    ? allLogs
        ?.filter(log =>
          log?.action &&
          filterActions[changeLocation]?.some(action =>
            log.action.startsWith(action)
          )
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : []

  const selectedLabel = changeLocation ? labelMap[changeLocation] : ""

  const buttonStyle = (key) => ({
    background: changeLocation === key ? "gray" : "goldenRod",
    color: changeLocation === key ? "white" : "black",
    padding: "0 2vw",
    margin: "0.5vh .5vw",
    textAlign: "center"
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

      <div style={{ background: "white", width: "100vw", display: "flex" }} className='responsiveSelect'> 

        <div style={buttonStyle("user")} className='rounded' onClick={() => setChangeLocation("user")}>
          {changeLocation === "user" ? `ON ${labelMap.user}` : "User"}
        </div>

        <div style={buttonStyle("security")} className='rounded' onClick={() => setChangeLocation("security")}>
          {changeLocation === "security" ? `ON ${labelMap.security}` : "Security Access"}
        </div>

        <div style={buttonStyle("allowed")} className='rounded' onClick={() => setChangeLocation("allowed")}>
          {changeLocation === "allowed" ? `ON ${labelMap.allowed}` : "Allowed"}
        </div>

        <div style={buttonStyle("notAllowed")} className='rounded' onClick={() => setChangeLocation("notAllowed")}>
          {changeLocation === "notAllowed" ? `ON ${labelMap.notAllowed}` : "Not Allowed"}
        </div>

        <div style={buttonStyle("mentee")} className='rounded' onClick={() => setChangeLocation("mentee")}>
          {changeLocation === "mentee" ? `ON ${labelMap.mentee}` : "Mentee"}
        </div>

        <div style={buttonStyle("program")} className='rounded' onClick={() => setChangeLocation("program")}>
          {changeLocation === "program" ? `ON ${labelMap.program}` : "Program"}
        </div>

        <div style={buttonStyle("direct")} className='rounded' onClick={() => setChangeLocation("direct")}>
          {changeLocation === "direct" ? `ON ${labelMap.direct}` : "Direct Msg"}
        </div>

        <div style={buttonStyle("question")} className='rounded' onClick={() => setChangeLocation("question")}>
          {changeLocation === "question" ? `ON ${labelMap.question}` : "Question Msg"}
        </div>
      </div>

      {changeLocation ? (
        <div style={{ padding: "1rem" }}>
          {filteredLogs.length > 0 ? (
            <>
              <h2 style={{ textAlign: "center", background: "white" }}>
                All {selectedLabel}
              </h2>

              {filteredLogs.map(log => (
                <LogCard
                  key={log._id}
                  log={log}
                  setTrigger={setTrigger}
                />
              ))}
            </>
          ) : (
            <h2 style={{ textAlign: "center", background: "white" }}>
              No audit logs for {selectedLabel}
            </h2>
          )}
        </div>
      ) : (
        <div style={{ minHeight: "200px" }}>
          <LogMessage />
        </div>
      )}
    </div>
  )
}

export default AuditLogReports
