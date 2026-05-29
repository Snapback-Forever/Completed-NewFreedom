import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AllMenteeCard from "./AllMenteeCard";
import { searchMailUser } from "../../../../redux/reducers/menteeReducers";

const MenteeModal = ({ allMentee, setTrigger, setOpenModal, pro }) => {

  const dispatch = useDispatch();
  const mailUserSearchResults = useSelector(state => state?.mentee?.mailUserSearchResults);

  const [searchInput, setSearchInput] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const handleSearch = () => {
    const value = searchInput.trim();
    setHasSearched(true);
    if (!value) return;
    dispatch(searchMailUser({ q: value }));
    setVisibleCount(10);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value.trim() === "") {
      setHasSearched(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };
  const handleShowMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const searchResults = mailUserSearchResults?.results || [];
  const menteesToRender = hasSearched ? searchResults : allMentee;
  const visibleMentees = menteesToRender.slice(0, visibleCount);
  const shouldShowNoResults =
    hasSearched && mailUserSearchResults && searchResults.length === 0;

  return (

    <div className="searchMenteeModal">
      <button style={{ fontSize: "2rem" }} onClick={() => setOpenModal("")}>❎</button>
      <div style={{ textAlign: "center", marginBottom: "1vh" }}>
        
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search Students..."
          style={{ width: "60%", height: "4vh", marginRight: "1vw", border: "solid black" }}
        />

        <div
          onClick={handleSearch}
          style={{ background: "goldenRod", height: "4vh", padding: "0 2vw" }}
        >🔍 Search</div>

      </div>

      {shouldShowNoResults && (
        <h2 style={{ textAlign: "center" }}>No Students Found</h2>
      )}

      {!shouldShowNoResults && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <h2 style={{ textAlign: "center", width: "100%" }}>
            Select A Student
          </h2>
          {visibleMentees.map((mentee) => (
            <AllMenteeCard
              key={mentee._id}
              mentee={mentee}
              setTrigger={setTrigger}
              pro={pro}
              setOpenModal={setOpenModal}
            />
          ))}
        </div>
      )}

      {visibleCount < menteesToRender.length && !shouldShowNoResults && (
        <button
          onClick={handleShowMore}
          style={{ margin: "1vh", background: "goldenRod", height: "5vh" }}
        >Show More Students</button>

      )}
    </div>
  );
};
export default MenteeModal;