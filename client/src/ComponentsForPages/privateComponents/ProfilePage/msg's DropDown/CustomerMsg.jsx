
import React from 'react'

import CustomerMsgStaffCard from './customerMsgToStaff/CustomerMsgStaffCard';

const CustomerMsg = ({ darkMode, setDarkMode, trigger, setTrigger, allQuest, allUsers }) => {


  return (

    <>
      {
        allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response.some((r) => r && r.questionType); return notCompleted && !hasQuestionTypeInResponse; }).length === 0 ? <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Guest Msg's</h2>
          :
          <>
            <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Msg's From Guest To All Staff</h2>
            <h6 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Direct These Msg's To The Proper Locations or NF Staff Directly</h6>

            {
              allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response.some((r) => r && r.questionType); return notCompleted && !hasQuestionTypeInResponse; }).map((quest) => (
                <CustomerMsgStaffCard
                  key={quest._id}
                  quest={quest}
                  trigger={trigger}
                  setTrigger={setTrigger}
                  allUsers={allUsers}
                />
              ))
            }
          </>}

    </>

  )
}

export default CustomerMsg
