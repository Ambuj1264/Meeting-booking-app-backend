import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { errorResponse, successResponse } from '../utils/response';
import { Types } from 'mongoose';
import { UserRepository } from '../repositories/user.repository';

const userService = new UserService();
const userRepository = new UserRepository();

export const UserController = {
  createUser: async (req: Request, res: Response) => {
    try {
      const {
        email,
        name,
        password,
        role,
        company,
        noOfMeetingRooms,
        meetingRooms,
      } = req.body;
      // check user is already exist
      const isUserAlreadyExist = await userRepository.getUserByEmail(email);
      if (isUserAlreadyExist) {
        errorResponse(res, 'User already exist', isUserAlreadyExist);
        return;
      }
      let companyData;
      let meetingRoomsData;
      if (role === 'admin') {
        // check company name is already exist
        const isCompanyAlreadyExist =
          await userService.isCompanyAlreadyExist(company);
        if (isCompanyAlreadyExist) {
          errorResponse(res, 'Company already exist', isCompanyAlreadyExist);
          return;
        }

        if (meetingRooms) {
          // register first rooms
          meetingRoomsData = await userService.createMeetingRooms(meetingRooms);

          if (!meetingRoomsData) {
            errorResponse(res, 'Failed to create meeting rooms');
            return;
          }
        }

        // register a company
        companyData = await userService.createCompany(
          company,
          meetingRoomsData,
          noOfMeetingRooms
        );

        if (!companyData) {
          errorResponse(res, 'Failed to create company');
          return;
        }
      }

      const companyId: Types.ObjectId | undefined = companyData?._id
        ? companyData?._id
        : company;

      // register a user
      const user = await userService.createUser({
        email,
        name,
        password,
        role,
        companyId,
      });
      successResponse(res, 'User created successfully', user);
      return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // errorResponse(res, error.message);
      console.log(error.stack);
      errorResponse(res, error.message, error.stack);
    }
  },
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      successResponse(res, 'Users retrieved successfully', users);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      errorResponse(res, 'Failed to retrieve users');
    }
  },
  deleteUser: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      await userService.deleteUserById(userId);
      successResponse(res, 'User deleted successfully');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      errorResponse(res, 'Failed to delete user');
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await userService.login(email, password);
      successResponse(res, 'User logged in successfully', user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  },

  sentMail: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await userService.sentMail(email);
      successResponse(res, 'Mail sent successfully', user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      errorResponse(res, 'Failed to sent mail', error.stack);
    }
  },
  checkTokenIsValid: async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const isValid = await userService.checkTokenIsValid(token);
      if (!isValid) {
        errorResponse(res, 'Token is not valid');
        return;
      }
      successResponse(res, 'Token is valid', isValid);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      errorResponse(res, 'Failed to check token', error.stack);
    }
  },
  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { newPassword, token } = req.body;
      const user = await userService.forgotPassword(newPassword, token);
      if (!user) {
        errorResponse(res, 'Token is not valid');
        return;
      }
      successResponse(res, 'Password sent successfully', user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      errorResponse(res, 'Failed to sent mail', error.stack);
    }
  },
  getMe: async (req: Request, res: Response) => {
    try {
      const user = await userRepository.getMe(req.body.id);

      successResponse(res, 'User retrieved successfully', user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      errorResponse(res, 'Failed to retrieve user', error.stack);
    }
  },
};
