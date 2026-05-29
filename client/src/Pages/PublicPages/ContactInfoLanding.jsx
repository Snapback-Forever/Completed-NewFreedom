import React, { useState } from 'react'

import NavBarLanding from './NavBarLanding'
import Footer from '../Footer'
import LoginModal from '../../ComponentsForPages/publicComponents/LoginModal'
import ContactDropDown from '../../ComponentsForPages/publicComponents/ContactLanding/ContactDropDown'
import ContactLandingContent from '../../ComponentsForPages/publicComponents/ContactLanding/ContactLandingContent'

const ContactInfoLanding = ({ darkMode, setDarkMode, openLogin, setOpenLogin, contactUs, setContactUs, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters, allEvents, allSupporters }) => {

   

   

 
  
  
    return (
  
      <div>
        <NavBarLanding contactUs={contactUs} setContactUs={setContactUs} darkMode={darkMode} setDarkMode={setDarkMode} />
  
        <div style={{ height: "89vh", overflowY: "scroll" }} >
  
          <ContactDropDown darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />
          
          <ContactLandingContent darkMode={darkMode} setDarkMode={setDarkMode} allSupporters={allSupporters} />
  
        </div>
  
        <Footer openLogin={openLogin} setOpenLogin={setOpenLogin} />
  
        <dialog open={openLogin}>
          <LoginModal openLogin={openLogin} setOpenLogin={setOpenLogin} />
        </dialog>
  
      </div>
    )
  }

export default ContactInfoLanding
