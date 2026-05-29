
import Card from 'react-bootstrap/Card';

import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Link, useParams } from 'react-router-dom'
 
import moment from 'moment'
import DOMPurify from 'dompurify';

import newImg from "../../../images/newFreedomLogo.png"
import newImg2 from "../../../images/whiteLogoNf.png"
import defaultImage from "../../../images/smile.png"


const MessageComponent = ({ openSearchUserModal, setOpenSearchModal, darkMode, setDarkMode }) => {

  const dispatch = useDispatch()
  const currentMessage = useRef()
  const { userId } = useParams()

  const authId = useSelector(state => state?.auth?.user?._id)
  const user = useSelector(state => state?.auth?.user)
  const socketConnection = useSelector(state => state?.auth?.socketConnection)

  const [click, setClick] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allMessage, setAllMessage] = useState([])
  const [onHover, setOnHover] = useState(false)

  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    imageFileId: null,
    imageBucketName: null,
    imagePreview: null,
    imageFile: null,
    videoUrl: "",
    videoFileId: null,
    videoBucketName: null,
    videoPreview: null,
    videoFile: null,
    seen: "",
    accountName: ""
  });

  const [dataUser, setDataUser] = useState({

    _id: "",

    profilePic: "",
    profilePicFileId: null,
    profilePicBucketName: null,

    accountName: "",
    email: "",
    location: "",
    online: false,
    products: [],
    blockedUser: [],
    blockedFromUser: []

  })

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (message.imagePreview) {
      URL.revokeObjectURL(message.imagePreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setMessage((prev) => ({
      ...prev,
      imagePreview: previewUrl,
      imageUrl: previewUrl,   // <-- make condition true
      imageFile: file
    }));
  };

  const handleUploadVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (message.videoPreview) {
      URL.revokeObjectURL(message.videoPreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setMessage((prev) => ({
      ...prev,
      videoPreview: previewUrl,
      videoUrl: previewUrl,   // <-- make condition true
      videoFile: file
    }));
  };

  const handleClearUploadImage = () => {
 
    setMessage((prev) => ({
      ...prev,
      imageUrl: "",
      imageFile: "",
      imagePreview: "",
      imageFileId: null,
      imageBucketName: null,
    }));
    // setImgSrc(null);
  };

  const handleClearUploadVideo = () => {
    if (message.videoPreview) {
      URL.revokeObjectURL(message.videoPreview);
    }
    setMessage((prev) => ({
      ...prev,
      videoUrl: "",
      videoPreview: null,
      videoFileId: null,
      videoBucketName: null,
    }));

  };

  useEffect(() => {
    if (currentMessage?.current) {
      currentMessage?.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [socketConnection, allMessage?.length, click, message, dataUser])


  useEffect(() => {

    if (socketConnection) {
      socketConnection.emit("message-page", userId)

      socketConnection.emit("seen", userId)

      socketConnection.on("message-user", (data) => {
        setDataUser(data)
      })

      socketConnection.on("message", (data) => {
        setAllMessage(data)
      })

    }

  }, [socketConnection, userId, dataUser?.length, click, allMessage?.length])

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setMessage(preve => {
      return {
        ...preve,
        text: value
      }
    })
  }

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
  
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const tabSpaces = "    ";
  
      const updatedDescription =
        message.text.substring(0, start) +
        tabSpaces +
        message.text.substring(end);
  
      setMessage((prev) => ({ ...prev, text: updatedDescription }));
  
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + tabSpaces.length;
      });
    }
  };
  

  const handleSendMessage = async (e) => {
    e.preventDefault();
  
    let textToSend = message.text || "";
  
    if (!user.isAdmin) {
      textToSend = DOMPurify.sanitize(textToSend, {
        ALLOWED_TAGS: ["b", "br"],
        ALLOWED_ATTR: [],
      });
    }
  
    const hasContent =
      textToSend.trim() ||
      message.imageFile ||
      message.imageFileId ||
      message.videoFile ||
      message.videoFileId;
  
    if (!hasContent) return;
  
    let imageUploadResult = null;
    let videoUploadResult = null;
  
    if (message.imageFile) {
      const body = new FormData();
      body.append("image", message.imageFile);
  
      const res = await fetch("http://localhost:8080/upload/image", {
        method: "POST",
        body,
      });
  
      if (!res.ok) {
        console.error("Image upload failed");
        return;
      }
  
      imageUploadResult = await res.json();
    }
  
    if (message.videoFile) {
      const body = new FormData();
      body.append("video", message.videoFile);
  
      const res = await fetch("http://localhost:8080/upload/video", {
        method: "POST",
        body,
      });
  
      if (!res.ok) {
        console.error("Video upload failed");
        return;
      }
  
      videoUploadResult = await res.json();
    }
  
    const payload = {
      sender: user?._id,
      receiver: userId,
      text: textToSend,
      imageUrl: message.imageUrl || null,
      videoUrl: message.videoUrl || null,
      imageFileId: imageUploadResult?.fileId ?? message.imageFileId,
      imageBucketName: imageUploadResult?.bucketName ?? message.imageBucketName,
      videoFileId: videoUploadResult?.fileId ?? message.videoFileId,
      videoBucketName: videoUploadResult?.bucketName ?? message.videoBucketName,
      msgByUserId: user?._id,
      accountName: user?.accountName,
    };
  
    socketConnection?.emit("new message", payload);
  
    setMessage({
      text: "",
      imageUrl: "",
      imageFileId: null,
      imageBucketName: null,
      imagePreview: null,
      imageFile: null,
      videoUrl: "",
      videoFileId: null,
      videoBucketName: null,
      videoPreview: null,
      videoFile: null,
      seen: "",
      accountName: "",
    });
  };
  

  const openOptions = () => {
    setClick(preve => !preve)
  }

  const refreshOption = () => {
    setRefresh(preve => !preve)
  }

  const baseUrl = 'http://localhost:8080';
  const profilePicSrc = (dataUser?.profilePicFileId && dataUser?.profilePicBucketName)
    ? `${baseUrl}/upload/image/${dataUser?.profilePicFileId}?bucketName=${dataUser?.profilePicBucketName}` : dataUser?.profilePic || defaultImage


  return (

    <>
      <div style={{ width: "70%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {dataUser?._id === authId ?
          <></>
          :

          <div style={{ width: "100%", background: "white", display: "flex" }}>
            <Link to={`/messagePage/${user?._id}`} ><button style={{ margin: "1vh 1vw" }} onClick={handleClearUploadImage}>🔙</button></Link>
             <img src={profilePicSrc} style={{ height: "6vh", margin: "0.5rem" }} alt="Profile Pic"/>

             <div style={{ display: "flex", flexDirection: "column", width: "90%", height: "6vh" }}>
             <b>{dataUser?.accountName}</b>
             <div>{dataUser?.onlineUser ? <div style={{ fontSize: "small", background: "rgba(0, 255, 0, 0.379)", width: "60%" }} ><span className='bg-white'>👽</span>Online</div>
             : <div style={{ fontSize: "small", background: "rgba(255, 0, 0, 0.396)", width: "60%" }} ><span className='bg-white'>😡</span>Offline</div>}</div>
             </div>
          </div>
        }

        <div style={{ minHeight: "70vh", maxHeight: "70vh", width: "100%", display: "flex", flexDirection: "column", overflowY: "scroll" }} className='scrollBar'>

          {/* IF YOUR CURRENT USER */}
          {dataUser?._id === authId ?
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "98%" }} >

              <div style={{ padding: "2vh", minWidth: "15vw", maxWidth: "90%", fontVariant: "small-caps", textAlign: "center" }} >
                {!darkMode ? <img src={newImg} style={{ minHeight: "50vh", maxHeight: "50vh" }} /> :
                <img src={newImg2} style={{ minHeight: "60vh", maxHeight: "60vh" }} />}
              <h4 className="text-center" style={{ width: "100%", }}> <b style={{ color: !darkMode? "black" : "white", padding: "0.5vh" }}>
                <button style={{ width: "fit-content", background: "blue", margin: "0.5vw" }} onClick={() => setOpenSearchModal(true)}>🔎</button>Search Users</b></h4>
              </div>

            </div>
            :
            <div className='flex flex-col gap-2'>
              {/* SHOW ALL MESSAGE -------------------------- */}

              {allMessage?.filter(msg => msg).map((msg, index) => {
                const hasText = !!msg?.text;
                const hasImage =
                  !!(
                    msg?.imageUrl ||
                    (msg?.imageFileId && msg?.imageBucketName)
                  );
                // If it’s an image message, build src
                const imgSrc =
                  msg?.imageFileId && msg?.imageBucketName
                    ? `${baseUrl}/upload/image/${msg.imageFileId}?bucketName=${msg.imageBucketName}`
                    : msg?.imageUrl;
                const isMe = user?._id === msg?.msgByUserId;
                // 1. IMAGE MESSAGE (takes precedence if you want image-only messages)

                if (hasImage && !hasText) {
                  return (
                    <div key={msg._id || crypto.randomUUID()} style={{ width: "100%", display: "flex", justifyContent: isMe ? "flex-start" : "flex-end", }}
                      ref={!isMe ? currentMessage : undefined}
                    >
                      <Card className="text-center" style={{ minWidth: "50%", maxWidth: "100%", margin: "1vw", border: `2px solid ${isMe ? "lightBlue" : "tan"}`, }} >
                        <Card.Header style={{ background: isMe ? "lightBlue" : "tan" }}>
                          <div
                            className="flex justify-between"
                            style={{ flexWrap: "wrap" }}
                          >
                            <div>
                              <span style={{ fontSize: "small" }}> {moment(msg?.createdAt).format("hh:mm MMM Do YY")} </span>
                            </div>
                            <div>
                              {isMe ? (
                                <>
                                  <b>To:</b> {dataUser?.accountName}
                                </>
                              ) : (
                                <>
                                  <b>FROM:</b> {msg?.accountName}
                                </>
                              )}
                            </div>
                          </div>
                        </Card.Header>
                        
                        <Card.Img variant="top" src={imgSrc} style={{ minHeight: "60vh", maxHeight: "60vh", }} onClick={() => setOnHover(prev => !prev)} className={onHover ? 'drawHover' : ""}/>


                      </Card>
                    </div>
                  );
                }
                // 2. TEXT MESSAGE (no image)
                if (hasText && !hasImage) {
                  return (
                    <div key={msg._id || crypto.randomUUID()} style={{ width: "100%", display: "flex", justifyContent: isMe ? "flex-start" : "flex-end" }} ref={!isMe ? currentMessage : undefined} >
                      <Card style={{ minWidth: "50%", maxWidth: "100%", margin: "1vw", border: `2px solid ${isMe ? "lightBlue" : "tan"}`, }} >
                        <Card.Header style={{ background: isMe ? "lightBlue" : "tan" }}>
                          <div className="flex justify-between" style={{ flexWrap: "wrap" }} >
                            <div>
                              <span style={{ fontSize: "small" }}> {moment(msg?.createdAt).format("hh:mm MMM Do YY")} </span>
                            </div>
                            <div>
                              {isMe ? (
                                <>
                                  <b>To:</b> {dataUser?.accountName}
                                </>
                              ) : (
                                <>
                                  <b>FROM:</b> {msg?.accountName}
                                </>
                              )}
                            </div>
                          </div>
                        </Card.Header>
                        <Card.Body>
                        <Card.Text style={{ padding: "1vw" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((msg?.text || "").replace(/\n/g, "<br />")),
  }}
/>

                        </Card.Body>
                      </Card>
                    </div>
                  );
                }
                // 3. If you ever have a message with both or neither, handle it here
                return null;
              })}

            </div>}

          {message?.imageUrl && (
            <div style={{ width: "100%", height: "98%", position: "sticky", background: "grey", bottom: "0" }}>
              <div style={{ width: "100%", background: "white" }}>
                <button style={{ fontSize: "3vh" }} onClick={handleClearUploadImage}>
                  ❎<span style={{ fontSize: "small", fontWeight: "bolder" }}>Cancel Upload?</span>
                </button>
              </div>
              <div className="bg-white" style={{ width: "100%", height: "98%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src={message?.imagePreview} alt="uploaded image" style={{ width: "90%", height: "80%" }}  onClick={() => setOnHover(prev => !prev)} className={onHover ? 'drawHover' : ""}/>
              </div>
            </div>
          )}

        </div>

        {dataUser?._id === authId ? <></> : <>
          {/* SEND MESSAGE ----------------------- */}
          <div style={{ background: "white", height: "8vh", width: "98%", marginTop: "1vh", display: "flex", alignItems: "center" }}>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "0.5vw" }}>

              <label htmlFor='uploadImage' style={{ background: "goldenrod", borderRadius: '10%', display: "flex", padding: "1vh 1vw", justifyContent: "center", alignItems: "center" }}><div>📷</div></label>

              <input
                type="file"
                id="uploadImage"
                className="hidden"
                onChange={handleUploadImage}
              />

            </div>

            <div style={{ width: "90%", height: "6vh", display: "flex", textAlign: "center" }}>
  <form onSubmit={handleSendMessage} style={{ width: "100%", height: "6vh", marginRight: "1vw", display: "flex" }}>
    {!message?.imageFile ? (
      <textarea style={{ width: "98%", height: "6vh", border: "solid lightGrey", background: "whitesmoke", marginRight: "1vw", resize: "none" }} placeholder="Type in a Message"   value={message.text}
      onChange={handleOnChange}
      onKeyDown={handleDescriptionKeyDown} />
    

    ) : (
      <h4 style={{ width: "98%", height: "6vh", border: "solid red", background: "whitesmoke", marginRight: "1vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Img Is Ready To Send
      </h4>
    )}

    <button style={{ height: "100%", padding: "0 2vw", background: "goldenRod" }} type="submit">
      Send
    </button>
  </form>
</div>




          </div></>}
      </div>


    </>

  )
}

export default MessageComponent
