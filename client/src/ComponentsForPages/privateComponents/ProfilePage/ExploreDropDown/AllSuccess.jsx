import React, { useState } from 'react'
import SuccessCard from './SuccessCard'
import AddSucImageModal from './AddSucImageModal'

const AllSuccess = ({ darkMode, setDarkMode, trigger, setTrigger, allStories }) => {

  const [visibleCount, setVisibleCount] = useState(5)
  const [addImage, setAddImage] = useState(false)
  const [sucInfo, setSucInfo] = useState("")

  const showMore = () => {
    setVisibleCount(prev => prev + 5)
  }

  const visibleStories = allStories?.filter(suc => suc).slice(0, visibleCount)

  return (
    <div>

      {visibleStories?.map((suc) => (
        <SuccessCard key={suc._id} setTrigger={setTrigger} suc={suc} addImage={addImage} setAddImage={setAddImage} sucInfo={sucInfo} setSucInfo={setSucInfo} />
      ))}

      {visibleCount < allStories?.length && (
        <div style={{ display: "flex", justifyContent: "center", margin: "2vh 0" }}>
          <button
            onClick={showMore}
            style={{ background: "goldenRod", width: "98%" }}
          > Show More Stories </button>

        </div>
      )}

      <dialog open={addImage}>
        <AddSucImageModal
          sucInfo={sucInfo}
          setSucInfo={setSucInfo}
          setTrigger={setTrigger}
          setAddImage={setAddImage}
        />
      </dialog>

    </div>
  )
}

export default AllSuccess
