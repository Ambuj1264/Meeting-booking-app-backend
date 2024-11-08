import { Router } from 'express';

// import { AuthRouter } from './auth.router';
import userRouter from './unAuth/user.router';
import contactrouter from './unAuth/contact.router';
import bookingRouter from './auth/bookin.router';

export const router = Router();
// router.use('/auth', AuthRouter);
router.use('/users', userRouter);
router.use('/contact', contactrouter);
router.use('/booking', bookingRouter);
