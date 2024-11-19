import { Router } from 'express';
import { BookingController } from '../../controllers/booking.controller';

const bookingRouter = Router();

bookingRouter.post('/create', BookingController.create);
bookingRouter.get('/getAll/:id', BookingController.getAll);
bookingRouter.get('/findRoomsByCompanyId/:id', BookingController.findRoom);
bookingRouter.get('/liveMeeting/:id', BookingController.liveMeeting);
bookingRouter.post('/deleteMeeting/:id', BookingController.deleteMeeting);

export default bookingRouter;
