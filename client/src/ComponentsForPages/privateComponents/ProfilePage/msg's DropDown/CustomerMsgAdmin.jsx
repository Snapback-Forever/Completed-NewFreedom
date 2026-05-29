import React from 'react'
import CustomerMsgToAdminCard from './customerMsgAdmin/CustomerMsgToAdminCard';

const CustomerMsgAdmin = ({ darkMode, setDarkMode, trigger, setTrigger, allQuest, allUsers }) => {

  

  return (

    <>
      {
        allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response.some((r) => r && typeof r.questionType === "string" && r.questionType.trim() === "Msg-To-Admin"); return notCompleted && hasQuestionTypeInResponse; }).length === 0 ?
          <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Guest Msg's To Admin</h2>
          : <>
            <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Msg's From Guest To All Admin</h2>
            <h6 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Respond To These Msg's Till Completed Or Send Them Directly To The Correct NF Staff Member</h6>

            {allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed" && quest.questionStatus.trim().toLowerCase() !== "received-msg"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response.some((r) => r && typeof r.questionType === "string" && r.questionType.trim() === "Msg-To-Admin"); return notCompleted && hasQuestionTypeInResponse; }).map((quest) => (<CustomerMsgToAdminCard key={quest._id} quest={quest} trigger={trigger} setTrigger={setTrigger} allUsers={allUsers} />))} </>}

    </>

  )
}


export default CustomerMsgAdmin
