import prisma from "../../utils/client.js"

export const updateUserServices = async (userId, payload) => {
    try {
        const updatedUser = await prisma.users.update({
            where: {
                id_user: userId
            },
            omit: {
                password: true,
                email: true
            },
            data: {
                name: payload.name,
                email: payload.email,
                address: payload.address,
                contact: payload.contact
            }
        })

        return updatedUser
    } catch (error) {
        throw error
    }
}