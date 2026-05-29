import React from 'react'

import moment from 'moment'
import { Link } from 'react-router-dom'
import DOMPurify from 'dompurify';
import AdminTeachersCard from './AdminToTeachers/AdminTeachersCard';
import { useSelector } from 'react-redux';

const TeacherMsg = ({ allPost, darkMode, setDarkMode, trigger, setTrigger }) => {

  const user = useSelector(state => state.auth.user)


  return (
    <div>

      {allPost?.filter(post => post?.areaOfPost === "ToAllTeachers" && (user?.teacher || user?.NFadmin || user?.creator)).length === 0 ?
        <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>Currently No Teacher Msg's</h2> : ""}

      <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>Teacher Msg's</h2>
      {allPost?.filter(post => post?.areaOfPost === "ToAllTeachers" && (user?.teacher || user?.NFadmin || user?.creator)).map(post => {
        return (
          <AdminTeachersCard post={post} trigger={trigger} setTrigger={setTrigger} />
        )
      })}

    </div>
  )
}

export default TeacherMsg
