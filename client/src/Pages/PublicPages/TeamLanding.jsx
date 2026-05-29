import React, { useState } from 'react' 

import newGif from "../../images/nfImage.png"

import NavBarLanding from './NavBarLanding'
import Footer from '../Footer'
import LoginModal from '../../ComponentsForPages/publicComponents/LoginModal'
import TeamDropDown from '../../ComponentsForPages/publicComponents/TeamLanding/TeamDropDown'
import TeamLandingContent from '../../ComponentsForPages/publicComponents/TeamLanding/TeamLandingContent'

const TeamLanding = ({ darkMode, setDarkMode, openLogin, setOpenLogin, contactUs, setContactUs, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters, allEvents,  allSupporters }) => {
 
   
  const [ data, setData ] = useState("")
   

 
  
  
    return (
  
      <div>
        <NavBarLanding contactUs={contactUs} setContactUs={setContactUs} darkMode={darkMode} setDarkMode={setDarkMode} />
  
        <div style={{ height: "89vh", overflowY: "scroll" }} className='scrollBar'>
  
          <TeamDropDown darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />
          
          <TeamLandingContent darkMode={darkMode} setDarkMode={setDarkMode} data={data} setData={setData} allSupporters={allSupporters} />
  
        </div>
  
        <Footer openLogin={openLogin} setOpenLogin={setOpenLogin} />
  
        <dialog open={openLogin}>
          <LoginModal openLogin={openLogin} setOpenLogin={setOpenLogin} />
        </dialog>
  
      </div>
    )
  }

export default TeamLanding
