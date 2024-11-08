import { Router } from 'express';
import { UserController } from '../../controllers/user.controller';

const userRouter = Router();

userRouter.post('/create', UserController.createUser);
userRouter.get('/users', UserController.getAllUsers);
userRouter.delete('/users/:id', UserController.deleteUser);
userRouter.post('/login', UserController.login);

export default userRouter;
