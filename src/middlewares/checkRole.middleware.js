import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'
import prisma from '../utils/client.js'

export const checkRole = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  return async (req, res, next) => {
    try {
      // If request was already authenticated, use its decoded payload
      if (req.auth) {
        const userRole = req.auth.role
        if (!roles.includes(userRole)) {
          const err = new Error('Forbidden. insufficient role to access this resource.')
          err.statusCode = 403
          throw err
        }

        return next()
      }

      // Fallback: if not authenticated yet, verify token and session here
      const token = req.cookies['authorization']?.split(' ')?.[1]
      if (!token) {
        const err = new Error('Unauthorized. please login to access this resources.')
        err.statusCode = 401
        throw err
      }

      const decoded = jwt.verify(token, JWT_SECRET)

      const session = await prisma.session.findUnique({ where: { id_session: decoded.id_session } })
      if (!session || !session.isActive || token !== session.token) {
        const err = new Error('Unauthorized. please login to access this resources.')
        err.statusCode = 401
        throw err
      }

      const userRole = decoded.role
      if (!roles.includes(userRole)) {
        const err = new Error('Forbidden. insufficient role to access this resource.')
        err.statusCode = 403
        throw err
      }

      // attach decoded token to request for downstream handlers if needed
      req.auth = decoded
      req.token = token

      next()
    } catch (error) {
      // if error already has statusCode, forward it; otherwise 401
      const err = error?.statusCode ? error : new Error('Unauthorized. please login to access this resources.')
      if (!err.statusCode) err.statusCode = 401
      next(err)
    }
  }
}

export default checkRole
