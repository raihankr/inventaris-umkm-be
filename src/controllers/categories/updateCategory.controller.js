import { updateCategoryService } from "../../services/categories/updateCategory.service.js"

export const updateCategory = async (req, res, next) => {
    try {
        const payload = {...req.body}
        const categoryId = req.params.id

        const result = await updateCategoryService(payload, categoryId)

        res.status(200).json({
            success: true,
            message: 'Category data updated successfully.',
            data: result
        })
    } catch (error) {
        next(error)
    }
}