import React, { useState } from 'react'
import DOMPurify from 'dompurify';
import moment from 'moment'
import { Link } from 'react-router-dom';

const SuccessCard = ({ story }) => {

    const [onHover, setOnHover] = useState(false)

    const baseUrl = 'http://localhost:8080';

    const imgSrc = story?.imageFileId && story?.imageBucketName
                      ? `${baseUrl}/upload/image/${story.imageFileId}?bucketName=${story.imageBucketName}`
                      : story?.imageUrl;

  return (

    <div style={{ width: "90vw", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 0", display: "flex", flexDirection: "column", border: "solid antiqueWhite", padding: "1vw" }}>

    <div>{moment(story?.createdAt).format("MMM Do, YYYY")}</div>
    <div style={{ display: "flex", margin: "1vh 1vw" }}>
        <img src={imgSrc} style={{ minWidth: "10vw", maxWidth: "10vw", minHeight: "10vh", maxHeight: "10vh" }} onClick={()=> setOnHover(prev => !prev)} className={onHover ? "drawHover" : ''} />
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <h3 style={{ textAlign: "center", width: "100%" }}>{story?.title}</h3>
    <h6 style={{ textAlign: "center", width: "100%" }}>By: {story?.displayName}</h6>
    </div>
    </div>
    <Link key={story?._id} to={`/successStory/${story?._id}`} style={{ color: "black" }}>
        <button style={{ textAlign: "center", width: "100%", background: "goldenRod" }}>View This Story</button>
    </Link>
</div>

  )
}

export default SuccessCard
