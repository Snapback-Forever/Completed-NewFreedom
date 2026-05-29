import { useDispatch, useSelector } from "react-redux";
import { searchMailUser } from "../../../../../redux/reducers/menteeReducers";
import { useState } from "react";
import SearchMenteeCard from "./SearchMenteeCard";

const AddMenteeModal = ({ setAddMenteeModal, allMentee, user, setTrigger }) => {
    const dispatch = useDispatch();
    // from Redux: { message, count, results }

    const mailUserSearchResults = useSelector((state) => state.mentee.mailUserSearchResults);

    const [searchInput, setSearchInput] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        const value = searchInput.trim();
        setHasSearched(true);
        if (!value) return;
        // send as generic q, or change to { phoneNumber: value } etc.
        dispatch(searchMailUser({ q: value }));
    };
      

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        // when cleared, reset search state so we go back to all mentees
        if (value.trim() === "") {
            setHasSearched(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };
    // Decide which list to show
    const searchResults = mailUserSearchResults?.results || [];
    const shouldShowSearchResults = hasSearched && searchResults.length > 0;
    const shouldShowNoResults =
        hasSearched && mailUserSearchResults && searchResults.length === 0;
    const menteesToRender = shouldShowSearchResults ? searchResults : allMentee;

    const titleText = hasSearched
    ? mailUserSearchResults?.message || "Search Results"
    : "All Mentees";

    return (
        <div className="searchUserModal">
            <button style={{ fontSize: "2rem" }}onClick={() => setAddMenteeModal(false)}>❎</button>
            <div style={{ width: "100%", height: "80vh", textAlign: "center" }}>
            <h3 style={{ textAlign: "center" }}>{titleText}</h3>

                <div style={{ width: "100%" }}>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Search mentees by name, email, inmate number..."
                        style={{ border: "solid lightGrey", background: "white", width: "80%" }} />

                    <div style={{ background: "goldenRod", padding: "0.5vh 1vw" }} onClick={handleSearch} > 🔍 Search </div>
                </div>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    {shouldShowNoResults ? (
                        <div style={{ marginTop: "1rem" }}>
                            {mailUserSearchResults?.message ||
                                `No Mentee Found With "${searchInput.trim()}"`}
                        </div>
                    ) : (
                        menteesToRender?.map((mentee) => (
                            <div key={crypto?.randomUUID()}>
                                <SearchMenteeCard
                                    mentee={mentee}
                                    user={user}
                                    searchTerm={searchInput} 
                                    setTrigger={setTrigger}
                                    setAddMenteeModal={setAddMenteeModal} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
export default AddMenteeModal;