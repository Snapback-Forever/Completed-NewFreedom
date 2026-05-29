
import NavBarLanding from './NavBarLanding'
import Footer from '../Footer'
import LoginModal from '../../ComponentsForPages/publicComponents/LoginModal'
 
import AllSuccessDropDown from '../../ComponentsForPages/publicComponents/AllSuccessStories/AllSuccessDropDown'
import AllSuccessContent from '../../ComponentsForPages/publicComponents/AllSuccessStories/AllSuccessContent'
 
 
const SeeAllSuccessStories = ({ darkMode, setDarkMode, openLogin, setOpenLogin, contactUs, setContactUs, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters, allEvents }) => {
  

  
    return (
  
      <div>
        <NavBarLanding contactUs={contactUs} setContactUs={setContactUs} darkMode={darkMode} setDarkMode={setDarkMode} />
  
        <div style={{ height: "89vh", overflowY: "scroll" }} className='scrollBar'>
  
          <AllSuccessDropDown darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />
  
          <AllSuccessContent darkMode={darkMode} setDarkMode={setDarkMode} allStories={allStories} />
  
        </div>
  
        <Footer openLogin={openLogin} setOpenLogin={setOpenLogin} />
  
        <dialog open={openLogin}>
          <LoginModal openLogin={openLogin} setOpenLogin={setOpenLogin} />
        </dialog>
  
      </div>
    )
  }

export default SeeAllSuccessStories
