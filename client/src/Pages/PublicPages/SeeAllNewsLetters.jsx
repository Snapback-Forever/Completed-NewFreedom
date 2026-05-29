
import NavBarLanding from './NavBarLanding'
import Footer from '../Footer'
import LoginModal from '../../ComponentsForPages/publicComponents/LoginModal'
 
import NewsDropDown from '../../ComponentsForPages/publicComponents/AllNewsLetters/NewsDropDown'
import NewsContent from '../../ComponentsForPages/publicComponents/AllNewsLetters/NewsContent'

const SeeAllNewsLetters = ({ darkMode, setDarkMode, openLogin, setOpenLogin, contactUs, setContactUs, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters, allEvents }) => {
  

  
    return (
  
      <div>
        <NavBarLanding contactUs={contactUs} setContactUs={setContactUs} darkMode={darkMode} setDarkMode={setDarkMode} />
  
        <div style={{ height: "89vh", overflowY: "scroll" }} className='scrollBar'>
  
          <NewsDropDown darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} />
  
          <NewsContent darkMode={darkMode} setDarkMode={setDarkMode} allNewsLetters={allNewsLetters} />
  
        </div>
  
        <Footer openLogin={openLogin} setOpenLogin={setOpenLogin} />
  
        <dialog open={openLogin}>
          <LoginModal openLogin={openLogin} setOpenLogin={setOpenLogin} />
        </dialog>
  
      </div>
    )
  }

export default SeeAllNewsLetters
