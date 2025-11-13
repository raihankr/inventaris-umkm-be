import express from 'express'
import { authRoutes } from './auth.route.js'
import { productRoutes } from './products.route.js'
import { categoryRoutes } from './categories.route.js'
import { userRoutes } from './users.route.js'
import { transactionRoutes } from './transactions.route.js'

export const routes = express.Router()

routes.use('/auth', authRoutes)
routes.use('/products', productRoutes)
routes.use('/categories', categoryRoutes)
routes.use('/users', userRoutes)
routes.use('/transaction', transactionRoutes)
