import logo from "../../images/snapback.jpg"

import React, { useEffect, useRef, useState } from 'react'

const FooterProfile = ({ openLogin, setOpenLogin }) => {




    return (
        <div style={{ width: "100%", display: "flex", height: "6vh", background: "white" }} >

            <a className='flex' href='changeMe' target="_blank" rel="noopener noreferrer" title='Snapback-Forever Website' style={{ textDecoration: "none" }}>
                <img src={logo} style={{ height: "6vh", marginLeft: "2vw" }} title="Created By Snapback-Forever" />
            </a>
            <div style={{ color: "red" }} className='spin'>&copy;</div>


        </div>
    )
}

export default FooterProfile
