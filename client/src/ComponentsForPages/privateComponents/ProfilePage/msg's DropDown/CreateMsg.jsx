
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makePost } from "../../../../redux/reducers/chatRoomReducers";
import DOMPurify from 'dompurify';
import CreateMsgModal from "./CreateMsg/CreateMsgModal";

const CreateMsg = ({ darkMode, setDarkMode, trigger, setTrigger, setChangeContent }) => {

  const MAX_LENGTH = 20000;

  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.user)

  const [openModal, setOpenModal] = useState(false)

  const [form, setForm] = useState({
    userId: user?._id || "",
    areaOfPost: "",
    postTitle: "",
    postBody: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Start with the raw message from state
    let safePostBody = form.postBody;
    // Only sanitize for non-admins
   
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
      userId: user?._id,      // make sure userId is set
      postBody: safePostBody, // sanitized content
    };
    dispatch(makePost(payload));
    // setChangeContent("")
    setForm((prev) => ({
      ...prev,
      areaOfPost: "",
      postTitle: "",
      postBody: "",
    }));
    
  };

  return (
    <div style={{ width: "100vw", height: "84vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "90%", minHeight: "90%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(245, 245, 245, 0.925)" }}>
        <h2 style={{ width: "100%", textAlign: "center", color: darkMode ? "white" : "black" }} > Create A Msg </h2>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: "center", gap: '1rem', }}>

          <label style={{ width: "100%", textAlign: "center", fontWeight: "bold" }}>Area of Post:</label>
          <select
            id="areaOfPost"
            name="areaOfPost"
            value={form.areaOfPost}
            onChange={handleInput}
            style={{ border: "solid lightGrey", background: "white", width: "80%" }}
            required
          >
            <option value="">Where Is This Msg Going?</option>
            <option value="ToAllStaff">To All Staff</option>
           {user?.NFadmin || user?.creator ? <option value="AdminToAdmin">Admin To Admin</option> : ""}
            {user?.NFadmin || user?.creator ? <option value="ToAllTeachers">To All Teachers</option> : ""}
            {user?.NFadmin || user?.creator ? <option value="ToAllMentors">To All Mentors</option> : ""}
          </select>

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

          <div style={{ background: "goldenRod", width: "80%", textAlign: "center" }} onClick={()=> setOpenModal(true)}>(Optional) How Do I Use Special Attributes For This Message?</div>

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

          <button type="submit" style={{ background: "green", color: "white", width: "80%", height: "5vh", margin: "1vh 0" }}>Submit Reply</button>

        </form>
      </div>

<dialog open={openModal} >
  <CreateMsgModal openModal={openModal} setOpenModal={setOpenModal} />
</dialog>

    </div>
  );
};
export default CreateMsg;