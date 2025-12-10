import prisma from "../../utils/client.js"

// mengambil data user yang login berdasarkan token didalam cookies user
export const getUserMeService = async (userId) => {
    try {
        const userData = await prisma.users.findUnique({
            where: {
                id_user: userId,
                isActive: true
            },
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
