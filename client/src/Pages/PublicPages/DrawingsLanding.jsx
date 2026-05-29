import React, { useEffect, useState } from 'react'

import newGif from "../../images/newFreedomGif.gif"
import newGif2 from "../../images/newFreedomGif2.gif"
import NavBarLanding from './NavBarLanding'
import Footer from '../Footer'
import LoginModal from '../../ComponentsForPages/publicComponents/LoginModal'
import DrawingsDropDown from '../../ComponentsForPages/publicComponents/DrawingsLanding/DrawingsDropDown'
import DrawingLandingContent from '../../ComponentsForPages/publicComponents/DrawingsLanding/DrawingLandingContent'
import { getAllDrawings } from '../../redux/reducers/drawingReducers'
import { useDispatch, useSelector } from 'react-redux'
 

const DrawingsLanding = ({ darkMode, setDarkMode, openLogin, setOpenLogin, contactUs, setContactUs, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters, allEvents }) => {

  const dispatch = useDispatch()

  const allDrawing = useSelector(state => state.draw.allDrawings)

  useEffect(() => {
    dispatch(getAllDrawings())
  }, [])



  return (

    <div>
      <NavBarLanding contactUs={contactUs} setContactUs={setContactUs} darkMode={darkMode} setDarkMode={setDarkMode} />

      <div style={{ height: "89vh", overflowY: "scroll" }} className='scrollBar'>

        <DrawingsDropDown newGif={newGif} newGif2={newGif2} darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} allDrawing={allDrawing} />

        <DrawingLandingContent darkMode={darkMode} setDarkMode={setDarkMode} allDrawing={allDrawing} />

      </div>

      <Footer openLogin={openLogin} setOpenLogin={setOpenLogin} />

      <dialog open={openLogin}>
        <LoginModal openLogin={openLogin} setOpenLogin={setOpenLogin} />
      </dialog>

    </div>
  )
}

export default DrawingsLanding
