
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selfServiceChangePassword } from '../../redux/reducers/authReducer';


const ForgotPassword = ({ openLogin, setOpenLogin, openTerms, setOpenTerms, openForgotPassword, setOpenForgotPassword }) => {

    const dispatch = useDispatch();

    const successMessage = useSelector(state => state.auth.successMessage);

    const securityQuestionOptions = [
        "In one word, What is your mother's maiden name?",
        "In one word, What was the first name of your first crush?",
        "In one word, What is your favorite food?",
        "In one word, what city were you born?",
        "In one word, What was your nickName your parents gave you?",
        "In one word, What is the one place you want to visit most",
        "In one word, Where do you see yourself in 10 years",
    ];


    const [state, setState] = useState({
        email: "",
        passwordNew: "",
        password2: "",
        dateOfBirth: "",
        securityQuestions: [
            { question: "", answer: "" },
            { question: "", answer: "" },
            { question: "", answer: "" },
        ],
        secreteKey: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showSecAnswers, setShowSecAnswers] = useState(false);
    const [showSecretKey, setShowSecretKey] = useState(false);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setState(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSecurityInput = (idx, field, value) => {
        const updated = state.securityQuestions.map((item, i) =>
            i === idx ? { ...item, [field]: value } : item
        );
        setState(prev => ({ ...prev, securityQuestions: updated }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(selfServiceChangePassword(state));

    };

    useEffect(() => {
        if (successMessage.startsWith("✅")) {
            setOpenForgotPassword(false);
            setOpenLogin(true)

            setState({
                email: "",
                passwordNew: "",
                password2: "",
                dateOfBirth: "",
                securityQuestions: [
                    { question: "", answer: "" },
                    { question: "", answer: "" },
                    { question: "", answer: "" },
                ]
            });
        }
    }, [successMessage]);


    return (
        <div className='forgotModal'>
            <div className='w-full'><button onClick={() => setOpenForgotPassword(false)} style={{ fontSize: "3vh", padding: "2vw", lineHeight: "1vh" }}>❎</button></div>

            <h2 style={{ textAlign: "center", background: "tan" }}><u>Forgot Your Password?</u></h2>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "90%" }}>

                    <div style={{ background: "lightGrey" }}>
                        <h6 style={{ textAlign: "center" }}>You get <u style={{ color: "red" }}>THREE ATTEMPTS</u> In 24 hours. If you max out attempts this information will be sent to Admin & Admin Could reach out to you in your email & try to help you figure out your forgotten password. If Admin is not able to contact you within 24 hours we apologize but please attempt your password change again in 24 hours.</h6>
                        <h6 style={{ textAlign: "center" }}>Admin could <u>TRY</u> to email anyone that makes a changed password attempt to make sure you are the user trying to change your password. Make sure to check your spam folder in your email.</h6>
                        <h6 style={{ textAlign: "center" }}>You are also welcome to reach out to NF Staff directly at any time to email Admin with any questions or issues. Thank You</h6>
                    </div>

                    <label style={{ fontWeight: "bold" }}>Email</label>
                    <input
                        type="text"
                        name="email"
                        value={state.email || ""}
                        onChange={handleInput}
                        placeholder="example@mail.com"
                        className='text-center forgotModalInput'
                        style={{ border: "solid lightgray" }}
                        required
                    />

                    <label style={{ fontWeight: "bold" }}>Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={state.dateOfBirth || ""}
                        onChange={handleInput}
                        className='text-center forgotModalInput'
                        style={{ border: "solid lightgray" }}
                        required
                    />

                    <div style={{
                        border: "double black",
                        padding: "2vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "1vh"
                    }}>

                        {state.securityQuestions.map((sq, idx) => (
                            <div key={idx} className="my-3">
                                <label htmlFor={`securityQuestion${idx}`}>
                                    <b>Security Question {idx + 1}</b>
                                </label>
                                <select
                                    name={`securityQuestions[${idx}].question`}
                                    value={sq.question}
                                    style={{ border: "solid lightgray", marginBottom: "1vh" }}
                                    onChange={e => handleSecurityInput(idx, "question", e.target.value)}
                                    className=' forgotModalInput2'
                                    required
                                >
                                    <option value="">Select a question...</option>
                                    {securityQuestionOptions.map((option, optIdx) => (
                                        <option key={optIdx} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>

                                <br />

                                <label htmlFor={`securityAnswer${idx}`}>
                                    <b>Answer {idx + 1}:</b>
                                </label>
                                <div className='w-full text-center flex flex-row justify-center items-center'>
                                    <input
                                        type={showSecAnswers ? "text" : "password"}
                                        name={`securityQuestions[${idx}].answer`}
                                        value={sq.answer || ""}
                                        onChange={e => handleSecurityInput(idx, "answer", e.target.value)}
                                        placeholder="Enter your answer"
                                        className="text-center forgotModalInput2"
                                        style={{ border: "solid lightgray" }}
                                        maxLength={100}
                                        required
                                    />
                                    <div
                                        onClick={() => setShowSecAnswers(!showSecAnswers)}
                                    >
                                        {showSecAnswers ? (
                                            <div style={{ border: "solid lightgray", borderLeft: "none" }} title="Hide Answers">😲</div>
                                        ) : (
                                            <div style={{ border: "solid lightgray", borderLeft: "none" }} title="Show Answers">😎</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <label className='text-center'><b>Secret Key</b></label>
                    <div className='w-full text-center flex flex-row justify-center items-center'>
                        <input
                            type={showSecretKey ? "text" : "password"}
                            name="secreteKey"
                            value={state.secreteKey || ""}
                            onChange={handleInput}
                            placeholder="Enter your secret key"
                            className='text-center forgotModalInput2'
                            style={{ border: "solid lightgray" }}
                            max={10}
                            required
                        />
                        <div
                            onClick={() => setShowSecretKey(!showSecretKey)}
                        >
                            {showSecretKey ? (
                                <div style={{ border: "solid lightgray", borderLeft: "none" }} title="Hide Secret Key">😲</div>
                            ) : (
                                <div style={{ border: "solid lightgray", borderLeft: "none" }} title="Show Secret Key">😎</div>
                            )}
                        </div>
                    </div>

                    <label className='text-center'><b>New Password</b></label>
                    <div className='w-full text-center flex flex-row justify-center items-center'>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="passwordNew"
                            value={state.passwordNew || ""}
                            onChange={handleInput}
                            placeholder="********"
                            className='text-center forgotModalInput2'
                            style={{ border: "solid lightgray" }}
                            required
                        />
                        <div
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <div style={{ border: "solid lightgray", borderLeft: "none" }} title="Hide Password">😲</div>
                            ) : (
                                <div style={{ border: "solid lightgray", borderLeft: "none" }} title="Show Password">😎</div>
                            )}
                        </div>
                    </div>

                    <label className='text-center'><b>Repeat New Password</b></label>
                    <div className='w-full text-center flex flex-row justify-center items-center'>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password2"
                            value={state.password2 || ""}
                            onChange={handleInput}
                            placeholder="********"
                            className='text-center forgotModalInput2'
                            style={{ border: "solid lightgray" }}
                            required
                        />
                        <div
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <div style={{ border: "solid lightgray", borderLeft: "none" }} title="Hide Password">😲</div>
                            ) : (
                                <div style={{ border: "solid lightgray", borderLeft: "none" }} title="Show Password">😎</div>
                            )}
                        </div>
                    </div>
                    <button type='submit' style={{ width: "100%", background: "goldenRod", margin: "1vh", height: "5vh" }} className='rounded forgotModalBtn'>Submit Change Password</button>
                </form>
            </div></div>
    )
}

export default ForgotPassword
