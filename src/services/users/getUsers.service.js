import prisma from "../../utils/client.js"

export const getUsersServices = async (page, limit) => {
    try {
        const offset = (page - 1) * limit 
        const result = await prisma.users.findMany({
            where: {
                isActive: true
            },
            include: {
                session: true
            },
            omit: {
                email: true,
                password: true
            },
            take: limit,
            skip: offset || undefined
        })

        return result; 
    } catch (error) {
        throw error
    }
}