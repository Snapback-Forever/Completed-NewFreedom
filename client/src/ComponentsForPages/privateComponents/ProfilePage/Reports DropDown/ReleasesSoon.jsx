import React from 'react'
import ReleaseCard from './ReleaseCard';

const ReleasesSoon = ({ darkMode, setDarkMode, trigger, setTrigger, allMentee }) => {

  const today = new Date()
  const oneWeekFromNow = new Date()
  oneWeekFromNow.setDate(today.getDate() + 3)

  const releaseSoonMentees = allMentee?.filter((mentee) => {
    if (!mentee.projectedReleaseDate) return false

    const releaseDate = new Date(mentee.projectedReleaseDate)

    return releaseDate >= today && releaseDate <= oneWeekFromNow
  }) || []
  
  

  return (
    <div >


      <h2 style={{ textAlign: "center", color: darkMode ? "white" : "black" }}>
        {releaseSoonMentees.length === 0
          ? 'No mentees to release soon'
          : "Mentee's Who Release Soon"}
      </h2>

      <div>


        {releaseSoonMentees.length > 0 && (
          <div className="release-soon-list">
            {releaseSoonMentees.map((mentee) => (
              <ReleaseCard mentee={mentee} key={mentee?._id} />
            ))}
          </div>
        )}

      </div>

    </div>
  )
}

export default ReleasesSoon
