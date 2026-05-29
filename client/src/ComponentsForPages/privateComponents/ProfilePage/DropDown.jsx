import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const DropDown = ({ openMenu, setOpenMenu, showMailIcon, changeContent, setChangeContent, allPost, allJobListings, AllInterviews, allDirectMsg, allDrawings, allEvents, allPrograms, allLocations, allNewsLetters, allSubscriptions, allQuest, allReplys, allStories, allSupporters, trigger, setTrigger, allUsers, adminAllUsers, allMentee, allLogs, forgotPasswords }) => {

    const user = useSelector(state => state.auth.user)

    const [adminAlert, setAdminAlert] = useState("birthday");
    const [showInterviewBadge, setShowInterviewBadge] = useState(false);

    useEffect(() => {
        const hasBirthday = hasBirthdayToday(adminAllUsers) || hasBirthdayToday(allMentee);
        const missingMentor = allMentee?.some(m => !m?.mentorAttached?.some(a => a?.active === true));
        if (hasBirthday && missingMentor) {
            const interval = setInterval(() => {
                setAdminAlert(prev => prev === "birthday" ? "mentor" : "birthday");
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [adminAllUsers, allMentee]);

    const Navigate = useNavigate()

    const navigateMsg = () => {
        setChangeContent("")
        Navigate(`/messagePage/${user?._id}`)
    }

    const isBirthdayToday = (dateOfBirthString) => {
        if (!dateOfBirthString) return false;
        const today = moment();
        const dob = moment(dateOfBirthString, "YYYY-MM-DD");
        return today.month() === dob.month() && today.date() === dob.date();
    };

    // helper to check all users
    const hasBirthdayToday = (users) => {
        if (!Array.isArray(users)) return false;
        return users?.some((u) => isBirthdayToday(u.dateOfBirth));
    };

    const myDirectMsgs = allDirectMsg?.filter(msg =>
        msg.userId?.some(id => id.toString() === user?._id?.toString())
    );
    // 2. For each of *my* messages, flag if I have responded
    const flags = myDirectMsgs?.map(msg =>
        msg.response?.some(resp =>
            resp.userId?.some(id => id.toString() === user?._id?.toString())
        ) || false
    );
    // 3. Among *my* messages, does any one have NO response from me?
    const hasAnyUnansweredForMe = flags?.some(flag => flag === false);

    useEffect(() => {
        const hasTodayInterview = allJobListings
            ?.filter(job => user?._id === job?.userId?._id)
            .some(job =>
                job?.applicationsAttached?.some(app =>
                    app?.interviews?.some(interview => {
                        const interviewDate = new Date(interview?.scheduledAt);
                        const today = new Date();
                        return interviewDate.toDateString() === today.toDateString();
                    })
                )
            );
        if (!hasTodayInterview) {
            setShowInterviewBadge(false);
            return;
        }
        setShowInterviewBadge(false);
        const interval = setInterval(() => {
            setShowInterviewBadge(prev => !prev);
        }, 2500);
        return () => clearInterval(interval);
    }, [allJobListings, user]);

    // console.log(allEvents)

    const [showRelease, setShowRelease] = useState(true);

    const today = new Date()
    const oneWeekFromNow = new Date()
    oneWeekFromNow.setDate(today.getDate() + 3)

    const releaseSoonMentees = allMentee?.filter((mentee) => {
        if (!mentee.projectedReleaseDate) return false

        const releaseDate = new Date(mentee.projectedReleaseDate)

        return releaseDate >= today && releaseDate <= oneWeekFromNow
    }) || []

    const hasRelease = releaseSoonMentees.length > 0;
    const hasPassword = forgotPasswords?.some(fp => fp.messageStatus === "send-email");

    useEffect(() => {
        if (hasRelease && hasPassword) {
          const interval = setInterval(() => {
            setShowRelease(prev => !prev);
          }, 2000);
      
          return () => clearInterval(interval);
        }
      
        if (hasRelease) setShowRelease(true);
        if (hasPassword && !hasRelease) setShowRelease(false);
      }, [hasRelease, hasPassword]);
      

    return (

        <div >


            <div
                style={{ background: "whiteSmoke", width: "100vw", height: "5vh", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 5vw" }} className="responsiveSelect" >

                {/* Messages Dropdown */}
                <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw" }} className='rounded responsiveDiv'>
                    {
                        showMailIcon
                            ||
                            (user?.NFadmin || user?.creator) && allPost?.filter(post => post?.areaOfPost === "AdminToAdmin" && !post?.seen?.some(s => String(s.userId) === String(user?._id) && s.seen === true)).length > 0
                            ||
                            allPost?.filter(post => post?.areaOfPost === "ToAllStaff" && !post?.seen?.some(s => String(s.userId) === String(user?._id) && s.seen === true)).length > 0
                            ||
                            (user?.teacher) && allPost?.filter(post => post?.areaOfPost === "ToAllTeachers" && !post?.seen?.some(s => String(s.userId) === String(user?._id) && s.seen === true)).length > 0
                            ||
                            (user?.mentor) && allPost?.filter(post => post?.areaOfPost === "ToAllMentors" && !post?.seen?.some(s => String(s.userId) === String(user?._id) && s.seen === true)).length > 0
                            ||
                            (allPost?.some(post => post?.recipients?.includes(user?.accountNameNormalized) && !post?.seen?.some(s => String(s.userId) === String(user?._id) && s.seen === true))) && allPost?.filter(post => (post?.recipients?.includes(user?.accountNameNormalized) && !post?.seen?.some(s => String(s.userId) === String(user?._id) && s.seen === true))).length > 0
                            ||
                            allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response?.some((r) => r && r.questionType); const responseCount = Array.isArray(quest.response) ? quest.response.length : 0; return notCompleted && !hasQuestionTypeInResponse && responseCount <= 1; }).length > 0
                            ||
                            (user?.NFadmin || user?.creator) && allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response?.some((r) => r && typeof r.questionType === "string" && r.questionType.trim() === "Msg-To-Admin"); const responseCount = Array.isArray(quest.response) ? quest.response.length : 0; return notCompleted && hasQuestionTypeInResponse && responseCount <= 1; }).length > 0
                            ||
                            (user?.mentor) && allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response?.some((r) => r && typeof r.questionType === "string" && r.questionType.trim() === "Msg-To-Mentor"); const responseCount = Array.isArray(quest.response) ? quest.response.length : 0; return notCompleted && hasQuestionTypeInResponse && responseCount <= 1; }).length > 0
                            ||
                            (user?.teacher) && allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response?.some((r) => r && typeof r.questionType === "string" && r.questionType.trim() === "Msg-To-Teacher"); const responseCount = Array.isArray(quest.response) ? quest.response.length : 0; return notCompleted && hasQuestionTypeInResponse && responseCount <= 1; }).length > 0
                            ||
                            (user?.websiteSupportTeam) && allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response?.some((r) => r && typeof r.questionType === "string" && r.questionType.trim() === "Website-Support"); const responseCount = Array.isArray(quest.response) ? quest.response.length : 0; return notCompleted && hasQuestionTypeInResponse && responseCount <= 1; }).length > 0
                            ||
                            (user?.newsLetter) && allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response?.some((r) => r && typeof r.questionType === "string" && (r.questionType.trim() === "Subscription-Issues" || r.questionType.trim() === "Success-Story")); const responseCount = Array.isArray(quest.response) ? quest.response.length : 0; return notCompleted && hasQuestionTypeInResponse && responseCount <= 1; }).length > 0
                            ||
                            (user?.eventStaff) && allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response?.some((r) => r && typeof r.questionType === "string" && r.questionType.trim() === "Event-Staff"); const responseCount = Array.isArray(quest.response) ? quest.response.length : 0; return notCompleted && hasQuestionTypeInResponse && responseCount <= 1; }).length > 0
                            ||
                            hasAnyUnansweredForMe


                            ? <button className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "Messages" ? null : "Messages")}>Messages <span className='lookAtMe' style={{ fontSize: "small" }}>📬 New</span></button> :
                            <button className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "Messages" ? null : "Messages")}>Messages</button>}
                    {openMenu === "Messages" && (

                        <div className="dropdownPanel" style={{ background: "white", border: "2px solid black" }}
                            onMouseLeave={() => setOpenMenu("")}>

                            {showMailIcon ? <button className='rounded lookAtMe' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={navigateMsg}>Private Msg's </button> : <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={navigateMsg} >Private Msg's</button>}


                            <section>

                                {(user?.NFadmin || user?.creator) && allPost?.filter(post => post?.areaOfPost === "AdminToAdmin").length !== 0 ?
                                    <>
                                        {(user?.NFadmin || user?.creator) && allPost?.filter(post => post?.areaOfPost === "AdminToAdmin" && !post?.seen?.some(s => String(s.userId) === String(user?._id) && s.seen === true)).length > 0 ? (
                                            <button className="rounded lookAtMe" style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("adminToAdmin")} > Admin To Admin Msg 📬 </button>)
                                            : (
                                                <button className="rounded" style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("adminToAdmin")} > Admin To Admin Msg </button>)}
                                    </>
                                    : ""}

                                <>{allPost?.filter(post => post?.areaOfPost === "ToAllStaff").length !== 0 ?
                                    <>
                                        {allPost?.filter(post => post?.areaOfPost === "ToAllStaff" && !post?.seen?.some(s => String(s.userId) === String(user?._id) && s.seen === true)).length > 0 ?
                                            <button className='rounded lookAtMe' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("adminToStaff")}>
                                                Admin To Staff Msg 📬</button>
                                            :
                                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("adminToStaff")}>
                                                Admin To Staff Msg</button>}
                                    </>
                                    : ""}
                                </>

                                {(user?.NFadmin || user?.creator || user?.teacher) && allPost?.filter(post => post?.areaOfPost === "ToAllTeachers").length !== 0 ?
                                    <>
                                        {allPost?.filter(post => post?.areaOfPost === "ToAllTeachers" && !post?.seen?.some(s => String(s.userId) === String(user?._id) && s.seen === true)).length > 0 ?
                                            <button className='rounded lookAtMe' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("teacherMsg")}>Msg To Teachers 📬</button>
                                            :
                                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("teacherMsg")}>Msg To Teachers</button>
                                        }
                                    </> : ""}

                                {(user?.NFadmin || user?.creator || user?.mentor) && allPost?.filter(post => post?.areaOfPost === "ToAllMentors").length !== 0 ?
                                    <>
                                        {allPost?.filter(post => post?.areaOfPost === "ToAllMentors" && !post?.seen?.some(s => String(s.userId) === String(user?._id) && s.seen === true)).length > 0 ?
                                            <button className='rounded lookAtMe' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("mentorMsg")}>Msg To Mentors 📬</button>
                                            :
                                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("mentorMsg")}>Msg To Mentors</button>
                                        }
                                    </>
                                    : ""}

                                {(user?.NFadmin || user?.creator || allPost?.some(post => post?.recipients?.includes(user?.accountName?.toLowerCase().trim().replace(/\s+/g, "")))) ?
                                    <>
                                        {(allPost?.some(post => post?.recipients?.includes(user?.accountNameNormalized) && !post?.seen?.some(s => String(s.userId) === String(user?._id) && s.seen === true))) && allPost?.filter(post => (post?.recipients?.includes(user?.accountNameNormalized) && !post?.seen?.some(s => String(s.userId) === String(user?._id) && s.seen === true))).length > 0 ?
                                            <button className='rounded lookAtMe' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("groupMsg")}>Msg To Group 📬</button>
                                            :
                                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("groupMsg")}>Msg To Group</button>
                                        }
                                    </>
                                    : ""}

                                {hasAnyUnansweredForMe ? (
                                    <button
                                        className="rounded lookAtMe"
                                        style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}
                                        onClick={() => setChangeContent("directMsg")}
                                    >
                                        Direct Msg From Guest 📬
                                    </button>
                                ) : (
                                    <button
                                        className="rounded"
                                        style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}
                                        onClick={() => setChangeContent("directMsg")}
                                    >
                                        Direct Msg From Guest
                                    </button>
                                )}

                                {allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response?.some((r) => r && r.questionType); const responseCount = Array.isArray(quest.response) ? quest.response.length : 0; return notCompleted && !hasQuestionTypeInResponse && responseCount <= 1; }).length > 0 ? <button className='rounded lookAtMe' style={{ background: "lightBlue", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("customerMsg")}>Guest Msg To All Staff 📬</button> : <button className='rounded' style={{ background: "lightBlue", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("customerMsg")}>Guest Msg To All Staff</button>}

                                {user?.NFadmin || user?.creator ? <>{allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response?.some((r) => r && typeof r.questionType === "string" && r.questionType.trim() === "Msg-To-Admin"); const responseCount = Array.isArray(quest.response) ? quest.response.length : 0; return notCompleted && hasQuestionTypeInResponse && responseCount <= 1; }).length > 0 ? <button className='rounded lookAtMe' style={{ background: "lightBlue", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("customerMsgAdmin")}>Guest Msg To Admin 📬</button> : <button className='rounded' style={{ background: "lightBlue", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("customerMsgAdmin")}>Guest Msg To Admin</button>}</> : ""}

                                {user?.mentor || user?.NFadmin || user?.creator ? <>{allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response?.some((r) => r && typeof r.questionType === "string" && r.questionType.trim() === "Msg-To-Mentor"); const responseCount = Array.isArray(quest.response) ? quest.response.length : 0; return notCompleted && hasQuestionTypeInResponse && responseCount <= 1; }).length > 0 ? <button className='rounded lookAtMe' style={{ background: "lightBlue", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("customerMsgMentors")}>Guest Msg To Mentors 📬</button> : <button className='rounded' style={{ background: "lightBlue", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("customerMsgMentors")}>Guest Msg To Mentors</button>}</> : ""}

                                {user?.teacher || user?.NFadmin || user?.creator ? <>{allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response?.some((r) => r && typeof r.questionType === "string" && r.questionType.trim() === "Msg-To-Teacher"); const responseCount = Array.isArray(quest.response) ? quest.response.length : 0; return notCompleted && hasQuestionTypeInResponse && responseCount <= 1; }).length > 0 ? <button className='rounded lookAtMe' style={{ background: "lightBlue", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("customerMsgTeachers")}>Guest Msg To Teachers 📬</button> : <button className='rounded' style={{ background: "lightBlue", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("customerMsgTeachers")}>Guest Msg To Teachers</button>}</> : ""}

                                {user?.websiteSupportTeam || user?.NFadmin || user?.creator ? <>{allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response?.some((r) => r && typeof r.questionType === "string" && r.questionType.trim() === "Website-Support"); const responseCount = Array.isArray(quest.response) ? quest.response.length : 0; return notCompleted && hasQuestionTypeInResponse && responseCount <= 1; }).length > 0 ? <button className='rounded lookAtMe' style={{ background: "lightBlue", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("customerMsgWebSupport")}>Guest Msg To Web Support 📬</button> : <button className='rounded' style={{ background: "lightBlue", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("customerMsgWebSupport")}>Guest Msg To Web Support</button>}</> : ""}

                                {user?.newsLetter || user?.NFadmin || user?.creator ? <>{allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response?.some((r) => r && typeof r.questionType === "string" && (r.questionType.trim() === "Subscription-Issues" || r.questionType.trim() === "Success-Story")); const responseCount = Array.isArray(quest.response) ? quest.response.length : 0; return notCompleted && hasQuestionTypeInResponse && responseCount <= 1; }).length > 0 ? <button className='rounded lookAtMe' style={{ background: "lightBlue", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("Success-Story")}>Guest To Newsletter & Success Stories Staff 📬</button> : <button className='rounded' style={{ background: "lightBlue", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("Success-Story")}>Guest To Newsletter & Success Stories Staff</button>}</> : ""}

                                {user?.eventStaff || user?.NFadmin || user?.creator ? <>{allQuest?.filter((quest) => { const notCompleted = quest?.questionStatus && quest.questionStatus.trim().toLowerCase() !== "completed"; const hasQuestionTypeInResponse = Array.isArray(quest.response) && quest.response?.some((r) => r && typeof r.questionType === "string" && r.questionType.trim() === "Event-Staff"); const responseCount = Array.isArray(quest.response) ? quest.response.length : 0; return notCompleted && hasQuestionTypeInResponse && responseCount <= 1; }).length > 0 ? <button className='rounded lookAtMe' style={{ background: "lightBlue", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("eventStaff")}>Guest Msg To Event Staff 📬</button> : <button className='rounded' style={{ background: "lightBlue", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("eventStaff")}>Guest Msg To Event Staff</button>}</> : ""}

                                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("createAMsg")}>Create A Msg</button>

                                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("createAGroupMsg")}>Create A Group Msg</button>
                            </section>
                        </div>


                    )}
                </div>


                {user?.creator ?

                    <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw" }} className='rounded responsiveDiv'>

                        {(hasBirthdayToday(adminAllUsers) || hasBirthdayToday(allMentee) || allMentee?.some(m => !m?.mentorAttached?.some(a => a?.active === true)) || ((user?.NFadmin || user?.creator || user?.eventStaff || allEvents?.events?.some(ev => ev?.createdBy === user?._id)) && allEvents?.events?.some(ev => ev?.attendees?.some(att => att?.statusOnAttendence === "requested")))) ? <button className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "admin" ? null : "admin")}>Admin Page's {((hasBirthdayToday(adminAllUsers) || hasBirthdayToday(allMentee)) && allMentee?.some(m => !m?.mentorAttached?.some(a => a?.active === true))) ? (adminAlert === "birthday" ? <span className='lookAtMe' style={{ fontSize: "small" }}>Birthday</span> : <span className='lookAtMe' style={{ fontSize: "small" }}>Mentor?</span>) : (hasBirthdayToday(adminAllUsers) || hasBirthdayToday(allMentee)) ? <span className='lookAtMe' style={{ fontSize: "small" }}>Birthday</span> : (allMentee?.some(m => !m?.mentorAttached?.some(a => a?.active === true))) ? <span className='lookAtMe' style={{ fontSize: "small" }}>Mentor?</span> : ((user?.NFadmin || user?.creator || user?.eventStaff || allEvents?.events?.some(ev => ev?.createdBy === user?._id)) && allEvents?.events?.some(ev => ev?.attendees?.some(att => att?.statusOnAttendence === "requested"))) ? <span className='lookAtMe' style={{ fontSize: "small" }}>Request</span> : ""}</button> : <button className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "admin" ? null : "admin")}>Admin Page's</button>}

                        {openMenu === "admin" && (

                            <div className="dropdownPanel" style={{ background: "white", border: "2px solid black" }} onMouseLeave={() => setOpenMenu("")} >

                               <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("pagesController")}>Page Controllers</button>

                                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("regEmail")}>Add Register Email</button>

                                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("notAllowedEmail")}>Add A Blocked Email</button>

                                {(hasBirthdayToday(adminAllUsers) || ((user?.NFadmin || user?.creator || user?.eventStaff || allEvents?.events?.some(ev => ev?.createdBy?.toString() === user?._id)) && allEvents?.events?.some(ev => ev?.attendees?.some(att => att?.statusOnAttendence === "requested")))) ? <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("adminUsers")}>Admin All Users <span className='lookAtMe' style={{ fontSize: "small" }}>{hasBirthdayToday(adminAllUsers) ? "Birthday" : "Request"}</span></button> : <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("adminUsers")}>Admin All Users</button>}

                                {allMentee?.some(m => !m?.mentorAttached?.some(a => a?.active === true)) ? <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("adminMentee")}>Admin All Mentee's {hasBirthdayToday(allMentee) ? <span className='lookAtMe' style={{ fontSize: "small" }}>Birthday</span> : ""} <span className='lookAtMe' style={{ fontSize: "small" }}>Mentor?</span></button> : <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("adminMentee")}>Admin All Mentee's {hasBirthdayToday(allMentee) ? <span className='lookAtMe' style={{ fontSize: "small" }}>Birthday</span> : ""}</button>}

                            </div>

                        )}
                    </div>
                    : ""}

                {/* Creation Dropdown */}
                <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw" }} className='rounded responsiveDiv'>

                { user?.creator || user?.NFadmin || user?.mentor || user?.teacher || user?.eventStaff || user?.newsLetter || user?.websiteSupportTeam ? <button className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "create" ? null : "create")} >Creation Controllers</button> : ""}


                    {openMenu === "create" && (

                        <div className="dropdownPanel" style={{ background: "white", border: "2px solid black" }} onMouseLeave={() => setOpenMenu("")} >

                            {user?.creator || user?.NFadmin || user?.mentor ? <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("createMentee")}>Create Mentee Form</button> : ""}

                            {user?.creator || user?.NFadmin || user?.teacher ? <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("createPro")}>Create Program Form</button> : ""}

                            {user?.creator || user?.NFadmin ? <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("createLoc")}>Create New Location Form</button> : ""}

                            {user?.creator || user?.NFadmin || user?.eventStaff ? <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("createEvent")}>Create New Event</button> : ""}

                            {user?.creator || user?.NFadmin || user?.newsLetter ? <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("createNews")}>Create News Letter</button> : ""}

                            {user?.creator || user?.NFadmin || user?.newsLetter ? <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("createSuccess")}>Create Success Story</button> : ""}

                            {user?.creator || user?.NFadmin || user?.websiteSupportTeam ? <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("createSupport")}>Create Support Partner</button> : ""}

                            {user?.creator || user?.NFadmin ? <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("addDrawing")}>Create Drawing</button> : ""}

                            {user?.creator || user?.NFadmin || user?.websiteSupportTeam || user?.staffCustomerService ? <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("addQA")}>Create QA</button> : ""}

                        </div>

                    )}

                </div>

                {/* Explore Dropdown */}
                <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw", }} className="rounded responsiveDiv" >

                    {(hasBirthdayToday(adminAllUsers) || hasBirthdayToday(allMentee) || allMentee?.some(m => !m?.mentorAttached?.some(a => a?.active === true))) ? (<button className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "explore" ? null : "explore")}>Explore <span className='lookAtMe' style={{ fontSize: "small" }}>{((hasBirthdayToday(adminAllUsers) || hasBirthdayToday(allMentee)) && allMentee?.some(m => !m?.mentorAttached?.some(a => a?.active === true))) ? (adminAlert === "birthday" ? "Birthday" : "Mentor?") : (hasBirthdayToday(adminAllUsers) || hasBirthdayToday(allMentee)) ? "Birthday" : "Mentor?"}</span></button>) : ((user?.NFadmin || user?.creator || user?.eventStaff || allEvents?.events?.some(ev => ev?.createdBy === user?._id)) && allEvents?.events?.some(ev => ev?.attendees?.some(att => att?.statusOnAttendence === "requested"))) ? (<button className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "explore" ? null : "explore")}>Explore <span className='lookAtMe' style={{ fontSize: "small" }}>Request</span></button>) : (<button className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "explore" ? null : "explore")}>Explore</button>)}

                    {openMenu === "explore" && (

                        <div className="dropdownPanel" style={{ background: "white", border: "2px solid black" }} onMouseLeave={() => setOpenMenu("")} >

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("allGrad")}>All Graduates</button>

                            {(hasBirthdayToday(adminAllUsers) || ((user?.NFadmin || user?.creator || user?.eventStaff || allEvents?.events?.some(ev => ev?.createdBy === user?._id)) && allEvents?.events?.some(ev => ev?.attendees?.some(att => att?.statusOnAttendence === "requested")))) ? <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("adminUsers")}>All Users <span className='lookAtMe' style={{ fontSize: "small" }}>{hasBirthdayToday(adminAllUsers) ? "Birthday" : "Request"}</span></button> : <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("adminUsers")}>All NF Staff</button>}

                            {allMentee?.some(m => !m?.mentorAttached?.some(a => a?.active === true)) ? <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("adminMentee")}>All Mentee's {hasBirthdayToday(allMentee) ? <span className='lookAtMe' style={{ fontSize: "small" }}>Birthday</span> : ""} <span className='lookAtMe' style={{ fontSize: "small" }}>Mentor?</span></button> : <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("adminMentee")}>All Mentee's {hasBirthdayToday(allMentee) ? <span className='lookAtMe' style={{ fontSize: "small" }}>Birthday</span> : ""}</button>}


                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("allPro")}>All Programs</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("allLoc")}>All Locations</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("allEvent")}>All Events</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("allNews")}>All News Letters</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("allDraw")}>All Drawings</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("allSuccess")}>All Success Stories</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("allSupporters")}>All Supporters</button>

                        </div>

                    )}

                </div>

                {user?.creator || user?.NFadmin || user?.hiring ? <>

                    <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw" }} className="rounded responsiveDiv" >

                        <button className="responsiveButton" onClick={() => setOpenMenu(openMenu === "job" ? null : "job")}>Job's {allJobListings?.filter(job => user?._id === job?.userId?._id).some(job => job?.applicationsAttached?.some(app => app?.seenByAuthor === false)) ? <span className="lookAtMe" style={{ fontSize: "small" }}>{showInterviewBadge ? "Interview Today" : "New App"}</span> : null}</button>


                        {openMenu === "job" && (

                            <div className="dropdownPanel dropdownPanel--alignRight" style={{ background: "white", border: "2px solid black" }}
                                onMouseLeave={() => setOpenMenu("")} >

                                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("createJobList")}>Create Job Listing</button>

                                <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("allJobList")}>All Job Listings {allJobListings?.filter(job => user?._id === job?.userId?._id).some(job => job?.applicationsAttached?.some(app => app?.seenByAuthor === false)) ? <span className="lookAtMe" style={{ fontSize: "small" }}>New</span> : null}
                                </button>

                            </div>

                        )}

                    </div>

                </> : ""}


                {/* Reports */}
                {user?.creator || user?.NFadmin || user?.staffCustomerService || user?.websiteSupportTeam || user?.mentor ?
                    <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw" }} className="rounded responsiveDiv">

                        <button className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "reports" ? null : "reports")} style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%", gap: "0.5rem" }}>Reports {hasRelease || hasPassword ? <span className="lookAtMe" style={{ fontSize: "small" }}>{hasRelease && hasPassword ? (showRelease ? "Release" : "Password") : hasRelease ? "Release" : "Password"}</span> : null}</button>


                        {openMenu === "reports" && (
                            <div className="dropdownPanel" style={{ position: "absolute", right: 0, left: "auto", top: "100%", background: "white", border: "2px solid black" }} onMouseLeave={() => setOpenMenu("")}>

                                {user?.creator || user?.NFadmin ? <button className="rounded" style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("auditLog")}>Audit Log Reports</button> : ""}

                                <button className="rounded" style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} onClick={() => setChangeContent("completedRes")}>Completed Responses</button>

                                {user?.creator || user?.NFadmin || user?.staffCustomerService || user?.websiteSupportTeam || user?.mentor ? <button className="rounded" style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black", display: "flex", justifyContent: "center" }} onClick={() => setChangeContent("release")}>{releaseSoonMentees.length > 0 ? <span className='lookAtMe' style={{ fontSize: "small" }}>Mentee Releasing</span> : "Mentee Releasing "}</button> : ""}

                                {user?.creator || user?.NFadmin || user?.websiteSupportTeam || user?.staffCustomerService ? <button className="rounded" style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black", display: "flex", justifyContent: "center" }} onClick={() => setChangeContent("forgot")}> {hasPassword ?  <span className="lookAtMe" style={{ fontSize: "small" }}>Forgot Password</span> : "Forgot Password"}</button> : null}

                            </div>
                        )}

                    </div> : ""}

            </div>



        </div>
    )
}

export default DropDown
