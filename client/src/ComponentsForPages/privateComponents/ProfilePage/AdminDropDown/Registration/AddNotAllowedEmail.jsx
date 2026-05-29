import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNotAllowedEmail, getAllNotAllowedEmails, removeNotAllowedEmail } from '../../../../../redux/reducers/authReducer';

const AddNotAllowedEmail = ({ darkMode, setDarkMode, trigger, setTrigger }) => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const allowedEmails = useSelector((state) => state.auth.allAllowedEmails);
    const notAllowedEmails = useSelector((state) => state.auth.allNotAllowedEmail);
 
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

    const clickCount = useRef(0);
    const clickTimer = useRef(null);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.email?.trim()) return;
        dispatch(addNotAllowedEmail(form));
        setTrigger(true);
        };
    
    const handleDeleteNotAllowed = (emailToRemove) => {
      if (!user?._id) return;
    
      clickCount.current += 1;
    
      if (clickCount.current === 1) {
        clickTimer.current = setTimeout(() => {
          clickCount.current = 0;
        }, 800);
      }
    
      if (clickCount.current >= 3) {
        clearTimeout(clickTimer.current);
        clickCount.current = 0;
    
        dispatch(removeNotAllowedEmail({
          userId: user._id,
          email: emailToRemove
        }));
        setTrigger(true);
      }
    };
    

    useEffect(() => {
        dispatch(getAllNotAllowedEmails());
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

                <h1 style={{ color: "black" }}>Block From Registration & Website Login</h1>
                
                <form
                    onSubmit={handleSubmit}
                    style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <label style={labelStyle} htmlFor="email">Add User To Not Allowed Emails </label>
                    <input id="email" name="email" type="text" value={form.email} onChange={handleInput} placeholder="Enter one or more emails, separated by commas" style={inputStyle} />
                    <button type="submit" style={{ background: 'green', color: 'white', width: '80%', height: '5vh', margin: '1vh 0' }}>Add Not Allowed Email(s)</button>
                </form>
        
                <div style={listContainerStyle}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Not Allowed Emails </div>
                    {Array.isArray(notAllowedEmails) && notAllowedEmails.length > 0 ? (
                        notAllowedEmails.map((em) => (
                            <div key={em}  style={{ background : "white", width: "98%", margin: "1vh", display: "flex", justifyContent: "space-between" }}>
                                <h3>{em}</h3>
                                <button type="button" style={deleteButtonStyle} onClick={() => handleDeleteNotAllowed(em)}>Remove</button>
                            </div>
                        ))
                    ) : (
                        <div style={{ fontSize: '0.85rem', color: '#555' }}>Currently No Not Allowed Emails. </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddNotAllowedEmail
