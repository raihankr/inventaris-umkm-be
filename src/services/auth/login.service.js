import prisma from "../../utils/client.js"
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../../config/env.js"
import { v4 as uuidv4 } from 'uuid';
import { createNewSession, updateSession } from "../../utils/sessionManagement.js";


export const loginServices = async (email, password) => {
    try {
        let session;
        const userData = await prisma.users.findUnique({
            where: {
                email: email
            },
            include: {
                session: true
            }
        })

        if (!userData) {
            const error = new Error("email or password is incorrect")
            error.statusCode = 400
            throw error
        }

        const isPasswordMatch = await bcrypt.compare(password, userData.password)
        console.log(isPasswordMatch)

        if (!isPasswordMatch) {
            const error = new Error("email or password is incorrect")
            error.statusCode = 400
            throw error
        }

        const payload = {
            id_user: userData.id_user,
            role: userData.role,
            name: userData.name,
            id_session: userData.session?.[0].id_session || '-'
        }

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })

        if (userData.session.length === 0) {
            session = await createNewSession(userData.id_user, token, userData.role)
        } else {
            session = await updateSession(userData.session?.[0].id_session, token, true)
        }

        delete userData.email
        delete userData.password
        return { userData, token, session }
    } catch (error) {
        throw error
    }
}