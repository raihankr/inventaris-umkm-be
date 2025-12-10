import { getCategoriesService } from "../../services/categories/getCategories.service.js"

export const getCategories = async (req, res, next) => {
    try {
        const result = await getCategoriesService()

        res.status(200).json({
            success: true,
            message: 'Categories data retrieved successfully.',
            data: result
        })
    } catch (error) {
        next(error)
    }
}