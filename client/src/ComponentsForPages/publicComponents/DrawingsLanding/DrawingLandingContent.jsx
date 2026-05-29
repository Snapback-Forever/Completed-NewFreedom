import React, { useState } from "react";

import noImage from "../../../images/noImageNF.png";
import DrawingCard from "./DrawingCard";

const PAGE_SIZE = 12;

const DrawingLandingContent = ({ darkMode, setDarkMode, allDrawing }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showMore, setShowMore] = useState(true);

  const drawings = allDrawing?.filter((draw) => draw) || [];
  const visibleDrawings = drawings.slice(0, visibleCount);

  const handleToggleImages = () => {
    if (showMore) {
      const nextCount = Math.min(visibleCount + PAGE_SIZE, drawings.length);
      setVisibleCount(nextCount);

      if (nextCount >= drawings.length) {
        setShowMore(false);
      }
    } else {
      setVisibleCount(PAGE_SIZE);
      setShowMore(true);
    }
  };

  const hasButton = drawings.length > PAGE_SIZE;

  return (
    <div>
      <div style={{ minHeight: "38%", display: "flex", flexWrap: "wrap", justifyContent: "center", margin: "1vh", gap: "1vw", color: !darkMode ? "black" : "white" }}>
        {drawings.length === 0 ? (
          <h2 style={{ width: "100%", textAlign: "center" }}>Currently No Drawings To Show</h2>
        ) : (
          <>
            {visibleDrawings.map((draw, index) => {
              const baseUrl = "http://localhost:8080";
              const imgSrc = draw?.imageFileId && draw?.imageBucketName ? `${baseUrl}/upload/image/${draw.imageFileId}?bucketName=${draw?.imageBucketName}` : draw.imageLink;

              return <DrawingCard key={draw._id || index} imgSrc={imgSrc} noImage={noImage} draw={draw} />;
            })}
          </>
        )}
      </div>

      {hasButton && (
        <button
          onClick={handleToggleImages}
          style={{ width: "100vw", margin: "20px auto", padding: "10px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "16px", background: showMore ? "goldenrod" : "lime" }}
        >
          {showMore ? "More images" : "Show less images"}
        </button>
      )}
    </div>
  );
};

export default DrawingLandingContent;
