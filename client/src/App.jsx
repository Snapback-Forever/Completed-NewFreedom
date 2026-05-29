
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast"

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUpdateLanding } from './redux/reducers/adminReducers';
import { getAllStories } from './redux/reducers/successStoriesReducer';
import { getAllNewsLetters, getAllSubscriptions } from './redux/reducers/newsLetterReducer';
import { getAllEvents } from './redux/reducers/eventReducers';
import { adminGetAllUsers, getAllAuditLogs, getAllForgotPasswords, getAllUsers } from './redux/reducers/authReducer';
import { getAllInterviews, getAllJobListings } from './redux/reducers/applicationReducers';
import { getAllPost } from './redux/reducers/chatRoomReducers';
import { getAllDirectMsgAdmin } from './redux/reducers/directMsgStaffReducers';
import { getAllDrawings } from './redux/reducers/drawingReducers';
import { getAllGraduates, getAllLocations, getAllPrograms,} from './redux/reducers/locationReducer';
import { getAllQuestions } from './redux/reducers/questionReducers';
import { getAllReplys } from './redux/reducers/replyReducer';
import { getAllSupporters } from './redux/reducers/supporterReducers';
import { getAllMailEntries } from './redux/reducers/menteeReducers';

import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

// public routes
import LandingPage from './Pages/PublicPages/LandingPage';

// Private Routes
import ProfilePage from './Pages/PrivatePages/ProfilePage';
import MessagePage from './Pages/PrivatePages/MessagePage';

// public pages
import MsgPage from './Pages/PublicPages/msgPage';
import WhyPage from './Pages/PublicPages/WhyPage';
import QALanding from './Pages/PublicPages/Q-ALanding';
import ContactInfoLanding from './Pages/PublicPages/ContactInfoLanding';
import TeamLanding from './Pages/PublicPages/TeamLanding';
import MentorsLanding from './Pages/PublicPages/MentorsLanding';
import TeacherLanding from './Pages/PublicPages/TeacherLanding';
import SupportLanding from './Pages/PublicPages/SupportLanding';
import RefferAFriendLanding from './Pages/PublicPages/RefferAFriendLanding';
import Approach from './Pages/PublicPages/Approach';
import ProgramsLanding from './Pages/PublicPages/ProgramsLanding';
import VocationalLanding from './Pages/PublicPages/VocationalLanding';
import InpatientLanding from './Pages/PublicPages/InpatientLanding';
import OutPatientLanding from './Pages/PublicPages/OutPatientLanding';
import MentorShipProgram from './Pages/PublicPages/MentorShipProgram';
import SubmitSuccessLanding from './Pages/PublicPages/SubmitSuccessLanding';
import SubscribeNewsLanding from './Pages/PublicPages/SubscribeNewsLanding';
import UpcomingEvents from './Pages/PublicPages/UpcomingEvents';
import ProgramGraduates from './Pages/PublicPages/ProgramGraduates';
import DrawingsLanding from './Pages/PublicPages/DrawingsLanding';
import NewProgramsLanding from './Pages/PublicPages/NewProgramsLanding';
import NewTrainingLanding from './Pages/PublicPages/NewTrainingLanding';
import JoinLanding from './Pages/PublicPages/JoinLanding';
import VisitLocationPage from './Pages/PublicPages/VisitLocationPage';
import VisitProgramPage from './Pages/PublicPages/VisitProgramPage';
import DirectMsgStaff from './Pages/PublicPages/DirectMsgStaff';
import DirectMsgForEvent from './Pages/PublicPages/DirectMsgForEvent';
import VisitSuccessStory from './Pages/PublicPages/VisitSuccessStory';
import SeeAllSuccessStories from './Pages/PublicPages/SeeAllSuccessStories';
import SeeAllNewsLetters from './Pages/PublicPages/SeeAllNewsLetters';
import VisitSingleNewsLetter from './Pages/PublicPages/VisitSingleNewsLetter';
import ApplicationForJob from './Pages/PublicPages/ApplicationForJob';
import RegistrationPage from './Pages/PublicPages/RegistrationPage';
import ExploreEvent from './ComponentsForPages/privateComponents/ProfilePage/ExploreDropDown/ExploreEvent';
import VisitJobListing from './ComponentsForPages/privateComponents/ProfilePage/JobDropDown/VisitJobListing/VisitJobListing';


