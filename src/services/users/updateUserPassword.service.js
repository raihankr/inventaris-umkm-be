import prisma from "../../utils/client.js"
import bcrypt from 'bcrypt'
import { Prisma } from "../../../generated/prisma/index.js"

// memperbarui password user yang login
export const updateUserPasswordServices = async (userId, currentPassword, newPassword, validatePassword, username) => {
    try {
        const userData = await prisma.users.findUnique({
            where: {
                id_user: userId,
                isActive: true
            },
            select :{
                password: true
            }
        })

        // validasi jika password sebelumnya sama dengan password baru
        const isPasswordMatch = bcrypt.compareSync(currentPassword, userData.password)

        if (newPassword !== validatePassword || !isPasswordMatch) {
            const error = new Error("The passwords you entered do not match. Please try again.")
            error.statusCode = 400
            throw error
        };

        // menyimpan password yang telah dienkripsi
        const saltRound = 10;
        const hashPassword = bcrypt.hashSync(newPassword, saltRound);

        const process = await prisma.users.update({
            where: {
                id_user: userId,
                isActive: true
            },
            data: {
                password: hashPassword,
                username: username
            }
        });

        return;
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