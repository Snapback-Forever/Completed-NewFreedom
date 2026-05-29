import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavBar from '../../ComponentsForPages/privateComponents/ProfilePage/NavBar';

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { logout, getAllUsers, getSingleUser, setOnlineUser, setSocketConnection } from '../../redux/reducers/authReducer';

import MessageComponent from '../../ComponentsForPages/privateComponents/Messages/MessageComponent';
import SearchUserModal from '../../ComponentsForPages/privateComponents/Messages/SearchUserModal';
import SideBar from '../../ComponentsForPages/privateComponents/Messages/SideBar';

import io from "socket.io-client"
import NavBarNotProfile from '../../ComponentsForPages/privateComponents/Messages/NavBarNotProfile';


const MessagePage = ({ darkMode, setDarkMode, trigger, setTrigger }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { userId } = useParams()

    const user = useSelector(state => state.auth.user)
    const authId = useSelector(state => state.auth.user?._id)
    const token = useSelector(state => state.auth.token)
    const socketConnection = useSelector(state => state.auth.socketConnection)

    const [navPath, setNavPath] = useState()
    const [openSearchUserModal, setOpenSearchModal] = useState(false)
    const [allConvo, setAllConvo] = useState([])

    const linkToPage = (e) => {
        const path = e.target.value
        setNavPath(path)
        navigate(path)
    }

    const basePath = userId === authId


    // SOCKET CONNECTION

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

    }, [ trigger ])

    const [showMailIcon, setShowMailIcon] = useState()
    useEffect(() => {
        socketConnection?.on("message", (messages) => {
            const hasUnseen = messages.some(
                msg => !msg.seen && msg.accountName !== user.accountName
            );

            setShowMailIcon(hasUnseen); // show 📬 if true, 📭 if false
        });
        return () => socketConnection?.off("message");
    }, [ socketConnection, user?.accountName]);


    // END OF SOCKET

    useEffect(() => {

        dispatch(getAllUsers())
        setTrigger(false)

    }, []) 

    return (
        <>


            <div style={{ border: "solid black", width: "100%", height: "98vh", display: "flex", flexDirection: "column" }}>

                <NavBarNotProfile darkMode={darkMode} setDarkMode={setDarkMode} user={user} />

                <div style={{ border: "solid black", width: "100%", height: "100%", display: "flex" }}>
                    <SideBar openSearchUserModal={openSearchUserModal} setOpenSearchModal={setOpenSearchModal} allConvo={allConvo} setAllConvo={setAllConvo} darkMode={darkMode} setDarkMode={setDarkMode} trigger={trigger} setTrigger={setTrigger} />

                    <MessageComponent openSearchUserModal={openSearchUserModal} setOpenSearchModal={setOpenSearchModal} darkMode={darkMode} setDarkMode={setDarkMode} />
                </div>
            </div>

            <dialog open={openSearchUserModal} >
                <SearchUserModal openSearchUserModal={openSearchUserModal} setOpenSearchModal={setOpenSearchModal} />
            </dialog>


        </>
    )
}

export default MessagePage
