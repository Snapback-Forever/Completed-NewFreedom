import React, { useEffect, useMemo, useState } from 'react'
import SupportersCard from './SupportersCard'

const AllSupporter = ({ darkMode, setDarkMode, trigger, setTrigger, allSupporters }) => {

  const [selectedTier, setSelectedTier] = useState("all")
  const [visibleCount, setVisibleCount] = useState(10)
  const [smallScreen, setSmallScreen] = useState(window.innerWidth < 700)

  useEffect(() => {

    const handleResize = () => {
      setSmallScreen(window.innerWidth < 700)
    }

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)

  }, [])

  const tiers = ["all", "platinum", "gold", "silver", "bronze", "supporter"]

  const filteredSupporters = useMemo(() => {

    if (selectedTier === "all") {
      return allSupporters?.filter(sup => sup)
    }

    return allSupporters?.filter(sup => sup && sup?.tier === selectedTier)

  }, [allSupporters, selectedTier])

  const displayedSupporters = filteredSupporters?.slice(0, visibleCount)

  const headerTitle = selectedTier === "all" ? "All Supporters" : `${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Supporters`

  const handleTierChange = (tier) => {
    setSelectedTier(tier)
    setVisibleCount(10)
  }

  return (
    <>

      <div style={{ background: "white", display: "flex", flexDirection: smallScreen ? "column" : "row", justifyContent: "space-evenly", alignItems: "center", width: "99.5vw", flexWrap: "wrap", padding: "0.5vh 1vw" }}>
        {tiers.map(tier => {

          const isActive = selectedTier === tier

          return (
            <button
              key={tier}
              onClick={() => handleTierChange(tier)}
              style={{ padding: ".7rem 1.2rem", borderRadius: ".5rem", border: "1px solid grey", cursor: "pointer", backgroundColor: isActive ? "lightgrey" : darkMode ? "#222" : "goldenRod", color: darkMode ? "white" : "black", textTransform: "capitalize", fontWeight: 600, width: smallScreen ? "100%" : "15vw", margin: smallScreen ? "0.5vh 0vw" : "1vh 0.5vw" }}
            >
              {tier}
            </button>
          )
        })}
      </div>

      <h2 style={{ textAlign: "center", color: darkMode ? "white" : "black", marginBottom: "2vh" }}>
        {headerTitle}
      </h2>

      {filteredSupporters?.length === 0 ? (

        <h3 style={{ textAlign: "center", background: "white" }}>
          There are no {selectedTier === "all" ? "" : selectedTier} supporters to view.
        </h3>

      ) : (

        <>
        
          <div style={{ display: "flex", flexWrap: "wrap" }}>

            {displayedSupporters?.map(sup => {
              return (
                <SupportersCard
                  setTrigger={setTrigger}
                  sup={sup}
                  key={sup?._id}
                />
              )
            })}

          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "1vw", margin: "3vh 0", flexWrap: "wrap" }}>

            {visibleCount < filteredSupporters?.length && (
              <button
                onClick={() => setVisibleCount(prev => prev + 10)}
                style={{ padding: ".8rem 1.5rem", borderRadius: ".5rem", border: "1px solid grey", cursor: "pointer", background: "goldenRod", fontWeight: 600 }}
              >
                Show More
              </button>
            )}

            {visibleCount > 10 && (
              <button
                onClick={() => setVisibleCount(10)}
                style={{ padding: ".8rem 1.5rem", borderRadius: ".5rem", border: "1px solid grey", cursor: "pointer", background: "lightgrey", fontWeight: 600 }}
              >
                Show Less
              </button>
            )}

          </div>

        </>

      )}

    </>
  )
}

export default AllSupporter