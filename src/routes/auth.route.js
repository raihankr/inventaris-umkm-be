import express from 'express'
import { login } from '../controllers/auth/login.controller.js'

export const authRoutes = express.Router()

authRoutes.post('/login', login)
