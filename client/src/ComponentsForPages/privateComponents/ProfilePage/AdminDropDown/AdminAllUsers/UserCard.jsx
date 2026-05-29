import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { resetErrorMessage, resetSuccessMessage } from '../../../../../redux/reducers/directMsgStaffReducers';
import { adminUpdateProfile, deleteUser } from '../../../../../redux/reducers/authReducer';
import { searchMailUser } from '../../../../../redux/reducers/menteeReducers';
import { useRef } from "react";

import moment from 'moment';
import DOMPurify from 'dompurify';

import noImage from "../../../../../images/noImageNF.png"
import MenteeCard from './MenteeCard';
import AddMenteeModal from './AddMenteeModal';
import UserQuestions from './UserQuestions';
import UserDirectMsg from './UserDirectMsg';
import UserNews from './UserNews';
import UserPost from './UserPost';
import UserTeaching from './UserTeaching';
import UserSuccessStories from './UserSuccessStories';
import UserEvents from './UserEvents';
import UserChangePassword from './UserChangePassword';

const UserCard = ({ darkMode, setDarkMode, trigger, setTrigger, user, handleOpenUpdate, allMentee, allPrograms, setChangeContent }) => {

  const dispatch = useDispatch();

  const clickCount = useRef(0);
  const timer = useRef(null);

  const [visibleCount5, setVisibleCount5] = useState(5);
  const [visibleCount, setVisibleCount] = useState(10);

  const adminId = useSelector((state) => state.auth.user?._id);
  const admin = useSelector((state) => state.auth.user);


  const successMessage = useSelector((state) => state.auth.successMessage);

  const [showMore, setShowMore] = useState("");
  const [addMenteeModal, setAddMenteeModal] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [showAllQuestResponses, setShowAllQuestResponses] = useState(false);
  const questResponses =
    (user?.questionsResponded?.filter(quest => quest) ?? [])
      .slice()
      .reverse();
  const questResponsesToShow = showAllQuestResponses
    ? questResponses
    : questResponses.slice(0, 10);

  const [showAllDirectMsg, setShowAllDirectMsg] = useState(false);
  const directMsgs = (user?.directMsg?.filter(msg => msg) ?? []).slice().reverse();
  const directMsgsToShow = showAllDirectMsg
    ? directMsgs
    : directMsgs.slice(0, 5);


  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const questions = (user?.questionsResponded?.filter(quest => quest) ?? []).slice().reverse();
  const questionsToShow = showAllQuestions
    ? questions
    : questions.slice(0, 5);

  const [showAllNews, setShowAllNews] = useState(false);
  const newsList = (user?.news?.filter(news => news) ?? []).slice().reverse();
  const newsToShow = showAllNews ? newsList : newsList.slice(0, 5);

  const [showAllPosts, setShowAllPosts] = useState(false);
  const postList = (user?.post?.filter(post => post) ?? []).slice().reverse();
  const postsToShow = showAllPosts ? postList : postList.slice(0, 5);

  const [showAllEvents, setShowAllEvents] = useState(false);
  const eventList =
    (user?.upcomingEvent?.filter(event => event) ?? []).slice().reverse();
  const eventsToShow = showAllEvents ? eventList : eventList.slice(0, 5);


  const [showAllSuccess, setShowAllSuccess] = useState(false);
  // data
  const authored = (user?.successStoryAuthor?.filter(suc => suc) ?? []).slice().reverse();
  // which ones to show
  const successToShow = showAllSuccess
    ? authored            // all
    : authored.slice(0, 5); // first 5

  const [form, setForm] = useState({
    profilePicPreview: null,
    profilePicFile: null,
  });

  const isBirthdayToday = (dateOfBirthString) => {
    if (!dateOfBirthString) return false;
    const today = moment();
    const dob = moment(dateOfBirthString, "YYYY-MM-DD");
    return today.month() === dob.month() && today.date() === dob.date();
  };

  const baseUrl = "http://localhost:8080";
  const imgSrc =
    user?.profilePicFileId && user?.profilePicBucketName
      ? `${baseUrl}/upload/image/${user.profilePicFileId}?bucketName=${user.profilePicBucketName}`
      : user?.profilePic;

  // 2) Your clean upload handler, unchanged except using form/setForm
  const handleUploadImage = (fieldPrefix) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewKey = `${fieldPrefix}Preview`;
    const fileKey = `${fieldPrefix}File`;
    // Clean previous preview URL
    setForm((prev) => {
      const prevUrl = prev[previewKey];
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return prev;
    });
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      [previewKey]: previewUrl,
      [fileKey]: file, // keep File in state, no upload yet
    }));
  };

  // 3) Clean image-only save handler, also prefix-based
  const handleSaveImage = (fieldPrefix) => async () => {
    const fileKey = `${fieldPrefix}File`;
    const file = form[fileKey];
    if (!file) return;
    // 1. Upload to GridFS (unchanged)
    const fd = new FormData();
    fd.append("image", file);
    const hasGridFsImage =
      !!user.profilePicFileId && !!user.profilePicBucketName;
    const uploadUrl = hasGridFsImage
      ? `${baseUrl}/upload/image/${user.profilePicFileId}?bucketName=${user.profilePicBucketName}`
      : `${baseUrl}/upload/image/${user?._id}`;
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      body: fd,
    });
    if (!uploadRes.ok) {
      console.error("Image upload failed");
      return;
    }

    const { fileId, bucketName } = await uploadRes.json();
    const payload = {
      authId: adminId,
      userId: user?._id,
      profilePicFileId: fileId,
      profilePicBucketName: bucketName,
    };
    // 2. IMPORTANT: wait for Redux to finish
    try {
      await dispatch(adminUpdateProfile(payload)).unwrap?.();
    } catch (err) {
      console.error("adminUpdateProfile failed:", err);
      return;
    }
    // 3. Only then trigger parent changes
    setTrigger && setTrigger((prev) => !prev);
  };

  useEffect(() => {
    if (successMessage === "Profile updated!") {
      setForm((prev) => ({
        ...prev,
        profilePicPreview: null,
        profilePicFile: null,
      }));
      dispatch(resetErrorMessage())
      dispatch(resetSuccessMessage())
    }
  }, [successMessage]);

  const inputStyle = {
    border: 'solid lightGrey',
    background: 'white',
    width: '30vw',
    margin: "0 0 1vh 0"
  };

  const mailUserSearchResults = useSelector(
    (state) => state.mentee.mailUserSearchResults
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [hasSearched, setHasSearched] = useState(false);

  const searchResults = mailUserSearchResults?.results || [];
  const searchCount = mailUserSearchResults?.count ?? 0;

  const handleSearch = () => {
    const q = searchTerm.trim();
    setHasSearched(true);
    if (!q) return;
    dispatch(searchMailUser({ q }));
    setTrigger(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setHasSearched(false);
      setVisibleCount(10);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const allMentees = user?.currentMentee || [];

  const shouldShowSearchResults = hasSearched && searchResults.length > 0;
  const menteesToDisplay = shouldShowSearchResults
    ? searchResults
    : allMentees.slice(0, visibleCount); // paginate only in "all mentees" mode
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };


  const deleteThisUser = (deletedUser) => {

    const payload = {
      authId: admin?._id,
      userId: deletedUser?._id,
      reason: `${admin?.accountName} Deleted User ${deletedUser?.accountName}`
    }

    dispatch(deleteUser(payload))
    setTrigger(true)
  }

  const handleTripleClick = () => {
    clickCount.current += 1;
    if (clickCount.current === 1) {
      timer.current = setTimeout(() => {
        clickCount.current = 0; // reset if too slow
      }, 1000); // 1 second window
    }
    if (clickCount.current === 3) {
      clearTimeout(timer.current);
      clickCount.current = 0;
      deleteThisUser(user);
    }
  };

  return (

    <div key={user?._id} style={{ width: '100%', minHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', background: user?._id !== adminId ? 'rgba(250, 235, 215, 0.960)' : "white", overflowY: 'auto', padding: '1rem', margin: '1vh 0' }} >

      {user?._id === adminId ? <div className='lookAtMe'>This Is Your Card</div> : ""}

      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'small' }}>{moment(user?.createdAt).format('MMM Do YYYY')}</span>

        <span style={{ fontSize: 'small' }}> Last Login:{' '} {user?.lastLogin ? moment(user.lastLogin).format('MMM Do YYYY') : 'Never'}</span>

      </div>

      <div style={{ width: '100%', display: "flex", flexDirection: "column" }}>
        <div style={{ width: '100%', display: "flex" }} className='responsiveAllUserCards'>

          <div style={{ width: "35vw", display: "flex", flexDirection: "column", alignItems: "center", border: 'double black' }} className='responsiveAllUserCardImg'>
            <img
              src={form?.profilePicPreview || imgSrc || noImage}
              style={{
                minHeight: "30vh",
                maxHeight: "30vh",
                margin: "2vh 1vw",
                maxWidth: "30vw",
                minWidth: "30vw",
              }}
              className='responsiveAllUserCardImage'
            />

            {user?._id === adminId || admin?.NFadmin || admin?.creator ? <div style={{ display: "flex", flexDirection: "column" }}>
              <h6>Change Image</h6>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadImage("profilePic")}
                style={inputStyle}
                className='responsiveAllUserCardInput'
              />

              {form?.profilePicPreview !== null ?
                <button
                  type="button"
                  onClick={handleSaveImage("profilePic")}
                  style={{ width: "100%", background: "lightBlue", margin: "0 0 1vh 0" }}
                  className='responsiveAllUserCardButton lookAtMe'
                >Update Image</button> : ""}
            </div> : ""}
          </div>
          <div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "55vw", height: "100%" }} className='responsiveAllUserCardInfo'>
              <h2 style={{ textAlign: 'center' }}>
                {admin?._id !== user?._id ? <Link to={`/messagePage/${user?._id}`}>{user?.accountName}</Link> : <>{user?.accountName}</>}
              </h2>
              <h6 style={{ textAlign: "center" }}><b>Staff Position:</b> <br />{user?.staffPosition}</h6>
              <h6 style={{ textAlign: "center" }}><b>FirstName:</b> {user?.firstName}</h6>
              <h6 style={{ textAlign: "center" }}><b>LastName:</b> {user?.lastName}</h6>
              <h6 style={{ textAlign: "center" }}><b>Phone Number:</b> <br />{user?.yourPhoneNumber}</h6>
              <h6 style={{ textAlign: "center" }}><b>Address:</b> <br />{user?.yourAddress}</h6>
              <h6 style={{ textAlign: "center" }}><b>Birth Date:</b> {user?.dateOfBirth}</h6>
              {isBirthdayToday(user?.dateOfBirth) && (
                <h6 className="lookAtMe" style={{ textAlign: 'center' }}>
                  Happy BirthDay!!!
                </h6>
              )}
              <h6 style={{ textAlign: "center" }}><b>Email:</b> <br />{user?.email}</h6>
              <h6><b>Gender:</b> {user?.sex}</h6>
            </div>
          </div>
        </div>

        {admin?.creator || admin?.NFadmin || user?._id === admin?._id ? <>
          <div style={{ width: "100%", border: "double black", display: "flex", flexWrap: "wrap", gap: "1vh 1vw", justifyContent: "center", padding: "1vh 1vw", margin: "1vh 0" }}>

            {showMore === "SecQuest" && admin?.creator ? <h6 style={{ textAlign: "center", width: "100%", background: "lightGrey" }} onClick={() => setShowMore("")}>Hide Security Questions/Answers</h6> : <h6 style={{ textAlign: "center", width: "100%", background: "lightGrey" }} onClick={() => setShowMore("SecQuest")}>View Security Questions/Answers</h6>}


            {showMore === "SecQuest" ?
              <>
                <div style={{ display: "flex", flexDirection: "column" }} >
                  {user?.securityQuestions?.map(quest => {
                    return (
                      <div style={{ display: "flex", flexDirection: "column" }} key={crypto?.randomUUID()}>
                        <div><b>Q:</b> {quest?.question}</div>
                        <div><b>A:</b> {quest?.answer}</div>
                      </div>
                    )
                  })}
                </div>
              </> : ""}

          </div>
        </> : ""}


        <div style={{ width: "100%", border: "double black", display: "flex", flexWrap: "wrap", gap: "1vh 1vw", justifyContent: "center", padding: "1vh 1vw" }}>


          {showMore === "positions" ? <h6 style={{ textAlign: "center", width: "100%", background: "lightGrey" }} onClick={() => setShowMore("")}>Hide Positions</h6> : <h6 style={{ textAlign: "center", width: "100%", background: "lightGrey" }} onClick={() => setShowMore("positions")}>View Positions</h6>}


          {showMore === "positions" ? <div>

            <div>{user?.Creator ? "✅ Main Admin" : ""}</div>
            <div>{user?.NFadmin ? "✅ NfAdmin" : ""}</div>
            <div>{user?.mentor ? "✅ Mentor" : ""}</div>
            <div>{user?.teacher ? "✅ Teacher" : ""}</div>
            <div>{user?.newsLetter ? "✅ NewsLetter" : ""}</div>
            <div>{user?.hiring ? "✅ Hiring Staff" : ""}</div>
            <div>{user?.staffCustomerService ? "✅ Customer Service" : ""}</div>
            <div>{user?.websiteSupportTeam ? "✅ website Support Team" : ""}</div>
            <div>{user?.eventStaff ? "✅ Event Staff" : ""}</div>
          </div>
            : ""}

        </div>


        {admin?.creator || admin?.NFadmin || user?._id === admin?._id ? <>
          <div style={{ width: "100%", border: "double black", display: "flex", flexWrap: "wrap", gap: "1vh 1vw", justifyContent: "center", padding: "1vh 1vw" }}>


            {showMore === "production" ? <h6 style={{ textAlign: "center", width: "100%", background: "lightGrey" }} onClick={() => setShowMore("")}>Hide User Production</h6> : <h6 style={{ textAlign: "center", width: "100%", background: "lightGrey" }} onClick={() => setShowMore("production")}>View User Production {user?.upcomingEvent?.some(ev => ev?.attendees?.some(att => att?.statusOnAttendence === "requested")) ? <span className='lookAtMe'>Event Request</span> : ""}</h6>}


            {showMore === "production" ? <div style={{ width: "100%", display: 'flex', flexDirection: "column", gap: "1vh 1vw" }}>
              <div onClick={() => setShowMore("mentee")}> {user?.currentMentee === 0 ? "" : <><b>View Mentee's:</b> ({user?.currentMentee.length})</>}</div>
              <div onClick={() => setShowMore("questResponse")}> {user?.questionsResponded === 0 ? "" : <><b>View Question's Responded:</b> ({user?.questionsResponded.length})</>}</div>
              <div onClick={() => setShowMore("directMsg")}> {user?.directMsg === 0 ? "" : <><b>View Direct Messages:</b> ({user?.directMsg.length})</>}</div>
              <div onClick={() => setShowMore("news")}> {user?.user?.news === 0 ? "" : <><b>View News letter:</b> ({user?.news.length})</>}</div>
              <div onClick={() => setShowMore("post")}> {user?.post === 0 ? "" : <><b>View Post:</b> ({user?.post.length})</>}</div>
              <div onClick={() => setShowMore("teaching")}> {user?.programsTeaching === 0 ? "" : <><b>View Programs Teaching:</b> ({user?.programsTeaching.length})</>}</div>
              <div onClick={() => setShowMore("story")}> {user?.successStoryAuthor === 0 ? "" : <><b>View Success Stories:</b> ({user?.successStoryAuthor.length})</>}</div>
              <div onClick={() => setShowMore("event")}>{user?.upcomingEvent?.length === 0 ? "" : <><b>View Upcoming Event:</b> ({user?.upcomingEvent.length}) {user?.upcomingEvent?.some(ev => ev?.attendees?.some(att => att?.statusOnAttendence === "requested")) ? <span className='lookAtMe'>Event Request</span> : ""}</>}</div>

            </div> : ""}


            {showMore === "questResponse" ? (
              <>
                <div style={{ border: "solid black", width: "100%" }}></div>
                {questResponsesToShow?.map(quest => (
                  <UserQuestions
                    key={quest._id}
                    user={user}
                    admin={admin}
                    quest={quest}
                  />
                ))}
                {questResponses?.length > 10 && !showAllQuestResponses && (
                  <button
                    type="button"
                    style={{ marginTop: "1vh", background: "green", width: "100%", color: "white" }}
                    onClick={() => setShowAllQuestResponses(true)}
                  >
                    Show more responses
                  </button>
                )}
                {questResponses?.length > 10 && showAllQuestResponses && (
                  <button
                    type="button"
                    style={{ marginTop: "1vh", background: "red", width: "100%" }}
                    onClick={() => setShowAllQuestResponses(false)}
                  >
                    Show fewer responses
                  </button>
                )}
              </>
            ) : ""}

            {showMore === "mentee" ? <>
              <div style={{ border: "solid black", width: "100%" }}></div>

              {showMore !== "mentee" ? <h6 style={{ textAlign: "center", width: "100%", background: "lightGrey" }}>User Mentee's</h6> : <h6 style={{ textAlign: "center", width: "100%", background: "lightGrey" }} onClick={() => setShowMore("")}>Hide Mentee's</h6>}
              <button style={{ width: "100%", background: "goldenRod" }} onClick={() => setAddMenteeModal(true)}>Add A Mentee To User</button>

              <dialog open={addMenteeModal} >
                <AddMenteeModal setAddMenteeModal={setAddMenteeModal} allMentee={allMentee} user={user} setTrigger={setTrigger} />
              </dialog>

              {user?.currentMentee?.length === 0 ?

                <h6>No Mentee's To View</h6>
                :
                <>

                  <div style={{ width: "100%", display: "flex", justifyContent: "center" }} >

                    <input
                      type="text"
                      value={searchTerm}
                      placeholder="Search mentees (name, state, Inmate Number, etc.)"
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown} // Enter to search
                      style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                    />
                    <button onClick={handleSearch} style={{ background: "green", padding: "0.5vh 2vw", margin: "0 0.5vw" }} > Search </button>
                  </div>
                  {/* List of mentees: search results or current mentees */}
                  {menteesToDisplay.map((mentee) => {
                    const imgSrcMentee =
                      mentee?.menteeImageFileId && mentee?.menteeImageBucketName
                        ? `${baseUrl}/upload/image/${mentee?.menteeImageFileId}?bucketName=${mentee?.menteeImageBucketName}`
                        : mentee?.menteeImage;
                    return (
                      <MenteeCard
                        mentee={mentee}
                        imgSrcMentee={imgSrcMentee}
                        isBirthdayToday={isBirthdayToday}
                        setTrigger={setTrigger}
                        mentor={user}
                        key={mentee?._id}
                        allPrograms={allPrograms}
                      />
                    );
                  })}
                  {/* Show more button only when showing all mentees */}
                  {!hasSearched && allMentees?.length > visibleCount && (
                    <div style={{ marginTop: "1rem", textAlign: "center" }}>
                      <button onClick={handleShowMore}>Show more</button>
                    </div>
                  )}
                  <div style={{ border: "solid black", width: "100%" }}></div>
                </>

              }

              <div style={{ width: "100%" }}>
                {showMore === "mentee" ? <button className="responsiveAllUserCardButton rounded" type="button" onClick={() => setShowMore("")} style={{ background: "blue", padding: "0 1vw", margin: "1vh 1vw", color: "white" }}>Hide Mentees</button> : ""}
              </div>



            </> : ""}


            {/* Toggle buttons only if there are more than 5 questions */}
            {questions?.length > 5 && !showAllQuestions && (
              <button
                type="button"
                style={{
                  marginTop: "1vh",
                  background: "green",
                  width: "100%",
                  color: "white",
                }}
                onClick={() => setShowAllQuestions(true)}
              >
                Show more question responses
              </button>
            )}
            {questions?.length > 5 && showAllQuestions && (
              <button
                type="button"
                style={{
                  marginTop: "1vh",
                  background: "red",
                  width: "100%",
                }}
                onClick={() => setShowAllQuestions(false)}
              >
                Show fewer question responses </button>
            )}



            {showMore === "directMsg" && (
              <>
                {directMsgsToShow?.map(msg => (
                  <div key={msg?._id} style={{ width: "100%" }}>
                    <UserDirectMsg user={user} admin={admin} msg={msg} />
                  </div>
                ))}
                {/* Toggle buttons only if there are more than 5 direct messages */}
                {directMsgs?.length > 5 && !showAllDirectMsg && (
                  <button
                    type="button"
                    style={{ marginTop: "1vh", background: "green", width: "100%", color: "white" }}
                    onClick={() => setShowAllDirectMsg(true)}
                  >
                    Show more direct messages
                  </button>
                )}
                {directMsgs?.length > 5 && showAllDirectMsg && (
                  <button type="button" style={{ marginTop: "1vh", background: "red", width: "100%" }} onClick={() => setShowAllDirectMsg(false)} > Show fewer direct messages </button>
                )}
              </>
            )}


            {showMore === "news" && (
              <>
                {newsToShow?.map(item => (
                  <div key={item?._id} style={{ width: "100%" }}>
                    <UserNews news={item} admin={admin} user={user} setTrigger={setTrigger} />
                  </div>
                ))}

                {newsList?.length > 5 && !showAllNews && (
                  <button
                    type="button"
                    style={{ marginTop: "1vh", background: "green", width: "100%", color: "white" }} onClick={() => setShowAllNews(true)}>Show more news</button>
                )}

                {newsList?.length > 5 && showAllNews && (
                  <button type="button" style={{ marginTop: "1vh", background: "red", width: "100%" }} onClick={() => setShowAllNews(false)} > Show fewer news items </button>
                )}
              </>
            )}

            {showMore === "post" && (
              <>
                {postsToShow?.map(item => (
                  <div key={item?._id} style={{ width: "100%" }}>
                    <UserPost admin={admin} user={user} post={item} />
                  </div>
                ))}

                {postList?.length > 5 && !showAllPosts && (
                  <button type="button" style={{ marginTop: "1vh", background: "green", width: "100%", color: "white" }} onClick={() => setShowAllPosts(true)} > Show more posts</button>
                )}

                {postList?.length > 5 && showAllPosts && (
                  <button type="button" style={{ marginTop: "1vh", background: "red", width: "100%" }} onClick={() => setShowAllPosts(false)} > Show fewer posts </button>
                )}
              </>
            )}


            {showMore === "teaching" ?
              <> {user?.programsTeaching.filter(teach => teach).reverse().map(teach => {
                return (
                  <UserTeaching admin={admin} user={user} setTrigger={setTrigger} teach={teach} setChangeContent={setChangeContent} />
                )
              })}
              </>
              : <></>}


            {showMore === "story" ?
              <>
                {successToShow?.map((suc) => (
                  <div key={suc._id} style={{ width: "100%" }}>
                    <UserSuccessStories suc={suc} admin={admin} user={user} setTrigger={setTrigger} />
                  </div>
                ))}
                {authored?.length > 5 && !showAllSuccess && (
                  <button type="button" style={{ marginTop: "1vh", background: "green", width: "100%", color: "white" }} onClick={() => setShowAllSuccess(true)} > Show more Stories </button>
                )}
                {authored?.length > 5 && showAllSuccess && (
                  <button type="button" style={{ marginTop: "1vh", background: "red", width: "100%" }} onClick={() => setShowAllSuccess(false)} > Show fewer Stories </button>
                )}
              </>
              : <></>}


            {showMore === "event" ? (
              <>
                {eventsToShow?.map(event => (
                  <UserEvents key={event._id} event={event} admin={admin} user={user} setTrigger={setTrigger} />
                ))}
                {eventList?.length > 5 && !showAllEvents && (
                  <button type="button" style={{ marginTop: "1vh", background: "green", width: "100%", color: "white" }} onClick={() => setShowAllEvents(true)} > Show more Events </button>
                )}

                {eventList?.length > 5 && showAllEvents && (
                  <button type="button" style={{ marginTop: "1vh", background: "red", width: "100%" }} onClick={() => setShowAllEvents(false)} > Show fewer Events </button>
                )}
              </>
            ) : (
              <></>
            )}

          </div>
        </> : ""}

        <div style={{ display: "flex", justifyContent: "space-between" }} className='responsiveAllUserCardButtons'>

          <div style={{ display: "flex" }} className='responsiveAllUserCardButtons'>
            {user?._id === adminId || admin?.NFadmin || admin?.creator ? <div>
              <button className="responsiveAllUserCardButton2 rounded" type="button" onClick={() => handleOpenUpdate(user)} style={{ background: "lightBlue", padding: "0 1vw", margin: "1vh 1vw" }}>Update This User</button>
            </div> : ""}
            {user?._id === adminId ? <div>
              {changePassword ? <button className="responsiveAllUserCardButton2 rounded" type="button" style={{ background: "red", padding: "0 1vw", margin: "1vh 0" }} onClick={() => setChangePassword(false)}>Cancel Change Password</button> : <button className="responsiveAllUserCardButton2 rounded" type="button" style={{ background: "green", padding: "0 1vw", margin: "1vh 0" }} onClick={() => setChangePassword(true)}>Change Your Password</button>}
            </div> : ""}
          </div>

          {admin?.creator || admin?.webBoss ?
            <button className="responsiveAllUserCardButton2 rounded" type="button" onClick={handleTripleClick} style={{ background: "red", padding: "0 1vw", margin: "1vh 1vw" }} > Delete User</button> : ""}

        </div>

        {changePassword ?
          <UserChangePassword admin={admin} user={user} setTrigger={setTrigger} setChangePassword={setChangePassword} />
          : ""}

      </div>
    </div>

  )
}

export default UserCard
