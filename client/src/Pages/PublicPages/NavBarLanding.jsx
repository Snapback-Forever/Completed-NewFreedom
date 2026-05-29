import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const NavBarLanding = ({ contactUs, setContactUs, darkMode, setDarkMode }) => {

 
  return (

    <div style={{ background: "white" }}>
    {contactUs ?
      <div className='responsiveNav' style={{ width: "98.5%", height: "5vh", background: "white", display: "flex", justifyContent: "end", marginRight: "2vw" }} onMouseLeave={() => setContactUs(false)}>

        <h5 className="responsiveP" style={{ fontWeight: "bold", width: "10%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>(602) 622-1178</h5>

       <Link to={"/msg"} className='rounded responsiveP' style={{ fontWeight: "bold", width: "fit-content", height: "90%", display: "flex", justifyContent: "center", alignItems: "center", background: 'white', textAlign: "center", margin: "0.3vh 0" }}>
        <div className='rounded responsiveP' style={{ fontWeight: "bold", width: "fit-content", height: "90%", display: "flex", justifyContent: "center", alignItems: "center", background: 'white', textAlign: "center", margin: "0.3vh 0" }}>📭 Message Us</div>
        </Link>

        {/* facebook */}
        <a href={"https://www.facebook.com/newfreedomaz/"} target="_blank" rel="noopener noreferrer" title='facebook'>
          <svg style={{ margin: "0 0.5vw", minHeight: "5vh", minWidth: "4vh", maxHeight: "5vh", maxWidth: "4vw", color: "black" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clipRule="evenodd" />
          </svg>
        </a>

        {/* LinkedIn */}
        <a href={"https://www.linkedin.com/company/newfreedom"} target="_blank" rel="noopener noreferrer" title='LinkedIn'>
          <svg style={{ margin: "0 0.5vw", minHeight: "5vh", minWidth: "4vh", maxHeight: "5vh", maxWidth: "4vw", color: "black" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clipRule="evenodd" />
            <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
          </svg>
        </a>

        {/* INSTAGRAM */}
        <a href={"https://www.instagram.com/newfreedomaz/"} target="_blank" rel="noopener noreferrer" title='Instagram'>
          <svg style={{ margin: "0 0.5vw", minHeight: "5vh", minWidth: "4vh", maxHeight: "5vh", maxWidth: "4vw", color: "black" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" fillRule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clipRule="evenodd" />
          </svg>
        </a>

         {/* Twitter */}
         <a href={"https://x.com/freedom50004"} target="_blank" rel="noopener noreferrer" title='X'>
            <svg style={{ margin: "0 0.5vw", minHeight: "5vh", minWidth: "4vh", maxHeight: "5vh", maxWidth: "4vw", color: "black" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
            </svg>
          </a>

      </div>
      :

      <div style={{ width: "98.5%", height: "5vh", background: "white", display: "flex", justifyContent: "end" }}>

        <h2 onMouseOver={() => setContactUs(true)} onClick={() => setContactUs(true)} style={{ height: "5vh", background: "white", display: "flex", marginRight: "2vw" }}>Contact Us</h2>

        {darkMode ?
          <svg style={{ margin: "0 0.5vw", minHeight: "5vh", minWidth: "4vh", maxHeight: "5vh", maxWidth: "4vw", color: "black" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" onClick={() => setDarkMode(false)}>
            <path fillRule="evenodd" d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z" clipRule="evenodd" />
          </svg>

          :
          <svg style={{ margin: "0 0.5vw", minHeight: "5vh", minWidth: "4vh", maxHeight: "5vh", maxWidth: "4vw", color: "black" }} onClick={() => setDarkMode(true)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
          </svg>}
      </div>
    }
      
    </div>
  )
}

export default NavBarLanding
