import prisma from "../../utils/client.js"

export const getCategoriesService = async () => {
    try {
        const categoriesData = await prisma.categories.findMany({
            where: {
                isActive: true   
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return categoriesData
    } catch (error) {
        throw error
    }
}