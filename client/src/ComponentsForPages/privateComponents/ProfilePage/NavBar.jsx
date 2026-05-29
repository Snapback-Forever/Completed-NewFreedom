import React from 'react'
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/reducers/authReducer';

const NavBar = ({ darkMode, setDarkMode, user }) => {

    const dispatch = useDispatch()

    const isBirthdayToday = (dateOfBirthString) => {
        if (!dateOfBirthString) return false;
        const today = moment();
        const dob = moment(dateOfBirthString, "YYYY-MM-DD");
        // Only compare month and day
        return today.month() === dob.month() && today.date() === dob.date();
    };


    return (

        <div>

            <div style={{ width: "100vw", height: "10vh", background: "white", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1vw" }} className='responsiveBirthday'>
                {isBirthdayToday(user?.dateOfBirth) ? (
                    <div style={{ width: "100vw", display: "flex", justifyContent: "space-around" }}>
                        <h1 className='happyBirthday' style={{ textAlign: "center" }}>🎈 Happy BirthDay {user?.accountName}!!! 🎂</h1>
                    </div>
                ) : <h4>Welcome: {user?.accountName}</h4>}

                <div style={{ display: "flex", alignItems: 'center', width: "15%" }} className='responsiveNavLogOut'>

                <button style={{ background: "red", padding: "0 2vw", height: "3vh" }} className='rounded' onClick={()=> dispatch(logout())}>LogOut</button>

                    {darkMode ?
                        <svg style={{ margin: "0 0.5vw", minHeight: "5vh", minWidth: "4vh", maxHeight: "5vh", maxWidth: "4vw", color: "black" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" onClick={() => setDarkMode(false)}>
                            <path fillRule="evenodd" d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z" clipRule="evenodd" />
                        </svg>

                        :
                        <svg style={{ margin: "0 0.5vw", minHeight: "5vh", minWidth: "4vh", maxHeight: "5vh", maxWidth: "4vw", color: "black" }} onClick={() => setDarkMode(true)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                        </svg>}

                    
                </div>

            </div>
        </div>

    )
}

export default NavBar
