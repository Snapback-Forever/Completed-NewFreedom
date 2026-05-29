import React from 'react'
import { useState } from 'react';

const UserImage = ({ staff }) => {

    const [ viewImg, setViewImg ] = useState(false) 
    const baseUrl = "http://localhost:8080";
    const imgSrc =
    staff?.profilePicFileId && staff?.profilePicBucketName
      ? `${baseUrl}/upload/image/${staff.profilePicFileId}?bucketName=${staff.profilePicBucketName}`
      : staff?.profilePic;

  return (
    <div style={{ minHeight: "100%", maxHeight: "100%", minWidth: "30vw", maxWidth: "30vw" }} className='responsiveImageDiv'>
    <img src={imgSrc} style={{ minHeight: "98%", maxHeight: "98%", minWidth: "98%", maxWidth: "98%" }} className={viewImg ? "drawHover" : ""} onClick={()=> setViewImg(prev => !prev)} />
  </div>
  )
}

export default UserImage
