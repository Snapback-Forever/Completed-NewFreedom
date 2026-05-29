import React, { useState } from "react";
import AllProCard from "./AllProCard";
import { useSelector } from "react-redux";

const AllProgram = ({ trigger, setTrigger, allPrograms, darkMode, setDarkMode, allLocations, allUsers, allMentee, setChangeContent }) => {

  const admin = useSelector(state => state.auth.user);

  const [changeVoc, setChangeVoc] = useState("all");
  const [visibleCount, setVisibleCount] = useState(10);

  const validPrograms = (allPrograms || []).filter(Boolean);

  const filteredPrograms = validPrograms
    .slice()
    .reverse()
    .filter(pro => {
      if (changeVoc === "noVoc") return pro?.programType !== "vocational";
      if (changeVoc === "voc") return pro?.programType === "vocational";
      return true;
    });

  const visiblePrograms = filteredPrograms.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const handleFilterChange = (value) => {
    setChangeVoc(value);
    setVisibleCount(10);
  };

  return (

    <div style={{ width: "100vw", minHeight: "84vh", display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      <div style={{ background: "white", width: "100%", display: "flex", justifyContent: "center" }}>
        <button style={{ background: "goldenRod", width: "30%", margin: "0.5vh 0.5vw" }} className="rounded" onClick={() => handleFilterChange("all")}>All Programs</button>
        <button style={{ background: "goldenRod", width: "30%", margin: "0.5vh 0.5vw" }} className="rounded" onClick={() => handleFilterChange("noVoc")}>Non-Vocational</button>
        <button style={{ background: "goldenRod", width: "30%", margin: "0.5vh 0.5vw" }} className="rounded" onClick={() => handleFilterChange("voc")}>Vocational</button>
      </div>

      {(admin?.creator || admin?.NFadmin) && (
        <button onClick={() => setChangeContent("createPro")} style={{ width: "100%", background: "goldenRod", margin: "1vh 0" }}>
          Create A Program
        </button>
      )}

      {changeVoc === "all" && filteredPrograms.length === 0 ? (
        <h2 style={{ textAlign: "center", height: "5vh", color: darkMode ? "white" : "black" }}>Currently No Programs to View</h2>
      ) : changeVoc === "noVoc" && filteredPrograms.length === 0 ? (
        <h2 style={{ textAlign: "center", height: "5vh", color: darkMode ? "white" : "black" }}>Currently No Non-Vocational Programs to View</h2>
      ) : changeVoc === "voc" && filteredPrograms.length === 0 ? (
        <h2 style={{ textAlign: "center", height: "5vh", color: darkMode ? "white" : "black" }}>Currently No Vocational Programs to View</h2>
      ) : (
        <div>
          <h2 style={{ textAlign: "center", height: "5vh", color: darkMode ? "white" : "black" }}>
            {changeVoc === "all" ? "All Programs" : changeVoc === "noVoc" ? "All Non-Vocational Programs" : "All Vocational Programs"}
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            {visiblePrograms.map(pro => (
              <div key={pro?._id} style={{ display: "flex", justifyContent: "center" }}>
                <AllProCard pro={pro} setTrigger={setTrigger} allLocations={allLocations} allUsers={allUsers} allMentee={allMentee} />
              </div>
            ))}
          </div>

          {visibleCount < filteredPrograms.length && (
            <button onClick={handleShowMore} style={{ margin: "1vh 1vw", background: "goldenRod", height: "5vh", width: "100%" }}>
              Show More Programs
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AllProgram;
