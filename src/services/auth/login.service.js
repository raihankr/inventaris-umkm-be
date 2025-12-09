import prisma from "../../utils/client.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../../config/env.js"
import { createNewSession, updateSession } from "../../utils/sessionManagement.js";

// Service ini berfungsi untuk pengecekan akun user dalam database
export const loginServices = async (username, password) => {
    try {
        let session;

        // mencari data user dengan username yang cocok
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

        // validasi password yang dimasukkan oleh user
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

        // isi token JWT
        const payload = {
            id_user: userData.id_user,
            email: userData.email,
            role: userData.role,
            name: userData.name,
            id_session: userData?.session?.[0]?.id_session || '-'
        }

        // membuat token jwt dengan data pada variable payload dan expires dalam 24 jam
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })

        // mengaktifkan sesi user di dalam database, jika tidak ada maka buat baru dengan status aktif.
        if (userData.session.length === 0) {
            session = await createNewSession(userData.id_user, token, true)
        } else {
            session = await updateSession(userData?.session?.[0]?.id_session, token, true)
        }

        delete userData.username
        delete userData.password
        delete userData.session
        return { userData, token, session }
    } catch (error) {
        throw error
    }
}
