import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUserList } from "../../../../../redux/reducers/authReducer";
import SearchUserCard from "./SearchUserCard";


const AdminMentorModal = ({ allUsers, mentee, setAddMentorModal, setTrigger }) => {

const dispatch = useDispatch();

const userSearchResults = useSelector((state) => state.auth.userSearchResults);
const admin = useSelector((state) => state.auth.user);

const [searchInput, setSearchInput] = useState("");
const [hasSearched, setHasSearched] = useState(false);
const [visibleCount, setVisibleCount] = useState(20);

const handleSearch = () => {
const value = searchInput.trim();
setHasSearched(true);
if (!value) return;
dispatch(searchUserList({ q: value }));
setVisibleCount(20);
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
setVisibleCount((prev) => prev + 20);
};

const searchResults = userSearchResults?.results || [];
const shouldShowSearchResults = hasSearched && searchResults.length > 0;
const shouldShowNoResults = hasSearched && userSearchResults && searchResults.length === 0;
const usersToRender = shouldShowSearchResults ? searchResults : allUsers;
const visibleUsers = usersToRender.slice(0, visibleCount);

return (
<div className="searchUserModal">

<button style={{ fontSize: "3vh" }} onClick={() => setAddMentorModal(false)}>❎</button>

{!shouldShowNoResults && !userSearchResults.message ? (
<h3 style={{ textAlign: "center" }}>Find A User To Attach To Mentee</h3>
) : (
    <h3 style={{ textAlign: "center" }}>{userSearchResults.message}</h3>
    )}

<div style={{ display: "flex", justifyContent: "center", gap: "1vw", marginBottom: "1vh" }}>

<input
type="text"
value={searchInput}
onChange={handleInputChange}
onKeyDown={handleKeyDown}
placeholder="Search users..."
style={{ border: "solid lightGrey", background: "white", width: "60%", height: "4vh" }}
/>

<div style={{ background: "goldenRod", padding: "0.5vh 1vw", height: "4vh" }} onClick={handleSearch}>🔍 Search</div>

</div>

{shouldShowNoResults && (
<h3 style={{ textAlign: "center" }}>No users found</h3>
)}

{!shouldShowNoResults && (

<div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>

{visibleUsers.filter(user => !user?.accountDisabled).map((user) => {
return (

<div key={user?._id} style={{ border: "1px solid lightgrey", padding: "1vh 1vw", margin: "1vh 1vw", width: "30%" }}>
<SearchUserCard user={user} admin={admin} setAddMentorModal={setAddMentorModal} setTrigger={setTrigger} mentee={mentee} />
</div>
 ) })}

</div>
)}

{visibleCount < usersToRender.length && !shouldShowNoResults && (
<button onClick={handleShowMore} style={{ marginTop: "1vh", background: "goldenRod", padding: "1vh 1vw" }} > Show More Users </button>
)}
</div>
);
};
export default AdminMentorModal;