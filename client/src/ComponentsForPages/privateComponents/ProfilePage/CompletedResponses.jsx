import React from 'react'

import { useSelector } from 'react-redux';

import CompletedResponsesCard from './Reports DropDown/CompletedResponsesCard';

const CompletedResponses = ({ darkMode, setDarkMode, trigger, setTrigger, allQuest }) => {

    const user = useSelector(state => state.auth.user)

    return (
        <>

            {allQuest?.filter(quest => quest.questionStatus === "completed").length === 0 ?
                <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Currently Completed Msg's</h2> :
                <>
                    <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Completed Msg's</h2>
                    <h6 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>Completed Response Reports Will Be Deleted When The Audit Log Attached Is Deleted By Admin Staff.</h6>
                    {allQuest?.filter(quest => quest.questionStatus === "completed").map(quest => {
                        return (
                            <CompletedResponsesCard quest={quest} trigger={trigger} setTrigger={setTrigger} />
                        )
                    })}</>}

        </>
    )
}

export default CompletedResponses
