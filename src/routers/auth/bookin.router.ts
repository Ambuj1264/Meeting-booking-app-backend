import { Router } from 'express';
import { BookingController } from '../../controllers/booking.controller';

const bookingRouter = Router();

bookingRouter.post('/create', BookingController.create);
bookingRouter.get('/getAll', BookingController.getAll);
bookingRouter.get('/findRoomsByCompanyId/:id', BookingController.findRoom);

export default bookingRouter;
