import { UserRepository } from '../repositories/user.repository';

const userRepository = new UserRepository();

export class UserService {
  async createUser({
    email,
    name,
    password,
    role,
    company,
    noOfMeetingRooms,
    meetingRooms,
  }: {
    email: string;
    name: string;
    password: string;
    role: string;
    company: string;
    noOfMeetingRooms: number;
    meetingRooms: string[];
  }) {
    try {
      return await userRepository.createUser({
        email,
        name,
        password,
        role,
        company,
        noOfMeetingRooms,
        meetingRooms,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error.message);
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
