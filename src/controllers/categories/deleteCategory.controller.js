import { deleteCategoryService } from "../../services/categories/deleteCategory.service.js"


export const deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id

        const result = await deleteCategoryService(categoryId)

        res.status(200).json({
            success: true,
            message: "Category deleted successfully.",
            data: result
        })
    } catch (error) {
        next(error)
    }
}