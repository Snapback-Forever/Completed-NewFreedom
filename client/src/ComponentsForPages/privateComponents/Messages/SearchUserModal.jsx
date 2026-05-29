import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllUsers, searchUserList } from "../../../redux/reducers/authReducer"
import UserSearchCard from "./UserSearchCard"

const SearchUserModal = ({ openSearchUserModal, setOpenSearchModal }) => {

  const dispatch = useDispatch()

  const allUsers = useSelector(state => state?.auth?.allUsers)
  const searchResults = useSelector(state => state?.auth?.userSearchResults?.results)
  const authId = useSelector(state => state?.auth?.user?._id)

  const [data, setData] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [visibleCount, setVisibleCount] = useState(10)

  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch])

  const roleLabels = {
    NFadmin: "NF Admin",
    teacher: "Teachers",
    mentor: "Mentors",
    eventStaff: "Event Staff",
    hiring: "Hiring Staff",
    newsLetter: "Newsletter Staff",
    websiteSupportTeam: "Website Support",
    staffCustomerService: "Customer Service"
  }

  const handleSearch = () => {
    const value = searchInput.trim();
  
    if (!value) return;
  
    setHasSearched(true);
    dispatch(searchUserList({ q: value }));
    setVisibleCount(10);
    setData("");
  };
  


  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchInput(value)
    if (value.trim() === "") setHasSearched(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch()
  }

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 10)
  }

  const baseUsers = hasSearched ? searchResults : allUsers

  const filteredUsers = (baseUsers || []).filter(user => {
    if (user?._id === authId) return false
    if (user?.accountDisabled) return false
    if (data === "" || data === "All") return true
    return user?.[data]
  })

  const visibleUsers = filteredUsers.slice(0, visibleCount)

  let emptyMessage = ""
  if (hasSearched && filteredUsers.length === 0) emptyMessage = "No Search Results Found"
  if (!hasSearched && data && data !== "All" && filteredUsers.length === 0)
    emptyMessage = `No ${roleLabels[data]} Found`

  let resultsMessage = ""
  if (!hasSearched && data && data !== "All" && filteredUsers.length > 0)
    resultsMessage = `All ${roleLabels[data]}`
  if (hasSearched && filteredUsers.length > 0)
    resultsMessage = `${filteredUsers.length} Search Results`

  return (

    <div className="searchUserModal">

      <button style={{ fontSize: "2rem" }} onClick={() => setOpenSearchModal(false)}>
        ❎
      </button>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {data === "" ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", gap: "1vw", marginBottom: "1vh" }}>
          <input
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search users by name, email, phone..."
            style={{ border: "solid lightGrey", background: "white", width: "60%", height: "4vh" }}
          />

          <div
            onClick={handleSearch}
            style={{ background: "goldenRod", padding: "0.5vh 1vw", height: "4vh", margin: "1vh" }}
          >🔍 Search</div>
        </div> : ""}

        {!searchInput ?
          <select
            value={data}
            onChange={(e) => { setData(e.target.value); setVisibleCount(10); }}
            style={{ width: "60%", textAlign: "center", margin: "1vh 0", height: "5vh", fontWeight: "bold", background: "lightGrey" }}
          >
            <option value="">➡️ Search User Staffing Positions ⬅️</option>
            <option value="teacher">All-Teachers</option>
            <option value="mentor">All-Mentors</option>
            <option value="eventStaff">All-Event-Staff</option>
            <option value="hiring">All-Hiring-Staff</option>
            <option value="newsLetter">All-NewsLetter-Staff</option>
            <option value="websiteSupportTeam">All-Website-Support</option>
            <option value="staffCustomerService">All-Customer-Service</option>
            <option value="NFadmin">All-NF-Admin</option>
          </select> : ""}

        {resultsMessage && (
          <h3 style={{ textAlign: "center", marginBottom: "1vh" }}>
            {resultsMessage}
          </h3>
        )}

        {emptyMessage && (
          <h3 style={{ textAlign: "center" }}>
            {emptyMessage}
          </h3>
        )}

        {!emptyMessage && (
          <div style={{ width: "100%", height: "70vh", display: "flex", flexWrap: "wrap" }}>

            {visibleUsers.map(user => (
              <UserSearchCard
                key={user._id}
                user={user}
                setOpenSearchModal={setOpenSearchModal}
              />
            ))}

          </div>
        )}

        {visibleCount < filteredUsers.length && !emptyMessage && (
          <button
            onClick={handleShowMore}
            style={{ margin: "1vh", background: "goldenRod", height: "5vh" }}
          >
            Show More Users
          </button>
        )}

      </div>
    </div>
  )
}

export default SearchUserModal
