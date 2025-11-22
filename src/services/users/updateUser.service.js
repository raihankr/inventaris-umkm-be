import { Prisma } from "../../../generated/prisma/index.js"
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
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                error.message = 'User not found.'
                error.statusCode = 404   
            } else if (error.code === 'P2002') {
                error.message = 'The provided email is already used.'
                error.statusCode = 400
            }
        }
        throw error
    }
}