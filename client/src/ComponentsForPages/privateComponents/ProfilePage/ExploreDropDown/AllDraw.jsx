import React, { useState } from "react";
import DrawingCard from "./DrawingCard";

const PAGE_SIZE = 10;

const AllDraw = ({ darkMode, setDarkMode, trigger, setTrigger, allDrawings }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showMore, setShowMore] = useState(true);

  const drawings = allDrawings?.filter((draw) => draw) || [];
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
      {drawings.length === 0 ? (
        <h2 style={{ textAlign: "center", color: darkMode ? "white" : "black" }}>Currently No Drawings</h2>
      ) : (
        <>
          <h2 style={{ textAlign: "center", color: darkMode ? "white" : "black" }}>All Drawings</h2>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {visibleDrawings.map((draw, index) => {
              return <DrawingCard draw={draw} setTrigger={setTrigger} key={draw._id || index} />;
            })}
          </div>
        </>
      )}

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

export default AllDraw;
