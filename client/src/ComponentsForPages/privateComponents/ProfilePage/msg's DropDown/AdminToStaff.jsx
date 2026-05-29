import React from 'react'
import AdminStaffCard from './AdminToStaff/AdminStaffCard';

const AdminToStaff = ({ allPost, darkMode, setDarkMode, trigger, setTrigger  }) => {


    return (
      <div>
  
        {allPost?.filter(post => post?.areaOfPost === "ToAllStaff").length === 0 ?
          <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>Currently No Admin To All Staff Msg's</h2>
          :
          <>
            <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>Admin To All Staff Msg's</h2>
            
            {allPost?.filter(post => post?.areaOfPost === "ToAllStaff").map(post => {
              return (
                <AdminStaffCard post={post} trigger={trigger} setTrigger={setTrigger} />
              )
            })}
  
          </>}
  
      </div>
    )
  }

export default AdminToStaff
