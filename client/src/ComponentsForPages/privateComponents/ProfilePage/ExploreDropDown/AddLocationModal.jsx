import React from "react";
import { useDispatch } from "react-redux";
import { attachProgramToLocation } from "../../../../redux/reducers/locationReducer";

const AddLocationModal = ({ setAddLocation, singleProgram, setTrigger, allLocations }) => {

  const dispatch = useDispatch();

  const handleAttach = async (locationId) => {

    const payload = {
      locationId,
      programId: singleProgram._id
    };

    try {
      await dispatch(attachProgramToLocation(payload)).unwrap?.();
      setTrigger(true);
      setAddLocation(false)
    } catch (err) {
      console.error("Attach failed:", err);
    }
  };

  return (

    <div className="addImageProModal scrollBar">

      <button style={{ fontSize: "2rem" }} onClick={() => setAddLocation(false)}>❎</button>

      {allLocations?.filter(loc => !singleProgram?.location?.some(t => t?._id?.toString() === loc?._id?.toString())).length === 0 ?  <h2 style={{ textAlign: "center" }}>No Locations To Add To Program</h2> : <>

        <h2 style={{ textAlign: "center" }}>Add Program To Location</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1vw", width: "100%", height: "73%", alignItems: "center", overflowY: "auto" }}>

          {allLocations?.filter(loc => !singleProgram?.location?.some(t => t?._id?.toString() === loc?._id?.toString())).map((location) => (

            <div key={location._id} style={{ display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "space-between", gap: "1vw", width: "80%", padding: "0.6vw 1vw", border: "1px solid #ccc", borderRadius: "8px", background: "#f9f9f9" }}>

              <h4 style={{ margin: 0 }}>{location.locationName}</h4>
              <h4 style={{ margin: 0 }}>Capacity Remaining: ({location.currentCapacity})</h4>

              <button style={{ background: "goldenrod", width: "100%", border: "none", cursor: "pointer" }} onClick={() => handleAttach(location._id)}>Attach To Location</button>

            </div>
          ))}

        </div></>}
    </div>
  );
};
export default AddLocationModal;