import React from 'react'
import AllEventCard from './AllEventCard';

const AllEvents = ({ allEvents, darkMode, setDarkMode, trigger, setTrigger, setChangeContent, allLocations }) => {


    return (

        <div style={{ width: "100vw" }}>
            {allEvents.length === 0 ? <h2 style={{ textAlign: "center" }}>Currently No Events</h2> : <>
                <button style={{ width: "100%", background: "goldenRod", margin: "1vh 0" }} onClick={()=> setChangeContent("createEvent")}>Create A Event</button>

                <h2 style={{ background: 'rgba(255, 255, 255, 0.766)', textAlign: "center" }}>All Events</h2>
                {allEvents.filter(event => event).reverse().map(event => {
                    return (
                        <AllEventCard setTrigger={setTrigger} event={event} allEvents={allEvents} allLocations={allLocations} key={event?._id} />
                    )
                })}
            </>}
        </div>

    )
}

export default AllEvents
