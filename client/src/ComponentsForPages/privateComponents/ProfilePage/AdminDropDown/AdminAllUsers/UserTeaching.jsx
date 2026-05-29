import React from 'react'
import moment from 'moment'
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';

const UserTeaching = ({ teach }) => {

  return (

    <div style={{ width: "100%", background: "lightGrey", padding: '1vh 1vw' }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} className='responsiveUserTeacher'>
      <span style={{ fontSize: "small" }}> {moment(teach?.createdAt).format("hh:mm MMM Do YY")}</span>
      <span> {teach?.programName} ({teach?.programType})</span>
      </div>

      <div>
      <h6 style={{ width: "100%", textAlign: "center", padding: "2vw", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(teach?.descriptionOfProgram)}} />
      <h6 style={{ width: "100%", textAlign: "center", padding: "2vw" }}><b>Remaining Capacity:</b> ({teach?.currentCapacity})</h6>
      </div>

    <Link to={`/viewProgram/${teach?._id}`}><button style={{ background: "goldenRod", padding: "0 2vw", color: "black" }}>Visit This Program</button></Link>

    </div>
  )
}

export default UserTeaching
