import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { CompanyModel } from '../models/company.model';
import { RoomModel } from '../models/room.model';
import { Types } from 'mongoose';
export class UserRepository {
  async createCompany(
    name: string,
    meetingRooms?: Types.ObjectId[],
    noOfMeetingRooms?: number
  ) {
    try {
      const company = await CompanyModel.create({
        name,
        meetingRooms,
        noOfMeetingRooms,
      });
      return company;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to create company');
    }
  }
  async createMeetingRooms(meetingRooms: [{ name: string }]) {
    try {
      const rooms = await RoomModel.insertMany(meetingRooms);
      //all _id of rooms
      return rooms.map(room => room._id);
    } catch (error) {
      console.log(error);
      throw new Error('Failed to create meeting rooms');
    }
  }
  async isCompanyAlreadyExist(name: string) {
    return await CompanyModel.findOne({ name, isDeleted: false });
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
      // Check if the user already exists
      // const existingUser = await this.isAlreadyExist(email);
      // if (existingUser) {
      //   throw new Error('User already exists');
      // }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user with hashed password
      const user = await User.create({
        email: email.toLowerCase(),
        name,
        password: hashedPassword,
        role,
        companyId,
      });

      return user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Provide more specific error handling and rethrow the error
      throw new Error(`${error.message}`);
    }
  }

  async getUserByEmail(email: string) {
    return await User.findOne({ email: email.toLowerCase(), isDeleted: false });
  }

  async getAllUsers() {
    return await User.find({
      isDeleted: false,
    });
  }

  async deleteUserById(id: string) {
    return await User.findOneAndDelete({
      _id: id,
      isDeleted: false,
    });
  }

  async isAlreadyExist(email: string) {
    return await User.findOne({ email, isDeleted: false });
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
