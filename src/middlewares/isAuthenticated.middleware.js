import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'
import prisma from '../utils/client.js'
import { terminateSession } from '../utils/sessionManagement.js'

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies['authorization']?.split(' ')?.[0]
        const decodedToken = jwt.verify(token, JWT_SECRET)
         
        const session = await prisma.session.findUnique({
            where: {
                id_session: decodedToken.id_session
            }
        })

        if (!session.isActive || token !== session.token) {
            throw new Error()
        }

        next()
    } catch (error) {
        const err = new Error('Unauthorized. please login to access this resources.')
        err.statusCode = 401
        next(err)
    }
}