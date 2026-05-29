import React from 'react'

import moment from 'moment'
import { Link } from 'react-router-dom'
import DOMPurify from 'dompurify';
import AdminMsgCard from './AdminToAdmin/AdminMsgCard';
import { useSelector } from 'react-redux';

const AdminToAdmin = ({ allPost, darkMode, setDarkMode, trigger, setTrigger }) => {

  const user = useSelector(state => state.auth.user)

  return (
    <div>

      {allPost?.filter(post => post?.areaOfPost === "AdminToAdmin" ).length === 0 ?
        <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>Currently No Admin To Admin Msg's</h2>
        :
        <>
          <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>Admin To Admin Msg's</h2>
          {allPost?.filter(post => post?.areaOfPost === "AdminToAdmin").map(post => {
            return (
              
              <AdminMsgCard post={post} trigger={trigger} setTrigger={setTrigger} /> 
             
            )
          })}

        </>}

    </div>
  )
}

export default AdminToAdmin
