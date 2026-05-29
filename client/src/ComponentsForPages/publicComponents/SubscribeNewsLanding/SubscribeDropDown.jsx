import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

const SubscribeDropDown = ({ newGif, newGif2, darkMode, setDarkMode, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters }) => {

  const [showAll, setShowAll] = useState(false);

  const MAX_VISIBLE = 5;

  const publishedStories = allStories?.filter(story => story?.consentToPublish) || [];

  const visibleStories = showAll
    ? publishedStories
    : publishedStories.slice(0, MAX_VISIBLE);

  const allNews = allNewsLetters?.filter(news => news?.status === "published") || []; // or however you receive it

  const visibleNewsLetters = showAll
    ? allNews
    : allNews.slice(0, MAX_VISIBLE);



  const handleDonate = () => {
    window.open(
      "http://localhost:5173",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (

    <div >

      <div
        style={{
          background: "whiteSmoke",
          width: "100vw",
          height: "5vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 5vw"
        }}
        className="responsiveSelect"
      >

        {/* WHO WE ARE dropdown wrapper */}
        <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw" }} className='rounded responsiveDiv' onMouseLeave={() => setOpenMenu("")}>
          <button
            className="responsiveButton rounded"
            onClick={() => setOpenMenu(openMenu === "who" ? null : "who")}
          >
            Our Community
          </button>
          {openMenu === "who" && (
            <div className="dropdownPanel" style={{ background: "white", border: "2px solid black" }}

            >

              <button className='rounded' disabled style={{ border: "solid goldenRod", background: "lightGrey", width: "100%", margin: "0.5vh 0", color: "black" }}>ON Why We Exists</button>

              <Link to={"/msg"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Send Us A Message</button>
              </Link>

              <Link to={"/Q-A"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Send Frequently Asked Questions</button>
              </Link>

              <Link to={"/contactInfo"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Contact Information</button>
              </Link>

              <Link to={"/team"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Our Team</button>
              </Link>

              <Link to={"/supporters"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Our Support Partners</button>
              </Link>

              <Link to={"/makeAReferral"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Make A Referral</button>
              </Link>
            </div>


          )}
        </div>

        {/* Wrapper for WHAT WE DO */}
        <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw" }} className='rounded responsiveDiv' onMouseLeave={() => setOpenMenu("")}>
          <button
            className="responsiveButton rounded"
            onClick={() => setOpenMenu(openMenu === "what" ? null : "what")}
          >
            WHAT WE DO
          </button>
          {openMenu === "what" && (
            <div className="dropdownPanel" style={{ background: "white", border: "2px solid black" }}

            >
              <Link to={"/approach"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Our Approach</button>
              </Link>

              <Link to={"/programs"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Programs</button>
              </Link>

              <Link to={"/vocational"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Vocational Training</button>
              </Link>

              <Link to={"/inpatient"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Inpatient Services</button>
              </Link>

              <Link to={"/outReach"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Outreach Services</button>
              </Link>

              <Link to={"/mentorShip"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Mentorship Program</button>
              </Link>

            </div>
          )}
        </div>

        {/* SUCCESS STORIES wrapper */}
        <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw" }} className='rounded responsiveDiv' onMouseLeave={() => setOpenMenu("")}>


          <button
            className="responsiveButton rounded"
            onClick={() => setOpenMenu(openMenu === "success" ? null : "success")}
          >
            SUCCESS STORIES
          </button>


          {openMenu === "success" && (
            <div className="dropdownPanel" style={{ background: "white", border: "2px solid black" }} >
              <Link to={"/submitSuccess"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Submit A Success Story</button>
              </Link>


              <>

                {publishedStories?.length === 0 ? "Currently No Success Stories To View" :
                  <>
                    {visibleStories?.map(story => (
                      <Link key={story?._id} to={`/successStory/${story?._id}`}>
                        <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} > Story From : {story?.displayName} -{" "} {moment(story?.createdAt).format("MMM DD, YYYY")} </button>
                      </Link>
                    ))}

                    {publishedStories?.length > MAX_VISIBLE && !showAll && (

                      <Link to={"/allSuccessStory"}>
                        <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} > See All Success Stories </button>
                      </Link>
                    )}

                  </>}

              </>
            </div>
          )}

        </div>

        {/* NEWS LETTER wrapper */}
        <div
          style={{
            position: "relative",
            width: "100%",
            textAlign: "center",
            background: "goldenRod",
            margin: "0 1vw",
          }}
          className="rounded responsiveDiv" onMouseLeave={() => setOpenMenu("")}
        >
          <button className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "news" ? null : "news")} > NEWS LETTER </button>

          {openMenu === "news" && (

            <div className="dropdownPanel" style={{ background: "white", border: "2px solid black" }} >


              <button className="rounded" disabled style={{ border: "solid goldenRod", background: "lightGrey", width: "100%", margin: "0.5vh 0", color: "black" }}>ON Subscribe To Our NewsLetter </button>


              {allNewsLetters?.length === 0 ? "Currently No Newsletters To View" :
                <>
                  {visibleNewsLetters?.map(news => (

                    <Link key={news?._id} to={`/newsletter/${news?._id}`}>
                      <button className="rounded" style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>
                        {news?.postTitle?.split(" ").slice(0, 8).join(" ") + (news?.postTitle?.split(" ").length > 8 ? "..." : "")}: {moment(news?.periodStart).format("MMM YYYY")}</button>
                    </Link>

                  ))}

                  {allNewsLetters?.length > MAX_VISIBLE && (
                    <Link to={"/allNewsLetters"}>
                      <button className="rounded" style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black", }} > See All News Letters </button>
                    </Link>
                  )}

                </>}

            </div>
          )}

        </div>

        {/* WHATS HAPPENING wrapper */}
        <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw" }} className='rounded responsiveDiv' onMouseLeave={() => setOpenMenu("")}>
          <button
            className="responsiveButton rounded"
            onClick={() => setOpenMenu(openMenu === "happening" ? null : "happening")}
          >
            WHATS HAPPENING
          </button>
          {openMenu === "happening" && (
            <div className="dropdownPanel" style={{ background: "white", border: "2px solid black" }}

            >
              <Link to={"/upcoming"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Up Coming Events</button>
              </Link>

              <Link to={"/graduates"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Program Graduates</button>
              </Link>

              <Link to={"/drawings"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Drawings Sent To NF</button>
              </Link>

              <Link to={"/newPrograms"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>New Programs</button>
              </Link>

              <Link to={"/newTraining"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>New Training Opportunities</button>
              </Link>

            </div>
          )}
        </div>

        {/* SUPPORT US wrapper */}
        <div
          style={{
            position: "relative",
            width: "100%",
            textAlign: "center",
            background: "goldenRod",
            margin: "0 1vw",
          }}
          className="rounded responsiveDiv" onMouseLeave={() => setOpenMenu("")}
        >
          <button
            className="responsiveButton"
            onClick={() => setOpenMenu(openMenu === "support" ? null : "support")}
          >
            SUPPORT US
          </button>
          {openMenu === "support" && (
            <div
              className="dropdownPanel dropdownPanel--alignRight"
              style={{ background: "white", border: "2px solid black" }}

            >
              <Link to={"/msg"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Send Us A Message</button>
              </Link>

              <a href='https://secure.qgiv.com/for/newfreedomproject'>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Make A Donation</button>
              </a>

              <Link to={"/join"}>
                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Join The Cause</button>
              </Link>

            </div>
          )}
        </div>

      </div>

    </div>
  )
}

export default SubscribeDropDown
