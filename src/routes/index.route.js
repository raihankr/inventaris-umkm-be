import express from 'express'
import { authRoutes } from './auth.route.js'
import { productRoutes } from './products.route.js'
import { categoryRoutes } from './categories.route.js'
import { userRoutes } from './users.route.js'
import { transactionRoutes } from './transactions.route.js'
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js'
import { dashboardRoutes } from './dashboard.route.js'

export const routes = express.Router()

routes.use('/dahsboard', isAuthenticated, dashboardRoutes)
routes.use('/auth', authRoutes)
routes.use('/products', isAuthenticated, productRoutes)
routes.use('/categories', isAuthenticated, categoryRoutes)
routes.use('/users', isAuthenticated, userRoutes)
routes.use('/transactions', isAuthenticated, transactionRoutes)
