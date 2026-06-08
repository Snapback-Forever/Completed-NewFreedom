import Carousel from "react-bootstrap/Carousel";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllQuestions, searchQuestions } from "../../../redux/reducers/questionReducers";
import DOMPurify from "dompurify";
import moment from "moment";
import { Link } from "react-router-dom";

const QALandingContent = ({ darkMode, setDarkMode, landingContent, allPrograms, allSupporters }) => {
  const dispatch = useDispatch();

  const allQuestions = useSelector((state) => state.quest.allQuestions);
  const searchQuest = useSelector((state) => state.quest.searchQuest);

  const [searchInput, setSearchInput] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    dispatch(getAllQuestions());
  }, [dispatch]);

  const baseUrl = "http://localhost:8080";

  const tierOrder = { platinum: 1, gold: 2, silver: 3, bronze: 4 };

  const visibleSupporters = [...allSupporters].sort((a, b) => (tierOrder[a.tier] || 999) - (tierOrder[b.tier] || 999));

  const supporters = visibleSupporters.filter((sup) => sup.tier !== "supporter");
  const chunkSize = 4;
  const slides = supporters.reduce((acc, _, i) => (i % chunkSize === 0 ? [...acc, supporters.slice(i, i + chunkSize)] : acc), []);

  const questionsSource = hasSearched ? searchQuest : allQuestions;

  const qaQuestions = Array.isArray(questionsSource)
    ? questionsSource.filter((quest) => {
        if (!quest || !Array.isArray(quest.response)) return false;
        return quest.response.some((resp) => resp?.questionType === "Q-A");
      })
    : [];

  const hasAnyQaQuestions = Array.isArray(allQuestions)
    ? allQuestions.some((quest) => {
        if (!quest || !Array.isArray(quest.response)) return false;
        return quest.response.some((resp) => resp?.questionType === "Q-A");
      })
    : false;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (!value.trim()) {
      setHasSearched(false);
      dispatch(getAllQuestions());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const value = searchInput.trim();

    if (!value) {
      setHasSearched(false);
      dispatch(getAllQuestions());
      return;
    }

    setHasSearched(true);
    dispatch(searchQuestions({ q: value }));
  };

  const showSearchBar = hasAnyQaQuestions || hasSearched;

  return (
    <div style={{ height: "84.1vh", overflow: "scroll" }} className={darkMode ? "scrollBar QADark" : "scrollBar QAWhite"}>
      <div style={{ minHeight: "70vh" }}>  
        {showSearchBar ? (
          <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", margin: "1vh 0" }}>
            <input type="text" value={searchInput} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Search questions by title, body, response..." style={{ border: "solid lightGrey", background: "white", width: "60%", height: "4vh" }} />
            <div onClick={handleSearch} style={{ background: "goldenRod", padding: "0.5vh 1vw", height: "4vh", margin: "1vh" }}>🔍 Search</div>
          </div>
        ) : null}

        {qaQuestions.length === 0 ? (
          hasSearched ? (
            <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>
              No Question And Answers Found For "{searchInput.trim()}"
            </h2>
          ) : (
            <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>
              Currently No Question And Answers
            </h2>
          )
        ) : (
          <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white", margin: !darkMode ? "0" : "2vh 0 0 0" }}>
            Questions And Answers
          </h2>
        )}

        {qaQuestions.length > 0 ? (
          <>
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Link to={"/msg"} style={{ width: "90%", margin: "0.5vh 0" }}>
                <button className="rounded" style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Have A Question? Send Us A Message.</button>
              </Link>
            </div>

            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              {qaQuestions.map((quest) => {
                return (
                  <div style={{ background: "rgba(250, 235, 215, 0.960)", border: "solid black", margin: "1vh 0", width: "90%", padding: "1vh 1vw" }} key={quest?._id || crypto.randomUUID()}>
                    <div><b>Question:</b> {quest?.body}</div>
                    <div>
                      <div style={{ textAlign: "center", fontWeight: "bold", display: "flex", flexDirection: "column" }}>
                        {quest?.response?.filter((res) => res).length > 1 ? "Response's:" : "Response"}
                      </div>
                      {quest?.response?.map((response) => {
                        return (
                          <div style={{ display: "flex", flexDirection: "column" }} key={response?._id || crypto.randomUUID()}>
                            <div style={{ margin: "0.5vh", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(response?.responseToMsg) }} />
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
                      <div>Posted: {moment(quest?.createdAt).format("MMM Do YYYY")}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}

         
<>
          {supporters.length !== 0 && !supporters.length > 6 ? <h3 style={{ textAlign: "center", margin: "0.5rem 0", background: "lightGrey", color: "black" }}>Supporters Of Our Mission</h3> : ""}
          {supporters.length > 6 ? (<>
            {supporters.length !== 0 ? <h3 style={{ textAlign: "center", margin: "0.5rem 0", background: "lightGrey", color: "black" }}>Supporters Of Our Mission</h3> : ""}

            <Carousel>
              {slides.map((group, idx) => (
                <Carousel.Item key={idx} interval={idx === 0 ? 5000 : idx === 1 ? 5000 : undefined}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: "0.5rem", width: "100%", boxSizing: "border-box", padding: "0.5rem" }}>
                    {group.map((sup) => {
                      const imgSrc = sup?.logoFileId && sup?.logoBucketName ? `${baseUrl}/upload/image/${sup?.logoFileId}?bucketName=${sup?.logoBucketName}` : sup?.logoUrl;
                      return (
                        <div key={sup?._id} title={sup?.name} style={{ flex: "0 0 22%", minWidth: "22%", maxWidth: "22%", minHeight: "20vh", background: "white" }}>
                          <a href={sup?.websiteLink} target="_blank" style={{ display: "block", width: "100%", height: "100%" }}>
                            <img src={imgSrc} alt={sup?.name || "Supporter logo"} style={{ width: "100%", height: "20vh", objectFit: "contain", display: "block" }} />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </>) : (
            <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "0.5rem", boxSizing: "border-box", margin: "0.5rem 0", flexWrap: "wrap" }}>
              {supporters.map((sup) => { const imgSrc = sup?.logoFileId && sup?.logoBucketName ? `${baseUrl}/upload/image/${sup?.logoFileId}?bucketName=${sup?.logoBucketName}` : sup?.logoUrl; return (<div key={sup?._id} title={sup?.name} style={{ minWidth: "10vw", maxWidth: "10vw", minHeight: "20vh", maxHeight: "20vh", margin: "1vh 0.5vw", background: "white" }}><a href={sup?.websiteLink} target="_blank"><img src={imgSrc} alt={sup?.name || "Supporter logo"} style={{ width: "100%", height: "20vh", objectFit: "contain", display: "block" }} /></a></div>); })}
            </div>
          )}
        </>

        {allSupporters.length !== 0 ? (
          <>
            <h3 style={{ textAlign: "center", margin: "1vh 0", background: "lightGrey", color: "black" }}>Agencies We Work With</h3>
            <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "1vw", boxSizing: "border-box", margin: "1vh 0", flexWrap: "wrap" }}>
              {allSupporters.filter((sup) => sup.tier === "supporter").map((sup) => {
                const imgSrc = sup?.logoFileId && sup?.logoBucketName ? `${baseUrl}/upload/image/${sup?.logoFileId}?bucketName=${sup?.logoBucketName}` : sup?.logoUrl;
                return (
                  <div key={sup?._id} style={{ minWidth: "10vw", maxWidth: "15vw", minHeight: "20vh", maxHeight: "20vh", margin: "1vh 0.5vw", background: "white" }} title={sup?.name}>
                    <a href={sup?.websiteLink} target="_blank" rel="noreferrer">
                      <img src={imgSrc} alt="Success story" style={{ minWidth: "100%", maxWidth: "100%", minHeight: "20vh", maxHeight: "20vh" }} />
                    </a>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default QALandingContent;
