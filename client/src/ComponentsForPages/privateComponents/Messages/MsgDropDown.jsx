import React, { useState } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const MsgDropDown = ({ openMenu, setOpenMenu, showMailIcon }) => {

    const user = useSelector(state => state.auth.user)


    return (

        <div >


            <div
                style={{ background: "whiteSmoke", width: "100vw", height: "5vh", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 5vw" }} className="responsiveSelect" >


                {/* Messages Dropdown */}
                <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw" }} className='rounded responsiveDiv'>
                    {showMailIcon ? <button className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "Messages" ? null : "Messages")}>Messages <span className='lookAtMe'>📬 New</span></button> :
                        <button className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "Messages" ? null : "Messages")}>Messages</button>}
                    {openMenu === "Messages" && (

                        <div className="dropdownPanel" style={{ background: "white", border: "2px solid black" }}
                            onMouseLeave={() => setOpenMenu("")}>

                            <Link to={`/messagePage/${user?._id}`}>
                                {showMailIcon ? <button className='rounded lookAtMe' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Private Msg's</button> : <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} >Private Msg's</button>}
                            </Link>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} >Admin To Admin Msg's</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} >Direct Msg's</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} >Customer Msg's</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} >Event Request Msg'g</button>


                        </div>


                    )}
                </div>


                {/* Admin Dropdown */}
                <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw" }} className='rounded responsiveDiv'>

                    <button
                        className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "admin" ? null : "admin")} > Admin Page's</button>

                    {openMenu === "admin" && (

                        <div className="dropdownPanel" style={{ background: "white", border: "2px solid black" }}
                            onMouseLeave={() => setOpenMenu("")}
                        >

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Page Controllers</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Add Register Email</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}></button>


                        </div>

                    )}
                </div>

                {/* Creation Dropdown */}
                <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw" }} className='rounded responsiveDiv'>

                    <button className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "create" ? null : "create")} >Creation Controllers</button>


                    {openMenu === "create" && (

                        <div className="dropdownPanel" style={{ background: "white", border: "2px solid black" }} onMouseLeave={() => setOpenMenu("")} >

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Create Mentee Form</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Create Program Form</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Create New Location Form</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Create New Event</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Create News Letter</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Create Success Story</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Create Support Partner</button>

                        </div>

                    )}

                </div>

                {/* Explore Dropdown */}
                <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw", }} className="rounded responsiveDiv" >

                    <button className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "explore" ? null : "explore")}>Explore</button>

                    {openMenu === "explore" && ( 

                        <div className="dropdownPanel" style={{ background: "white", border: "2px solid black" }} onMouseLeave={() => setOpenMenu("")} >

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>All Graduates</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>All Users</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>All Metees</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>All Programs</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>All Locations</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>All Events</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>All News Letters</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>All Drawings</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>All Success Stories</button>

                        </div>

                    )}

                </div>

                {/* Reports */}
                <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw" }} className='rounded responsiveDiv'>
                    <button className="responsiveButton rounded" onClick={() => setOpenMenu(openMenu === "reports" ? null : "reports")} >Reports</button>

                    {openMenu === "reports" && (

                        <div className="dropdownPanel" style={{ background: "white", border: "2px solid black" }}
                            onMouseLeave={() => setOpenMenu("")} >

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} >Audit Log Reports</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} >Audit Log Reports</button>

                        </div>

                    )}
                </div>

                {/* Job Listing's Dropdown */}
                <div style={{ position: "relative", width: "100%", textAlign: "center", background: "goldenRod", margin: "0 1vw" }} className="rounded responsiveDiv" >

                    <button className="responsiveButton" onClick={() => setOpenMenu(openMenu === "job" ? null : "job")} >Job's</button>

                    {openMenu === "job" && (

                        <div className="dropdownPanel dropdownPanel--alignRight" style={{ background: "white", border: "2px solid black" }}
                            onMouseLeave={() => setOpenMenu("")} >

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Create Job Listing</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>All Job Listings</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} >All Applications</button>

                            <button className='rounded' style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }} >All Volunteer Applications</button>

                        </div>

                    )}

                </div>

            </div>

        </div>
    )
}

export default MsgDropDown
