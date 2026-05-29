import React, { useState } from 'react'

const ImgCard = ({ imgSrc }) => {

    const [ viewImg, setViewImg ] = useState(false)

    return (
        <div

            style={{
                display: "flex",
                flexDirection: "column",
                margin: "1vh 0.5vw",
                border: "double black",
                padding: "1vh 1vw",
                maxWidth: "20vw",
                minWidth: "20vw",
                maxHeight: "23vh",
                minHeight: "23vh"
            }}>
            {imgSrc &&
                <img
                    src={imgSrc}
                    alt=""
                    style={{
                        maxWidth: "18vw",
                        minWidth: "18vw",
                        maxHeight: "20vh",
                        minHeight: "20vh"
                    }}
                    className={viewImg ? "drawHover" : ""}
                    onClick={() => setViewImg(prev => !prev)}
                />}

        </div>
    )
}

export default ImgCard
