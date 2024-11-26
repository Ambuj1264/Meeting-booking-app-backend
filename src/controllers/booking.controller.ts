import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/response';
import { BookingRepository } from '../repositories/booking.repository';
const bookingRepository = new BookingRepository();
export const BookingController = {
  findRoom: async (req: Request, res: Response) => {
    try {
      const { id: companyId } = req.params;
      console.log(companyId);
      const findCompany = await bookingRepository.findCompany(companyId);

      successResponse(res, 'Company retrieved successfully', findCompany);
    } catch (error) {
      console.log(error);
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      const { email, date, endTime, startTime, meetingId, companyId, name } =
        req.body;
      //check email is exist or not
      //check the time is already token
      const isTakenTimeByOtherBooking =
        await bookingRepository.isTakenTimeByOtherBooking(
          date,
          startTime,
          endTime,
          meetingId,
          companyId
        );

      if (isTakenTimeByOtherBooking) {
        errorResponse(
          res,
          'Time is already taken by another booking',
          isTakenTimeByOtherBooking
        );
        return;
      }
      const booking = await bookingRepository.create(
        email,
        date,
        startTime,
        endTime,
        meetingId,
        companyId,
        name
      );
      if (!booking) {
        errorResponse(res, 'Failed to create booking');
        return;
      }
      successResponse(res, 'Booking created successfully', booking);
      return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      errorResponse(res, 'Failed to create booking', error.message);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const { id: companyId } = req.params;
      const { limit, page, search } = req.query;
      const bookings = await bookingRepository.getAll(
        limit as string,
        page as string,
        search as string,
        companyId as string
      );
      successResponse(res, 'Bookings retrieved successfully', bookings);
    } catch (error) {
      console.log(error);
      errorResponse(res, 'Failed to retrieve bookings');
    }
  },
  async liveMeeting(req: Request, res: Response) {
    try {
      const { id: companyId } = req.params;
      const { limit, page, search } = req.query;
      const bookings = await bookingRepository.liveMeeting(
        limit as string,
        page as string,
        search as string,
        companyId as string
      );
      successResponse(res, 'Bookings retrievedsuccessfully', bookings);
    } catch (error) {
      console.log(error);
      errorResponse(res, 'Failed to retrieve bookings', error);
    }
  },
  async deleteMeeting(req: Request, res: Response) {
    try {
      const { id: meetingId } = req.params;
      const { email, companyId } = req.body;
      console.log(meetingId, email);
      const deleteMeetingResult = await bookingRepository.deleteMeeting(
        meetingId,
        email,
        companyId
      );
      if (!deleteMeetingResult) {
        errorResponse(res, 'Failed to delete meeting', deleteMeetingResult);
        return;
      }
      successResponse(res, 'Meeting deleted successfully');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      errorResponse(res, 'Failed to delete meeting' + error.stack);
    }
  },
  async getAllUsers(req: Request, res: Response) {
    try {
      const { id: companyId } = req.params;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { limit, page, search }: any = req.query;
      const users = await bookingRepository.getAllUsers(
        companyId,
        limit,
        page,
        search
      );
      successResponse(res, 'Users retrieved successfully', users);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      errorResponse(res, 'Failed to retrieve users', error.stack);
    }
  },
  async deleteUsers(req: Request, res: Response) {
    try {
      const { id: userId } = req.params;
      const { companyId } = req.body;
      const deleteUserResult = await bookingRepository.deleteUser(
        userId,
        companyId
      );
      if (!deleteUserResult) {
        errorResponse(res, 'Failed to delete user', deleteUserResult);
        return;
      }
      successResponse(res, 'User deleted successfully', deleteUserResult);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      errorResponse(res, 'Failed to delete user', error.stack);
    }
  },
};
