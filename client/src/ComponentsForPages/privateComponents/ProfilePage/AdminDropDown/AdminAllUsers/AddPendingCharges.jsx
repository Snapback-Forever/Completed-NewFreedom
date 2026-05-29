import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPendingCharges } from '../../../../../redux/reducers/menteeReducers';
const locationList = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "New-Hampshire", "New-Jersey", "New-Mexico",
  "New-York", "North-Carolina", "North-Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode-Island", "South-Carolina", "South-Dakota", "Tennessee",
  "Texas", "Utah", "Vermont", "Virginia", "Washington", "West-Virginia",
  "Wisconsin", "Wyoming"
];
const AddPendingCharges = ({ mentee, user, setTrigger, setAddInformation }) => {

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    charge: '',
    dateOfCharge: '',
    courtDate: '',
    facility: '',
    state: '',
    city: '',
    notes: '',
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      mailId: mentee?._id, // -> req.params.mailId
      pendingCharges: [
        {
          charge: form.charge,
          dateOfCharge: form.dateOfCharge || null,
          courtDate: form.courtDate || null,
          facility: form.facility,
          state: form.state,
          city: form.city,
          notes: form.notes,
        },
      ],
    };

    // Replace with your real Redux action that calls addPendingCharges API
    dispatch(addPendingCharges(payload));
      setTrigger(true);
      setAddInformation("")
  };

  const labelStyle = {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5vw',
  };

  const inputStyle = {
    border: 'solid lightGrey',
    background: 'white',
    width: '80%',
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >

        <label style={labelStyle}>
          Charge
        </label>
        <input
          type="text"
          name="charge"
          value={form?.charge}
          onChange={handleInput}
          style={inputStyle}
          required
        />
        
        <label style={labelStyle}>
          Date of Charge
        </label>
        <input
          type="date"
          name="dateOfCharge"
          value={form?.dateOfCharge}
          onChange={handleInput}
          style={inputStyle}
        />

        <label style={labelStyle}>
          Court Date
        </label>
        <input
          type="date"
          name="courtDate"
          value={form?.courtDate}
          onChange={handleInput}
          style={inputStyle}
        />
    
        <label style={labelStyle}>
          State
        </label>
        <select
          name="state"
          value={form?.state}
          onChange={handleInput}
          style={inputStyle}
          required
        >

          <option value="">Select State</option>
          {locationList.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <label style={labelStyle}>
          City
        </label>

        <input
          type="text"
          name="city"
          value={form?.city}
          onChange={handleInput}
          style={inputStyle}
        />

        <label style={labelStyle}>
          Notes
        </label>
        <textarea
          name="notes"
          value={form?.notes}
          onChange={handleInput}
          style={{ ...inputStyle, height: '100px' }}
        />

       <button type="submit" style={{ background: "lime", margin: "1vh", width: "100%" }}>Add Pending Charge</button>

      </div>
    </form>
  );
};
export default AddPendingCharges;
