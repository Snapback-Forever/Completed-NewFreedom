import jwt from "jsonwebtoken"
import db from "../db/index.js"
import config from "../config.js"


const getUserDetailsFromToken = (token)=>{
    
    if(!token){
        return {
            message : "session out",
            logout : true,
        }
    }

    const decode = jwt.verify(token, config.TOKEN)

    const user = db.User.findById(decode.id).select('-password')

    return user
}

export default getUserDetailsFromToken