// Admin Routes 

const App = () => {

  const dispatch = useDispatch()

  const [darkMode, setDarkMode] = useState(false)

  const [openLogin, setOpenLogin] = useState(false)

  const [contactUs, setContactUs] = useState(false)

  const [openMenu, setOpenMenu] = useState(null)

  const [changeContent, setChangeContent] = useState("")

  const [trigger, setTrigger] = useState(null)

  const landingContent = useSelector(state => state.admin?.adminLanding)
  const allJobListings = useSelector(state => state.app?.allJobs)
  const AllInterviews = useSelector(state => state.app?.allInterviews?.data)
  const allPost = useSelector(state => state.chat?.post)
  const allDirectMsg = useSelector(state => state.staffMsg?.directMsgs?.directMsg)
  const allDrawings = useSelector(state => state.draw?.allDrawings)
  const allEvents = useSelector(state => state.event.events)
  const allPrograms = useSelector(state => state.pro?.allPrograms)
  const allGraduates = useSelector(state => state.pro?.allGraduates)
  const allLocations = useSelector(state => state.pro?.allLocations)
  const allNewsLetters = useSelector(state => state.news.newsLetters.newsletters)
  const allSubscriptions = useSelector(state => state.news?.subscriptions)
  const allQuest = useSelector(state => state.quest?.allQuestions)
  const allReplys = useSelector(state => state.reply?.allReplys)
  const allStories = useSelector(state => state.success.allStories)
  const allSupporters = useSelector(state => state.support.supporters)
  const allUsers = useSelector(state => state.auth?.allUsers)
  const allMentee = useSelector(state => state.mentee?.allMailEntries)
  const adminAllUsers = useSelector(state => state.auth?.adminAllUsers)
  const allLogs = useSelector(state => state.auth?.allLogs)
  
  const forgotPasswords = useSelector(state => state.auth.forgotMessages)

 
  useEffect(() => {

    dispatch(getUpdateLanding())
    dispatch(getAllJobListings())
    dispatch(getAllInterviews())
    dispatch(adminGetAllUsers())
    dispatch(getAllUsers())
    dispatch(getAllMailEntries())
    dispatch(getAllPost())
    dispatch(getAllDirectMsgAdmin())
    dispatch(getAllDrawings())
    dispatch(getAllEvents())
    dispatch(getAllPrograms())
    dispatch(getAllGraduates())
    dispatch(getAllLocations())
    dispatch(getAllNewsLetters())
    dispatch(getAllSubscriptions())
    dispatch(getAllQuestions())
    dispatch(getAllReplys())
    dispatch(getAllStories())
    dispatch(getAllSupporters())
    dispatch(getAllAuditLogs())
    dispatch(getAllForgotPasswords())

    setTrigger(false)

  }, [ trigger, changeContent ])




  return (

    <>

      <div style={{ height: "100vh", width: "100vw", display: 'flex', background: !darkMode ? "linear-gradient(to right, lightBlue 30%, blue"  : "linear-gradient(to right, black, blue)" }}>

        <Routes>

          {/* PUBLIC */}
          <Route element={<PublicRoute />}>


            {/* Direct Msg Staff */}
            <Route path="/directMsgEvent/:userId/:eventId" element={<DirectMsgForEvent darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            <Route path="/directMsg/:userId" element={<DirectMsgStaff darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            {/* Visit Program */}
            <Route path="/visitProgram/:programId" element={<VisitProgramPage darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allSupporters={allSupporters} allPrograms={allPrograms} setChangeContent={setChangeContent} />} />

            {/* Visit Location */}
            <Route path="/visitLocation/:locationId" element={<VisitLocationPage darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allSupporters={allSupporters} />} />

            {/* SUPPORT */}
            <Route path="/join" element={<JoinLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            <Route path="/application/:jobId" element={<ApplicationForJob darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            {/* Dropdown what*/}

            <Route path="/newTraining" element={<NewTrainingLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allSupporters={allSupporters} />} />

            <Route path="/newPrograms" element={<NewProgramsLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allSupporters={allSupporters} />} />

            <Route path="/drawings" element={<DrawingsLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            <Route path="/graduates" element={<ProgramGraduates darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            <Route path="/upcoming" element={<UpcomingEvents darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allSupporters={allSupporters} />} />

            {/* Dropdown newsletter*/}
            <Route path="/subscribe" element={<SubscribeNewsLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            <Route path="/allNewsLetters" element={<SeeAllNewsLetters darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            <Route path="/newsletter/:id" element={<VisitSingleNewsLetter darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            {/* Dropdown success*/}

            <Route path="/submitSuccess" element={<SubmitSuccessLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            <Route path="/successStory/:storyId" element={<VisitSuccessStory darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            <Route path="/allSuccessStory" element={<SeeAllSuccessStories darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            {/* Dropdown what */}

            <Route path="/mentorShip" element={<MentorShipProgram darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allSupporters={allSupporters} />} />

            <Route path="/outReach" element={<OutPatientLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allPrograms={allPrograms} allSupporters={allSupporters} />} />

            <Route path="/inpatient" element={<InpatientLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allPrograms={allPrograms} />} />

            <Route path="/vocational" element={<VocationalLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allSupporters={allSupporters} />} />

            <Route path="/programs" element={<ProgramsLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allPrograms={allPrograms} allSupporters={allSupporters} />} />

            <Route path="/approach" element={<Approach darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allSupporters={allSupporters} allPrograms={allPrograms} />} />

            {/* Dropdown community */}
            <Route path="/makeAReferral" element={<RefferAFriendLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            <Route path="/supporters" element={<SupportLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allSupporters={allSupporters} />} />

            <Route path="/teacher" element={<TeacherLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            <Route path="/mentor" element={<MentorsLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            <Route path="/team" element={<TeamLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allSupporters={allSupporters} />} />

            <Route path="/contactInfo" element={<ContactInfoLanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allSupporters={allSupporters} />} />

            <Route path="/Q-A" element={<QALanding darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allSupporters={allSupporters} />} />

            <Route path="/msg" element={<MsgPage darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />} />

            <Route path="/why" element={<WhyPage darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allSupporters={allSupporters}  />} />

            <Route path="/RegistrationPage" element={<RegistrationPage openLogin={openLogin} setOpenLogin={setOpenLogin} />} />

            <Route path="/" element={<LandingPage darkMode={darkMode} setDarkMode={setDarkMode} openLogin={openLogin} setOpenLogin={setOpenLogin} contactUs={contactUs} setContactUs={setContactUs} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allSupporters={allSupporters} />} />
          </Route>


          {/* PRIVATE */}
          <Route element={<PrivateRoute />}>

            <Route path="/profilePage" element={<ProfilePage darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allJobListings={allJobListings} AllInterviews={AllInterviews} allPost={allPost} allDirectMsg={allDirectMsg} allDrawings={allDrawings} allEvents={allEvents} allPrograms={allPrograms} allLocations={allLocations} allNewsLetters={allNewsLetters} allSubscriptions={allSubscriptions} allQuest={allQuest} allReplys={allReplys} allStories={allStories} allSupporters={allSupporters} changeContent={changeContent} setChangeContent={setChangeContent} trigger={trigger} setTrigger={setTrigger} allUsers={allUsers} adminAllUsers={adminAllUsers} allMentee={allMentee} allGraduates={allGraduates} allLogs={allLogs} forgotPasswords={forgotPasswords} />} />

            <Route path="/messagePage/:userId" element={<MessagePage darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} openMenu={openMenu} setOpenMenu={setOpenMenu} />} />

            <Route path="/viewEvent/:eventId" element={<ExploreEvent darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} openMenu={openMenu} setOpenMenu={setOpenMenu} />} />

            <Route path="/visitJobListing/:jobId" element={<VisitJobListing darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} allLocations={allLocations} />} />

          </Route>

        </Routes>

        <Toaster position="top-center" />

      </div>

    </>

  )
}

export default App
