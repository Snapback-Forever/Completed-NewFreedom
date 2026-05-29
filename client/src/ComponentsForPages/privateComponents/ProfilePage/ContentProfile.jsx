import React from 'react'

import AdminToAdmin from './msg\'s DropDown/AdminToAdmin'
import AdminToStaff from './msg\'s DropDown/AdminToStaff'
import DirectMsg from './msg\'s DropDown/DirectMsg'
import TeacherMsg from './msg\'s DropDown/TeacherMsg'
import MentorMsg from './msg\'s DropDown/MentorMsg'
import GroupMsg from './msg\'s DropDown/GroupMsg'
import CustomerMsg from './msg\'s DropDown/CustomerMsg'
import CreateMsg from './msg\'s DropDown/CreateMsg'
import CustomerMsgAdmin from './msg\'s DropDown/CustomerMsgAdmin'
import CustomerWebSupport from './msg\'s DropDown/CustomerWebSupport'
import GuestMsgMentors from './msg\'s DropDown/GuestMsgMentors'
import GuestMsgTeachers from './msg\'s DropDown/GuestMsgTeachers'
import CustomerMsgEventStaff from './msg\'s DropDown/CustomerMsgEventStaff'
import CustomerSuccessNews from './msg\'s DropDown/CustomerSuccessNews'
import CompletedResponses from './CompletedResponses'
import CreateGroupMsg from './msg\'s DropDown/CreateGroupMsg'
import LandingPagesForm from './AdminDropDown/PageController/LandingPagesForm'
import AddRegistrationEmail from './AdminDropDown/Registration/AddRegistrationEmail'
import AddNotAllowedEmail from './AdminDropDown/Registration/AddNotAllowedEmail'
import AllUsers from './AdminDropDown/AdminAllUsers/AllUsers'
import AdminAllMentee from './AdminDropDown/AdminAllUsers/AdminAllMentee'
import CreateMenteeUser from './CreateDropDown/CreateMenteeUser'
import CreateProgram from './CreateDropDown/CreateProgram'
import CreateLocation from './CreateDropDown/CreateLoaction'
import CreateNewEvent from './CreateDropDown/CreateNewEvent'
import CreateNewsLetter from './CreateDropDown/CreateNewsLetter'
import CreateSuccessStory from './CreateDropDown/CreateSuccessStory'
import CreateSupport from './CreateDropDown/CreateSupport'
import AddSocialSupporter from './CreateDropDown/AddSocialSupporter'
import AllGraduates from './ExploreDropDown/AllGraduates'
import AllProgram from './ExploreDropDown/AllProgram'
import AllLocation from './ExploreDropDown/AllLocation'
import AllEvents from './ExploreDropDown/AllEvents'
import AllNewsLetters from './ExploreDropDown/AllNewsLetters'
import AllDraw from './ExploreDropDown/AllDraw'
import AddDrawing from './CreateDropDown/AddDrawing'
import AllSuccess from './ExploreDropDown/AllSuccess'
import AllSupporter from './ExploreDropDown/AllSupporter'
import AuditLogReports from './ReportsDropDown/AuditLogReports'
import CreateJobList from './JobDropDown/CreateJobList'
import AllJobList from './JobDropDown/AllJobList'
import ReleasesSoon from './Reports DropDown/ReleasesSoon'
import AddQA from './CreateDropDown/AddQA'
import ForgotPassword from './Reports DropDown/ForgotPassword'

