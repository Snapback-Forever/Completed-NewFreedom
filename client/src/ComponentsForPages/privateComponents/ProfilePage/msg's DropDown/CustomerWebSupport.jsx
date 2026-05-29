import React from 'react'
import CustomerWebSupportCard from './CusomerWebSupport/CustomerWebSupportCard';

const CustomerWebSupport = ({ darkMode, setDarkMode, trigger, setTrigger, allQuest, allUsers }) => {
  return (
    <div>
      {
        allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasWebsiteSupportResponse = Array.isArray(quest.response) && quest.response.some((r) => r && typeof r.questionType === "string" && r.questionType.trim() === "Website-Support"); return notCompleted && hasWebsiteSupportResponse; }).length === 0 ?
          <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Guest Msg's To Web Support</h2> :
          <> <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Msg's From Guest To Web Support</h2>

            <h6 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Respond To These Msg's Till Completed Or Send Them Directly To The Correct NF Staff Member</h6>

            {allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed" && quest.questionStatus.trim().toLowerCase() !== "received-msg"; const hasWebsiteSupportResponse = Array.isArray(quest.response) && quest.response.some((r) => r && typeof r.questionType === "string" && r.questionType.trim() === "Website-Support"); return notCompleted && hasWebsiteSupportResponse; }).map((quest) => (
              <CustomerWebSupportCard key={quest._id} quest={quest} trigger={trigger} setTrigger={setTrigger} allUsers={allUsers} />))}
          </>

      }

    </div>
  )
}

export default CustomerWebSupport
