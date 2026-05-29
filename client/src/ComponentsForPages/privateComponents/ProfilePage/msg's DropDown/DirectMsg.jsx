import React from 'react'
import DirectMsgCard from './DirectMsgFromGuest/DirectMsgCard';
import { useSelector } from 'react-redux';
 
const DirectMsg = ({ darkMode, setDarkMode, trigger, setTrigger, allDirectMsg, allUsers }) => {

const user = useSelector(state => state.auth.user)

  return (
    <div>


      { allDirectMsg?.filter(msg => msg.userId.includes(user?._id) && msg?.questionStatus !== "completed").length === 0 ? <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Direct Msg's</h2> : <>
      <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>Direct Msg's From Guests</h2>
     { allDirectMsg?.filter(msg => msg.userId.includes(user?._id) && msg?.questionStatus !== "completed").reverse().map(msg => { 
      return(
        <div key={msg?._id}>
       <DirectMsgCard msg={msg} trigger={trigger} setTrigger={setTrigger} allDirectMsg={allDirectMsg} allUsers={allUsers} />
       </div>
      )
     })}</>}
    </div>
  )
}

export default DirectMsg
