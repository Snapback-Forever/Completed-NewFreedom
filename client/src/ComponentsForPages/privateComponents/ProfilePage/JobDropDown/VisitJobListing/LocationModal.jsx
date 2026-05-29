import React from "react";

const LocationModal = ({ allLocations, onSelectLocation, onClose }) => {



  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
      <div style={{ background: "white", width: "80%", maxHeight: "80vh", overflowY: "auto", padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Select a Location</h3>
          <button type="button" onClick={onClose}>Close</button>
        </div>

        {allLocations?.length ? allLocations.map((location) => (
          <div key={location._id} style={{ border: "1px solid lightgrey", margin: "0.5rem 0", padding: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div><b>{location.locationName || location.name}</b></div>
              {location.address ? <div>{location.address}</div> : null}
            </div>
            <button type="button" onClick={() => onSelectLocation(location)}>Select</button>
          </div>
        )) : <div>No locations found.</div>}
      </div>
    </div>
  );
};

export default LocationModal;

