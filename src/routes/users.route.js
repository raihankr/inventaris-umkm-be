import express from 'express'
import { createUser } from '../controllers/users/createUser.controller.js'
import { deleteUser } from '../controllers/users/deleteUser.controller.js'
import { getUser } from '../controllers/users/getUser.controller.js'
import { getUsers } from '../controllers/users/getUsers.controller.js'
import { updateUser } from '../controllers/users/updateUser.controller.js'
import { updateUserPassword } from '../controllers/users/updateUserPassword.controller.js'
import { getUserMe } from '../controllers/users/getUserMe.controller.js'
import { checkRole } from '../middlewares/checkRole.middleware.js'
import { resetPassword } from '../controllers/users/resetPassword.controller.js'

export const userRoutes = express.Router()

userRoutes.patch('/:id/reset-password', checkRole('admin'), resetPassword)
userRoutes.patch('/change-password', updateUserPassword)
userRoutes.get('/me', getUserMe)
userRoutes.post('/', checkRole('admin'), createUser)
userRoutes.get('/:id', checkRole('admin'), getUser)
userRoutes.get('/', checkRole('admin'),getUsers)
userRoutes.patch('/:id', updateUser)
userRoutes.delete('/:id', checkRole('admin'), deleteUser)




