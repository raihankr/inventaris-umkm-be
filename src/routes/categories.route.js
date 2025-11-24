import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js'
import { getCategories } from '../controllers/categories/getCategories.controller.js'
import { createCategory } from '../controllers/categories/createCategory.controller.js'
import { updateCategory } from '../controllers/categories/updateCategory.controller.js'
import { deleteCategory } from '../controllers/categories/deleteCategory.controller.js'
import { getCategory } from '../controllers/categories/getCategory.controller.js'

export const categoryRoutes = express.Router()

categoryRoutes.post('/', isAuthenticated, createCategory)
categoryRoutes.patch('/:id', isAuthenticated, updateCategory)
categoryRoutes.delete('/:id', isAuthenticated, deleteCategory)
categoryRoutes.get('/', isAuthenticated, getCategories)
categoryRoutes.get('/:id', isAuthenticated, getCategory)