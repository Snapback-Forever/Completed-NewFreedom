import Carousel from 'react-bootstrap/Carousel';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

import ImgCard from './ImageCard';
import AddImage from './AddImage';
import UserImage from './UserImage';

const VisitLandingContent = ({ darkMode, singleLocation, data, setData, allSupporters }) => {

  const baseUrl = "http://localhost:8080";

  const tierOrder = { platinum: 1, gold: 2, silver: 3, bronze: 4 };

  const visibleSupporters = [...allSupporters].sort(
    (a, b) => (tierOrder[a.tier] || 999) - (tierOrder[b.tier] || 999)
  );

  const supporters = visibleSupporters.filter((sup) => sup.tier !== "supporter");

  const chunkSize = 4;

  const slides = supporters.reduce(
    (acc, _, i) => i % chunkSize === 0 ? [...acc, supporters.slice(i, i + chunkSize)] : acc,
    []
  );

  console.log("single location", singleLocation);

  return (
    <div style={{ minHeight: "38%", display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* TOP NAV */}
      <div style={{ background: "white", width: "100%", display: "flex", justifyContent: "space-evenly", padding: "1vh 0" }}>

        <button
          className="rounded"
          style={{ background: data === "images" ? "lightGrey" : "goldenRod", border: data === "images" ? "solid goldenrod" : "none", padding: "0 1vw", margin: "0 1vw", width: "25%" }}
          onClick={() => setData("images")}
        >
          Images
        </button>

        <button
          className="rounded"
          style={{ background: data === "programs" ? "lightGrey" : "goldenRod", border: data === "programs" ? "solid goldenrod" : "none", padding: "0 1vw", margin: "0 1vw", width: "25%" }}
          onClick={() => setData("programs")}
        >
          Programs
        </button>

        <button
          className="rounded"
          style={{ background: data === "staff" ? "lightGrey" : "goldenRod", border: data === "staff" ? "solid goldenrod" : "none", padding: "0 1vw", margin: "0 1vw", width: "25%" }}
          onClick={() => setData("staff")}
        >
          Staff
        </button>

        <button
          className="rounded"
          style={{ background: data === "event" ? "lightGrey" : "goldenRod", border: data === "event" ? "solid goldenrod" : "none", padding: "0 1vw", margin: "0 1vw", width: "25%" }}
          onClick={() => setData("event")}
        >
          Events
        </button>

      </div>

      {/* DEFAULT VIEW */}
      {data === "" && (
        <>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", margin: "2vh 0" }}>

            {singleLocation?.aboutLocationVideo?.startsWith("htt") && (
              <video className="videoMedia" controls style={{ width: "60%", height: "50vh", margin: "2vh 0" }} aria-label="Welcome Video" title="Welcome Video">
                <source src={singleLocation?.aboutLocationVideo} type="video/mp4" />
              </video>
            )}

            <h4
              style={{ width: "100%", whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(singleLocation?.aboutLocation || ""),
              }}
            />

          </div>
        </>
      )}

      {/* IMAGES */}
      {data === "images" && (
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", padding: "2vh 1vw" }}>

          {!singleLocation?.additionalImages?.filter(Boolean)?.length ? (
            <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
              Currently No Images To View
            </h1>
          ) : (
            singleLocation.additionalImages
              .filter(Boolean)
              .map((img, imgIndex) => (
                <ImgCard key={imgIndex} img={img} />
              ))
          )}

        </div>
      )}

      {/* PROGRAMS */}
      {data === "programs" && (
        <>
          {!singleLocation?.programs?.filter(Boolean)?.length ? (
            <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
              Currently No Programs To View
            </h1>
          ) : (
            <>
              {singleLocation.programs
                .filter(Boolean)
                .map((pro, programIndex) => {

                  console.log("program", pro);

                  return (
                    <div
                      key={pro?._id || programIndex}
                      style={{ width: "90%", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 0", display: "flex", flexDirection: "column", border: "solid antiqueWhite" }}
                    >

                      <div style={{ width: "89vw", display: "flex", overflowX: "scroll" }}>
                        {pro?.additionalImages?.filter(Boolean)?.map((img, index) => (
                          <AddImage key={index} img={img} />
                        ))}
                      </div>

                      <h1
                        style={{ width: "100%", textAlign: "center" }}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(pro?.programName || ""),
                        }}
                      />

                      <h6
                        style={{ width: "100%", textAlign: "center", whiteSpace: "pre-wrap" }}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(pro?.descriptionOfProgram || ""),
                        }}
                      />

                      <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                        <h6 style={{ margin: "1vh 1vw" }}>
                          Max Capacity: {pro?.maxCapacity}
                        </h6>

                        <h6 style={{ margin: "1vh 1vw" }}>
                          Program Length: {pro?.lengthOfProgram} Days
                        </h6>
                      </div>

                      <Link to={`/visitProgram/${pro?._id}`} style={{ height: "5vh", width: "100%", color: "black" }}>
                        <button style={{ textAlign: "center", background: "goldenRod", height: "5vh", width: "100%" }} className="rounded">
                          Visit This Program
                        </button>
                      </Link>

                    </div>
                  );
                })}
            </>
          )}
        </>
      )}

      {/* STAFF */}
      {data === "staff" && (
        <>
          {!singleLocation?.locationStaff?.filter(Boolean)?.length ? (
            <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
              Currently No Staff To View
            </h1>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", width: "100%", alignItems: "center" }}>

              {singleLocation.locationStaff
                .filter(Boolean)
                .map((staff, index) => (

                  <div
                    key={staff?._id || index}
                    style={{ width: "98%", height: "40vh", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 1vw", display: "flex", border: "solid antiqueWhite" }}
                    className="responsiveUser"
                  >

                    <UserImage staff={staff} />

                    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>

                      <div style={{ width: "90%", height: "80%", display: "flex", flexDirection: "column" }}>

                        <h1 style={{ width: "100%", textAlign: "center" }}>
                          {staff?.firstName} {staff?.lastName}
                        </h1>

                        {staff?.mentor && <h6>Mentor</h6>}
                        {staff?.teacher && <h6>Teacher</h6>}

                      </div>

                      <Link to={`/directMsg/${staff?._id}`} style={{ height: "5vh", width: "100%", color: "black" }}>
                        <button style={{ textAlign: "center", background: "goldenRod", height: "3.5vh", width: "100%" }} className="rounded">
                          Msg Staff Directly
                        </button>
                      </Link>

                    </div>

                  </div>

                ))}

            </div>
          )}
        </>
      )}

      {/* EVENTS */}
      {data === "event" && (
        <>
          {singleLocation?.upcomingEvent
            ?.filter((event) => event?.status === "published")
            ?.map((event, index) => (

              <div
                key={event?._id || index}
                style={{ width: "90%", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 1vw", display: "flex", flexDirection: "column", border: "solid antiqueWhite", padding: "1vh 1vw" }}
              >

                <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
                  {event?.title}
                </h1>

                <div style={{ display: "flex", justifyContent: "space-between" }}>

                  <div style={{ textAlign: "end", margin: "0 2vw" }}>
                    <b>Start Of Event:</b> {moment(event?.startDate).format("MMM Do YYYY")}
                  </div>

                  {event?.endDate && (
                    <div style={{ textAlign: "end", margin: "0 2vw" }}>
                      <b>End Of Event:</b> {moment(event?.endDate).format("MMM Do YYYY")}
                    </div>
                  )}

                </div>

                <div>

                  <h5
                    style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black", whiteSpace: "pre-wrap" }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(event?.description || ""),
                    }}
                  />

                  <h6 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
                    <b>Remaining Capacity: ({event?.capacityRemaining})</b>
                  </h6>

                  <Link to={`/directMsgEvent/${event?.createdBy}/${event?._id}`} style={{ width: "100%", color: "black", height: "5vh" }}>
                    <button style={{ background: "goldenRod", height: "5vh", width: "100%" }}>
                      Msg Event Staff
                    </button>
                  </Link>

                </div>

              </div>

            ))}
        </>
      )}

      {/* SUPPORTERS */}
      {data === "" && (
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
      )}

    </div>
  );
};

export default VisitLandingContent;