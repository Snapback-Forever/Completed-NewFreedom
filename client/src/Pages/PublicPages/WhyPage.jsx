
import React, { useState } from 'react'

import newGif from "../../images/newFreedomGif.gif"
import newGif2 from "../../images/newFreedomGif2.gif"
import NavBarLanding from './NavBarLanding'
import Footer from '../Footer'
import LoginModal from '../../ComponentsForPages/publicComponents/LoginModal'
import WhyDropDown from '../../ComponentsForPages/publicComponents/WhyLanding/WhyDropDown'
import WhyLandingContent from '../../ComponentsForPages/publicComponents/WhyLanding/WhyLandingContent'


const WhyPage = ({ darkMode, setDarkMode, openLogin, setOpenLogin, contactUs, setContactUs, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters, allEvents, allSupporters }) => {

   


    return (
  
      <div>
        <NavBarLanding contactUs={contactUs} setContactUs={setContactUs} darkMode={darkMode} setDarkMode={setDarkMode} />
  
        <div style={{ height: "89vh", overflowY: "scroll" }} className='scrollBar'>
  
          <WhyDropDown newGif={newGif} newGif2={newGif2} darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />
          
          <WhyLandingContent darkMode={darkMode} setDarkMode={setDarkMode} landingContent={landingContent} allStories={allStories} allSupporters={allSupporters} />
  
        </div>
  
        <Footer openLogin={openLogin} setOpenLogin={setOpenLogin} />
  
        <dialog open={openLogin}>
          <LoginModal openLogin={openLogin} setOpenLogin={setOpenLogin} />
        </dialog>
  
      </div>
    )
  }

export default WhyPage
