import express from 'express'
import { login } from '../controllers/auth/login.controller.js'
import { logout } from '../controllers/auth/logout.controller.js'
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js'

export const authRoutes = express.Router()

authRoutes.post('/login', login)
authRoutes.get('/logout', isAuthenticated, logout)
