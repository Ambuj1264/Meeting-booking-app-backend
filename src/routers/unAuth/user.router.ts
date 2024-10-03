import { Router } from 'express';
import { UserController } from '../../controllers/user.controller';

const userRouter = Router();

userRouter.post('/users', UserController.createUser)
userRouter.get('/users', UserController.getAllUsers);
userRouter.delete('/users/:id',  UserController.deleteUser);

export default userRouter;
