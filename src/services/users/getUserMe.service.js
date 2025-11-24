import prisma from "../../utils/client.js"

export const getUserMeService = async (userId) => {
    try {
        const userData = await prisma.users.findUnique({
            where: {
                id_user: userId,
                isActive: true
            },
            include: {
                session: {
                    take: 1,
                    orderBy: {
                        updatedAt: "desc"
                    }
                },   
            }
        })

        if (!userData) {
            const error = new Error('User not found.')
            error.statusCode = 404
            throw error
        }

        return userData
    } catch (error) {
        throw error
    }
}