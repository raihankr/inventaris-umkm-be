import { updateUserServices } from "../../services/users/updateUser.service.js"

export const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const payload = { ...req.body }
        console.log(payload)

        const result = await updateUserServices(userId, payload)

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: result
        })
    } catch (error) {
        next(error)
    }
}