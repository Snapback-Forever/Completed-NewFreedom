

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout, setOnlineUser, setSocketConnection } from '../../redux/reducers/authReducer';

import io from "socket.io-client"
import NavBar from '../../ComponentsForPages/privateComponents/ProfilePage/NavBar';
import DropDown from '../../ComponentsForPages/privateComponents/ProfilePage/DropDown';
import ContentProfile from '../../ComponentsForPages/privateComponents/ProfilePage/ContentProfile';
import FooterProfile from './FooterProfile';

const ProfilePage = ({ darkMode, setDarkMode, openMenu, setOpenMenu, landingContent, allJobListings, AllInterviews, allPost, allDirectMsg, allDrawings, allEvents, allPrograms, allLocations, allNewsLetters, allSubscriptions, allQuest, allReplys, allStories, allSupporters, changeContent, setChangeContent, trigger, setTrigger, allUsers, adminAllUsers, allMentee, allGraduates, allLogs, forgotPasswords }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const user = useSelector(state => state.auth.user)
    const userId = useSelector(state => state.auth.user?._id)
    const socketConnection = useSelector(state => state.auth.socketConnection)

    const [navPath, setNavPath] = useState()

    const linkToPage = (e) => {
        const path = e.target.value
        setNavPath(path)
        navigate(path)
    }

    // SOCKET CONNECTION

    const token = useSelector(state => state.auth.token)
    const onlineUser = useSelector(state => state.auth.onlineUser)
    useEffect(() => {
        const socketConnection = io("http://localhost:8080", {
            auth: {
                token: token
            }
        })

        socketConnection.on("onlineUser", (data) => {

            dispatch(setOnlineUser(data))
        })

        dispatch(setSocketConnection(socketConnection))

        return () => {
            socketConnection.disconnect()
        }

    }, [])

    const [showMailIcon, setShowMailIcon] = useState()
    useEffect(() => {
        socketConnection?.on("message", (messages) => {
            const hasUnseen = messages.some(
                msg => !msg.seen && msg.accountName !== user.accountName
            );

            setShowMailIcon(hasUnseen); // show 📬 if true, 📭 if false
        });
        return () => socketConnection?.off("message");
    }, [socketConnection, user?.accountName]);

    // END OF SOCKET


    return (
        <>

            <div style={{ width: "100%", height: "90vh" }}>
                <NavBar darkMode={darkMode} setDarkMode={setDarkMode} user={user} />
                <DropDown openMenu={openMenu} setOpenMenu={setOpenMenu} user={user} showMailIcon={showMailIcon} changeContent={changeContent} setChangeContent={setChangeContent} allPost={allPost} allJobListings={allJobListings} AllInterviews={AllInterviews} allDirectMsg={allDirectMsg} allDrawings={allDrawings} allEvents={allEvents} allPrograms={allPrograms} allLocations={allLocations} allNewsLetters={allNewsLetters} allSubscriptions={allSubscriptions} allQuest={allQuest} allReplys={allReplys} allStories={allStories} allSupporters={allSupporters} trigger={trigger} setTrigger={setTrigger} allUsers={allUsers} adminAllUsers={adminAllUsers} allMentee={allMentee} allGraduates={allGraduates} allLogs={allLogs} forgotPasswords={forgotPasswords} />

                <div style={{ height: "84vh", overflowY: "scroll", display: "flex", flexDirection: "column", alignItems: "center" }} className={darkMode ? "scrollBar QADark" : "scrollBar QAWhite"} >

                    <ContentProfile darkMode={darkMode} setDarkMode={setDarkMode} openMenu={openMenu} setOpenMenu={setOpenMenu} landingContent={landingContent} allJobListings={allJobListings} AllInterviews={AllInterviews} allPost={allPost} allDirectMsg={allDirectMsg} allDrawings={allDrawings} allEvents={allEvents} allPrograms={allPrograms} allLocations={allLocations} allNewsLetters={allNewsLetters} allSubscriptions={allSubscriptions} allQuest={allQuest} allReplys={allReplys} allStories={allStories} allSupporters={allSupporters} changeContent={changeContent} setChangeContent={setChangeContent} trigger={trigger} setTrigger={setTrigger} allUsers={allUsers} adminAllUsers={adminAllUsers} allMentee={allMentee} allGraduates={allGraduates} allLogs={allLogs} forgotPasswords={forgotPasswords} />

                </div>

                <FooterProfile />
            </div>

        </>
    )
}

export default ProfilePage
