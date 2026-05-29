
import NavBarLanding from './NavBarLanding'
import Footer from '../Footer'
import LoginModal from '../../ComponentsForPages/publicComponents/LoginModal'

import newGif from "../../images/newFreedomGif.gif"
import newGif2 from "../../images/newFreedomGif2.gif"
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { useEffect, useState } from 'react'
import VisitSingleNewsContent from '../../ComponentsForPages/publicComponents/VisitSingleNewsletter/VisitSingleNewsContent'
import VisitSingleNewsDropDown from '../../ComponentsForPages/publicComponents/VisitSingleNewsletter/VisitSingleNewsDropDown'
import { getSingleNewsLetter } from '../../redux/reducers/newsLetterReducer'

const VisitSingleNewsLetter= ({ darkMode, setDarkMode, openLogin, setOpenLogin, contactUs, setContactUs, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters, allEvents }) => {
  
    const params = useParams()

    const dispatch = useDispatch()
    
    const singleNews = useSelector(state => state.news.singleNews.newsletter)

    const [ data, setData ] = useState("")
  
    useEffect(() => {
    dispatch(getSingleNewsLetter(params?.id))
    }, [ params?.id ])
  
    return (
  
      <div>
        <NavBarLanding contactUs={contactUs} setContactUs={setContactUs} darkMode={darkMode} setDarkMode={setDarkMode} />
  
        <div style={{ height: "89vh", overflowY: "scroll" }} className='scrollBar'>
  
          <VisitSingleNewsDropDown newGif={newGif} newGif2={newGif2} darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} singleNews={singleNews} />
  
          <VisitSingleNewsContent darkMode={darkMode} setDarkMode={setDarkMode} data={data} setData={setData} singleNews={singleNews} allNewsLetters={allNewsLetters} />
  
        </div>
  
        <Footer openLogin={openLogin} setOpenLogin={setOpenLogin} />
  
        <dialog open={openLogin}>
          <LoginModal openLogin={openLogin} setOpenLogin={setOpenLogin} />
        </dialog>
  
      </div>
    )
  }

export default VisitSingleNewsLetter
