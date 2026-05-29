import React, { useEffect, useState } from 'react'

const DrawingsLandingHeader = ({ newGif, newGif2, darkMode, setDarkMode, allDrawing }) => {

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (!allDrawing || allDrawing.length === 0) return;
      // Start at the last one if you’re reversing
      setCurrentIndex(0);
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          // loop back to start when we hit the end
          return next >= allDrawing.length ? 0 : next;
        });
      }, 10000); // 10 seconds
      return () => clearInterval(interval);
    }, [allDrawing]);

    if (!allDrawing || allDrawing.length === 0) {
      return null; // or some fallback UI
    }

    // If you want newest first, you can reverse here:
    const orderedDrawings = [...allDrawing]
      .filter((draw) => draw)
      ;

    const currentDrawing = orderedDrawings[currentIndex];

    const baseUrl = 'http://localhost:8080';
    const imgSrc = (currentDrawing?.imageFileId && currentDrawing?.imageBucketName)
      ? `${baseUrl}/upload/image/${currentDrawing.imageFileId}?bucketName=${currentDrawing.imageBucketName}` : currentDrawing.imageLink

    return (

        <div style={{ display: 'flex' }} className='responsiveBorder'>

            {!darkMode ? <img src={imgSrc || newGif} style={{  width: "30vw", maxHeight: "50vh" }} className='responsiveImage' /> :
                <img src={imgSrc ||newGif2} style={{ width: "30vw", maxHeight: "50vh" }} className='responsiveImage' />}

            <div style={{ height: "50vh", width: "70vw", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} className='responsiveMessage'>

                <div style={{ width: "80%", color: darkMode ? "white" : "black" }}>
                    <h1 style={{ width: "100%", textAlign: "center" }}>Drawings Sent To New Freedom</h1>

                </div>
                <br />
                <h4 style={{ width: "80%", color: darkMode ? "white" : "black", textAlign: "center" }}>
                    All Images have been sent to New Freedom and We would like To Present all the great art we enjoy to receive. Thank You To Everyone who donates a Drawing.
                </h4>

            </div>
        </div>

    )
}

export default DrawingsLandingHeader
