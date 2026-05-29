import React, { useEffect, useState } from 'react'

import NavBarLanding from './NavBarLanding'
import Footer from '../Footer'
import LoginModal from '../../ComponentsForPages/publicComponents/LoginModal'
import VisitDropDown from '../../ComponentsForPages/publicComponents/VisitLocationPage/VisitDropDown'
import VisitLandingContent from '../../ComponentsForPages/publicComponents/VisitLocationPage/VisitLandingContent'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getLocationById } from '../../redux/reducers/locationReducer'

const VisitLocationPage = ({ darkMode, setDarkMode, openLogin, setOpenLogin, contactUs, setContactUs, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters, allEvents, allSupporters }) => {

  const params = useParams()
  const dispatch = useDispatch()

  const [ data, setData ] = useState("")

  const singleLocation = useSelector(state => state.pro.singleLocation)



  useEffect(() => {
    dispatch(getLocationById(params?.locationId))
  }, [params?.locationId])

  return (

    <div>
      <NavBarLanding contactUs={contactUs} setContactUs={setContactUs} darkMode={darkMode} setDarkMode={setDarkMode} />

      <div style={{ height: "89vh", overflowY: "scroll" }} className='scrollBar'>

        <VisitDropDown darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} singleLocation={singleLocation} />

        <VisitLandingContent darkMode={darkMode} setDarkMode={setDarkMode} singleLocation={singleLocation} data={data} setData={setData} allSupporters={allSupporters} />

      </div>

      <Footer openLogin={openLogin} setOpenLogin={setOpenLogin} />

      <dialog open={openLogin}>
        <LoginModal openLogin={openLogin} setOpenLogin={setOpenLogin} />
      </dialog>

    </div>
  )
}

export default VisitLocationPage
