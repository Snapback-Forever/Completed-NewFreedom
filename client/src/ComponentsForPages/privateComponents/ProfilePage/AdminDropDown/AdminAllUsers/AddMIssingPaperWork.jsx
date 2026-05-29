

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePaperwork } from '../../../../../redux/reducers/menteeReducers';
const AddMissingPaperWork = ({ mentee, user, setTrigger, setAddInformation }) => {

  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: '',
    notes: '',
    completedRequiredPaperwork: false,
  });

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!form.completedRequiredPaperwork){
  const payload = {
      
      mailId: mentee?._id, 
      missingPaperwork: [
        {
          name:  form.name,
          notes: form.notes,
        },
      ],
      completedRequiredPaperwork: form.completedRequiredPaperwork,
    };
        dispatch(updatePaperwork(payload));
    } else {
      const payload = {
      
        mailId: mentee?._id, 
        missingPaperwork: [
          {
            name:  `Marked Paper Work Completed`,
            notes: `User: ${user?.accountName} Date: ${new Date()}`,
          },
        ],
        completedRequiredPaperwork: form.completedRequiredPaperwork,
      };
          dispatch(updatePaperwork(payload));
    }

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

<label style={{ ...labelStyle, justifyContent: 'flex-start', width: '80%', color: "red" }}><u>ONLY CHECK THIS IF USER HAS COMPLETE ALL PAPERWORK</u>
          <input
            type="checkbox"
            name="completedRequiredPaperwork"
            checked={form?.completedRequiredPaperwork}
            onChange={handleInput}
            style={{ margin: '0 2vw', width: 'auto', transform: "scale(2, 2)" }}
          /></label>

    { !form?.completedRequiredPaperwork ?  
    <>  
    <label style={labelStyle}>
          Missing Paperwork Name
        </label>
        <input
          type="text"
          name="name"
          value={form?.name}
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
        </>: ""}

        <button type="submit" style={{ background: "lime", margin: "1vh", width: "100%" }}>Save Paperwork Status</button>

      </div>
    </form>
  );
};
export default AddMissingPaperWork;
