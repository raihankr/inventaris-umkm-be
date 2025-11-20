import prisma from "../../utils/client.js"

export const getUserService = async (userId) => {
    try {
        const data = await prisma.users.findUnique({
            where: {
                id_user: userId,
                isActive: true
            },
            include: {
                session: true
            },
            omit: {
                password: true,
                email: true
            }
        })

        if (!data) {
            const error = new Error('User not found.')
            error.statusCode = 404
            throw error
        }

        return data
    } catch (error) {
        throw error
    }
}