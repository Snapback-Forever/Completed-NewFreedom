
import React, { useEffect, useState } from 'react'

import newGif from "../../images/newFreedomGif.gif"
import newGif2 from "../../images/newFreedomGif2.gif"
import NavBarLanding from './NavBarLanding'
import DropDowns from '../../ComponentsForPages/publicComponents/FirstLanding/DropDowns'
import FirstLandingPageContent from '../../ComponentsForPages/publicComponents/FirstLanding/FirstLandingPageContent'
import Footer from '../Footer'
import LoginModal from '../../ComponentsForPages/publicComponents/LoginModal'
import ForgotPassword from './ForgotPassword'




const LandingPage = ({ darkMode, setDarkMode, openLogin, setOpenLogin, contactUs, setContactUs, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters, allEvents, allSupporters }) => {

  const [openForgotPassword, setOpenForgotPassword] = useState(false)


  return (

    <div>
      <NavBarLanding contactUs={contactUs} setContactUs={setContactUs} darkMode={darkMode} setDarkMode={setDarkMode} />

      <div style={{ height: "89vh", overflowY: "scroll" }} className='scrollBar'>

        <DropDowns newGif={newGif} newGif2={newGif2} darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />

        <FirstLandingPageContent darkMode={darkMode} setDarkMode={setDarkMode} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allSupporters={allSupporters} />

      </div>

      <Footer openLogin={openLogin} setOpenLogin={setOpenLogin} />

      <dialog open={openLogin}>
        <LoginModal openLogin={openLogin} setOpenLogin={setOpenLogin} openForgotPassword={openForgotPassword} setOpenForgotPassword={setOpenForgotPassword} />
      </dialog>

      <dialog open={openForgotPassword}>
        <ForgotPassword openLogin={openLogin} setOpenLogin={setOpenLogin} openForgotPassword={openForgotPassword} setOpenForgotPassword={setOpenForgotPassword} />
      </dialog>

    </div>
  )
}

export default LandingPage
