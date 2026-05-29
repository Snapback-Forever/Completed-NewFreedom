import React from 'react'
import moment from 'moment'
import DOMPurify from 'dompurify';
import { useDispatch } from 'react-redux';
import { attachProgramToLocation } from '../../../../redux/reducers/locationReducer';

const LocationModal = ({ setTrigger, allLocations, setOpenModal, pro }) => {

    const dispatch = useDispatch()

    const attachLocation = (locId) => {
        const payload = {
            locationId: locId,
            programId: pro?._id
        }
        dispatch(attachProgramToLocation(payload))
        setTrigger(true)
        setOpenModal("")
    }

    const availableLocations = allLocations?.filter(loc => !pro?.location?.some(lo => lo?._id === loc?._id));

    return (
        <div className='searchLocationModal'>
            <button style={{ fontSize: "2rem" }} onClick={() => setOpenModal("")} >❎</button>


            <div style={{ display: "flex", flexWrap: "wrap" }}>
            {availableLocations?.length === 0 ? <h2 style={{ textAlign: "center", width: '100%' }}>No Locations To Select</h2> : <>
            <h2 style={{ textAlign: "center", width: "100%" }}>Select A Location</h2>
            {availableLocations?.map(loc => {
                    const baseUrl = 'http://localhost:8080';
                    const imgSrc = (loc?.locImageFileId && loc?.locImageBucketName)
                        ? `${baseUrl}/upload/image/${loc.locImageFileId}?bucketName=${loc.locImageBucketName}` : loc.locationImage
                    return (
                        <div style={{ minWidth: "20vw", maxWidth: "20vw", minHeight: "40vh", maxHeight: "40vh", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 1vw", padding: "1vh 1vw" }}>

                            <div style={{ padding: "1vh 1vw" }}>
                                <span style={{ fontSize: "small" }}>{moment(loc?.createdDate).format("hh:mm MMM Do YY")}</span>
                                <img src={imgSrc} style={{ minWidth: "100%", maxWidth: "100%", minHeight: "20vh", maxHeight: "20vh", }} />
                                <h3 style={{ width: "100%", textAlign: "center", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(loc?.locationName) }} />
                                <h6 >Capacity Remaining: {loc?.currentCapacity}</h6>
                                <h6 >Location Gender: {loc?.facilitySex}</h6>
                                <h6 >Programs Attached: ({loc?.programs.length})</h6>
                                <div style={{ width: "100%", display: 'flex', justifyContent: "space-between" }}>

                                    <button style={{ background: "lightBlue", width: "100%" }} onClick={() => attachLocation(loc?._id)}>Select Location</button>

                                </div>
                            </div>
                        </div>
                    )
                })}</>}
            </div>
        </div>
    )
}

export default LocationModal
