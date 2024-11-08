import { Router } from 'express';
import { BookingController } from '../../controllers/booking.controller';

const bookingRouter = Router();

bookingRouter.post('/create', BookingController.create);
bookingRouter.get('/getAll', BookingController.getAll);

export default bookingRouter;
