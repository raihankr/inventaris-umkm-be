import { NODE_ENV, FRONTEND_DOMAIN } from "../../config/env.js"
import { loginServices } from "../../services/auth/login.service.js"

// login menggunakan username dan password
export const login = async (req, res, next) => {
    try {
        // input dari user
        const { username, password } = req.body

        // proses pengecekan dan validasi akun
        const result = await loginServices(username, password)
        result.userData.session = result.session

        // konfigurasi domain agar cookies terkirim jika menggunakan custom domain
        const cookiesDomain = NODE_ENV === "staging" || NODE_ENV === "production" ? FRONTEND_DOMAIN : undefined

        console.log(NODE_ENV === "staging" || NODE_ENV === "production")

        // konfigurasi lengkap cookies
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

        // mengirim cookies ke clien
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
