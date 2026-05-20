import { Router, type Request, type Response } from "express";
import { userController } from "./user.controller";

const router = Router();


router.post('/',userController.createUser) 
router.get('/',userController.getUsers) 
router.get('/:id',userController.getUserById) 
router.put('/:id',userController.updateUser)
router.delete('/:id', userController.deleteUser)


export const userRoute = router;