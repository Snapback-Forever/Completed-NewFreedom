import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateMsgModal from "./Group Msg/CreateMsgModal";
import ModalFindUser from "./Group Msg/ModalFindUser";
import DOMPurify from 'dompurify';
import { groupPost } from "../../../../redux/reducers/chatRoomReducers";

const CreateGroupMsg = ({ darkMode, setDarkMode, trigger, setTrigger, setChangeContent, allUsers }) => {

  const MAX_LENGTH = 20000;

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [openModal, setOpenModal] = useState(false);
  const [openModalUser, setOpenModalUser] = useState(false);

  const handleAddRecipient = (accountNameNormalized) => {
    setForm((prev) => {
      const current = prev.recipientAccountNames || "";
      // avoid duplicate entries
      const parts = current
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      if (parts.includes(accountNameNormalized)) {
        return prev; // already added
      }
      const updated =
        parts.length === 0
          ? accountNameNormalized
          : `${current.replace(/,\s*$/, "")}, ${accountNameNormalized}`;
      return {
        ...prev,
        recipientAccountNames: updated,
      };
    });
  };

  const [form, setForm] = useState({
    userId: user?._id || "",
    areaOfPost: "ToAGroup",       
    postTitle: "",
    postBody: "",
    recipientAccountNames: "",
    groupRole: "",
  });

  const handleClearRecipients = () => {
    setForm(prev => ({
      ...prev,
      recipientAccountNames: "",
    }));
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let safePostBody = form.postBody;
   
      safePostBody = DOMPurify.sanitize(safePostBody, {
        FORBID_TAGS: [
          "script",
          "iframe",
          "object",
          "embed",
          "form",
          "input",
          "button",
          "link",
          "meta",
          "base",
        ],
        FORBID_ATTR: ["onerror", "onload", "onclick"],
      });
    
    const payload = {
      ...form,
      userId: user?._id,
      postBody: safePostBody,
      // areaOfPost is "ToAGroup" from state
    };
    dispatch(groupPost(payload)); // NEW: dispatch groupPost action
    setForm((prev) => ({
      ...prev,
      // keep areaOfPost as ToAGroup for future group messages
      postTitle: "",
      postBody: "",
      recipientAccountNames: "",
      groupRole: "",
    }));
  };

  return (
    <div style={{ width: "100vw", height: "84vh", display: "flex", flexDirection: "column", alignItems: "center", margin: "1.5vh 0" }}>
      <div style={{ width: "90%", minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(245, 245, 245, 0.925)", padding: "2vh 1vw", overflowY: "scroll" }}>
        <h2 style={{ width: "100%", textAlign: "center", color: "black" }} > Create A Group Msg </h2>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: "center", gap: '1rem', }}>

          <div style={{ border: "double black", width: "90%", display: "flex", flexDirection: "column", alignItems: "center", padding: "2vh 0" }}>
         
         {!form.groupRole ? 
         <>
            <label style={{ width: "100%", textAlign: "center", fontWeight: "bold" }}>Recipients Select Users Individually Or Select A Group Role:</label>
            <input
              id="recipientAccountNames"
              name="recipientAccountNames"
              type="text"
              value={form.recipientAccountNames}
              readOnly
              placeholder="Use Select users button to add users to group Msg..."
              style={{ border: "solid lightGrey", background: "white", width: "80%" }}
            />

            <div
              style={{ background: "goldenRod", width: "80%", textAlign: "center", margin: "1vh 0" }}
              onClick={() => setOpenModalUser(true)}
            >
              Select Users
            </div>

            {form.recipientAccountNames && (
              <div
                style={{ background: "lightcoral", width: "80%", textAlign: "center", marginTop: "0.5rem", cursor: "pointer" }}
                onClick={handleClearRecipients}
              >
                Clear Recipients
              </div>
            )}
            </> : ""}

            {!form.recipientAccountNames && !form.groupRole ? <h5>OR</h5> : ""}

            {!form.recipientAccountNames ? <>

              {/* OR select a groupRole */}
              <label style={{ width: "100%", textAlign: "center", fontWeight: "bold" }}>Select a Group Role:</label>
              <select
                id="groupRole"
                name="groupRole"
                value={form.groupRole}
                onChange={handleInput}
                style={{ border: "solid lightGrey", background: "white", width: "80%" }}
              >
                <option value="">- Select A Group Role of users -</option>
                <option value="NFadmin">NF Admin</option>
                <option value="creator">Creator</option>
                <option value="mentor">Mentor</option>
                <option value="teacher">Teacher</option>
                <option value="newsLetter">Newsletter</option>
                <option value="hiring">Hiring</option>
                <option value="staffCustomerService">Staff Customer Service</option>
                <option value="websiteSupportTeam">Website Support Team</option>
                <option value="eventStaff">Event Staff</option>
              </select>
            </> : ""}

          </div>

          <label style={{ width: "100%", textAlign: "center", fontWeight: "bold" }}>Title:</label>
          <input
            id="postTitle"
            name="postTitle"
            type="text"
            value={form.postTitle}
            onChange={handleInput}
            placeholder="I Love Working For New Freedom."
            style={{ border: "solid lightGrey", background: "white", width: "80%" }}
          />
          <div style={{ background: "goldenRod", width: "80%", textAlign: "center" }} onClick={() => setOpenModal(true)}>(Optional) How Do I Use Special Attributes For This Message?</div>
          <label style={{ width: "100%", textAlign: "center", fontWeight: "bold" }}>Message:</label>
          <textarea
            id="postBody"
            name="postBody"
            value={form.postBody}
            onChange={handleInput}
            placeholder="Write your message..."
            rows={4}
            style={{ border: "solid lightGrey", background: "white", width: "80%", minHeight: "20vh" }}
            maxLength={MAX_LENGTH}
            required
          />
          <div style={{ width: "80%", textAlign: "right", fontSize: "0.85rem" }}>
            {MAX_LENGTH - form.postBody.length} / {MAX_LENGTH}
          </div>
          {form.postBody !== "" ?
            <div style={{ border: "double black", width: "80%" }}>
              <h6>Preview Of Msg: </h6>
              <div style={{ width: "100%", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form.postBody) }} />
            </div>
            : ""}
          <button type="submit" style={{ background: "green", color: "white", width: "80%", height: "5vh", margin: "1vh 0" }}>Submit Group Msg</button>
        </form>
      </div>

      <dialog open={openModal} >
        <CreateMsgModal openModal={openModal} setOpenModal={setOpenModal} />
      </dialog>

      <dialog open={openModalUser} >
        <ModalFindUser openModal={openModal} setOpenModalUser={setOpenModalUser} allUsers={allUsers} onAddRecipient={handleAddRecipient} />
      </dialog>


    </div>
  );
};
export default CreateGroupMsg;