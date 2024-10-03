import { User } from '../models/user.model';

export class UserRepository {
  async createUser(data: unknown) {
    const user = new User(data);
    return await user.save();
  }

  async getUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  async getAllUsers() {
    return await User.find();
  }

  async deleteUserById(id: string) {
    return await User.findByIdAndDelete(id);
  }
}
