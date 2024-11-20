import { User } from '../models/user.model';
import { BookingModel } from '../models/booking.model';
import { CompanyModel } from '../models/company.model';
// import moment from 'moment';
import moment from 'moment-timezone';
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
      isDeleted: false,
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
    const timezone = process.env.APP_TIMEZONE || 'UTC'; //
    // Get the current date and time
    const severTime = new Date();
    const now = moment(severTime).tz(timezone);
    const currentDate = now.format('YYYY-MM-DD');
    const currentTime = now.format('HH:mm');

    console.log(
      currentDate,
      currentTime,
      '===============current time and date'
    );

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
  async findUser(email: string, companyId: string) {
    const findUser = await User.findOne({
      email: email.toLowerCase(),
      companyId,
      isDeleted: false,
    });
    return findUser;
  }
  async deleteMeeting(meetingId: string, email: string, companyId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const findUser: any = await this.findUser(email, companyId);
    if (!findUser) {
      throw new Error('User not found');
      return;
    }

    const role = findUser?.role;

    if (role === 'admin') {
      const deleteByAdmin = await BookingModel.updateOne(
        { _id: meetingId, companyId },
        { $set: { isDeleted: true } },
        {
          new: true,
        }
      );

      if (!deleteByAdmin) {
        throw new Error('Meeting not found');
        return;
      }
      return deleteByAdmin;
    } else if (role === 'user') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const findBooking: any = await BookingModel.findOne({
        _id: meetingId,
      });

      if (findBooking?.createdBy !== findUser?._id) {
        throw new Error('You are not authorized to delete this meeting');
        return;
      }
      const deleteByUser = await BookingModel.updateOne(
        { _id: meetingId, companyId },
        { $set: { isDeleted: true } },
        {
          new: true,
        }
      );

      if (!deleteByUser) {
        throw new Error('Meeting not found');
        return;
      }
      return deleteByUser;
    }
  }
  async getAllUsers(id: string) {
    console.log(id, 'id============');
    return await User.find({
      companyId: id,
      isDeleted: false,
    });
  }
}
