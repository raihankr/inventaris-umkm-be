import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'
import prisma from '../utils/client.js'

export const checkRole = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  return async (req, res, next) => {
    try {
      const token = req.cookies['sks-authorization']
      const decoded = jwt.verify(token, JWT_SECRET)

      const userRole = decoded.role
      if (!roles.includes(userRole)) {
        const err = new Error('Forbidden. insufficient role to access this resource.')
        err.statusCode = 403
        throw err
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}