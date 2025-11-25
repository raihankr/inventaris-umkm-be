import express from 'express'
import { createUser } from '../controllers/users/createUser.controller.js'
import { deleteUser } from '../controllers/users/deleteUser.controller.js'
import { getUser } from '../controllers/users/getUser.controller.js'
import { getUsers } from '../controllers/users/getUsers.controller.js'
import { updateUser } from '../controllers/users/updateUser.controller.js'
import { updateUserPassword } from '../controllers/users/updateUserPassword.controller.js'
import { getUserMe } from '../controllers/users/getUserMe.controller.js'

export const userRoutes = express.Router()

userRoutes.get('/me', getUserMe)
userRoutes.post('/', createUser)
userRoutes.get('/:id', getUser)
userRoutes.get('/', getUsers)
userRoutes.patch('/:id', updateUser)
userRoutes.patch('/:id/change-password', updateUserPassword)
userRoutes.delete('/:id', deleteUser)



