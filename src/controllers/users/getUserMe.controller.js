import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../config/env.js'
import { getUserMeService } from '../../services/users/getUserMe.service.js'

export const getUserMe = async (req, res, next) => {
    try {
        const token = req.cookies['sks-authorization']
        const decodedToken = jwt.verify(token, JWT_SECRET)

        const result = await getUserMeService(decodedToken.id_user)

        res.status(200).json({
            success: true,
            message: 'User data retrieved successfully',
            data: result
        })
    } catch (error) {
        next(error)
    }
}