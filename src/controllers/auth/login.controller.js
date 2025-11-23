import { NODE_ENV } from "../../config/env.js"
import { loginServices } from "../../services/auth/login.service.js"

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body

        const result = await loginServices(username, password)

        const cookiesConfiguration = {
            path: '/',
            httpOnly: true,
            secure: NODE_ENV === "production" || NODE_ENV === "staging",
            sameSite: "none",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };

        res.cookie('authorization', result.token, cookiesConfiguration)

        res.status(200).json({
            success: true,
            message: `Login successfully. Welcome ${result.userData.name}`,
            data: result.userData
        })
    } catch (error) {
        next(error)
    }
}
