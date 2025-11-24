import prisma from "../../utils/client.js"

export const createCategoryService = async (name, description) => {
    try {
        const categoryData = await prisma.categories.create({
            data: {
                name: name,
                description: description,
                isActive: true
            }
        })

        return categoryData
    } catch (error) {
        throw error
    }
}