import bcrypt from 'bcrypt'
import prisma from '../../utils/client.js'
import { Prisma } from '../../../generated/prisma/index.js'

// memperbarui password user
export const resetPasswordService = async (userId, newPassword) => {
    try {
        const saltRound = 10

        const hashPassword = bcrypt.hashSync(newPassword, saltRound)

        const userData = await prisma.users.update({
            where: {
                id_user: userId,
                isActive: true
            },
            data: {
                password: hashPassword
            }
        })

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                error.statusCode = 404
                error.message = "User not found."
            }
        }
        throw error
    }
}