import { createUserService } from "../../services/users/createUser.service.js";
import prisma from "../../utils/client.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res, next) => {
    try {
        const { name, username, email, password, role, address, contact } =
            req.body;

        // menyimpan password yang dienkripsi
        const saltRounds = 10;
        const hashPassword = bcrypt.hashSync(password, saltRounds);

        const payload = {
            name,
            username,
            email,
            password: hashPassword,
            role,
            address,
            contact,
        };

        const result = await createUserService(payload);

        res.status(200).json({
            success: true,
            message: `User ${username} created successfully`,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
