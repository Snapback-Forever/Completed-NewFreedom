import React, { useState } from 'react'

const ContactLandingHeader = ({ newGif, newGif2, darkMode, setDarkMode }) => {

    return (

        <div style={{ display: 'flex' }} className='responsiveBorder'>

            <div style={{ display: "flex" }}>
                {darkMode ? <img src={newGif} style={{ background: "white", width: "50vw", height: "50vh", border: "solid grey" }} className='responsiveImage' /> :
                    <img src={newGif2} style={{ background: "grey", width: "50vw", height: "50vh", border: "solid white" }} className='responsiveImage' />}

                {!darkMode ? <img src={newGif} style={{ background: "white", width: "50vw", height: "50vh", border: "solid grey" }} className='responsiveImage' /> :
                    <img src={newGif2} style={{ background: "grey", width: "50vw", height: "50vh", border: "solid white" }} className='responsiveImage' />}
            </div>



        </div>

    )
}

export default ContactLandingHeader
