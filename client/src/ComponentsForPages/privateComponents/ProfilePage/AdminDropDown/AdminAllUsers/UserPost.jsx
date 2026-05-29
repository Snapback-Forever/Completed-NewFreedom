import React from 'react'
import moment from 'moment'
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';

const UserPost = ({ admin, user, post }) => {

    console.log("post",post);

  return (

    <div style={{ width: "100%", background: "lightGrey", margin: "1vh 0", display: "flex", flexDirection: "column", border: "solid black", padding: "1vw" }}>
    <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
      <span style={{ fontSize: "small" }}>{moment(post?.createdAt).format("hh:mm MMM Do YY")}</span>
      {admin?._id === post?.userId ? <Link to={`/messagePage/${post?.userId}`}> <h6>{post?.accountName}</h6></Link> : <>{ post?.isGroupPost ? "Your Group Post" : "Your Post"}</>}
    </div>

    {post?.recipients?.length !== 0 ? (
                <div
                    style={{ 
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                        background: "white",
                        width: "100%",
                    }}
                    className="scrollBar"
                >
                    {/* Animated strip */}
                    <div className="scrollBy" style={{ display: "flex" }}>
                        <div style={{ minWidth: "fit-content" }}><b>Other Users In Msg:</b></div>
                        {post.recipients
                            .filter(rep => rep !== user?.accountName)
                            .map(rep => (
                                <div key={rep} style={{ margin: "0 1vw", minWidth: "fit-content" }}>
                                    {rep}
                                </div>
                            ))}
                    </div>
                </div>
            ) : null}

    <div style={{ width: "100%", display: "flex", flexDirection: 'column' }}>
    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(singleNews?.postTitle) }} style={{ }} />
   <div style={{ width: "100%", textAlign: "center", padding: "2vw", wordBreak: "break-all", }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post?.postBody) }} />
    </div>
 
    </div>
    
  )
}

export default UserPost
