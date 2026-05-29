
import React, { useState } from 'react'

import newGif from "../../images/newFreedomGif.gif"
import newGif2 from "../../images/newFreedomGif2.gif"
import NavBarLanding from './NavBarLanding'
import Footer from '../Footer'
import LoginModal from '../../ComponentsForPages/publicComponents/LoginModal'
import OutPatientDropDown from '../../ComponentsForPages/publicComponents/OutPatientLanding/OutPatientDropDown'
import OutPatientLandingContent from '../../ComponentsForPages/publicComponents/OutPatientLanding/OutPatientLandingContent'

const OutPatientLanding = ({ darkMode, setDarkMode, openLogin, setOpenLogin, contactUs, setContactUs, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters, allEvents, allPrograms, allSupporters }) => {

    

   

 
  
  
    return (
  
      <div>
        <NavBarLanding contactUs={contactUs} setContactUs={setContactUs} darkMode={darkMode} setDarkMode={setDarkMode} />
  
        <div style={{ height: "89vh", overflowY: "scroll" }} className='scrollBar'>
  
          <OutPatientDropDown newGif={newGif} newGif2={newGif2} darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />
          
          <OutPatientLandingContent darkMode={darkMode} setDarkMode={setDarkMode} landingContent={landingContent} allPrograms={allPrograms} allSupporters={allSupporters} />
  
        </div>
  
        <Footer openLogin={openLogin} setOpenLogin={setOpenLogin} />
  
        <dialog open={openLogin}>
          <LoginModal openLogin={openLogin} setOpenLogin={setOpenLogin} />
        </dialog>
  
      </div>
    )
  }

export default OutPatientLanding
