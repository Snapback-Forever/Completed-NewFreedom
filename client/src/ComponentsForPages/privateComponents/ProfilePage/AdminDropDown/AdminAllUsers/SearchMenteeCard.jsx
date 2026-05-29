import Card from "react-bootstrap/Card";
import moment from "moment";
import React from "react";
import { useDispatch } from "react-redux";
import { addMentorAttached } from "../../../../../redux/reducers/menteeReducers";



const SearchMenteeCard = ({ mentee, user, setTrigger, setAddMenteeModal, searchTerm }) => {

  const dispatch = useDispatch();

  const highlightText = (text, searchTerm) => {

    if (!text || !searchTerm) return text;
    const term = searchTerm.trim();
    if (!term) return text;
    const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${safe})`, "gi");
    const parts = String(text).split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          style={{ backgroundColor: "yellow", fontWeight: "bold" }}
        >
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const baseUrl = "http://localhost:8080";
  const imgSrc =
    mentee?.menteeImageFileId && mentee?.menteeImageBucketName
      ? `${baseUrl}/upload/image/${mentee.menteeImageFileId}?bucketName=${mentee.menteeImageBucketName}`
      : mentee?.menteeImage;

  const addThisUser = () => {
    const payload = {
      mailId: mentee?._id,
      mentorId: user?._id,
    };
    dispatch(addMentorAttached(payload));
    setTrigger(true);
    setAddMenteeModal(false);
  };

  const term = searchTerm?.trim()?.toLowerCase() || "";
  const fieldContainsTerm = (value) =>
    term && value && String(value).toLowerCase().includes(term);
  // For inmateNumbers (array)
  const inmateNumberMatches =
    Array.isArray(mentee?.inmateNumbers) &&
    mentee.inmateNumbers.some(
      (i) =>
        (i.number &&
          String(i.number).toLowerCase().includes(term)) ||
        (i.state && String(i.state).toLowerCase().includes(term))
    );

    const hasActiveMentee =
    Array.isArray(mentee?.mentorAttached) &&
    mentee.mentorAttached.some((attached) => attached?.active === true);

    const youActiveMentee =
    Array.isArray(mentee?.mentorAttached) &&
    mentee.mentorAttached.some((attached) => attached?.mentorId !== user?._id);


  return (

    <Card style={{ minWidth: "20vw", maxWidth: "20vw", minHeight: "50vh", maxHeight: "50vh", margin: "1vw" }}>
      <Card.Img
        variant="top"
        src={imgSrc}
        style={{ minWidth: "20vw", maxWidth: "20vw", minHeight: "20vh", maxHeight: "20vh" }}
      />

      <Card.Body style={{ overflowX: "scroll" }} className="scrollBar">
        <Card.Title>
          {moment(mentee?.createdAt).format("hh:mm MMM Do YY")}
        </Card.Title>
        {/* Name already on card: just highlight */}
        <Card.Title>
          {highlightText(
            `${mentee?.firstName || ""}${mentee?.lastName || ""}`,
            searchTerm
          )}
        </Card.Title>

        {/* Sex already on card: highlight */}
        <Card.Title>{highlightText(mentee?.sex, searchTerm)}</Card.Title>
        {/* staffPosition already on card (if you want highlight there too) */}
        <Card.Text>

          {highlightText(mentee?.staffPosition, searchTerm)}
        </Card.Text>

        {/* Conditionally show extra fields ONLY when they contain the term */}
        {fieldContainsTerm(mentee?.email) && (
          <Card.Text>
            Email: {highlightText(mentee?.email, searchTerm)}
          </Card.Text>
        )}

        {fieldContainsTerm(mentee?.phoneNumber) && (
          <Card.Text>
            Phone: {highlightText(mentee?.phoneNumber, searchTerm)}
          </Card.Text>
        )}
        {fieldContainsTerm(mentee?.currentLocation) && (
          <Card.Text>
            Current Location:{" "}
            {highlightText(mentee?.currentLocation, searchTerm)}
          </Card.Text>
        )}
        {fieldContainsTerm(mentee?.dateOfBirth) && (
          <Card.Text>
            DOB: {highlightText(mentee?.dateOfBirth, searchTerm)}
          </Card.Text>
        )}
        {fieldContainsTerm(mentee?.projectedReleaseDate) && (
          <Card.Text>
            Projected Release:{" "}
            {highlightText(mentee?.projectedReleaseDate, searchTerm)}
          </Card.Text>
        )}
        {fieldContainsTerm(mentee?.maxReleaseDate) && (
          <Card.Text>
            Max Release:{" "}
            {highlightText(mentee?.maxReleaseDate, searchTerm)}
          </Card.Text>
        )}
        {fieldContainsTerm(mentee?.currentCharge) && (
          <Card.Text>
            Current Charge:{" "}
            {highlightText(mentee?.currentCharge, searchTerm)}
          </Card.Text>
        )}
        {fieldContainsTerm(mentee?.currentInsurance) && (
          <Card.Text>
            Current Insurance:{" "}
            {highlightText(mentee?.currentInsurance, searchTerm)}
          </Card.Text>
        )}
        {fieldContainsTerm(mentee?.lastContact) && (
          <Card.Text>
            Last Contact:{" "}
            {highlightText(mentee?.lastContact, searchTerm)}
          </Card.Text>
        )}
        {fieldContainsTerm(mentee?.programStatus) && (
          <Card.Text>
            Program Status:{" "}
            {highlightText(mentee?.programStatus, searchTerm)}
          </Card.Text>
        )}
        {fieldContainsTerm(mentee?.status) && (
          <Card.Text>
            Status: {highlightText(mentee?.status, searchTerm)}
          </Card.Text>
        )}
        {inmateNumberMatches && (
          <Card.Text>
            Inmate Numbers:{" "}
            {mentee?.inmateNumbers.map((i, idx) => (
              <span key={idx}>
                {highlightText(i?.number, searchTerm)}{" "}
                ({highlightText(i?.state, searchTerm)}){" "}
              </span>
            ))}
          </Card.Text>
        )}
      
      </Card.Body>
        <div className="flex flex-col">
         {hasActiveMentee ? <>{youActiveMentee ? <h6 style={{ color: "red", border: "solid red" }}>Already Has A Mentor</h6> : <h6 style={{ color: "red", border: "solid red" }}>Already User's Mentee</h6>}</> : <>
         { user?.sex === mentee?.sex ?
            <button className="m-1 rounded" style={{ background: "lightBlue", width: "100%" }}onClick={addThisUser}>Select Mentee</button> : <h6 style={{ color: "red", border: "solid red" }}>Gender Is Not The Same</h6>
         }</>
         }
        </div>
    </Card>
  );
};
export default SearchMenteeCard;
