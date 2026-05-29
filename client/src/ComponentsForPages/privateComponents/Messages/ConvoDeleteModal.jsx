
import Button from 'react-bootstrap/Button';

import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { deleteConversation } from '../../../redux/reducers/messageReducers';


const ConvoDeleteModal = ({ setOpenDeleteConvo, deleteConvoId }) => {

    const dispatch = useDispatch()

    const deleteConvo = () => {
        dispatch(deleteConversation(deleteConvoId))
        setOpenDeleteConvo(false)
    }

    return (

        <div className='deleteConvoModal'>
            <div style={{ width: "100%", height: "70%", textAlign: "center" }}>
                <h2 className='blink'>WARNING</h2>
                <h6>If you delete this conversation it will remove this message from your account AND the other persons account!!! 
                    <br /> <br /><b>YOU <span style={{ fontSize: "x-large" }}>"WILL NOT"</span> BE ABLE TO RECOVER THIS MESSAGE!!!</b> 
                    <br /><br /><u>ARE YOU SURE YOU WANT TO PROCEED???</u>
                </h6>
            </div>
            <div style={{ height: "30%", display: "flex", flexDirection: "column" }}>
                <Button onClick={() => setOpenDeleteConvo(false)} variant='success' style={{ marginBottom: "1vh" }}>Cancel</Button>
                <Button onClick={() => deleteConvo()} variant='danger'>Delete </Button>
            </div>
        </div>

    )
}

export default ConvoDeleteModal
