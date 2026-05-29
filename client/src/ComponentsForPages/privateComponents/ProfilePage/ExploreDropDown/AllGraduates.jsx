import React from 'react'

import AllGradCard from './AllGradCard';

const AllGraduates = ({ allGraduates, trigger, setTrigger, darkMode, setDarkMode }) => {



    return (

        <div style={{ width: '100vw', minHeight: '84vh', display: 'flex', flexWrap: "wrap", justifyContent: "center" }}>
            {allGraduates.filter(grad => grad).length === 0 ? <h2 style={{ textAlign: "center", height: "5vh", color: darkMode ? "white" : "black" }}>Currently No Graduates to View</h2> :
                <div>
                    <h2 style={{ textAlign: "center", height: "5vh", color: darkMode ? "white" : "black" }}>All Graduates</h2>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>

                        {allGraduates.filter(grad => grad).reverse().map(grad => {
                            return (
                                <AllGradCard grad={grad} setTrigger={setTrigger} key={grad?._id} />
                            )
                        })}
                    </div>
                </div>}

        </div>

    )
}

export default AllGraduates
