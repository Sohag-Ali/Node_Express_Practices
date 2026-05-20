import { Router, type Request, type Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../../types";

const router = Router();




router.post('/',userController.createUser) 
router.get('/',auth(USER_ROLES.ADMIN),userController.getUsers) 
router.get('/:id',userController.getUserById) 
router.put('/:id',userController.updateUser)
router.delete('/:id', userController.deleteUser)


export const userRoute = router;