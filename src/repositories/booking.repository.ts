import { BookingModel } from '../models/booking.model';

export class BookingRepository {
  async create(
    email: string,
    date: string,
    startTime: string,
    endTime: string,
    meetingRoom: string,
    meetingId: string
  ) {
    return await BookingModel.create({
      email,
      date,
      startTime,
      endTime,
      meetingRoom,
      meetingId,
    });
  }

  async getAll(
    limit: string = '10',
    page: string = '1',
    search: string = ''
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const data = await BookingModel.find({
      $or: [
        { email: { $regex: search, $options: 'i' } },
        { date: { $regex: search, $options: 'i' } },
        { startTime: { $regex: search, $options: 'i' } },
        { endTime: { $regex: search, $options: 'i' } },
        { meetingRoom: { $regex: search, $options: 'i' } },
        { meetingId: { $regex: search, $options: 'i' } },
      ],
    })
      .limit(Number(limit))
      .skip(Number((Number(page) - 1) * Number(limit)));
    console.log(data, '=================');

    return data;
  }
}
