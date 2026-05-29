import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {

    const isLogin = useSelector(state => state.auth.isLogin)
    const admin = useSelector(state => state.auth.user.admin)

    return (

            isLogin && admin ? <Navigate to="/profilePage" /> :
                !isLogin && !admin ? <Outlet /> : <></>

    )
}


export default PublicRoute
