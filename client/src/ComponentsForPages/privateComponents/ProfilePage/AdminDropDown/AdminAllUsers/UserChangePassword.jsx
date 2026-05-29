import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changePassword } from '../../../../../redux/reducers/authReducer'
const UserChangePassword = ({ admin, user, setTrigger, setChangePassword }) => {

  const dispatch = useDispatch()

  const successMessage = useSelector(state => state.auth.successMessage)

  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [form, setForm] = useState({
    password: "",
    passwordNew: "",
    password2: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      userId: admin?._id
    }
    dispatch(changePassword(payload))
    setTrigger(true)
  }

  useEffect(() => {
    if (successMessage === "✅ Password changed successfully!") {
      setChangePassword(false)
    }
  }, [successMessage])

  return (

    <form onSubmit={handleSubmit} style={{ width: "100%", padding: "1vh 0" }}>
      <div style={{ margin: "1vh 0", display: "flex" }}>
        <input type={showPassword ? "text" : "password"} name="password" placeholder="Current Password" value={form.password} onChange={handleChange} style={{ width: "92%", padding: "0.5vh 0.5vw", border: "solid lightgray" }} />
        <div onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? (<div style={{ border: "solid lightgray", borderLeft: "none" }} title="Hide Password">😲</div>) : (<div style={{ border: "solid lightgray", borderLeft: "none" }} title="Show Password">😎</div>)}
        </div>
      </div>

      <div style={{ margin: "1vh 0", display: "flex" }}>
        <input type={showNewPassword ? "text" : "password"} name="passwordNew" placeholder="New Password" value={form.passwordNew} onChange={handleChange} style={{ width: "92%", padding: "0.5vh 0.5vw", border: "solid lightgray" }} />
        <div onClick={() => setShowNewPassword(!showNewPassword)}>
          {showNewPassword ? (<div style={{ border: "solid lightgray", borderLeft: "none" }} title="Hide Password">😲</div>) : (<div style={{ border: "solid lightgray", borderLeft: "none" }} title="Show Password">😎</div>)}
        </div>
      </div>

      <div style={{ margin: "1vh 0", display: "flex" }}>
        <input type={showConfirmPassword ? "text" : "password"} name="password2" placeholder="Confirm New Password" value={form.password2} onChange={handleChange} style={{ width: "92%", padding: "0.5vh 0.5vw", border: "solid lightgray" }} />
        <div onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
          {showConfirmPassword ? (<div style={{ border: "solid lightgray", borderLeft: "none" }} title="Hide Password">😲</div>) : (<div style={{ border: "solid lightgray", borderLeft: "none" }} title="Show Password">😎</div>)}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1vh" }}>
        <button type="submit" style={{ background: "green", color: "white", padding: "0.5vh 1vw" }}>Change Password</button>
        <button type="button" style={{ background: "red", color: "white", padding: "0.5vh 1vw" }} onClick={() => setChangePassword(false)}>Cancel</button>
      </div>

    </form>

  )
}
export default UserChangePassword


