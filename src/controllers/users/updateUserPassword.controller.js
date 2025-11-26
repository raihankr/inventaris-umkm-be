import { updateUserPasswordServices } from "../../services/users/updateUserPassword.service.js"
import { JWT_SECRET } from '../../config/env.js'
import jwt from 'jsonwebtoken'

export const updateUserPassword = async (req, res, next) => {
    try {
        const { new_password, validate_password, username } = req.body

        const token = req.cookies['sks-authorization']
        const decodedToken = jwt.verify(token, JWT_SECRET)
        const userId = decodedToken?.id_user

        const process = await updateUserPasswordServices(userId, new_password, validate_password, username)

        res.status(200).json({
            success: true,
            message: 'User password updated successfully'
        })
    } catch (error) {
        next(error)
    }
}