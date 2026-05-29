import React from 'react'
import { useState } from 'react';

const ImageCard = ({ user }) => {

  const [viewImg, setViewImg] = useState(false)

  const baseUrl = 'http://localhost:8080';
  const imgSrc =
    (user?.profilePicFileId && user?.profilePicBucketName)
      ? `${baseUrl}/upload/image/${user.profilePicFileId}?bucketName=${user.profilePicBucketName}`
      : user?.profilePic || '/fallback-avatar.png'; // optional fallback

  return (
    <img
      src={imgSrc}
      style={{ margin: "0 0.5vw", border: "solid lightGrey", minWidth: "98%", minHeight: "25vh", maxWidth: "98%", maxHeight: "35vh" }}
      alt={`${user?.firstName} ${user?.lastName}`}
      className={viewImg ? "drawHover" : ""} onClick={() => setViewImg(prev => !prev)}
    />
  )
}

export default ImageCard
