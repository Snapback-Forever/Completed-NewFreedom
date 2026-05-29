import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/reducers/authReducer'

const LoginModal = ({ openLogin, setOpenLogin, openForgotPassword, setOpenForgotPassword }) => {

    const dispatch = useDispatch()


    const successMessage = useSelector(state => state.auth.successMessage)

    const [showPassword, SetShowPassword] = useState(false)

    const [state, setState] = useState({

        identifier: "", 
        password: ""

    })

    const handleInput = (e) => {
        let { name, value } = e.target
        setState({
            ...state,
            [name]: value
        })
    } 

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(login(state))

    }

    useEffect(() => {
        if (successMessage !== "") {
            setOpenLogin(false)

            setState((preve) => {
                return {
                    ...preve,
                    email: "",
                    password: ""
                }
            })
        }
    }, [successMessage]);


    return (
        <div className='loginModal scrollBar responsiveLogin'>

            <div>
                <button onClick={() => setOpenLogin(false)} style={{ fontSize: "1.5em" }} >❎</button>
            </div>

            <div style={{ height: "90%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "0 0.5vw" }} >
                <div >

                    <form onSubmit={handleLogin}>

                        <label style={{ width: "100%", textAlign: "center" }}><b>Email Or AccountName</b></label>
                        <input
                            type="text"
                            name="identifier"
                            value={state.identifier || ""}
                            onChange={handleInput}
                            placeholder="email@mail.com"
                            className='text-center'
                            style={{ border: "solid lightgray", width: "99%" }}
                            required
                        />

                        <label style={{ width: "100%", textAlign: "center" }}><b>Password</b></label>
                        <div style={{ display: "flex" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={state.password || ""}
                                onChange={handleInput}
                                placeholder="********"
                                className='text-center'
                                style={{ border: "solid lightgray", width: "92%" }}
                                required
                            />

                            <div onClick={() => SetShowPassword(!showPassword)}>
                                {showPassword ? (<div style={{ border: "solid lightgray", borderLeft: "none" }} title="Hide Password">😲</div>)
                                    : (<div style={{ border: "solid lightgray", borderLeft: "none" }} title="Show Password">😎</div>)}
                            </div></div>

                        <button type='submit' style={{ width: "100%", background: "goldenrod", color: "black", marginTop: "1vh" }} className='rounded'>Login</button>


                        <div style={{ width: "100%", display: "flex", margin: "1vh 2vw" }}>
                        <div className="rounded navPubLandingBtn2" style={{ color: 'black' }} onClick={() => setOpenForgotPassword(true)}>ForgotPassword?</div>
                        </div>
                    </form>

                </div>
            </div>

        </div>
    )
}

export default LoginModal
