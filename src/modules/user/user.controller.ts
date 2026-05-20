import type { Request, Response } from "express"
import { pool } from "../../db"
import { userService } from "./user.service"


const createUser = async (req: Request, res: Response) => {

    try {

        const result = await userService.creteUserIntoDB(req.body)
        res.status(200).json({
            success: true,
            message: 'user created successfully!',
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error creating user!',
            error: error,
        })
    }
}

const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getUserFromDB()
        res.status(200).json({
            success: true,
            message: 'users fetched successfully!',
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users!',
            error: error
        })

    }
}

const getUserById = async (req: Request, res: Response) => {

    const { id } = req.params;

    try {

        const result = await userService.getUserByIdFromDB(id as string)
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
            })
        }

        res.status(200).json({
            success: true,
            message: 'user fetched successfully!',
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user!',
            error: error
        })
    }
}

const updateUser = async (req: Request, res: Response) => {

    const { id } = req.params;
    try {
        const result = await userService.updateUserInDB(id as string, req.body)

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
            })
        }

        res.status(200).json({
            success: true,
            message: 'user updated successfully!',
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating user!',
            error: error
        })
    }
}

const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await userService.deleteUserFromDB(id as string)

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
            })
        }

        res.status(200).json({
            success: true,
            message: 'user deleted successfully!',
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user!',
            error: error
        })
    }
}



export const userController = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
}