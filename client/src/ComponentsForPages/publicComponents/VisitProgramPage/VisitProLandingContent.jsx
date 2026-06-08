import Carousel from 'react-bootstrap/Carousel';
import React from 'react';
import DOMPurify from 'dompurify';
import moment from 'moment';
import { Link } from 'react-router-dom';

import ImageCard from './ImageCard';
import AddImage from './AddImage';
import UserImage from './UserImage';
import GradImage from './GradImage';

const VisitProLandingContent = ({
  darkMode,
  singleProgram,
  data,
  setData,
  allSupporters,
  allPrograms
}) => {

  const baseUrl = "http://localhost:8080";

  const tierOrder = { platinum: 1, gold: 2, silver: 3, bronze: 4 };

  const sortedSupporters = [...allSupporters].sort(
    (a, b) => (tierOrder[a.tier] || 999) - (tierOrder[b.tier] || 999)
  );

  const supporters = sortedSupporters.filter(s => s.tier !== "supporter");

  const chunkSize = 4;
  const slides = supporters.reduce((acc, _, i) => {
    if (i % chunkSize === 0) acc.push(supporters.slice(i, i + chunkSize));
    return acc;
  }, []);

  const Button = ({ label, value }) => (
    <button
      className="rounded"
      onClick={() => setData(value)}
      style={{
        background: data === value ? "lightGrey" : "goldenRod",
        border: data === value ? "solid goldenrod" : "none",
        padding: "0 1vw",
        margin: "0.5vh 1vw",
        width: "22%"
      }}
    >
      {label}
    </button>
  );

  const MessageBtn = () => (
    <Link to="/msg" style={{ width: "100%" }}>
      <button
        className="rounded"
        style={{
          background: "goldenRod",
          width: "100%",
          margin: "2vh 0 0.5vh 0",
          color: "black"
        }}
      >
        Send Us A Message About Program
      </button>
    </Link>
  );

  const renderDefault = () => (
    <div style={{
      width: "90%",
      background: "rgba(250, 235, 215, 0.96)",
      margin: "1vh auto",
      display: "flex",
      flexDirection: "column",
      border: "solid antiqueWhite",
      padding: "1vh 1vw"
    }} className="rounded">

      <h1 style={{ textAlign: "center" }}>
        {singleProgram?.programName}
      </h1>

      {singleProgram?.descriptionOfProgramVideo?.startsWith("htt") && (
        <video
          controls
          style={{ width: "60%", height: "50vh", margin: "0 auto" }}
        >
          <source src={singleProgram.descriptionOfProgramVideo} />
        </video>
      )}

      <h4
        style={{ whiteSpace: "pre-wrap" }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(singleProgram?.descriptionOfProgram)
        }}
      />

      {/* ONLY PLACE FOR MESSAGE BUTTON */}
      <MessageBtn />
    </div>
  );

  const renderImages = () => {
    const imgs = singleProgram?.additionalImages?.filter(Boolean) || [];

    return (
      <>
        {imgs.length === 0 ? (
          <h2 style={{ textAlign: "center", color: darkMode ? "white" : "black" }}>
            No Images Attached
          </h2>
        ) : (
          <>
            <h2 style={{ textAlign: "center" }}>Images From Program</h2>
            {imgs.map((img, i) => <ImageCard key={i} img={img} />)}
          </>
        )}
      </>
    );
  };

  const renderLocations = () => {
    const locs = singleProgram?.location?.filter(Boolean) || [];

    return (
      <>
        {locs.length === 0 ? (
          <h2 style={{ textAlign: "center" }}>No Locations</h2>
        ) : (
          locs.map((loc) => (
            <div key={loc._id} style={{
              width: "92%",
              margin: "1vh auto",
              background: "rgba(250,235,215,0.96)",
              padding: "1vh"
            }}>
              <div style={{ display: "flex", overflowX: "auto" }}>
                {loc?.additionalImages?.filter(Boolean).map((img, i) => (
                  <AddImage key={i} img={img} />
                ))}
              </div>

              <h3 style={{ textAlign: "center" }}>{loc.locationName}</h3>
              <p style={{ textAlign: "center" }}>
                {loc?.mailingAddress?.street}<br />
                {loc?.mailingAddress?.city}, {loc?.mailingAddress?.state}<br />
                {loc?.mailingAddress?.zipCode}
              </p>

              <Link to={`/visitLocation/${loc._id}`}>
                <button style={{ width: "100%", background: "goldenRod" }}>
                  Visit This Location
                </button>
              </Link>
            </div>
          ))
        )}
      </>
    );
  };

  const renderStaff = () => {
    const staff = singleProgram?.teachers?.filter(t => t?.teacher) || [];

    return (
      <>
        {staff.length === 0 ? (
          <h2 style={{ textAlign: "center" }}>No Teachers</h2>
        ) : (
          staff.map((s) => (
            <div key={s._id} style={{
              width: "30%",
              margin: "1vh",
              background: "rgba(250,235,215,0.96)",
              padding: "1vh"
            }}>
              <UserImage staff={s} />

              <h3 style={{ textAlign: "center" }}>
                {s.firstName} {s.lastName}
              </h3>

              <Link to={`/directMsg/${s._id}`}>
                <button style={{ width: "100%", background: "goldenRod" }}>
                  Message
                </button>
              </Link>
            </div>
          ))
        )}
      </>
    );
  };

  // ✅ ONLY REAL CHANGE (CLEAN + SAFE)
  const renderGraduates = () => {
    const grads = singleProgram?.graduates?.filter(Boolean) || [];

    return (
      <>
        {grads.length === 0 ? (
          <h2 style={{ textAlign: "center" }}>No Graduates</h2>
        ) : (
          <div className="graduatesWrap">
            {grads.map((g) => (
              <div
                key={g._id}
                className="graduateCard"
                style={{
                  margin: "1vh",
                  background: "rgba(250,235,215,0.96)",
                  padding: "1vh"
                }}
              >
                <GradImage grad={g} />

                <h4 style={{ textAlign: "center" }}>
                  {g.firstName} {g.lastName}
                </h4>

                <p style={{ textAlign: "center" }}>
                  {moment(g.gradDate).format("MMM Do YYYY")}
                </p>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  const renderOtherPrograms = () => (
    <div style={{ padding: "2vh" }}>
      <h3 style={{ textAlign: "center" }}>Other Programs</h3>

      <Carousel>
        {allPrograms
          .filter(p => p._id !== singleProgram?._id)
          .map((pro) => (
            <Carousel.Item key={pro._id}>
              <div style={{ background: "white", padding: "2vh" }}>
                <h3 style={{ textAlign: "center" }}>{pro.programName}</h3>

                <Link to={`/visitProgram/${pro._id}`}>
                  <button style={{ width: "100%", background: "goldenRod" }}>
                    Visit Program
                  </button>
                </Link>
              </div>
            </Carousel.Item>
          ))}
      </Carousel>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* TABS */}
      <div className="programTabs"
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          flexWrap: "wrap"
        }}
      >
        <Button label="Images" value="images" />
        <Button label="Locations" value="locations" />
        <Button label="Teachers" value="staff" />
        <Button label="Graduates" value="Graduates" />
      </div>

      {data === "" && renderDefault()}
      {data === "images" && renderImages()}
      {data === "locations" && renderLocations()}
      {data === "staff" && renderStaff()}
      {data === "Graduates" && renderGraduates()}

      {data === "" && renderOtherPrograms()}
    </div>
  );
};

export default VisitProLandingContent;