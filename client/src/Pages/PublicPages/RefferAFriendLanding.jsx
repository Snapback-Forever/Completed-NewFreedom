import React, { useState } from 'react'

import newGif from "../../images/refer.png"

import NavBarLanding from './NavBarLanding'
import Footer from '../Footer'
import LoginModal from '../../ComponentsForPages/publicComponents/LoginModal'
import ReferDropDown from '../../ComponentsForPages/publicComponents/ReferAFriendLanding/ReferDropDown'
import ReferLandingContent from '../../ComponentsForPages/publicComponents/ReferAFriendLanding/ReferLandingContent'

const RefferAFriendLanding = ({  darkMode, setDarkMode, openLogin, setOpenLogin, contactUs, setContactUs, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters, allEvents }) => {

   
 
  
    return (
  
      <div>
        <NavBarLanding contactUs={contactUs} setContactUs={setContactUs} darkMode={darkMode} setDarkMode={setDarkMode} />
  
        <div style={{ height: "89vh", overflowY: "scroll" }} className='scrollBar'>
  
          <ReferDropDown darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />
          
          <ReferLandingContent darkMode={darkMode} setDarkMode={setDarkMode} />
  
        </div>
  
        <Footer openLogin={openLogin} setOpenLogin={setOpenLogin} />
  
        <dialog open={openLogin}>
          <LoginModal openLogin={openLogin} setOpenLogin={setOpenLogin} />
        </dialog>
  
      </div>
    )
  }

export default RefferAFriendLanding
