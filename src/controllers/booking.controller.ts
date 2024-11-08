import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/response';
import { BookingRepository } from '../repositories/booking.repository';
const bookingRepository = new BookingRepository();
export const BookingController = {
  create: (req: Request, res: Response) => {
    try {
      const {
        email,
        date,
        endTime,
        startTime,
        meetingRoom,
        meetingId = '5235715443',
      } = req.body;
      const booking = bookingRepository.create(
        email,
        date,
        startTime,
        endTime,
        meetingRoom,
        meetingId
      );
      if (!booking) {
        errorResponse(res, 'Failed to create booking');
      }
      successResponse(res, 'Booking created successfully');
    } catch (error) {
      console.log(error);
      errorResponse(res, 'Failed to create booking');
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const { limit, page, search } = req.query;
      const bookings = await bookingRepository.getAll(
        limit as string,
        page as string,
        search as string
      );
      successResponse(res, 'Bookings retrieved successfu  lly', bookings);
    } catch (error) {
      console.log(error);
      errorResponse(res, 'Failed to retrieve bookings');
    }
  },
};
