import { UserRepository } from '../repositories/user.repository';

const userRepository = new UserRepository();

export class UserService {
  async createUser(data: unknown) {
    // You can add business logic here (e.g., password hashing)
    return await userRepository.createUser(data);
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
}
