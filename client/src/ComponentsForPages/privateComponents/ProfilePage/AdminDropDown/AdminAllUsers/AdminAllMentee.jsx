import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import AdminMenteeCard from "./AdminMenteeCard";
import { searchMailUser } from "../../../../../redux/reducers/menteeReducers";

const AdminAllMentee = ({ darkMode, setDarkMode, trigger, setTrigger, adminAllUsers, allMentee, allPrograms, setChangeContent, allUsers }) => {

const dispatch = useDispatch();

const mailUserSearchResults = useSelector((state) => state.mentee.mailUserSearchResults);
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
if (e.key === "Enter") {
handleSearch();
}
};

const handleShowMore = () => {
setVisibleCount((prev) => prev + 10);
};

const searchResults = mailUserSearchResults?.results || [];
const shouldShowSearchResults = hasSearched && searchResults.length > 0;
const shouldShowNoResults = hasSearched && mailUserSearchResults && searchResults.length === 0;
const menteesToRender = shouldShowSearchResults ? searchResults : allMentee;
const visibleMentees = menteesToRender.slice(0, visibleCount);

const isBirthdayToday = (dateOfBirthString) => {
if (!dateOfBirthString) return false;
const today = moment();
const dob = moment(dateOfBirthString, "YYYY-MM-DD");
return today.month() === dob.month() && today.date() === dob.date();
};

const titleText = hasSearched
  ? mailUserSearchResults?.message || "Search Results"
  : "All Mentees";

return (

<div style={{ display: "flex", flexDirection: "column", width: "100vw" }}>

<h2 style={{ textAlign: "center", color:  darkMode ? "white" : "black" }}>{titleText}</h2>

<div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginBottom: "1vh", gap: "1vw" }}>
    
<input type="text" value={searchInput} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Search mentees by name, email, inmate number..." style={{ border: "solid lightGrey", background: "white", width: "60%", height: "4vh" }} />
<div style={{ background: "goldenRod", padding: "0.5vh 1vw", height: "4vh" }} onClick={handleSearch}>🔍 Search</div>
</div>

{shouldShowNoResults && (
<h3 style={{ textAlign: "center" }}>No mentees found</h3>
)}

{!shouldShowNoResults && (
<div style={{ width: "100vw" }}>
    
{visibleMentees.reverse().map((mentee) => {

const baseUrl = "http://localhost:8080";
const imgSrcMentee =
mentee?.menteeImageFileId && mentee?.menteeImageBucketName
? `${baseUrl}/upload/image/${mentee?.menteeImageFileId}?bucketName=${mentee?.menteeImageBucketName}`
: mentee?.menteeImage;

return (
<div key={mentee?._id} style={{ margin: "1vh 0", display: "flex", justifyContent: "center" }}>
<AdminMenteeCard mentee={mentee} imgSrcMentee={imgSrcMentee} isBirthdayToday={isBirthdayToday} setTrigger={setTrigger} allPrograms={allPrograms} allUsers={allUsers} />
</div> 
)})}
</div>
)}

{visibleCount < menteesToRender.length && !shouldShowNoResults && (
<button onClick={handleShowMore} style={{ margin: "1vh 1vw", background: "goldenRod", height: "5vh" }}>
Show More Mentees
</button>

)}
</div>
);
};
export default AdminAllMentee;