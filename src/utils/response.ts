import { Response } from 'express';
export const successResponse = (
  res: Response,
  message: string,
  data?: unknown
) => {
  return res.status(200).json({
    status: 'SUCCESS',
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message: string,
  data?: unknown
) => {
  return res.status(400).json({
    status: 'ERROR',
    message,
    data,
  });
};
