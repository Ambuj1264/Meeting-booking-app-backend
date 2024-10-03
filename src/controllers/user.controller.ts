import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { errorResponse, successResponse } from '../utils/response';

const userService = new UserService();

export const UserController ={
   createUser: async(req: Request, res: Response) =>{
    try {
      const user = await userService.createUser(req.body);
     successResponse(res, 'User created successfully', user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      errorResponse(res, 'Failed to create user');
    }
  }
,
   getAllUsers :async(req: Request, res: Response)=> {
    try {
      const users = await userService.getAllUsers();
      successResponse(res, 'Users retrieved successfully', users);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      errorResponse(res, 'Failed to retrieve users');
    }
  }
,
   deleteUser: async(req: Request, res: Response)=> {
    try {
      const userId = req.params.id;
      await userService.deleteUserById(userId);
      successResponse(res, 'User deleted successfully');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      errorResponse(res, 'Failed to delete user');
    }
  }
}