const ContentProfile = ({ darkMode, setDarkMode, openMenu, setOpenMenu, landingContent, allJobListings, AllInterviews, allPost, allDirectMsg, allDrawings, allEvents, allPrograms, allLocations, allNewsLetters, allSubscriptions, allQuest, allReplys, allStories, allSupporters, changeContent, setChangeContent, trigger, setTrigger, allUsers, adminAllUsers, allMentee, allGraduates, allLogs, forgotPasswords }) => {


  return (

    <div>

      {/* msg's dropdown */}
      {/* ✅ */}
      {changeContent === "adminToAdmin" ?
        <AdminToAdmin allPost={allPost} darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} />
        : ""}
      {/* ✅ */}
      {changeContent === "" || changeContent === "adminToStaff" ? <AdminToStaff allPost={allPost} darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} /> : ""}

      {/* ✅ */}
      {changeContent === "teacherMsg" ? <TeacherMsg allPost={allPost} darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} /> : ""}

      {/* ✅ */}
      {changeContent === "mentorMsg" ? <MentorMsg allPost={allPost} darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} /> : ""}

      {/* ✅ */}
      {changeContent === "groupMsg" ? <GroupMsg allPost={allPost} darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allUsers={allUsers} /> : ""}

      {/* ✅ */}
      {changeContent === "directMsg" ? <DirectMsg darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allDirectMsg={allDirectMsg} allUsers={allUsers} /> : ""}

      {/* ✅ */}
      {changeContent === "customerMsg" ? <CustomerMsg darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allQuest={allQuest} allUsers={allUsers} /> : ""}

      {/* ✅ */}
      {changeContent === "customerMsgAdmin" ? <CustomerMsgAdmin darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allQuest={allQuest} allUsers={allUsers} /> : ""}

      {/* ✅ */}
      {changeContent === "customerMsgMentors" ? <GuestMsgMentors darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allQuest={allQuest} allUsers={allUsers} /> : ""}

      {/* ✅ */}
      {changeContent === "customerMsgTeachers" ? <GuestMsgTeachers darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allQuest={allQuest} allUsers={allUsers} /> : ""}

      {/* ✅ */}
      {changeContent === "customerMsgWebSupport" ? <CustomerWebSupport darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allQuest={allQuest} allUsers={allUsers} /> : ""}

      {/* ✅ */}
      {changeContent === "Success-Story" ? <CustomerSuccessNews darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allQuest={allQuest} allUsers={allUsers} /> : ""}

      {/* ✅ */}
      {changeContent === "eventStaff" ? <CustomerMsgEventStaff darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allQuest={allQuest} allUsers={allUsers} /> : ""}

      {/* ✅ */}
      {changeContent === "createAMsg" ? <CreateMsg darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} setChangeContent={setChangeContent} /> : ""}

      {/* ✅ */}
      {changeContent === "createAGroupMsg" ? <CreateGroupMsg darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allUsers={allUsers} /> : ""}


      {/*  Admin Dropdown  */}
      {changeContent === "pagesController" ? <LandingPagesForm darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} /> : ""}

      {/* ✅ */}
      {changeContent === "regEmail" ? <AddRegistrationEmail darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} /> : ""}

      {/* ✅ */}
      {changeContent === "notAllowedEmail" ? <AddNotAllowedEmail darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} /> : ""}

      {/* ✅ */}
      {changeContent === "adminUsers" ? <AllUsers darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} adminAllUsers={adminAllUsers} allMentee={allMentee} allPrograms={allPrograms} setChangeContent={setChangeContent} /> : ""}

      {/* ✅ */}
      {changeContent === "adminMentee" ? <AdminAllMentee darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} adminAllUsers={adminAllUsers} allMentee={allMentee} allPrograms={allPrograms} setChangeContent={setChangeContent} allUsers={allUsers} /> : ""}



      {/* Creation Dropdown */}
      {/* ✅ */}
      {changeContent === "createMentee" ? <CreateMenteeUser setChangeContent={setChangeContent} /> : ""}

      {/* ✅ */}
      {changeContent === "createPro" ? <CreateProgram setChangeContent={setChangeContent} /> : ""}

      {/* ✅ */}
      {changeContent === "createLoc" ? <CreateLocation setChangeContent={setChangeContent} /> : ""}

      {/* ✅ */}
      {changeContent === "createEvent" ? <CreateNewEvent setChangeContent={setChangeContent} /> : ""}

      {/* ✅ */}
      {changeContent === "createNews" ? <CreateNewsLetter setChangeContent={setChangeContent} /> : ""}

      {/* ✅ */}
      {changeContent === "createSuccess" ? <CreateSuccessStory setChangeContent={setChangeContent} /> : ""}

      {/* ✅ */}
      {changeContent === "createSupport" ? <CreateSupport setChangeContent={setChangeContent} /> : ""}

      {/* ✅ */}
      {changeContent === "addSocial" ? <AddSocialSupporter setChangeContent={setChangeContent} setTrigger={setTrigger} /> : ""}

      {/* ✅ */}
      {changeContent === "addDrawing" ? <AddDrawing setChangeContent={setChangeContent} setTrigger={setTrigger} /> : ""}

      {/* ✅ */}
      {changeContent === "addQA" ? <AddQA setChangeContent={setChangeContent} setTrigger={setTrigger} /> : ""}


      {/* Explore Dropdown */}

      {/* ✅ */}
      {changeContent === "allGrad" ?
        <AllGraduates trigger={trigger} setTrigger={setTrigger} allGraduates={allGraduates} darkMode={darkMode} setDarkMode={setDarkMode} /> : ""}

      {/* ✅ */}
      {changeContent === "allPro" ?
        <AllProgram trigger={trigger} setTrigger={setTrigger} allPrograms={allPrograms} darkMode={darkMode} setDarkMode={setDarkMode} allLocations={allLocations} allUsers={allUsers} allMentee={allMentee} setChangeContent={setChangeContent} /> : ""}

      {/* ✅ */}
      {changeContent === "allLoc" ?
        <AllLocation darkMode={darkMode} setDarkMode={setDarkMode} allLocations={allLocations} trigger={trigger} setTrigger={setTrigger} setChangeContent={setChangeContent} allMentee={allMentee} allUsers={allUsers} allPrograms={allPrograms} allEvents={allEvents} /> : ""}

      {/* ✅ */}
      {changeContent === "allEvent" ? <AllEvents allEvents={allEvents} darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} setChangeContent={setChangeContent} allLocations={allLocations} /> : ""}

      {/* ✅ */}
      {changeContent === "allNews" ? <AllNewsLetters darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allNewsLetters={allNewsLetters} setChangeContent={setChangeContent} /> : ""}

      {/* ✅ */}
      {changeContent === "allDraw" ? <AllDraw darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allDrawings={allDrawings} /> : ""}

      {/* ✅ */}
      {changeContent === "allSuccess" ? <AllSuccess darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allStories={allStories} /> : ""}

      {/* ✅ */}
      {changeContent === "allSupporters" ? <AllSupporter darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allSupporters={allSupporters} /> : ""}


      {/* Reports */}
      {/* ✅ */}
      {changeContent === "auditLog" ? <AuditLogReports darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allLogs={allLogs} /> : ""}

      {/* ✅ */}
      {changeContent === "completedRes" ?
        <CompletedResponses darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allQuest={allQuest} allUsers={allUsers} />
        : ""}

      {/* ✅ */}
      {changeContent === "release" ? <ReleasesSoon darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allMentee={allMentee} /> : ""}


      {/* Job Listing's Dropdown */}

      {/* ✅ */}
      {changeContent === "createJobList" ? <CreateJobList darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} /> : ""}

      {/* ✅ */}
      {changeContent === "allJobList" ? <AllJobList darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allJobListings={allJobListings} /> : ""}

      {/* Forgot Password Reports */}

      {/* ✅ */}
      {changeContent === 'forgot' &&
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100vw", height: "82.5vh", overflowY: "scroll", padding: "1vh" }}>
          {forgotPasswords?.filter(msg => msg).length === 0 ? <h2 style={{ textAlign: "center", background: 'tan', width: "100%" }}>Currently No Forgot Password Reports</h2> : <>
            <h2 style={{ textAlign: "center", background: 'tan', width: "100%" }}>Forgot Password Reports</h2>
            {forgotPasswords?.filter(msg => msg).reverse().map(msg => {

              return (
                <div key={crypto.randomUUID()}>
                  <ForgotPassword msg={msg} setTrigger={setTrigger} />
                </div>
              )
            })}</>} 
        </div>
      }


    </div>

  )
}

export default ContentProfile
