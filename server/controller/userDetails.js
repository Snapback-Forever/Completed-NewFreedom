import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js"

const userDetailsController = {

    userDetails: (req, res) => {
        const token = req.cookies.token || ""
        const user = getUserDetailsFromToken(token)

        return res.json({
            message: "User details",
            data: user
        })
    }

}

export default userDetailsController