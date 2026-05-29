import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addOrUpdateAttendee, updateAttendeeStatus } from "../../../../redux/reducers/eventReducers"

const AttendeeEditor = ({ attendee, eventId, setTrigger }) => {

    const dispatch = useDispatch()
    const errorMessage = useSelector(state => state.event.errorMessage)

    const [status, setStatus] = useState(attendee.statusOnAttendence)

    const [form, setForm] = useState({
        email: attendee.email,
        bringingAlongEmails: attendee.bringingAlongEmails || []
    })

    const isEditable = status === "requested"

    const updateGuest = (i, val) => {
        const updated = [...form.bringingAlongEmails]
        updated[i] = val
        setForm({ ...form, bringingAlongEmails: updated })
    }

    const removeGuest = (i) => {
        const updated = form.bringingAlongEmails.filter((_, x) => x !== i)
        setForm({ ...form, bringingAlongEmails: updated })
    }

    const addGuest = () => {
        setForm({
            ...form,
            bringingAlongEmails: [...form.bringingAlongEmails, ""]
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!isEditable) return

        dispatch(addOrUpdateAttendee({
            eventId,
            form
        }))
    }

    const handleStatusChange = (e) => {

        const newStatus = e.target.value
        setStatus(newStatus)

        dispatch(updateAttendeeStatus({
            eventId,
            email: attendee.email,
            statusOnAttendence: newStatus
        }))

        setTrigger(true)
    }

    const labelStyle = {
        width: "100%",
        fontWeight: "bold"
    }

    const inputStyle = {
        border: "solid lightGrey",
        width: "80%",
        margin: "0.5vh 0"
    }

    return (
        <form
            onSubmit={handleSubmit}
            style={{ border: "10px double black", padding: "2vh 2vw", marginBottom: "10px" }}
        >

            <label style={labelStyle}>Primary Email:</label>
            <input
                type="email"
                value={form.email}
                disabled={!isEditable}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ ...inputStyle, background: isEditable ? "white" : "#eee" }}
            />

            <label style={labelStyle}>Current Attendance Status:</label>
            <select
                value={status}
                onChange={handleStatusChange}
                style={{ ...inputStyle, background: "white" }}
            >
                <option value="requested">requested</option>
                <option value="approved">approved</option>
                <option value="denied">denied</option>
            </select>

            <h4>Bringing Along Guests:</h4>

            {form.bringingAlongEmails.map((g, i) => {

                const guestHasError = errorMessage && errorMessage?.includes(g) && !errorMessage?.includes(attendee?.email)

                return (
                    <div key={i}>

                        <input
                            type="email"
                            value={g}
                            disabled={!isEditable}
                            onChange={e => updateGuest(i, e.target.value)}
                            style={{
                                ...inputStyle,
                                backgroundColor: guestHasError
                                    ? "red"
                                    : isEditable
                                        ? "white"
                                        : "#eee"
                            }}
                        />

                        {isEditable &&
                            <button
                                type="button"
                                style={{
                                    background: "red",
                                    margin: "1vh 1vw",
                                    padding: "0.3vh 2vw"
                                }}
                                onClick={() => removeGuest(i)}
                            >
                                Remove
                            </button>
                        }

                        <br />

                        {guestHasError &&
                            <b className="lookAtMe">❌ {errorMessage} ⛔</b>
                        }

                    </div>
                )
            })}

            {isEditable &&
                <button
                    type="button"
                    style={{
                        background: "goldenRod",
                        margin: "1vh 1vw",
                        padding: "0 2vw"
                    }}
                    onClick={addGuest}
                >
                    Add Guest
                </button>
            }

            <br /><br />

            {isEditable ? (
                <button
                    type="submit"
                    style={{
                        background: "lime",
                        margin: "1vh 1vw",
                        width: "40%"
                    }}
                >
                    Update
                </button>
            ) : (
                <div style={{ margin: "1vh 1vw", width: "40%" }}>
                    <b>✅ Completed — Change Status To "requested" To Edit</b>
                </div>
            )}

        </form>
    )
}

export default AttendeeEditor
