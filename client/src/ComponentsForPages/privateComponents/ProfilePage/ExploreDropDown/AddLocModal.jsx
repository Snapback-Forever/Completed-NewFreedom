import React from 'react'
import moment from 'moment'
import DOMPurify from 'dompurify'
import { useDispatch } from 'react-redux';
import { addEventToLocation } from '../../../../redux/reducers/eventReducers';

const AddLocModal = ({ setAddLocation, event, allLocations, setTrigger }) => {

    const dispatch = useDispatch()

    const addThisLocation = (locId) => {

        const form = {
            locationId: locId,
            eventId: event?._id
        }

        dispatch(addEventToLocation(form))
        setTrigger(true)
        setAddLocation(false)
    }

    return (
        <div className="searchLocationModal scrollBar" >
            <button style={{ fontSize: "2rem" }} onClick={() => setAddLocation(false)}>❎</button>

            {allLocations?.filter(loc => !event?.upcomingEvent?.some(e => e?._id === loc?._id)).length === 0 ? <h2 style={{ textAlign: "center" }}>Currently No Locations To Add</h2> : <>
            <h2 style={{ textAlign: "center" }}>Select A Location To Add To Event</h2>
            <div style={{ padding: "1vh 1vw", display: "flex", flexWrap: "wrap", width: '100%' }}>

                {allLocations?.filter(loc => !event?.upcomingEvent?.some(e => e?._id === loc?._id)).map(loc => {
                    const baseUrl = "http://localhost:8080";
                    const imgSrc = loc?.locImageFileId && loc?.locImageBucketName
                        ? `${baseUrl}/upload/image/${loc?.locImageFileId}?bucketName=${loc?.locImageBucketName}`
                        : loc?.locationImage;
                    return (
                        <div style={{ minWidth: "48%", maxWidth: "48%", border: "solid black", padding: "1vh 1vw", margin: "0.5vh 0.5vw" }} key={loc?._id}>
                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: "small" }}><b>Connected:</b> {moment(loc?.createdAt).format("hh:mm MMM Do YY")}</span>
                            </div>
                            <img src={imgSrc} style={{ minHeight: "20vh", maxHeight: "20vh", minWidth: "100%", maxWidth: "100%" }} />
                            <h2 style={{ textAlign: "center" }}>{loc?.locationName}</h2>
                            <h4>Phone Number: {loc?.locationPhoneNumber}</h4>

                            <div style={{ border: "double black", display: "flex", flexDirection: "column", padding: "1vh 1vw" }}>
                                <b>Location Address:</b>
                                <h4>Street: {loc?.mailingAddress.street}</h4>
                                <div style={{ display: "flex" }}>
                                    <h4>{loc?.mailingAddress.city}, </h4>
                                    <h4 style={{ marginLeft: "0.5vw" }}>{loc?.mailingAddress.state}</h4>
                                </div>
                                <h4>{loc?.mailingAddress.zipCode}</h4>
                            </div>
                            <h4>Gender: {loc?.facilitySex}</h4>
                            <h4>Remaining Capacity: ({loc?.currentCapacity})</h4>

                            <div style={{ width: "100%", display: "flex", justifyContent: "end" }} >
                                <button style={{ background: "goldenRod", padding: "0 2vw" }} onClick={() => addThisLocation(loc?._id)} >Add Location</button>
                            </div>

                        </div>
                    )
                })}
            </div></>}
        </div>
    )
}

export default AddLocModal
