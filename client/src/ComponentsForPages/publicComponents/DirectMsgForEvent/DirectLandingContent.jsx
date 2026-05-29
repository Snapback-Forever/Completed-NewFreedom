import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { directMsg, resetErrorMessage, resetSuccessMessage } from '../../../redux/reducers/directMsgStaffReducers'

const DirectLandingContent = ({ darkMode, singleUser, singleEvent }) => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const successMessage = useSelector(state => state.staffMsg.successMessage)

  const [form, setForm] = useState({
     userId: singleUser?._id,
      title: `Responding to: ${singleEvent?.title} Event Id # is: ${singleEvent?._id}`,
      msgBody: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: ''
  })

  const handleChange = (e) => {
      const { name, value } = e.target
      setForm((prev) => ({
          ...prev,
          [name]: value,
      }))
  }

  const handleSubmit = async (e) => {
      e.preventDefault()

      dispatch(directMsg(form))

  }

  useEffect(() => {

      if (successMessage === "Direct message sent successfully!") {
          setForm((preve) => {
              return {
                  ...preve,
                  userId: singleUser?._id,
                  title: '',
                  msgBody: '',
                  firstName: '',
                  lastName: '',
                  email: '',
                  phoneNumber: '',
              }
          })
          dispatch(resetSuccessMessage())
          dispatch(resetErrorMessage())
          navigate("/")
      }


  }, [successMessage])


  return (
      <div
          style={{
              width: '100vw',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: !darkMode
                  ? "linear-gradient(to right, lightBlue 30%, blue"
                  : "linear-gradient(to right, black, blue)",
              padding: '2rem',
          }}
      >

          <div className='messageUs' style={{ width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", background: !darkMode ? "rgba(255, 255, 255, 0.663)" : "rgba(0, 0, 0, 0.63)", margin: "0 0 2vh 0", color: darkMode ? "white" : "black", }}>
              <h2 style={{ width: "100%", textAlign: "center" }}>Send {singleUser?.firstName} {singleUser?.lastName} A Message</h2>
              <h4 style={{  width: "100%", textAlign: "center" }}>The Form To Submit A Request To Attend This Event Is Below. Please Make Sure You Submit Your Correct Email So {singleUser?.firstName} Can Respond. {singleUser?.firstName} Looks Forward To Hearing From You </h4>
          </div>

          <form
              onSubmit={handleSubmit}
              style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: "center",
                  gap: '1rem',
              }}
          >

              <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Message:</h4>
              <textarea
                  name="msgBody"
                  placeholder={`I am trying to attend the Event named ${singleEvent?.title}. I am coming with List emails of people coming with you.`}
                  className='responsiveInput'
                  value={form.msgBody}
                  onChange={handleChange}
                  rows={4}
                  required
                  style={{ border: "solid lightGrey", background: "white", height: "50vh", width: "80%" }}
                  maxLength={5000}
              />

              <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Your First Name:</h4>
              <input
                  type="text"
                  name="firstName"
                  placeholder="Jane/John"
                  className='responsiveInput'
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                  maxLength={100}
              />

              <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Your Last Name:</h4>
              <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  className='responsiveInput'
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                  maxLength={100}
              />

              <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Your Email:</h4>
              <input
                  type="email"
                  name="email"
                  className='responsiveInput'
                  placeholder="example@mail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                  maxLength={100}
              />

              <h4 style={{ color: darkMode ? "white" : "black", width: "80%" }}>Your Phone Number: (Not Required)</h4>
              <input
                  type="tel"
                  name="phoneNumber"
                  className='responsiveInput'
                  placeholder="(555)555-5555"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  style={{ border: "solid lightGrey", background: "white", width: "80%" }}
                  maxLength={15}
              />

              {successMessage !== "Direct message sent successfully!" ? <button type="submit" className='responsiveButton rounded' style={{ background: "goldenRod", width: "80%", height: "5vh" }} >
                  Submit A Event Request
              </button> : <div className='responsiveButton rounded' style={{ background: 'lime', width: '80%', height: '5vh', color: 'black', display: "flex", justifyContent: 'center', alignItems: "center" }} >
                  Thank You For Submitting A Request To Attend Event
              </div>}

          </form>
      </div>
  )
}

export default DirectLandingContent
