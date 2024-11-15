import { Types } from 'mongoose';
import { UserRepository } from '../repositories/user.repository';

const userRepository = new UserRepository();

export class UserService {
  async createCompany(
    name: string,
    meetingRooms?: Types.ObjectId[],
    noOfMeetingRooms?: number
  ) {
    return await userRepository.createCompany(
      name,
      meetingRooms,
      noOfMeetingRooms
    );
  }
  async createMeetingRooms(meetingRooms: [{ name: string }]) {
    return await userRepository.createMeetingRooms(meetingRooms);
  }
  async isCompanyAlreadyExist(name: string) {
    return await userRepository.isCompanyAlreadyExist(name);
  }
  async createUser({
    email,
    name,
    password,
    role,
    companyId,
  }: {
    email: string;
    name: string;
    password: string;
    role: string;
    companyId?: Types.ObjectId;
  }) {
    try {
      return await userRepository.createUser({
        email,
        name,
        password,
        role,
        companyId,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.stack, 'error.stack');
      throw new Error(error.message + 'user service');
    }
    // You can add business logic here (e.g., password hashing)
  }

  async getUserByEmail(email: string) {
    return await userRepository.getUserByEmail(email);
  }

  async getAllUsers() {
    return await userRepository.getAllUsers();
  }

  async deleteUserById(id: string) {
    return await userRepository.deleteUserById(id);
  }

  async login(email: string, password: string) {
    return await userRepository.login(email, password);
  }
}
