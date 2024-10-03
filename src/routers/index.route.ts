
import{ Router } from 'express';

// import { AuthRouter } from './auth.router';
import userRouter from './unAuth/user.router'; 


export const router = Router();
// router.use('/auth', AuthRouter);
router.use('/users', userRouter);





