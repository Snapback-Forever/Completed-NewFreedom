import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addStudentToProgram } from '../../../../../redux/reducers/locationReducer';
import AddProgramModal from './AddProgramModal';

const AddProgramToMentee = ({ mentee, user, setTrigger, addProgramModal, setAddProgramModal, allPrograms }) => {

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    programId: "",
    mailUser: mentee?._id || '',
  });

  // Placeholder for future modal selection logic
  const handleProgramSelectFromModal = (programId) => {
    setForm((prev) => ({
      ...prev,
      programId: programId || '',
    }));
  };

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
      ...form
    };

    dispatch(addStudentToProgram(payload));
    setAddProgramModal(false)
    setTrigger(true);
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

        {/* Hidden programId field */}
        <input
          type="hidden"
          name="programId"
          value={form?.programId}
          onChange={handleInput} 
        />

        {mentee?.programsEnrolled?.length === 0 ?<button style={{ background: "lime", margin: "1vh", width: "100%" }} type="button" onClick={() => setAddProgramModal(true)}>Select A Program To Enroll</button> : ""}

      </div>

      <dialog open={addProgramModal} >
        <div className='searchProgramModal' style={{ overflowX: "scroll" }} >

            <div style={{ width: "100%", display: "flex", margin: "1vh 1vw" }}>
            <button style={{ fontSize: "3vh" }} onClick={(() => setAddProgramModal(false))}>❎</button>
            </div>

             <h2 style={{ width: "100%", textAlign: "center" }}>Select A Program To Add Mentee</h2> 

            <div style={{ width: "100%", display: "flex", flexWrap: "wrap", padding: "1vh 1vw",   }} className='responsiveAddProgramCardContainer scrollBar'>
            {allPrograms.filter(pro => !pro?.graduates?.some(g => g?.mailUser === mentee?._id)).map(pro => { return (
              <div key={pro?._id}>
                <AddProgramModal addProgramModal={addProgramModal} setAddProgramModal={setAddProgramModal} pro={pro} handleProgramSelectFromModal={handleProgramSelectFromModal} setForm={setForm} /></div>) })}
          
          </div>
        </div>
      </dialog>


    </form>
  );
};
export default AddProgramToMentee;