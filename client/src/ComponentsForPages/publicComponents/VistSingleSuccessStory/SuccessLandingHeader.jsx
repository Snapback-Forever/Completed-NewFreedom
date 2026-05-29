import React, { useEffect, useState } from 'react';
import moment from 'moment';

const SuccessLandingHeader = ({ darkMode, setDarkMode, singleStory, newGif, newGif2 }) => {
  const baseUrl = 'http://localhost:8080';

  const imgSrc = singleStory?.imageFileId && singleStory?.imageBucketName ? `${baseUrl}/upload/image/${singleStory.imageFileId}?bucketName=${singleStory.imageBucketName}` : singleStory?.imageUrl;

  const backgroundImage = imgSrc || (darkMode ? newGif2 : newGif);

  return (
    <div style={{ display: 'flex', backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', width: '100vw', minHeight: '60vh', justifyContent: "center", alignItems: "center" }}>
      <div style={{ height: "30vh", width: "80vw", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: 'rgba(255, 255, 255, 0.766)' }} className='responsiveMessage'>
        <h1 style={{ textAlign: "center" }}>{singleStory?.firstName} {singleStory?.lastName}</h1>

        <h5  style={{ textAlign: "center" }}>Program Completed: {singleStory?.programName} {singleStory?.lastName}</h5>
        <h5  style={{ textAlign: "center" }}>Graduation Date: {moment(singleStory?.graduationDate).format("MMM Do, YYYY")}</h5>
        <h1  style={{ textAlign: "center" }}>{singleStory?.title}</h1>
      </div>
    </div>
  );
};

export default SuccessLandingHeader;
