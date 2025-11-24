import { createCategoryService } from "../../services/categories/createCategory.service.js"

export const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body

        const result = await createCategoryService(name, description)

        res.status(200).json({
            success: true,
            message: 'Category created successfully.',
            data: result
        })
    } catch (error) {
        next(error)
    }
}