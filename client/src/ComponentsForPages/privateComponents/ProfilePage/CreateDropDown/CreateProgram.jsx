import DOMPurify from "dompurify";
import { useDispatch, useSelector } from "react-redux";
import { makeProgram, resetErrorMessage, resetSuccessMessage } from "../../../../redux/reducers/locationReducer";
import { useEffect, useState } from "react";


const CreateProgram = ({ setChangeContent }) => {

    const dispatch = useDispatch();

    const successMessage = useSelector(state => state.pro.successMessage)

    const [formData, setFormData] = useState({
        programName: "",
        programType: "",
        openToPublic: false,
        descriptionOfProgram: "",
        descriptionOfProgramVideo: "",
        lengthOfProgram: "",
        maxCapacity: "",
        graduates: []
    });

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...formData };
        // sanitize the textarea field
        if (payload.descriptionOfProgram) {
            payload.descriptionOfProgram = DOMPurify.sanitize(
                payload.descriptionOfProgram,
                {
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
                        "base"
                    ],
                    FORBID_ATTR: ["onerror", "onload", "onclick"]
                }
            );
        }
        dispatch(makeProgram(payload));
    };

    useEffect(() => {
        if (successMessage === "Program created successfully!") {
            setChangeContent("")
            dispatch(resetErrorMessage())
            dispatch(resetSuccessMessage())
        }
    }, [successMessage])


    const labelStyle = {
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
        display: "flex",
        justifyContent: "center",
        margin: "1vh 0"
    };

    const inputStyle = {
        border: 'solid lightGrey',
        background: 'white',
        width: '80%',
    };

    return (

        <div style={{ width: '100vw', minHeight: '84vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: "2vh 0" }}>

            <div style={{ width: '90%', minHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', background: "rgba(250, 235, 215, 0.960)", overflowY: 'auto', padding: '1rem', }}>

                <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

                    <h2>Create Program</h2>

                    <label style={labelStyle}>Program Name:</label>
                    <input
                        name="programName"
                        placeholder="Program Name"
                        value={formData.programName}
                        onChange={handleInput}
                        style={inputStyle}
                        required
                    />

                    <label style={labelStyle}>Program Type:</label>
                    <select
                        name="programType"
                        value={formData.programType}
                        onChange={handleInput}
                        style={inputStyle}
                        required
                    >
                        <option value="">- Select Program Type -</option>
                        <option value="reg-Program">Regular Program</option>
                        <option value="vocational">Vocational</option>
                    </select>

                    <label style={labelStyle}>Max Capacity:</label>
                    <input
                        name="maxCapacity"
                        type="number"
                        placeholder="Max Capacity"
                        value={formData.maxCapacity}
                        onChange={handleInput}
                        style={inputStyle}
                        required
                    />

                    <label style={labelStyle}>Length Of Program: (# Of Days To Complete)</label>
                    <input
                        name="lengthOfProgram"
                        placeholder="# Of Days Fo Program"
                        value={formData.lengthOfProgram}
                        onChange={handleInput}
                        style={inputStyle}
                        required
                    />

                    <label style={labelStyle}>Description Of Program:</label>
                    <textarea
                        name="descriptionOfProgram"
                        placeholder="Program Description"
                        value={formData.descriptionOfProgram}
                        onChange={handleInput}
                        required
                        style={{ ...inputStyle, minHeight: "40vh" }}
                    />

                    <label style={labelStyle}>Video Link: (Optional)</label>
                    <input
                        name="descriptionOfProgramVideo"
                        placeholder="Video URL"
                        value={formData.descriptionOfProgramVideo}
                        onChange={handleInput}
                        style={inputStyle}
                    />

                    <label style={labelStyle}>Is Program Open To Public?

                        <input
                            type="checkbox"
                            name="openToPublic"
                            checked={formData.openToPublic}
                            onChange={handleInput}
                            style={{ transform: "scale(3,3)", margin: "2vh 2vw" }}
                        />

                    </label>

                    <h5><u>After You Create The Program</u> You Can Explore The Program And Beef It Up To Look Better. By Adding Images/Teachers/Graduates & Locations For This Program.</h5>
                    <h4>-- Explore DropDown Button/AllPrograms Button/Find Your Program --</h4>

                    <button type="submit" style={{ background: "goldenRod", width: "80%", height: "5vh" }}>Create Program</button>

                </form>
            </div>
        </div>

    );
};

export default CreateProgram;
