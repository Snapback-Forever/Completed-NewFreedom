import React from 'react'
import AllLocationCard from './AllLocationCard'
import { useSelector } from 'react-redux'


const AllLocation = ({ darkMode, setDarkMode, allLocations, trigger, setTrigger, setChangeContent, allMentee, allUsers, allPrograms, allEvents }) => {


  const admin = useSelector(state => state.auth.user)

  return (
    <div style={{ width: "100vw" }}>
      
    { admin?.creator || admin?.NFadmin ? <button onClick={()=> setChangeContent("createLoc") } style={{ width: "100%", background: "goldenRod", margin: "1vh 0" }}>Create A Location</button> : ""}

      {allLocations?.filter(loc => loc).length === 0 ? <h2 style={{ textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Locations To View</h2> : <>
      <h2 style={{ textAlign: "center", color: darkMode ? "white" : "black" }}>All Locations</h2>
        {allLocations?.filter(loc => loc).map(loc => {

          return (

            <AllLocationCard loc={loc} setTrigger={setTrigger} allMentee={allMentee} allUsers={allUsers} allPrograms={allPrograms} allEvents={allEvents} />

          )
        })}
      </>}

    </div>
  )
}

export default AllLocation
