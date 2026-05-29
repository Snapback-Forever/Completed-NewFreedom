
import React, { useEffect, useState } from 'react'

import newGif from "../../images/newFreedomGif.gif"
import newGif2 from "../../images/newFreedomGif2.gif"
import NavBarLanding from './NavBarLanding'
import Footer from '../Footer'
import LoginModal from '../../ComponentsForPages/publicComponents/LoginModal'

import MentorlandingContent from '../../ComponentsForPages/publicComponents/MentorshipLanding/MentorLandingContent'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../../redux/reducers/authReducer'
import MentorDropDown from '../../ComponentsForPages/publicComponents/MentorshipLanding/MentorDropDown'

const MentorShipProgram = ({ darkMode, setDarkMode, openLogin, setOpenLogin, contactUs, setContactUs, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters, allEvents, allSupporters }) => {

  const dispatch = useDispatch()

  const allUsers = useSelector(state => state.auth.allUsers)

  const [data, setData] = useState("")

  useEffect(() => {
    dispatch(getAllUsers())
  }, [])



  return (
 
    <div>
      <NavBarLanding contactUs={contactUs} setContactUs={setContactUs} darkMode={darkMode} setDarkMode={setDarkMode} />

      <div style={{ height: "89vh", overflowY: "scroll" }} className='scrollBar'>

        <MentorDropDown newGif={newGif} newGif2={newGif2} darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />

        <MentorlandingContent darkMode={darkMode} setDarkMode={setDarkMode} landingContent={landingContent} data={data} setData={setData} allUsers={allUsers} allSupporters={allSupporters} />

      </div>

      <Footer openLogin={openLogin} setOpenLogin={setOpenLogin} />

      <dialog open={openLogin}>
        <LoginModal openLogin={openLogin} setOpenLogin={setOpenLogin} />
      </dialog>

    </div>
  )
}

export default MentorShipProgram
