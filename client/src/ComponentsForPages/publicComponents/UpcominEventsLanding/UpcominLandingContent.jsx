import Carousel from 'react-bootstrap/Carousel';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import DOMPurify from 'dompurify';

const UpcominLandingContent = ({ darkMode, setDarkMode, allEvents, allSupporters }) => {


  const [eventView, setEventView] = useState("upcoming");

  const baseUrl = "http://localhost:8080";

  const tierOrder = { platinum: 1, gold: 2, silver: 3, bronze: 4 };

  const visibleSupporters = [...allSupporters].sort((a, b) => (tierOrder[a.tier] || 999) - (tierOrder[b.tier] || 999));

  const supporters = visibleSupporters.filter((sup) => sup.tier !== "supporter");

  const chunkSize = 4;

  const slides = supporters.reduce((acc, _, i) => (i % chunkSize === 0 ? [...acc, supporters.slice(i, i + chunkSize)] : acc), []);

  const upcomingEvents = allEvents?.filter(event => event.status === "published" && moment(event.startDate).isAfter(moment())).reverse();

  const pastEvents = allEvents?.filter(event => event.status === "published" && moment(event.startDate).isBefore(moment())).reverse();

  const displayedEvents = eventView === "upcoming" ? upcomingEvents : pastEvents;

  return (

    <div style={{ minHeight: "84.1vh", overflow: "scroll", display: "flex", flexDirection: "column", alignItems: "center" }} className={darkMode ? "scrollBar QADark" : "scrollBar QAWhite"} >

      {/* EVENT TOGGLE BUTTONS */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", background: "white" }}>

        <button onClick={() => setEventView("upcoming")} style={{ padding: "0.75rem 1.5rem", border: "none", cursor: "pointer", background: eventView !== "upcoming" ? "goldenrod" : "lightgray", color: "black", fontWeight: "bold", width: "50%", margin: "0.5vh 0.5vw" }}>
          Upcoming Events
        </button>

        <button onClick={() => setEventView("past")} style={{ padding: "0.75rem 1.5rem", border: "none", cursor: "pointer", background: eventView !== "past" ? "goldenrod" : "lightgray", color: "black", fontWeight: "bold", width: "50%", margin: "0.5vh 0.5vw" }}>
          Past Events
        </button>

      </div>

      {/* EVENTS */}
      <div style={{ minHeight: "70vh", width: "100%", margin: "1vh 0" }}>

        {displayedEvents?.length === 0 ? (
          <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
            {eventView === "upcoming" ? "Currently No Upcoming Events To View" : "Currently No Past Events To View"}
          </h2>
        ) : (
          <>

            <h1 style={{ width: "100%", textAlign: "center", background: 'rgba(255, 255, 255, 0.766)', }}>
              {eventView === "upcoming" ? "Upcoming Events" : "Past Events"}
            </h1>

            {displayedEvents.map(event => {

              return (

                <div style={{ background: "rgba(250, 235, 215, 0.960)", width: "98%", margin: "1vh 1vw", padding: "1vh" }} key={event._id}>

                  <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
                    {event?.title}
                  </h1>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <div style={{ textAlign: "end", margin: "0 2vw" }}>
                      <b>Start Of Event:</b> {moment(event?.startDate).format("MMM Do YYYY")}
                    </div>

                    {event?.endDate ? (
                      <div style={{ textAlign: "end", margin: "0 2vw" }}>
                        <b>End Of Event:</b> {moment(event?.endDate).format("MMM Do YYYY")}
                      </div>
                    ) : ""}

                  </div>

                  <div>

                    <h6 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
                      <b>Remaining Capacity: ({event?.capacityRemaining})</b>
                    </h6>

                    <h5 style={{ width: "100%", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event?.description) }} />

                    <Link to={`/directMsgEvent/${event?.createdBy}/${event._id}`} style={{ width: "100%", color: "black", height: "5vh" }}>

                      <button style={{ background: "goldenRod", height: "5vh", width: "100%" }}>
                        Msg Event Staff
                      </button>

                    </Link>

                  </div>

                </div>

              )

            })}

          </>
        )}

      </div>

      {/* SUPPORTERS */}
      <>
     
        {supporters.length > 6 ? (

<>
{supporters.length !== 0 && !supporters.length > 6 ? <h3 style={{ textAlign: "center", margin: "0.5rem 0", background: "lightGrey", color: "black" }}>Supporters Of Our Mission</h3> : ""}
{supporters.length > 6 ? (<>
  {supporters.length !== 0 ? <h3 style={{ textAlign: "center", margin: "0.5rem 0", background: "lightGrey", color: "black" }}>Supporters Of Our Mission</h3> : ""}

  <Carousel>
    {slides.map((group, idx) => (
      <Carousel.Item key={idx} interval={idx === 0 ? 5000 : idx === 1 ? 5000 : undefined}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: "0.5rem", width: "100%", boxSizing: "border-box", padding: "0.5rem" }}>
          {group.map((sup) => {
            const imgSrc = sup?.logoFileId && sup?.logoBucketName ? `${baseUrl}/upload/image/${sup?.logoFileId}?bucketName=${sup?.logoBucketName}` : sup?.logoUrl;
            return (
              <div key={sup?._id} title={sup?.name} style={{ flex: "0 0 22%", minWidth: "22%", maxWidth: "22%", minHeight: "20vh", background: "white" }}>
                <a href={sup?.websiteLink} target="_blank" style={{ display: "block", width: "100%", height: "100%" }}>
                  <img src={imgSrc} alt={sup?.name || "Supporter logo"} style={{ width: "100%", height: "20vh", objectFit: "contain", display: "block" }} />
                </a>
              </div>
            );
          })}
        </div>
      </Carousel.Item>
    ))}
  </Carousel>
</>) : (
  <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "0.5rem", boxSizing: "border-box", margin: "0.5rem 0", flexWrap: "wrap" }}>
    {supporters.map((sup) => { const imgSrc = sup?.logoFileId && sup?.logoBucketName ? `${baseUrl}/upload/image/${sup?.logoFileId}?bucketName=${sup?.logoBucketName}` : sup?.logoUrl; return (<div key={sup?._id} title={sup?.name} style={{ minWidth: "10vw", maxWidth: "10vw", minHeight: "20vh", maxHeight: "20vh", margin: "1vh 0.5vw", background: "white" }}><a href={sup?.websiteLink} target="_blank"><img src={imgSrc} alt={sup?.name || "Supporter logo"} style={{ width: "100%", height: "20vh", objectFit: "contain", display: "block" }} /></a></div>); })}
  </div>
)}
</>

        ) : (

          <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "0.5rem", boxSizing: "border-box", margin: "0.5rem 0", flexWrap: "wrap" }}>

            {supporters.length !== 0 ? <h3 style={{ textAlign: "center", margin: "0.5rem 0", background: "lightGrey", color: "black", width: "100%" }}>Supporters Of Our Mission</h3> : ""}

            {supporters.map((sup) => {

              const imgSrc = sup?.logoFileId && sup?.logoBucketName ? `${baseUrl}/upload/image/${sup?.logoFileId}?bucketName=${sup?.logoBucketName}` : sup?.logoUrl;

              return (

                <div key={sup?._id} title={sup?.name} style={{ minWidth: "10vw", maxWidth: "10vw", minHeight: "20vh", maxHeight: "20vh", margin: "1vh 0.5vw", background: "white" }}>

                  <a href={sup?.websiteLink} target="_blank" rel="noreferrer">

                    <img src={imgSrc} alt={sup?.name || "Supporter logo"} style={{ width: "100%", height: "20vh", objectFit: "contain", display: "block" }} />

                  </a>

                </div>

              );

            })}

          </div>

        )}

      </>

    </div>

  )

}

export default UpcominLandingContent