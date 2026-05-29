import React from 'react'

import moment from 'moment'
import { Link } from 'react-router-dom'
import DOMPurify from 'dompurify';
import AdminMentors from './AdminToMentors/AdminMentors';
import { useSelector } from 'react-redux';

const MentorMsg = ({ allPost, darkMode, setDarkMode, trigger, setTrigger  }) => {

  const user = useSelector(state => state.auth.user)

    return (
      <div>
  
        {allPost?.filter(post => post?.areaOfPost === "ToAllMentors" && (user?.mentor || user?.NFadmin || user?.creator)).length === 0 ?
          <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>Currently No Mentor Msg's</h2>
          :
          <>
            <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>Mentor Msg's</h2>
            {allPost?.filter(post => post?.areaOfPost === "ToAllMentors" && (user?.mentor || user?.NFadmin || user?.creator)).map(post => {
              return (
                <AdminMentors post={post} trigger={trigger} setTrigger={setTrigger} />
              )
            })}
  
          </>}
  
      </div>
    )
  }

export default MentorMsg
