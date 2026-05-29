import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setOnlineUser, setSocketConnection } from '../../redux/reducers/authReducer';


import io from "socket.io-client"

const TemplateForPages = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const user = useSelector(state => state.auth.user)
    const userId = useSelector(state => state.auth.user?._id)

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
    // END OF SOCKET


    return (
        <div>

            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home">Welcome {user?.accountName}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <div style={{ display: "flex", marginTop: "1vh", justifyContent: "space-between", minWidth: "70vw" }}>
                                <div >
                                    <select
                                        onChange={linkToPage}
                                        className='lookAtMe'
                                        required
                                        title="Explore More Pages"
                                        style={{ width: "fit-content", textAlign: "center" }}
                                    >
                                        {/* style={{ color: 'grey' }} */}
                                        <option value={'/profilePage'} >Profile Page</option>
                                        <option value={`/messagePage/${userId}`}>Messages</option>
                                        <option value={"/chatRoomPage"}>ChatRoom Page</option>
                                        {/* <option value="/allProd">See All Products</option> */}
                                        {/* <option value="/seeking">Seeking Post</option> */}
                                        {/* <option value="/chatRoom">Chat Rooms</option> */}
                                    </select>

                                </div>
                            </div>
                        </Nav>
                        <Nav>
                            <Link to="/" style={{ color: "black" }}>
                                <button className='bg-red-600 p-2 rounded' onClick={() => dispatch(logout())}>logout</button>
                            </Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div style={{ background: "black", color: "white", height: "83vh" }}>

            </div>



        </div>
    )
}

export default TemplateForPages

