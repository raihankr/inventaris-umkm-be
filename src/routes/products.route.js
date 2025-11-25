import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js'
import { createProduct } from '../controllers/products/createProduct.controller.js'
import { getProduct } from '../controllers/products/getProduct.controller.js'
import { deleteProduct } from '../controllers/products/deleteProduct.controller.js'
import { updateProduct } from '../controllers/products/updateProduct.controller.js'
import { getProducts } from '../controllers/products/getProducts.controller.js'
import { getProductStatistics } from '../controllers/products/getProductStatistics.controller.js'

export const productRoutes = express.Router()

productRoutes.get('/statistic', getProductStatistics)
productRoutes.post('/', createProduct)
productRoutes.patch('/:id', updateProduct)
productRoutes.delete('/:id', deleteProduct)
productRoutes.get('/', getProducts)
productRoutes.get('/:id', getProduct)



