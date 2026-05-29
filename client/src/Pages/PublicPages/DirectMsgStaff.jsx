import React, { useEffect, useState } from 'react'

import NavBarLanding from './NavBarLanding'
import Footer from '../Footer'
import LoginModal from '../../ComponentsForPages/publicComponents/LoginModal'
import DirectDropDown from '../../ComponentsForPages/publicComponents/DirectMsgStaffPage/DirectDropDown'
import DirectLandingContent from '../../ComponentsForPages/publicComponents/DirectMsgStaffPage/DirectLandingContent'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSingleUser } from '../../redux/reducers/authReducer'

const DirectMsgStaff = ({ darkMode, setDarkMode, openLogin, setOpenLogin, contactUs, setContactUs, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters, allEvents }) => {

  const dispatch = useDispatch()
  const params = useParams()

  const singleUser = useSelector(state => state.auth.singleUser)



  useEffect(() => {
    dispatch(getSingleUser(params?.userId))
  }, [])

  return (

    <div>
      <NavBarLanding contactUs={contactUs} setContactUs={setContactUs} darkMode={darkMode} setDarkMode={setDarkMode} />

      <div style={{ height: "89vh", overflowY: "scroll" }} className='scrollBar'>

        <DirectDropDown darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} singleUser={singleUser} />

        <DirectLandingContent darkMode={darkMode} setDarkMode={setDarkMode} singleUser={singleUser} />

      </div>

      <Footer openLogin={openLogin} setOpenLogin={setOpenLogin} />

      <dialog open={openLogin}>
        <LoginModal openLogin={openLogin} setOpenLogin={setOpenLogin} />
      </dialog>

    </div>
  )
}

export default DirectMsgStaff
