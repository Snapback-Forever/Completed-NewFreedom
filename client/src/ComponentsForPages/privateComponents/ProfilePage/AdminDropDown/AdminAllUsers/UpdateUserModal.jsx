import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminUpdateProfile } from '../../../../../redux/reducers/authReducer';

const UpdateUserModal = ({ admin, user, onClose, onUpdated, setTrigger }) => {

  const dispatch = useDispatch()

  const adminId = useSelector(state => state.auth.user?._id)

  const [form, setForm] = useState({
    accountName: user.accountName || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    staffPosition: user.staffPosition || '',
    yourAddress: user.yourAddress || '',
    yourPhoneNumber: user.yourPhoneNumber || '',
    newPassword: '',
    // role booleans
    NFadmin: !!user.NFadmin,
    creator: !!user.creator,
    mentor: !!user.mentor,
    teacher: !!user.teacher,
    newsLetter: !!user.newsLetter,
    hiring: !!user.hiring,
    staffCustomerService: !!user.staffCustomerService,
    websiteSupportTeam: !!user.websiteSupportTeam,
    eventStaff: !!user.eventStaff,

    auditLogStatus: '',
    aboutAuditLog: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId: user?._id,
      authId: adminId,
      accountName: form.accountName,
      firstName: form.firstName,
      lastName: form.lastName,
      staffPosition: form.staffPosition,
      yourAddress: form.yourAddress,
      yourPhoneNumber: form.yourPhoneNumber,
      ...(form.newPassword ? { newPassword: form.newPassword } : {}),
      NFadmin: form.NFadmin,
      creator: form.creator,
      mentor: form.mentor,
      teacher: form.teacher,
      newsLetter: form.newsLetter,
      hiring: form.hiring,
      staffCustomerService: form.staffCustomerService,
      websiteSupportTeam: form.websiteSupportTeam,
      eventStaff: form.eventStaff,
      auditLogStatus: form.auditLogStatus || 'completed',
      aboutAuditLog:
        form.aboutAuditLog ||
        `Admin ${admin.accountName} updated user ${user.accountName}`,
    };

    dispatch(adminUpdateProfile(payload))
    setTrigger(true)
    onClose()
  }

  const labelStyle = {
    width: '100%',
    fontWeight: 'bold',
    gap: '0.5vw',
  };

  const inputStyle = {
    border: 'solid lightGrey',
    background: 'white',
    width: '60%',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: '95%',
          maxWidth: '700px',
          background: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Update User: {user?.accountName}
        </h3>
        <form onSubmit={handleSubmit}>
          {/* Basic info */}
          <div>
            <label style={labelStyle}>Account Name: </label>
            <input
              type="text"
              name="accountName"
              value={form?.accountName}
              onChange={handleChange}
              className="input"
              style={inputStyle}
            />
          </div>
          <div>

            <label style={labelStyle}>First Name</label>
            <input
              type="text"
              name="firstName"
              value={form?.firstName}
              onChange={handleChange}
              className="input"
              style={inputStyle}
            />
          </div>
          <div>

            <label style={labelStyle}>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form?.lastName}
              onChange={handleChange}
              className="input"
              style={inputStyle}
            />
          </div>
          <div>

            <label style={labelStyle}>Staff Position</label>
            <input
              type="text"
              name="staffPosition"
              value={form?.staffPosition}
              onChange={handleChange}
              className="input"
              style={inputStyle}
            />
          </div>
          <div>

            <label style={labelStyle}>Address</label>
            <input
              type="text"
              name="yourAddress"
              value={form?.yourAddress}
              onChange={handleChange}
              className="input"
              style={inputStyle}
            />
          </div>
          <div>

            <label style={labelStyle}>Phone Number</label>
            <input
              type="text"
              name="yourPhoneNumber"
              value={form?.yourPhoneNumber}
              onChange={handleChange}
              className="input"
              style={inputStyle}
            />
          </div>
          
          { admin?.creator || admin?.NFadmin ? 
          <div>
            <label style={labelStyle}>New Password (for this user)</label>
            <input
              type="password"
              name="newPassword"
              value={form?.newPassword}
              onChange={handleChange}
              className="input"
              placeholder="Leave blank to keep current password"
              style={inputStyle}
            />
          </div>: ""}

          {/* Role booleans */}
          <fieldset style={{ marginTop: '1rem' }}>
            {user?.creator || user?.NFadmin ? <legend style={labelStyle}>Roles / Permissions</legend> : ""}

            {admin?.creator ? <>

              {!user?.webBoss ?
                <> <label style={labelStyle}>
                  <input
                    type="checkbox"
                    name="creator"
                    checked={form.creator}
                    onChange={handleChange}
                  />
                  {" "} Creator
                </label>
                </> : ""}

            </> : ""}

            <br />

            {admin?.creator || admin?.NFadmin ?

              <>
                <label style={labelStyle}>
                  <input
                    type="checkbox"
                    name="NFadmin"
                    checked={form?.NFadmin}
                    onChange={handleChange}
                  />
                  {" "} NFadmin</label>
                <br />

                <label style={labelStyle}>
                  <input
                    type="checkbox"
                    name="mentor"
                    checked={form?.mentor}
                    onChange={handleChange}
                  />
                  {" "} Mentor
                </label>
                <br />

                <label style={labelStyle}>
                  <input
                    type="checkbox"
                    name="teacher"
                    checked={form?.teacher}
                    onChange={handleChange}
                  />
                  {" "} Teacher
                </label>
                <br />

                <label style={labelStyle}>
                  <input
                    type="checkbox"
                    name="newsLetter"
                    checked={form?.newsLetter}
                    onChange={handleChange}
                  />
                  {" "} Newsletter
                </label>
                <br />

                <label style={labelStyle}>
                  <input
                    type="checkbox"
                    name="hiring"
                    checked={form?.hiring}
                    onChange={handleChange}
                  />
                  {" "} Hiring
                </label>
                <br />

                <label style={labelStyle}>
                  <input
                    type="checkbox"
                    name="staffCustomerService"
                    checked={form?.staffCustomerService}
                    onChange={handleChange}
                  />
                  {" "} Staff Customer Service
                </label>
                <br />

                <label style={labelStyle}>
                  <input
                    type="checkbox"
                    name="websiteSupportTeam"
                    checked={form?.websiteSupportTeam}
                    onChange={handleChange}
                  />
                  {" "} Website Support Team
                </label>
                <br />

                <label style={labelStyle}>
                  <input
                    type="checkbox"
                    name="eventStaff"
                    checked={form?.eventStaff}
                    onChange={handleChange}
                  />
                  {" "} Event Staff
                </label>

              </> : ""}

          </fieldset>


          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.5rem',
              marginTop: '1rem',
            }}
          >
            <button
              type="button"
              className="responsiveButton rounded"
              onClick={onClose}
              style={{ background: "red", padding: "0.5vh 1vw" }}>Cancel</button>

            <button
              type="submit"
              className="responsiveButton rounded"
              style={{ background: "lime", padding: "0.5vh 1vw" }}>Change Profile</button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;