import prisma from "../../utils/client.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../../config/env.js"
import { createNewSession, updateSession } from "../../utils/sessionManagement.js";


export const loginServices = async (username, password) => {
    try {
        let session;
        const userData = await prisma.users.findUnique({
            where: {
                username: username,
            },
            include: {
                session: true
            }
        })

        if (!userData) {
            const error = new Error("Username or password is incorrect")
            error.statusCode = 400
            throw error
        }

        const isPasswordMatch = await bcrypt.compare(password, userData.password)

        if (!isPasswordMatch) {
            const error = new Error("Username or password is incorrect")
            error.statusCode = 400
            throw error
        }

        if (!userData.isActive) {
            const error = new Error("Account is deleted. Please contact administrator")
            error.statusCode = 400
            throw error
        }

        const payload = {
            id_user: userData.id_user,
            email: userData.email,
            role: userData.role,
            name: userData.name,
            id_session: userData?.session?.[0]?.id_session || '-'
        }

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })

        if (userData.session.length === 0) {
            session = await createNewSession(userData.id_user, token, true)
        } else {
            session = await updateSession(userData?.session?.[0]?.id_session, token, true)
        }

        delete userData.username
        delete userData.password
        delete userData.session
        return { userData, session }
    } catch (error) {
        throw error
    }
}
