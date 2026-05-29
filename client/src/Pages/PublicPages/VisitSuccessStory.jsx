
import NavBarLanding from './NavBarLanding'
import Footer from '../Footer'
import LoginModal from '../../ComponentsForPages/publicComponents/LoginModal'

import newGif from "../../images/newFreedomGif.gif"
import newGif2 from "../../images/newFreedomGif2.gif"
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { useEffect, useState } from 'react'
import { getStoryById } from '../../redux/reducers/successStoriesReducer'
import SuccessDropDown from '../../ComponentsForPages/publicComponents/VistSingleSuccessStory/SuccessDropDown'
import SuccessLandingContent from '../../ComponentsForPages/publicComponents/VistSingleSuccessStory/SuccessLandingContent'


const VisitSuccessStory= ({ darkMode, setDarkMode, openLogin, setOpenLogin, contactUs, setContactUs, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters, allEvents }) => {
  
    const params = useParams()

    const dispatch = useDispatch()
    
    const singleStory = useSelector(state => state.success.storyById)

    const [ data, setData ] = useState("")
  
  
    useEffect(()=>{
      if(params?.storyId){
        dispatch(getStoryById(params.storyId))
      }
    },[params?.storyId])
  
    return (
  
      <div>
        <NavBarLanding contactUs={contactUs} setContactUs={setContactUs} darkMode={darkMode} setDarkMode={setDarkMode} />
  
        <div style={{ height: "89vh", overflowY: "scroll" }} className='scrollBar'> 
  
          <SuccessDropDown newGif={newGif} newGif2={newGif2} darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} singleStory={singleStory} />
  
          <SuccessLandingContent darkMode={darkMode} setDarkMode={setDarkMode} data={data} setData={setData} singleStory={singleStory} allStories={allStories} />
  
        </div>
  
        <Footer openLogin={openLogin} setOpenLogin={setOpenLogin} />
  
        <dialog open={openLogin}>
          <LoginModal openLogin={openLogin} setOpenLogin={setOpenLogin} />
        </dialog>
  
      </div>
    )
  }

export default VisitSuccessStory
