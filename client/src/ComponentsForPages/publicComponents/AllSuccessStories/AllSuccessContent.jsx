import React, { useState } from 'react'
import SuccessCard from './SuccessCard';

const AllSuccessContent = ({ darkMode, allStories, data, setData }) => {


  

    return (

        <div style={{ height: "84.1vh", overflow: "scroll", display: "flex", flexDirection: "column", alignItems: "center" }} className={darkMode ? "scrollBar QADark" : "scrollBar QAWhite"} >
            {allStories?.filter(story => story?.consentToPublish).length === 0 ? <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Success Stories To Show</h1> : <>
                <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Success Stories</h1>
                {allStories?.filter(story => story?.consentToPublish).map(story => {
                    
                    return (
                  <SuccessCard story={story} key={story?._id} />
                    )
                })}</>}


        </div>

    )
}

export default AllSuccessContent
