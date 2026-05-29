import React, { useRef } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAuditLog } from '../../../../redux/reducers/authReducer'
import { Link } from 'react-router-dom'

const LogCard = ({ log, setTrigger }) => {

    const dispatch = useDispatch()

    const admin = useSelector(state => state.auth.user)

    const clickCountRef = useRef(0)
    const timeoutRef = useRef(null)

    const sixtyDayActions = ["UPDATE_SECURITY_ACCESS_LEVELS", "GRANTED_NFADMIN", "REVOKED_NFADMIN", "UPDATE_SECURITY_ACCESS_LEVELS_CREATOR", "Removed from website", "User-Registered - Account Name", "Updated Profile", "REMOVE_USER_FROM_PROGRAM", "REDUCE_MAIL_USER", "DELETE_MAIL_USER", "REMOVE_STUDENT_FROM_PROGRAM", "REMOVE_GRADUATE", "DELETE_PROGRAM"]

    const shouldShowDeleteButton = () => {
        if (!log?.createdAt) return false
        const isSixtyDayLog = sixtyDayActions.some(item => log?.action?.startsWith(item))
        const ageLimitDays = isSixtyDayLog ? 60 : 30
        const logAgeInDays = moment().diff(moment(log.createdAt), "days")
        return logAgeInDays >= ageLimitDays
    }

    const handleDelete = (id) => {
        clickCountRef.current += 1
        if (clickCountRef.current === 3) {
            clearTimeout(timeoutRef.current)
            dispatch(deleteAuditLog({ id }))
            if (setTrigger) setTrigger(true)
            clickCountRef.current = 0
            return
        }
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => { clickCountRef.current = 0 }, 400)
    }

    return (
        <div style={{ width: "96vw", background: "rgba(250,235,215,0.96)", padding: "1rem 1vw", margin: "1vh 1vw" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "small" }}><b>Report Made: </b>{moment(log?.createdAt).format("MMM Do YY")}</span>
                {log?.auditLogStatus ? <span style={{ fontSize: "small" }}><b>Status:</b> {log?.auditLogStatus}</span> : ""}
            </div>

            {log?.action ? <h4 style={{ textAlign: "center" }}><b>Action Taken:</b> {log?.action}</h4> : ""}
            {log?.aboutAuditLog ? <h4 style={{ textAlign: "center" }}><b>About Audit Log:</b> {log?.aboutAuditLog}</h4> : ""}

            <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "start" }}>
                {log?.details ? <h6 style={{ textAlign: "center" }}><b>Log Details:</b> <br />{log?.details}</h6> : ""}

                {log?.performedBy ?
                    <div>
                        {admin?._id !== log?.performedBy ?
                            <Link to={`/messagePage/${log?.performedBy}`}>
                                <button style={{ background: "lightBlue", padding: "0 2vw" }}>Message Performed By User</button>
                            </Link>
                            :
                            <h6 style={{ textAlign: "center", background: "red", padding: "0 2vw" }}>You Performed This Action</h6>}
                    </div> : ""}

                {log?.performedByFirstName ? <h6 style={{ textAlign: "center" }}><b>Performed First Name:</b> {log?.performedByFirstName}</h6> : ""}
                {log?.performedByLastName ? <h6 style={{ textAlign: "center" }}><b>Performed Last Name:</b> {log?.performedByLastName}</h6> : ""}
                {log?.userMakingLog ? <h6 style={{ textAlign: "center" }}><b>Performed Account Name:</b> {log?.userMakingLog}</h6> : ""}
                {log?.affectedUser ? <h6 style={{ textAlign: "center" }}><b>Affected User Id #:</b> {log?.affectedUser}</h6> : ""}
                {log?.affectedUserAccountName ? <h6 style={{ textAlign: "center" }}><b>Affected User Account:</b> {log?.affectedUserAccountName}</h6> : ""}
            </div>

            {shouldShowDeleteButton() ? <div style={{ display: "flex", justifyContent: "end" }}>
                <button onClick={() => handleDelete(log._id)} style={{ background: "crimson", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer" }}>Delete Report</button>
            </div> : ""}
        </div>
    )
}

export default LogCard
