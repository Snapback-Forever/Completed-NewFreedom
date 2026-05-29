import React from 'react'


import GroupMsgCard from './Group Msg/GroupMsgCard';
import { useSelector } from 'react-redux';

const GroupMsg = ({ allPost, darkMode, setDarkMode, trigger, setTrigger }) => {


  const user = useSelector(state => state.auth.user)

  return (
<div>
      {allPost?.filter(post => post?.areaOfPost === "ToAGroup" && (post?.recipients?.includes(user?.accountNameNormalized || user?.accountName?.toLowerCase().trim().replace(/\s+/g, "")) || user?.NFadmin || user?.creator)).length === 0 ? (
        <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>Currently No Group Msg's</h2>
      ) : (
        <>
          <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>Group Msg's </h2>
          {allPost?.filter(post => post?.areaOfPost === "ToAGroup" && (post?.recipients?.includes(user?.accountNameNormalized || user?.accountName?.toLowerCase().trim().replace(/\s+/g, "")) || user?.NFadmin || user?.creator)).map(post => (
            <GroupMsgCard key={post._id} post={post} trigger={trigger} setTrigger={setTrigger} />))}
        </>
      )}
    </div>
  )
}

export default GroupMsg
