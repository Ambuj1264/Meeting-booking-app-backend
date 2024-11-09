import { BookingModel } from '../models/booking.model';
import { CompanyModel } from '../models/company.model';

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
    search: string = ''
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    console.log(search, '===================search');
    const data = await BookingModel.find({
      $or: [
        { email: { $regex: search, $options: 'i' } },
        { date: { $regex: search, $options: 'i' } },
        { startTime: { $regex: search, $options: 'i' } },
        { endTime: { $regex: search, $options: 'i' } },
        // { meetingId: { $regex: search, $options: 'i' } },
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
      .skip(Number((Number(page) - 1) * Number(limit)));

    return data;
  }
}
