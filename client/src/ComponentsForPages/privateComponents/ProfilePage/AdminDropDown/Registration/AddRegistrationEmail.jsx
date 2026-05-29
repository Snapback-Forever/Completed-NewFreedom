import React, { useEffect, useState } from 'react';
import { useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getAllAllowedEmails, getAllNotAllowedEmails, makeAllowedEmail, removeAllowedEmail } from '../../../../../redux/reducers/authReducer';

const AddRegistrationEmail = ({ darkMode, setDarkMode, trigger, setTrigger }) => {

    const dispatch = useDispatch();

    const lastTapRef = useRef(0);

    const user = useSelector((state) => state.auth.user);
    const allowedEmails = useSelector((state) => state.auth.allAllowedEmails);
    const notAllowedEmails = useSelector((state) => state.auth.allNotAllowedEmail);
    const apiMessage = useSelector((state) => state.auth.apiMessage); // optional

    const [form, setForm] = useState({
        userId: user?._id,
        email: '',
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.email?.trim()) return;
        dispatch(makeAllowedEmail(form))
        setTrigger(true)
    };

    const handleDeleteAllowed = (emailToRemove) => {
        if (!user?._id) return;
        const now = Date.now();
        const delay = 400;
        if (now - lastTapRef.current < delay) {
          dispatch(removeAllowedEmail({
            userId: user?._id,
            email: emailToRemove
          }));
          setTrigger(true);
        }
        lastTapRef.current = now;
      };

    useEffect(() => {
        dispatch(getAllAllowedEmails());

    }, [ trigger, allowedEmails, form ]);

    const labelStyle = {
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5vw',
    };

    const inputStyle = {
        border: 'solid lightGrey',
        background: 'white',
        width: '80%',
    };

    const listContainerStyle = {
        marginTop: '1rem',
        width: '100%',
        maxHeight: '40vh',
        overflowY: 'auto',
        borderTop: '1px solid lightgrey',
        paddingTop: '0.75rem',
    };

    const listItemStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.25rem 0.5rem',
        borderBottom: '1px solid #eee',
        fontSize: '0.9rem',
    };

    const deleteButtonStyle = {
        border: '1px solid #c00',
        background: '#fbe9e9',
        color: '#c00',
        padding: '0.1rem 0.5rem',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    return (
        <div
            style={{ width: '100vw', minHeight: '84vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '2vh 0' }} >

            <div
                style={{ width: '90%', minHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', background: 'rgba(250, 235, 215, 0.960)', overflowY: 'auto', padding: '1rem' }}>

                <h1 style={{ color: "black" }}>Add A User To Be Allowed To Register</h1>
                <form
                    onSubmit={handleSubmit}
                    style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>

                    <label style={labelStyle} htmlFor="email">Add User To Allowed Emails </label>

                    <input id="email" name="email" type="text" value={form.email}onChange={handleInput} placeholder="Enter one or more emails, separated by commas" style={inputStyle}/>
                    <button type="submit" style={{ background: 'green', color: 'white', width: '80%', height: '5vh', margin: '1vh 0' }}>Add Allowed Email(s)</button>

                </form>

                {apiMessage && ( <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>{apiMessage}</div> )}

                <div style={listContainerStyle}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Allowed Emails </div>

                    {Array.isArray(allowedEmails) && allowedEmails.length > 0 ? (

                        allowedEmails.map((em) => (
                            <div key={em}  style={{ background : "white", width: "98%", margin: "1vh", display: "flex", justifyContent: "space-between" }}>
                                <h3>{em}</h3>
                                <button type="button" style={deleteButtonStyle} onClick={() => handleDeleteAllowed(em)}>Remove</button>
                            </div>

                        ))
                    ) : (

                        <div style={{ fontSize: '0.85rem', color: '#555' }}>Currently No Allowed Emails. </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default AddRegistrationEmail;