import { Request, Response } from 'express';
import { ContactService } from '../services/contact.service';
import { errorResponse, successResponse } from '../utils/response';

const constactService = new ContactService();
export const ContactController = {
  create: async (req: Request, res: Response) => {
    try {
      const { name, email, message } = req.body;
      const contact = await constactService.create({ name, email, message });
      if (!contact) {
        errorResponse(res, 'Failed to create contact');
      }

      successResponse(res, 'Contact created successfully', contact);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  },
};
