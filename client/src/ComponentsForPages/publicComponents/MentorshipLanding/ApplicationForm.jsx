import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addApplication } from '../../../redux/reducers/applyNfRedcuers';

const ApplicationForm = ({ darkMode }) => {

    const dispatch = useDispatch()

    const successMessage = useSelector(state => state.applyNF.successMessage)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    applyingMentor: true,
    applyingVolunteer: false,
    fullOrPart: 'asNeeded',
    startDate: '', 
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   dispatch(addApplication(form))

  };

  return (

      <form onSubmit={handleSubmit} style={{ width: "90vw", margin: "1vh 0", background: "rgba(250, 235, 215, 0.960)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2vh 2vw" }}>

      <h2 style={{ width: "100%", textAlign: "center" }}>Application To Become A Mentor</h2>

       
          <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>First Name: </h4>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder='Jane/John'
              style={{ border: "solid lightGrey", background: "white", margin: "1vh 0", width: "80%" }}
              required
            />
          
       

       
          <h4 style={{ color: darkMode ? "white" : "black", margin: "1vh 0", width: "80%" }}>Last Name: </h4>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              placeholder='Doe'
              onChange={handleChange}
              style={{ border: "solid lightGrey", background: "white", margin: "1vh 0", width: "80%" }}
              required
            />
          
       

       
          <h4 style={{ color: darkMode ? "white" : "black", margin: "1vh 0", width: "80%" }}>Email: </h4>
            <input
              type="email"
              name="email"
              value={form.email}
              placeholder='example@mail.com'
              onChange={handleChange}
              style={{ border: "solid lightGrey", background: "white", margin: "1vh 0", width: "80%" }}
              required
            />
          
       

       
          <h4 style={{ color: darkMode ? "white" : "black", margin: "1vh 0", width: "80%" }}>Phone: </h4>
            <input
              type="text"
              name="phone"
              placeholder='(555)555-5555'
              value={form.phone}
              onChange={handleChange}
              style={{ border: "solid lightGrey", background: "white", width: "80%" }}
            />
          
       

       
          {/* <h4 style={{ color: darkMode ? "white" : "black", margin: "1vh 0", width: "80%" }}>Applying as Mentor: </h4>
            <input
              type="checkbox"
              name="applyingMentor"
              checked={form.applyingMentor}
              style={{ border: "solid lightGrey", background: "white", margin: "1vh 0", width: "80%" }}
              onChange={handleChange}
            /> */}
          
       

        {/*
          <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>
            Applying as Volunteer
            <input
              type="checkbox"
              name="applyingVolunteer"
              checked={form.applyingVolunteer}
              onChange={handleChange}
              style={{ border: "solid lightGrey", background: "white", width: "80%" }}
            />
          
        */}

       
          <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Availability: </h4>
            <select
              name="fullOrPart"
              value={form.fullOrPart}
              onChange={handleChange}
              style={{ border: "solid lightGrey", background: "white", margin: "1vh 0", width: "80%" }}
            >
              <option value="fullTime">Full Time</option>
              <option value="partTime">Part Time</option>
              <option value="asNeeded">As Needed</option>
              
            </select>
          
       

       
          <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Start Date: </h4>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              style={{ border: "solid lightGrey", background: "white", margin: "1vh 0 2vh 0", width: "80%" }}
            />
          
       

        {successMessage !== "Volunteer application created successfully!" ? 
        <button type="submit" className='rounded' style={{ background: "goldenRod", width: "100%", height: "5vh" }}>Apply To Become A Mentor</button> 
              : 
              <div className='rounded' style={{ background: 'lime', width: '80%', height: '5vh', color: 'black', display: "flex", justifyContent: 'center', alignItems: "center" }} >
                  Thank You For Submitting An Application To Become A Mentor
              </div>}

      </form>


  );
};

export default ApplicationForm;