import React, { useState } from 'react'
import NewsLetterCard from './NewsLetterCard';
import AddNewsImagesModal from './AddNewsImagesModal';

const AllNewsLetters = ({ darkMode, setDarkMode, trigger, setTrigger, allNewsLetters, setChangeContent }) => {

    const [addImage, setAddImage] = useState(false)
    const [newsInfo, setNewsInfo] = useState("")

    const [visibleCount, setVisibleCount] = useState(5);



    return (

        <div>

            <button style={{ background: "goldenRod", width: "100%", margin: '1vh 0' }} onClick={() => setChangeContent("createNews")}>Create A News Letter</button>

          {allNewsLetters?.filter(news => news).length === 0 ?
    <h2 style={{ textAlign: "center", color: darkMode ? "white" : "black" }}>
        Currently No News Letters
    </h2>
    :
    <>
        <h2 style={{ textAlign: "center", color: darkMode ? "white" : "black" }}>
            All News Letters
        </h2>

        {allNewsLetters
            ?.filter(news => news)
            .slice(0, visibleCount)
            .map(news => {
                return (
                    <NewsLetterCard
                        key={news._id}
                        news={news}
                        setTrigger={setTrigger}
                        setChangeContent={setChangeContent}
                        setAddImage={setAddImage}
                        addImage={addImage}
                        setNewsInfo={setNewsInfo}
                    />
                )
        })}

        {visibleCount < allNewsLetters?.filter(news => news).length && (
            <div style={{ display: "flex", justifyContent: "center", margin: "2vh 0" }}>
                <button
                    style={{ width: "98%", background: "goldenrod" }}
                    onClick={() => setVisibleCount(prev => prev + 5)}
                >
                    See More NewsLetters
                </button>
            </div>
        )}
    </>
}


                <dialog open={addImage}>
                <AddNewsImagesModal
                    newsInfo={newsInfo} 
                    setNewsInfo={setNewsInfo}
                    setTrigger={setTrigger}
                    setAddImage={setAddImage}
                />
            </dialog>
        </div>

    )
}

export default AllNewsLetters
