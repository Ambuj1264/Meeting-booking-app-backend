import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
export class UserRepository {
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
      // Check if the user already exists
      const existingUser = await this.isAlreadyExist(email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user with hashed password
      const user = await User.create({
        email,
        name,
        password: hashedPassword,
        role,
        company,
        noOfMeetingRooms,
        meetingRooms,
      });

      return user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Provide more specific error handling and rethrow the error
      throw new Error(`${error.message}`);
    }
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

  async isAlreadyExist(email: string) {
    return await User.findOne({ email });
  }

  async login(email: string, password: string) {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // Generate the token with the user's email and name
      const token = await this.generateToken({
        email: user.email,
        name: user.name,
      });
      console.log(token, '------------------------------');

      // Convert user to a plain JavaScript object before modifying it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userWithoutPassword: any = user.toObject
        ? user.toObject()
        : { ...user };

      // Remove password from the object
      delete userWithoutPassword.password;

      // Add the generated token to the object
      userWithoutPassword['token'] = token;
      console.log(userWithoutPassword, 'userWithoutPassword');

      return userWithoutPassword;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  generateToken({ ...user }) {
    try {
      const result = jwt.sign({ ...user }, process.env.JWT_SECRET!, {
        expiresIn: '30d',
      });

      return result;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error('Failed to generate token' + error.message);
    }
  }
}
