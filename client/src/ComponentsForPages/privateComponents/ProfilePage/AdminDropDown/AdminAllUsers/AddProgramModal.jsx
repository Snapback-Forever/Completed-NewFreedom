import React from 'react'
import Card from 'react-bootstrap/Card';
import DOMPurify from 'dompurify';

const AddProgramModal = ({ addProgramModal, setAddProgramModal, pro, handleProgramSelectFromModal }) => {

    return (

        <Card style={{ minWidth: "20vw", maxWidth: "20vw", minHeight: "50vh", maxHeight: "70vh", margin: "1vh 1vw", overflowX: "scroll" }} className='responsiveAddProgramCard'>

            <Card.Body>
            <h1 style={{ width: "100%", textAlign: "center", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pro?.programName) }} />
                <Card.Title>Type: {pro?.programType}</Card.Title>
                <Card.Title>Capacity Remaining: ({pro?.currentCapacity})</Card.Title>
                {pro?.location.length >= 1 ? <Card.Title>Program Location{pro?.location.length > 1 ? 's' : ""}: {pro?.location.filter(loc => loc).map(loc => {
                    return(
                        <>
                        {pro?.location.length > 1 ? <>{loc?.locationName},</> : <>{loc?.locationName}</>}
                        </>
                    )
                })}</Card.Title> : ""} 
            </Card.Body>
            <button style={{ background: "lightBlue", margin: "1vh 1vw" }} onClick={() => handleProgramSelectFromModal(pro?._id)}>Select This Program</button>
        </Card>

    )
}

export default AddProgramModal
