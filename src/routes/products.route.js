import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js'
import { createProduct } from '../controllers/products/createProduct.controller.js'
import { getProduct } from '../controllers/products/getProduct.controller.js'
import { deleteProduct } from '../controllers/products/deleteProduct.controller.js'
import { updateProduct } from '../controllers/products/updateProduct.controller.js'
import { getProducts } from '../controllers/products/getProducts.controller.js'
import { getProductStatistics } from '../controllers/products/getProductStatistics.controller.js'

export const productRoutes = express.Router()

productRoutes.get('/statistic', isAuthenticated, getProductStatistics)
productRoutes.post('/', isAuthenticated, createProduct)
productRoutes.patch('/:id', isAuthenticated, updateProduct)
productRoutes.delete('/:id', isAuthenticated, deleteProduct)
productRoutes.get('/', isAuthenticated, getProducts)
productRoutes.get('/:id', isAuthenticated, getProduct)



