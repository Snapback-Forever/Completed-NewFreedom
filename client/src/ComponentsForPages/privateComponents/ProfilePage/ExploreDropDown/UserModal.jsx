import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import UserSearchCard from "./UserSearchCard"
import { searchUserList } from "../../../../redux/reducers/authReducer"

const UserModal = ({ allUsers, setTrigger, setOpenModal, pro }) => {

  const dispatch = useDispatch()

  const searchResults = useSelector(state => state?.auth?.userSearchResults?.results)
  const [searchInput, setSearchInput] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [visibleCount, setVisibleCount] = useState(10)

  const handleSearch = () => {
    const value = searchInput.trim()
    setHasSearched(true)
    if (!value) return;
    dispatch(searchUserList({ q: value }))
    setVisibleCount(10)
  }

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
  const visibleUsers = (baseUsers || []).slice(0, visibleCount)

  return (
    <div className="searchUserModal">
      <button style={{ fontSize: "2rem" }} onClick={() => setOpenModal("")}>❎</button>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", gap: "1vw", marginBottom: "1vh" }}>
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
          >
            🔍 Search
          </div>
        </div>
        <div style={{ width: "100%", height: "70vh", display: "flex", flexWrap: "wrap" }}>
          {visibleUsers.map(user => (
            <UserSearchCard
              key={user._id}
              user={user}
              pro={pro}
              setTrigger={setTrigger}
              setOpenModal={setOpenModal}
            />
          ))}
        </div>
        {visibleCount < baseUsers.length && (
          <button onClick={handleShowMore}style={{ margin: "1vh", background: "goldenRod", height: "5vh" }}>Show More Users</button>
        )}
      </div>
    </div>
  )
}
export default UserModal