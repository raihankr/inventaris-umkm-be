import prisma from "../../utils/client.js"
import bcrypt from 'bcrypt'

export const updateUserPasswordServices = async (userId, newPassword, validatePassword) => {
    try {
        if (newPassword !== validatePassword) {
            const error = new Error("The passwords you entered do not match. Please try again.")
            error.statusCode = 400
            throw error
        };

        const saltRound = 10;
        const hashPassword = bcrypt.hashSync(newPassword, saltRound);

        const process = await prisma.users.update({
            where: {
                id_user: userId,
                isActive: true
            },
            data: {
                password: hashPassword
            }
        });

        return;
    } catch (error) {
        throw error
    }
}