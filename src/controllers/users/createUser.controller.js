import { createUserService } from "../../services/users/createUser.service.js"
import prisma from "../../utils/client.js"
import bcrypt from 'bcrypt'

export const createUser = async (req, res, next) => {
    try {
        const { name, email, password, role, address, contact } = req.body

        const saltRounds = 10
        const hashPassword = bcrypt.hashSync(password, saltRounds)
        console.log(hashPassword)

        const payload = {
            name: name,
            email: email,
            password: hashPassword,
            role: role,
            address: address,
            contact: contact
        }

        const result = await createUserService(payload)
        
        res.status(200).json({
            success: true,
            message: `User ${name} created successfully`,
            data: result
        })
    } catch (error) {
        next(error)
    }
}