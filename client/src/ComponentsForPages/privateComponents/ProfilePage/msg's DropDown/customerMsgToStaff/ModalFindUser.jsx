import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import UserCard from './UserCard';

const ModalFindUser = ({ allUsers, setFindUser, quest, setTrigger, setResponse }) => {

    const authId = useSelector(state => state?.auth?.user?._id)

    const [data, setData] = useState("") 

 

    return (

        <div className='searchUserModal'>
            <button style={{ fontSize: "2rem" }} onClick={() => setFindUser(false)} >❎</button>
            <div style={{ width: "100%", height: "80vh" }} className='text-center flex flex-col items-center'>

            <select
                    name='data'
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    style={{ width: "80%", textAlign: "center", marginTop: "1vw", marginBottom: "1vw", height: "8vh", fontWeight: "bolder", background: "lightGrey" }}>

                    <option value="">➡️ Search User Staffing Positions ⬅️</option>
                    <option value="All">All NF Staff</option>
                    <option value="teacher">All Teachers</option>
                    <option value="mentor">All Mentors</option>
                    <option value="eventStaff">All Event Staff</option>
                    <option value="hiring">All Hiring Staff</option>
                    <option value="newsLetter">All NewsLetter Staff</option>
                    <option value="websiteSupportTeam">All Website Support</option>
                    <option value="staffCustomerService">All Customer Service</option>
                    <option value="NFadmin">All NF-Admin</option>

                </select>


                <>
                    {data === "" || data === "All" ?
                        (() => {
                            const list = allUsers?.filter(user => user?._id !== authId) || [];
                            return list.length === 0 ? (
                                <div>No users found.</div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                    <div style={{ width: "100%", display: "flex", flexWrap: "wrap", overflowX: "scroll" }} className='scrollBar'>
                                        {list.map(user => (
                                            <UserCard
                                                key={user?._id}
                                                user={user}
                                                setFindUser={setFindUser}
                                                quest={quest}
                                                setTrigger={setTrigger}
                                                setResponse={setResponse}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })()
                        : ""}

                    {data && data !== "All" && data !== "" ?
                        (() => {
                            const list = allUsers
                                ?.filter(user => user?._id !== authId && user?.[data]) || [];
                            return list.length === 0 ? (
                                <div>Currently No {data} Users .</div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                    <div style={{ width: "100%", display: "flex", flexWrap: "wrap", overflowX: "scroll" }}>
                                        {list.map(user => (
                                            <UserCard
                                                key={user?._id}
                                                user={user}
                                                setFindUser={setFindUser}
                                                quest={quest}
                                                setTrigger={setTrigger}
                                                setResponse={setResponse}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })()
                        : ""}
                </>


            </div>
        </div>
    )
}

export default ModalFindUser
