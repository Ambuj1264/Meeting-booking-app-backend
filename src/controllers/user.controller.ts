import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { errorResponse, successResponse } from '../utils/response';
import { Types } from 'mongoose';

const userService = new UserService();

export const UserController = {
  createUser: async (req: Request, res: Response) => {
    console.log(req.body, '==========================meetingRooms');
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
      console.log(name, 'name======================');
      // check user is already exist
      const isUserAlreadyExist = await userService.getUserByEmail(email);
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
        console.log(isCompanyAlreadyExist, 'isCompanyAlreadyExist');
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
};
