 
import NavBarLanding from './NavBarLanding'
import Footer from '../Footer'
import LoginModal from '../../ComponentsForPages/publicComponents/LoginModal'

import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import VisitProDropDown from '../../ComponentsForPages/publicComponents/VisitProgramPage/VisitProDropDown'
import VisitProLandingContent from '../../ComponentsForPages/publicComponents/VisitProgramPage/VisitProLandingContent'
import { useEffect, useState } from 'react'
import { getProgramById } from '../../redux/reducers/locationReducer'

const VisitProgramPage = ({ darkMode, setDarkMode, openLogin, setOpenLogin, contactUs, setContactUs, openMenu, setOpenMenu, landingContent, allStories, allNewsLetters, allEvents, allSupporters, allPrograms, setChangeContent }) => {
  
    const params = useParams()
    const dispatch = useDispatch()
  
    const singleProgram = useSelector(state => state.pro.singleProgram)

    const [ data, setData ] = useState("")
  
  
    useEffect(() => {
    dispatch(getProgramById(params?.programId))
    }, [params?.programId])
  
    return (
  
      <div>
        <NavBarLanding contactUs={contactUs} setContactUs={setContactUs} darkMode={darkMode} setDarkMode={setDarkMode} />
  
        <div style={{ height: "89vh", overflowY: "scroll" }} className='scrollBar'>
  
          <VisitProDropDown darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allStories={allStories} allNewsLetters={allNewsLetters} allEvents={allEvents} singleProgram={singleProgram} />
  
          <VisitProLandingContent darkMode={darkMode} setDarkMode={setDarkMode} singleProgram={singleProgram} data={data} setData={setData} allSupporters={allSupporters} allPrograms={allPrograms} setChangeContent={setChangeContent} />
  
        </div>
  
        <Footer openLogin={openLogin} setOpenLogin={setOpenLogin} />
  
        <dialog open={openLogin}>
          <LoginModal openLogin={openLogin} setOpenLogin={setOpenLogin} />
        </dialog>
  
      </div>
    )
  }

export default VisitProgramPage
