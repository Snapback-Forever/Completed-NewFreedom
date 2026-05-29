import React, { useState } from "react";
import DOMPurify from "dompurify";
import { useDispatch, useSelector } from "react-redux";
import { subscribeNewsLetter } from "../../../redux/reducers/newsLetterReducer";

const SubscribeLandingContent = ({ darkMode, allNewsLetters }) => {

  const dispatch = useDispatch()
  const successMessage = useSelector(state => state.news.successMessage)


  const locationList = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
    "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
    "Montana", "Nebraska", "Nevada", "New-Hampshire", "New-Jersey", "New-Mexico",
    "New-York", "North-Carolina", "North-Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode-Island", "South-Carolina", "South-Dakota", "Tennessee",
    "Texas", "Utah", "Vermont", "Virginia", "Washington", "West-Virginia",
    "Wisconsin", "Wyoming",
  ];

  const [form, setForm] = useState({
    email: "",
    newsLetterRequested: "",
    inmateNumbers: [
      {
        number: "",
        state: ""
      },
    ],
    address: [
      {
        facilityName: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
    ],
    firstName: "",
    lastName: "",
    phoneNumber: "",
    status: "subscribed",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle inmateNumbers[0].*
    if (name === "inmateNumber" || name === "inmateState") {
      setForm((prev) => {
        const clone = { ...prev };
        const list = [...clone.inmateNumbers];
        const item = { ...list[0] };
        if (name === "inmateNumber") {
          // optional: strip whitespace like the backend does
          item.number = value.replace(/\s+/g, "");
        } else {
          item.state = value;
        }
        list[0] = item;
        clone.inmateNumbers = list;
        return clone;
      });
      return;
    }
    // Handle address[0].*
    if (
      name === "facilityName" ||
      name === "street" ||
      name === "city" ||
      name === "addrState" ||
      name === "zipCode"
    ) {
      setForm((prev) => {
        const clone = { ...prev };
        const list = [...clone.address];
        const item = { ...list[0] };
        if (name === "addrState") {
          item.state = value;
        } else if (name === "zipCode") {
          item.zipCode = value.trim();
        } else {
          item[name] = value;
        }
        list[0] = item;
        clone.address = list;
        return clone;
      });
      return;
    }
    // Default: top-level fields (email, newsLetterRequested, firstName, etc.)
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
dispatch(subscribeNewsLetter(form))
  };

  const inmate = form.inmateNumbers[0];
  const addr = form.address[0];

  return (

    <div style={{ height: "84.1vh", overflow: "scroll", display: "flex", flexDirection: "column", alignItems: "center" }}  >

      <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: "center", gap: '1rem' }}>

        <h2 style={{ color: darkMode ? "white" : "black", width: "100%", textAlign: "center" }}>Subscribe to Newsletter</h2>

        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Newsletter delivery method:</h4>

        <select
          name="newsLetterRequested"
          value={form.newsLetterRequested}
          onChange={handleChange}
          style={{ border: "solid lightGrey", background: "white", width: "80%" }}
          required
        >
          <option value="">-- Select NewsLetter Delivery Request --</option>
          <option value="emailed">Email Newsletter</option>
          <option value="mail">Mail Me A Newsletter</option>
        </select>


        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Your First Name:</h4>

        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="Jane/John"
          required
          style={{ border: "solid lightGrey", background: "white", width: "80%" }}
        />

        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Your Last Name:</h4>

        <input
          type="text"
          name="lastName"
          value={form.lastName}
          placeholder="Doe"
          onChange={handleChange}
          style={{ border: "solid lightGrey", background: "white", width: "80%" }}
        />

        {/* Email */}

        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Email:</h4>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@mail.com"
          required
          style={{ border: "solid lightGrey", background: "white", width: "80%" }}
        />

        <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Your Phone Number (Not Required):</h4>

        <input
          type="tel"
          name="phoneNumber"
          value={form.phoneNumber}
          placeholder="(555)555-5555"
          onChange={handleChange}
          style={{ border: "solid lightGrey", background: "white", width: "80%" }}
        />


        {form.newsLetterRequested === "mail" ?
          <div style={{ width: "80%", border: "solid black", padding: "1vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Facility Name (If Applicable):</h4>

            <input
              type="text"
              name="facilityName"
              value={addr.facilityName}
              placeholder="Whetstone Correctional"
              onChange={handleChange}
              style={{ border: "solid lightGrey", background: "white", width: "80%" }}
            />



            <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Street Or Po-Box:</h4>

            <input
              type="text"
              name="street"
              value={addr.street}
              placeholder="1234 Ave"
              onChange={handleChange}
              style={{ border: "solid lightGrey", background: "white", width: "80%" }}
            />


            <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>City:</h4>

            <input
              type="text"
              name="city"
              placeholder="Phoenix"
              value={addr.city}
              onChange={handleChange}
              style={{ border: "solid lightGrey", background: "white", width: "80%" }}
            />

            <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>State:</h4>

            <select
              name="inmateState"
              value={inmate.state}
              onChange={handleChange}
              style={{ border: "solid lightGrey", background: "white", width: "80%" }}
            >
              <option value="">Select a state</option>
              {locationList.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>ZIP Code:</h4>

            <input
              type="text"
              name="zipCode"
              value={addr.zipCode}
              onChange={handleChange}
              style={{ border: "solid lightGrey", background: "white", width: "80%" }}
              placeholder="12345 or 12345-6789"
            />
          </div> : ""}

        <div style={{ width: "80%", border: "solid black", padding: "1vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Inmate Number (If Applicable):</h4>

          <input
            type="text"
            name="inmateNumber"
            value={inmate.number}
            placeholder="123456"
            onChange={handleChange}
            style={{ border: "solid lightGrey", background: "white", width: "80%" }}
          />


          <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Inmate State *Required With Inmate Number*:</h4>

          <select
            name="addrState"
            value={addr.state}
            onChange={handleChange}
            style={{ border: "solid lightGrey", background: "white", width: "80%" }}
          >
            <option value="">Select a state</option>
            {locationList.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {successMessage !== "Newsletter subscription created successfully!" ? <button type="submit" className='responsiveButton rounded' style={{ background: "goldenRod", width: "80%", height: "5vh" }} >
          Submit Subscription
        </button> : <div className='responsiveButton rounded' style={{ background: 'lime', width: '80%', height: '5vh', color: 'black', display: "flex", justifyContent: 'center', alignItems: "center" }} >
          Thank You For Submitting A Subscription
        </div>}

      </form>

    </div>
  );
};

export default SubscribeLandingContent;