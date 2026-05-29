import React from 'react'

const LogMessage = () => {
  return (
    <div style={{
        width: "95vw",
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        background: "rgba(250, 235, 215, 0.960)",
        padding: "1rem 1vw",
        margin: "1vh 1vw",
        textAlign: "center"
      }}>
    <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
      Audit Log Notice
    </h2>
  
    <p style={{ marginBottom: "1rem", lineHeight: "1.6", fontSize: "1.8em" }}>
      Audit logs are important administrative records that track activity within
      the website. They provide a history of actions taken in the system, such as
      account changes, permission updates, deletions, and other important events.
      These reports are used for security, accountability, troubleshooting, and
      recordkeeping.
    </p>
  
    <p style={{ marginBottom: "1rem", lineHeight: "1.6", fontSize: "1.8em" }}>
      Audit logs should not be deleted within the first <strong>30 days</strong>,
      and should generally not be kept longer than <strong>60 days maximum</strong>{" "}
      unless your organization requires otherwise. Before deleting any audit
      logs, it is strongly recommended that you make a copy, export the reports,
      or print them for your records.
    </p>
  
    <p style={{ marginBottom: "1rem", lineHeight: "1.6", fontSize: "1.8em" }}>
      If you are not familiar with website administration, think of audit logs as
      the website&apos;s activity history or paper trail. They help show what
      happened, when it happened, and sometimes who performed the action. If a
      question, issue, or review comes up later, these reports can help explain
      what took place.
    </p>
  
    <p style={{ marginBottom: "1rem", lineHeight: "1.6", fontSize: "1.8em" }}>
      These reports are intended to preserve important historical information and
      should be handled carefully to maintain accurate records for future use.
    </p>

    <p style={{ marginBottom: "1rem", lineHeight: "1.6", fontSize: "1.8em" }} className='lookAtMe'>
        To View An Audit Log Select A button above
        </p>

  </div>
  
  )
}

export default LogMessage
