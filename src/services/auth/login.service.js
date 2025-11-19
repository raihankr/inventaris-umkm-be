import prisma from "../../utils/client.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../../config/env.js"
import { v4 as uuidv4 } from 'uuid';


export const loginServices = async (email, password) => {
    try {
        const userData = await prisma.users.findUnique({
            where: {
                email: email
            },
        })

        const isPasswordMatch = bcrypt.compare(password, userData.password)

        if (!isPasswordMatch) {
            const error = new Error("email or password is incorrect")
            error.statusCode = 400
            throw error
        }

        const payload = {
            id_user: userData.id_user,
            role: userData.role,
            name: userData.name
        }

        const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' })

        delete userData.email
        delete userData.password
        return { userData, token }
    } catch (error) {
        throw error
    }
}