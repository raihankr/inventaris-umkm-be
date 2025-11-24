import express from 'express'
import { createUser } from '../controllers/users/createUser.controller.js'
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js'
import { deleteUser } from '../controllers/users/deleteUser.controller.js'
import { getUser } from '../controllers/users/getUser.controller.js'
import { getUsers } from '../controllers/users/getUsers.controller.js'
import { updateUser } from '../controllers/users/updateUser.controller.js'
import { updateUserPassword } from '../controllers/users/updateUserPassword.controller.js'
import { getUserMe } from '../controllers/users/getUserMe.controller.js'

export const userRoutes = express.Router()

userRoutes.get('/me', isAuthenticated, getUserMe)
userRoutes.post('/', isAuthenticated, createUser)
userRoutes.get('/:id', isAuthenticated, getUser)
userRoutes.get('/', isAuthenticated, getUsers)
userRoutes.patch('/:id', isAuthenticated, updateUser)
userRoutes.patch('/:id/change-password', isAuthenticated, updateUserPassword)
userRoutes.delete('/:id', isAuthenticated, deleteUser)



