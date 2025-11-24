import { NODE_ENV, FRONTEND_DOMAIN } from "../../config/env.js"
import { loginServices } from "../../services/auth/login.service.js"

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body

        const result = await loginServices(username, password)
        result.userData.session = result.session

        const cookiesDomain = NODE_ENV === "staging" || NODE_ENV === "production" ? FRONTEND_DOMAIN : undefined

        console.log(NODE_ENV === "staging" || NODE_ENV === "production")
        const cookiesConfiguration = {
            path: '/',
            httpOnly: true,
            secure: NODE_ENV === "production" || NODE_ENV === "staging",
            sameSite: NODE_ENV === "development" ? "Lax" : "None",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };

        if (cookiesDomain) {
            cookiesConfiguration.domain = cookiesDomain
        }

        res.cookie('sks-authorization', result.token, cookiesConfiguration)

        console.log(result.token)

        res.status(200).json({
            success: true,
            message: `Login successfully. Welcome ${result.userData.name}`,
            data: result.userData
        })
    } catch (error) {
        next(error)
    }
}
