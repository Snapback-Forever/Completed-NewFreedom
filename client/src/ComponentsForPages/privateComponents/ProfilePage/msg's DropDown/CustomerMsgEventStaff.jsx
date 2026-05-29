import React from 'react'
import CustomerMsgToEventCard from './CustomerMsgEvent/CustomerMsgToEventCard';

const CustomerMsgEventStaff = ({ darkMode, setDarkMode, trigger, setTrigger, allQuest, allUsers }) => {
  return (
    <div>
      {
        allQuest?.filter((quest) => {
          const status = quest?.questionStatus && typeof quest.questionStatus === "string" ? quest.questionStatus.trim().toLowerCase() : ""; const notCompleted = status !== "completed" && status !== "received-msg"; const hasQuestionTypeInResponse =
            Array.isArray(quest.response) && quest.response.some((r) => r &&
              typeof r.questionType === "string" &&
              r.questionType.trim() === "Event-Staff"
            ); return notCompleted && hasQuestionTypeInResponse;
        }).length === 0 ?
          <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Guest Msg's To Event Staff</h2>
          :
          <> <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Msg's From Guest To Event Staff</h2> <h6 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Respond To These Msg's Till Completed Or Send Them Directly To The Correct NF Staff Member</h6>
            {allQuest?.filter((quest) => {
              const status = quest?.questionStatus && typeof quest.questionStatus === "string" ? quest.questionStatus.trim().toLowerCase() : ""; const notCompleted = status !== "completed" && status !== "received-msg"; const hasQuestionTypeInResponse =
                Array.isArray(quest.response) && quest.response.some((r) => r &&
                  typeof r.questionType === "string" &&
                  r.questionType.trim() === "Event-Staff"
                ); return notCompleted && hasQuestionTypeInResponse;
            }).map((quest) => (<CustomerMsgToEventCard key={quest._id} quest={quest} trigger={trigger} setTrigger={setTrigger} allUsers={allUsers} />))} </>
      }
    </div>
  )
}

export default CustomerMsgEventStaff
