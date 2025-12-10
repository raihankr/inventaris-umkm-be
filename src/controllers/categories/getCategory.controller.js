import { getCategoryService } from "../../services/categories/getCategory.service.js"

export const getCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id

        const result = await getCategoryService(categoryId)

        res.status(200).json({
            success: true,
            message: 'Category data retrieved successfully.',
            data: result
        })
    } catch (error) {
        next(error)
    }
}