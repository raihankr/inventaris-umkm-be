import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js'
import { createProduct } from '../controllers/products/createProduct.controller.js'

export const productRoutes = express.Router()

productRoutes.post('/', isAuthenticated, createProduct)
// productRoutes.patch('/:id')
// productRoutes.delete('/')
// productRoutes.get('/')
// productRoutes.get('/:id')
// productRoutes.get('/statistic')


