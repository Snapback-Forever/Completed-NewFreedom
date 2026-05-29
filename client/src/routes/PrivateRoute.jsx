import { Navigate,  Outlet } from "react-router-dom";
import { useSelector } from "react-redux";



const PrivateRoute = ()=> {

  const isLogin = useSelector( state => state.auth.isLogin )
    const admin = useSelector( state => state.auth.user.admin)

    return (

      isLogin && admin  ? <Outlet /> : 
      !isLogin && !admin  ? <Navigate to="/" /> : <></>

    )
    
}


export default PrivateRoute
