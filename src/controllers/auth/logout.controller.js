import { JWT_SECRET, NODE_ENV } from "../../config/env.js";
import { logoutServices } from "../../services/auth/logout.service.js";
import jwt from 'jsonwebtoken'
import { terminateSession, updateSession } from "../../utils/sessionManagement.js";

export const logout = async (req, res, next) => {
    try {
        const token = req.cookies['authorization'].split(' ')[0]
        const decodeToken = jwt.decode(token, JWT_SECRET)

        console.log(decodeToken)

        const process = await logoutServices(decodeToken.id_session)

        const cookiesConfiguration = {
            path: '/',
            httpOnly: true,
            secure: NODE_ENV === "production" || NODE_ENV === "staging",
            sameSite: "lax",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };

        res.clearCookie('authorization', cookiesConfiguration)

        res.status(200).json({
            success: true,
            message: 'logout successfully',
        })
    } catch (error) {
        next(error)
    }
} 