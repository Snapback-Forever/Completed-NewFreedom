import React from 'react'
import moment from 'moment'
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';

const PaidJobCard = ({ job, highlightText }) => {
  
  return (
    <div style={{ background: "rgba(250, 235, 215, 0.960)", width: "98%", margin: "1vh 1vw", padding: "1vh" }}>
      <div>{moment(job?.createdAt).format("hh:mm MMM Do YY")}</div>
      <h3 style={{ width: "100%", textAlign: "center" }}>{highlightText ? highlightText(job?.title) : job?.title}</h3>
      <div style={{ width: "100%", textAlign: "center", whiteSpace: "pre-wrap", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job?.description) }} />

      <div style={{ border: "1px solid black" }}></div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>

        <h6 style={{ width: "100%", textAlign: "center" }}>Starting Wages: ${job?.salaryMin}</h6>
        <h6 style={{ width: "100%", textAlign: "center" }}>Hours: {highlightText ? highlightText(job?.jobType) : job?.jobType}</h6>
        <h6 style={{ width: "100%", textAlign: "center" }}>Job Location: {highlightText ? highlightText(job?.location) : job?.location}</h6>
        <h6 style={{ width: "100%", textAlign: "center" }}>Seniority: {highlightText ? highlightText(job?.seniority) : job?.seniority}</h6>
      </div>

      <div>
        <div style={{ border: "1px solid black" }}></div>
        <h4 style={{ width: "100%", textAlign: "center" }}><u>Experience Needed</u></h4>
        {job?.requirements?.map((req, index) => {
          return (
            <ul key={index}>
              <li>💠 {highlightText ? highlightText(req) : req}</li>
            </ul>
          )
        })}
        <div style={{ border: "1px solid black" }}></div>
      </div>

      <div style={{ width: "100%" }}>
        <h4 style={{ width: "100%", textAlign: "center" }}><u>Expected Responsibilities</u></h4>
        {job?.responsibilities?.map((res, index) => {
          return (
            <ul key={index}>
              <li>✔️ {highlightText ? highlightText(res) : res}</li>
            </ul>
          )
        })}
        <div style={{ border: "1px solid black" }}></div>
      </div>

      <Link to={`/application/${job?._id}`} >
        <button style={{ background: "goldenRod", width: "100%", margin: "0.5vh 0", color: "black" }}>Apply For This Job</button>
      </Link>
    </div>
  )
}

export default PaidJobCard
