import Carousel from 'react-bootstrap/Carousel';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { getAllUsers } from '../../../redux/reducers/authReducer'
import { Link } from 'react-router-dom'
import DOMPurify from 'dompurify';
import ImageCard from './ImageCard';

const TeamLandingContent = ({ darkMode, setDarkMode, data, setData, allSupporters }) => {

  const dispatch = useDispatch()

  const allUsers = useSelector(state => state.auth.allUsers)

  // useEffect(() => {
  //   dispatch(getAllUsers())
  // }, [])

  const baseUrl = "http://localhost:8080";

  const activeUsers = allUsers?.filter(user => user && !user?.accountDisabled) || []

  const admins = activeUsers.filter(user => user?.NFadmin)
  const staff = activeUsers.filter(user => !user?.NFadmin && !user?.mentor && !user?.teacher)
  const mentors = activeUsers.filter(user => user?.mentor)
  const teachers = activeUsers.filter(user => user?.teacher)

  const tierOrder = { platinum: 1, gold: 2, silver: 3, bronze: 4 };

  const visibleSupporters = [...allSupporters].sort((a, b) => (tierOrder[a.tier] || 999) - (tierOrder[b.tier] || 999))

  const supporters = visibleSupporters.filter((sup) => sup.tier !== "supporter")

  const chunkSize = 4;

  const slides = supporters.reduce((acc, _, i) => (i % chunkSize === 0 ? [...acc, supporters.slice(i, i + chunkSize)] : acc), [])

  const renderCards = (users, type) => {
    return (
      <div style={{ display: "flex" }} className='responsiveNFStaffCardsContainer'>
        {users.map(user => (
          <div key={user?._id} style={{ width: "20vw", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 1vw", display: "flex", flexDirection: "column", border: "solid antiqueWhite" }} className='responsiveNFStaffCards'>

            <ImageCard user={user} />

            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>

              <div style={{ display: "flex", flexDirection: "column", height: "80%" }}>

                <h1 style={{ width: "100%", textAlign: "center" }}>
                  {user?.firstName} {user?.lastName}
                </h1>

                <h4 style={{ width: "100%", textAlign: "center" }}>
                  {user?.staffPosition}
                </h4>

                {type === "mentor" &&
                  <h6 style={{ width: "100%", textAlign: "center" }}>
                    Mentoring: ({user?.currentMentee?.filter(mentee => mentee).length})
                  </h6>
                }

                {type === "teacher" &&
                  <div>
                    <h6 style={{ width: "100%", textAlign: "center" }}>
                      {user?.programsTeaching?.filter(pro => pro).length > 1 ? "Program's" : "Program"} Teaching:
                    </h6>

                    {user?.programsTeaching?.filter(pro => pro).map(pro => (
                      <div key={pro?._id}>
                        <Link to={`/visitProgram/${pro?._id}`}>
                          <h5 style={{ width: "100%", textAlign: "center", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pro?.programName) }} />
                        </Link>
                      </div>
                    ))}
                  </div>
                }

              </div>

              <Link to={`/directMsg/${user?._id}`} style={{ width: "100%", color: "black", height: "5vh" }}>
                <button style={{ background: "goldenRod", height: "5vh", width: "100%" }}>
                  Msg Me Directly
                </button>
              </Link>

            </div>

          </div>
        ))}
      </div>
    )
  }

  return (

    <div style={{ height: "84.1vh", overflow: "scroll", display: "flex", flexDirection: "column", alignItems: "center" }} className={darkMode ? "scrollBar QADark" : "scrollBar QAWhite"}>

      <div style={{ background: "white", width: "100%", display: "flex", justifyContent: "space-evenly", padding: "1vh 0" }}>

        <div style={{ background: "white", width: "100%", display: "flex", justifyContent: "space-evenly", padding: "1vh 0" }}>

          <button className='rounded' style={{ background: data === "" || data === "admin" ? "lightGrey" : "goldenRod", border: data === "" || data === "admin" ? "solid goldenrod" : "none", padding: "0 1vw", margin: "0 1vw", width: "25%" }} onClick={() => setData("admin")}>
            Admin
          </button>

          <button className='rounded' style={{ background: data === "staff" ? "lightGrey" : "goldenRod", border: data === "staff" ? "solid goldenrod" : "none", padding: "0 1vw", margin: "0 1vw", width: "25%" }} onClick={() => setData("staff")}>
            Staff
          </button>

          <button className='rounded' style={{ background: data === "mentors" ? "lightGrey" : "goldenRod", border: data === "mentors" ? "solid goldenrod" : "none", padding: "0 1vw", margin: "0 1vw", width: "25%" }} onClick={() => setData("mentors")}>
            Mentors
          </button>

          <button className='rounded' style={{ background: data === "teachers" ? "lightGrey" : "goldenRod", border: data === "teachers" ? "solid goldenrod" : "none", padding: "0 1vw", margin: "0 1vw", width: "25%" }} onClick={() => setData("teachers")}>
            Teachers
          </button>

        </div>

      </div>

      <div style={{ width: "100%", minHeight: "90%" }}>

        {(data === "" || data === "admin") && (
          admins.length === 0 ? (
            <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
              No New Freedom Admin
            </h2>
          ) : (
            <>
              <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
                New Freedom Administration
              </h1>

              {renderCards(admins)}
            </>
          )
        )}

        {data === "staff" && (
          staff.length === 0 ? (
            <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
              No New Freedom Staff
            </h2>
          ) : (
            <>
              <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
                New Freedom Staff
              </h1>

              {renderCards(staff)}
            </>
          )
        )}

        {data === "mentors" && (
          mentors.length === 0 ? (
            <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
              No New Freedom Mentors
            </h2>
          ) : (
            <>
              <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
                New Freedom Mentors
              </h1>

              {renderCards(mentors, "mentor")}
            </>
          )
        )}

        {data === "teachers" && (
          teachers.length === 0 ? (
            <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
              No New Freedom Teachers
            </h2>
          ) : (
            <>
              <h1 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }}>
                New Freedom Teachers
              </h1>

              {renderCards(teachers, "teacher")}
            </>
          )
        )}

      </div>

      <>
        {supporters.length !== 0 && !supporters.length > 6 ? <h3 style={{ textAlign: "center", margin: "0.5rem 0", background: "lightGrey", color: "black" }}>Supporters Of Our Mission</h3> : ""}

        {supporters.length > 6 ? (
          <>
            {supporters.length !== 0 ? <h3 style={{ textAlign: "center", margin: "0.5rem 0", background: "lightGrey", color: "black" }}>Supporters Of Our Mission</h3> : ""}

            <Carousel>
              {slides.map((group, idx) => (
                <Carousel.Item key={idx} interval={5000}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: "0.5rem", width: "100%", boxSizing: "border-box", padding: "0.5rem" }}>
                    {group.map((sup) => {
                      const imgSrc = sup?.logoFileId && sup?.logoBucketName ? `${baseUrl}/upload/image/${sup?.logoFileId}?bucketName=${sup?.logoBucketName}` : sup?.logoUrl;

                      return (
                        <div key={sup?._id} title={sup?.name} style={{ flex: "0 0 22%", minWidth: "22%", maxWidth: "22%", minHeight: "20vh", background: "white" }}>
                          <a href={sup?.websiteLink} target="_blank" style={{ display: "block", width: "100%", height: "100%" }}>
                            <img src={imgSrc} alt={sup?.name || "Supporter logo"} style={{ width: "100%", height: "20vh", objectFit: "contain", display: "block" }} />
                          </a>
                        </div>
                      )
                    })}
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </>
        ) : (
          <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "0.5rem", boxSizing: "border-box", margin: "0.5rem 0", flexWrap: "wrap" }}>
            {supporters.map((sup) => {
              const imgSrc = sup?.logoFileId && sup?.logoBucketName ? `${baseUrl}/upload/image/${sup?.logoFileId}?bucketName=${sup?.logoBucketName}` : sup?.logoUrl;

              return (
                <div key={sup?._id} title={sup?.name} style={{ minWidth: "10vw", maxWidth: "10vw", minHeight: "20vh", maxHeight: "20vh", margin: "1vh 0.5vw", background: "white" }}>
                  <a href={sup?.websiteLink} target="_blank">
                    <img src={imgSrc} alt={sup?.name || "Supporter logo"} style={{ width: "100%", height: "20vh", objectFit: "contain", display: "block" }} />
                  </a>
                </div>
              )
            })}
          </div>
        )}
      </>

    </div>
  )
}

export default TeamLandingContent