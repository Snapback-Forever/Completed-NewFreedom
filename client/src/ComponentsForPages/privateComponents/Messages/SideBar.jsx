import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, Link } from "react-router-dom";

import SearchUserModal from './SearchUserModal';
 
import moment from 'moment'
import { deleteConversation } from '../../../redux/reducers/messageReducers';

const SideBar = ({ openSearchUserModal, setOpenSearchModal, allConvo, setAllConvo, darkMode, setDarkMode, trigger, setTrigger }) => {

    const dispatch = useDispatch()

    const user = useSelector(state => state?.auth?.user)
    const authId = useSelector(state => state?.auth?.user?._id)
    const socketConnection = useSelector(state => state?.auth?.socketConnection)
    const allConversations = useSelector(state => state.msg.allConversations)

    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit("sidebar", user?._id)

            socketConnection.on("conversation", (data) => {
                const conversationUserData = data.map((conversationUser, index) => {

                    if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser?.sender
                        }
                    }
                    else if (conversationUser?.receiver?._id !== user?._id) {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser?.receiver
                        }
                    } else {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser?.sender
                        }
                    }
                })

                setAllConvo(conversationUserData)

            })
            setTrigger(false)
        }
    }, [ socketConnection, user, trigger ])

    
    const clickCountRef = useRef(0);
    const timeoutRef = useRef(null);
    
    const deleteConvo = (convId) => {
      clickCountRef.current += 1;
    
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    
      if (clickCountRef.current === 3) {
        clickCountRef.current = 0;
    
        setTrigger(true);
        dispatch(deleteConversation(convId));
        return;
      }
    
      timeoutRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 400);
    };
    
    return (
        <div style={{ width: "40%", height: "100%", borderRight: !darkMode ? "solid black" : "solid white" }}>

            <div style={{ width: "100%", height: "6vh", display: "flex", justifyContent: "center" }}>


                <button style={{ width: "100%", margin: "0.5vw", height: "4.2vh", background: "goldenRod" }} className='rounded' title='Search Users' onClick={() => setOpenSearchModal(true)}>🔎 Search</button>
            </div>

            <div style={{ width: "100%", height: "92%", display: "flex", flexDirection: "column", overflowY: "scroll" }} className='scrollBar'>

                {allConvo?.filter(user => user).map(user => {

                    return (
                        <div key={crypto.randomUUID()}>

                            <>
                                <Link to={`/messagePage/${user?.userDetails?._id}`} style={{ margin: "1vh", display: "flex", flexWrap: "wrap", minHeight: "15vh", maxHeight: "20vh" }} >
                                    <Card key={user?._id} style={{ width: "100%", padding: "1vh 0" }}>
                                        <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}>
                                            <Card.Body>

                                                <div style={{ textAlign: "center", width: "95%" }}>
                                                    <Card.Title style={{ fontSize: "small", display: "flex", justifyContent: "flex-end" }}>{moment(user?.lstMsg?.createdAt).format("hh:mm MMM Do YY")}</Card.Title>
                                                    <Card.Title style={{ fontVariant: "all-petite-caps" }}>{user?.userDetails?.accountName}</Card.Title>
                                                    {user?.unSeenMsg ? <Card.Text style={{ fontSize: "small", display: "flex", width: "fit-content", justifyContent: "center" }} className='blink'>📫: {user?.unSeenMsg}</Card.Text>
                                                        : ""}
                                                </div>
                                            </Card.Body>
                                            <div style={{ width: "100%", display: "flex", justifyContent: "end", padding: "0 1vw" }}>
                                                <button style={{ background: "red", width: "fit-content", padding: "0 1vw" }} className='rounded' onClick={() => deleteConvo(user?._id)}>Delete Convo</button>
                                            </div>
                                        </div>

                                    </Card></Link>
                            </>
                        </div>
                    )
                })
                }

            </div>

            <dialog open={openSearchUserModal} >
                <SearchUserModal setOpenSearchModal={setOpenSearchModal} />
            </dialog>


        </div>
    )
}

export default SideBar
