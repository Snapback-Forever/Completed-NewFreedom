import React, { useRef } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux';
import { deleteDrawing } from '../../../../redux/reducers/drawingReducers';

const DrawingCard = ({ draw, setTrigger }) => {

    const dispatch = useDispatch()

    const timeoutRef = useRef(null);
    const lastTapRef = useRef(0)

    const baseUrl = 'http://localhost:8080';
    const imgSrc = (draw?.imageFileId && draw?.imageBucketName)
        ? `${baseUrl}/upload/image/${draw?.imageFileId}?bucketName=${draw?.imageBucketName}`
        : draw?.imageLink;

    const deleteThisDrawing = (id) => {
        const now = Date.now();
        const delay = 400;
        if (now - lastTapRef.current < delay) {
            dispatch(deleteDrawing(id))
            setTrigger(true)
        }
        lastTapRef.current = now;
    }

    return (

        <div style={{ width: '30vw', height: "50vh", display: 'flex', flexDirection: 'column', background: "rgba(250, 235, 215, 0.960)", overflowY: 'auto', padding: '1rem 1vw', margin: "1vh 1vw" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "small" }}>{moment(draw?.createdDate).format("hh:mm MMM Do YY")}</span>
            </div>
            <div style={{ height: "90%" }}>
                <img src={imgSrc} style={{ minWidth: "100%", maxWidth: "100%", minHeight: "30vh", maxHeight: "30vh" }} />

                {draw?.inmateNumbers?.filter(im => im).map(im => {
                    return (
                        <div key={im}>
                            <h6>Inmate Number: {im?.number}</h6>
                            <h6>Inmate State: {im?.state}</h6>
                        </div>
                    )
                })}

                {draw?.notes ? <h5>Notes: {draw?.notes}</h5> : ""}
            </div>

            <div style={{ display: "flex", justifyContent: "end" }} >
                <button style={{ background: "red", padding: "0 2vh" }} onClick={() => deleteThisDrawing(draw?._id)}>Delete Drawing</button>
            </div>
        </div>

    )
}

export default DrawingCard
