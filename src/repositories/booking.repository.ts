import { BookingModel } from '../models/booking.model';
import { CompanyModel } from '../models/company.model';
import moment from 'moment';

export class BookingRepository {
  async findCompany(companyId: string) {
    const result = await CompanyModel.find({
      _id: companyId,
      isDeleted: false,
    })
      .populate({
        path: 'meetingRooms',
        match: { isDeleted: false }, // Only populate rooms that are not deleted
        select: 'name',
      })
      .select('meetingRooms');

    const meetingRooms = result.flatMap(company => company.meetingRooms);
    return meetingRooms;
  }
  async isTakenTimeByOtherBooking(
    date: string,
    startTime: string,
    endTime: string,
    meetingId: string,
    companyId: string
  ) {
    console.log(meetingId);
    const result = await BookingModel.findOne({
      date,
      meetingId,
      companyId,
      $or: [
        {
          startTime: { $lt: endTime }, // Existing booking starts before the requested end time
          endTime: { $gt: startTime }, // Existing booking ends after the requested start time
        },
      ],
    });
    return result;
  }
  async create(
    email: string,
    date: string,
    startTime: string,
    endTime: string,
    meetingId: string,
    companyId: string,
    name: string
  ) {
    return await BookingModel.create({
      email,
      date,
      startTime,
      endTime,
      meetingId,
      companyId,
      name,
    });
  }

  async getAll(
    limit: string = '10',
    page: string = '1',
    search: string = '',
    companyId: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    // Get the current date and time as a single value
    const now = moment();

    const data = await BookingModel.find({
      $or: [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { date: { $regex: search, $options: 'i' } },
        { startTime: { $regex: search, $options: 'i' } },
        { endTime: { $regex: search, $options: 'i' } },
      ],
      isDeleted: false,
      companyId,
      $expr: {
        $gt: [
          {
            $dateFromString: {
              dateString: { $concat: ['$date', 'T', '$startTime'] },
            },
          },
          now.toDate(),
        ],
      },
    })
      .populate({
        path: 'meetingId',
        match: { isDeleted: false },
        select: 'name',
      })
      .populate({
        path: 'companyId',
        match: { isDeleted: false },
        select: 'name',
      })
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .skip(Number((Number(page) - 1) * Number(limit)));

    return data;
  }

  async liveMeeting(
    limit: string = '10',
    page: string = '1',
    search: string = '',
    companyId: string
  ) {
    // Get the current date and time
    const now = moment();
    const currentDate = now.format('YYYY-MM-DD');
    const currentTime = now.format('HH:mm');

    const data = await BookingModel.find({
      $and: [
        {
          $or: [
            { email: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } },
            { date: { $regex: search, $options: 'i' } },
            { startTime: { $regex: search, $options: 'i' } },
            { endTime: { $regex: search, $options: 'i' } },
          ],
        },
        {
          date: currentDate, // Ensure the meeting is today
          startTime: { $lte: currentTime }, // Meeting has started
          endTime: { $gte: currentTime }, // Meeting hasn't ended yet
        },
        { isDeleted: false }, // Only active meetings
        { companyId }, // Filter by the provided company ID
      ],
    })
      .populate({
        path: 'meetingId',
        match: { isDeleted: false },
        select: 'name',
      })
      .populate({
        path: 'companyId',
        match: { isDeleted: false },
        select: 'name',
      })
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .skip(Number((Number(page) - 1) * Number(limit)));

    return data;
  }
}
