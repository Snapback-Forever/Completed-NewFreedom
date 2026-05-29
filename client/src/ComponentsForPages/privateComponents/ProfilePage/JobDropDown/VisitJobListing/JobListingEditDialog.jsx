import React from "react";

const EditJobListingDialog = ({
  selectedJob,
  form,
  handleChange,
  handleSubmit,
  closeDialog,
}) => {

    const labelStyle = {
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
        display: "flex",
        justifyContent: "center",
        gap: "0.5vw"
    };

    const inputStyle = {
        border: 'solid lightGrey',
        background: 'white',
        minWidth: '70vw',
    };

  return (
    <div className="editListingModal">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Edit Job Listing
        </h2>

        {selectedJob?.title ? (
          <p style={{ textAlign: "center", marginBottom: "1rem" }}>
            Editing: <b>{selectedJob.title}</b>
          </p>
        ) : null}

        <div>
          <label style={labelStyle}>Title:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Location:</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={{
              ...inputStyle,
              minHeight: "140px",
              resize: "vertical",
            }}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Requirements:</label>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            style={{
              ...inputStyle,
              minHeight: "140px",
              resize: "vertical",
            }}
            placeholder="One requirement per line"
          />
        </div>

        <div>
          <label style={labelStyle}>Responsibilities:</label>
          <textarea
            name="responsibilities"
            value={form.responsibilities}
            onChange={handleChange}
            style={{
              ...inputStyle,
              minHeight: "140px",
              resize: "vertical",
            }}
            placeholder="One responsibility per line"
          />
        </div>

        <div>
          <label style={labelStyle}>Job Type:</label>
          <select
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="volunteer">volunteer</option>
            <option value="temporary">Temporary</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Seniority:</label>
          <select
            name="seniority"
            value={form.seniority}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Minimum Salary:</label>
          <input
            type="text"
            name="salaryMin"
            value={form.salaryMin}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Maximum Salary:</label>
          <input
            type="text"
            name="salaryMax"
            value={form.salaryMax}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            style={{ transform: "scale(3,3)", margin: "2vh 1vw" }}
          />
          <label style={labelStyle}><b>Check If Job Listing Active?</b></label>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}>

          <button type="submit" style={{ background: "lime", width: "90%", margin: "0.5vh" }} > Update Listing </button>

          <button type="button" style={{ background: "red", width: "90%", margin: "0.5vh" }} onClick={() => closeDialog(false)} > Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditJobListingDialog;
