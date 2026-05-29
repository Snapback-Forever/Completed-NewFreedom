import React, { useState } from 'react'
import DOMPurify from 'dompurify';
import moment from 'moment'
import { Link } from 'react-router-dom';

const NewsContent = ({ darkMode, allNewsLetters, data, setData }) => {



    return (

        <div style={{ height: "84.1vh", overflow: "scroll", display: "flex", flexDirection: "column", alignItems: "center" }} className={darkMode ? "scrollBar QADark" : "scrollBar QAWhite"} >

            {allNewsLetters?.filter(news => news?.status === "published").length === 0 ? <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>Currently No NewsLetters</h2> :
             <>
                <h2 style={{ textAlign: "center", color: !darkMode ? "black" : "white" }}>All News Letters</h2>
                {allNewsLetters?.filter(news => news?.status === "published").map(news => {   
                    return (
                        <div style={{ width: "90vw", background: "rgba(250, 235, 215, 0.960)", margin: "1vh 0", display: "flex", flexDirection: "column", border: "solid antiqueWhite", padding: "1vw" }} key={crypto?.randomUUID()}>

                            <div style={{ fontSize: "small", display: "flex", width: "100%", justifyContent: "end" }}><b>NewsLetter Date: </b> {moment(news?.periodStart).format("MMM YYYY")}</div>
                            <h2 style={{ textAlign: "center", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news?.postTitle) }} />
                            <h6 style={{ width: "100%", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news?.StoriesThisNews) }} />
                            <Link key={news?._id} to={`/newsletter/${news?._id}`} style={{ color: "black" }}>
                                <button style={{ textAlign: "center", width: "100%", background: "goldenRod" }}>View This NewsLetter</button>
                            </Link>
                        </div>
                    )
                })}</>}


        </div>

    )
}

export default NewsContent
