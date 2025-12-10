import prisma from "../../utils/client.js"

// mengambil satu data category berdasarkan id
export const getCategoryService = async (categoryId) => {
    try {
        const categoryData = await prisma.categories.findUnique({
            where: {
                id_category: categoryId,
                isActive: true
            }
        })

        if (!categoryData) {
            const error = new Error('Category not found.')
            error.statusCode = 404
            throw error
        }

        return categoryData
    } catch (error) {
        throw error
    }
}