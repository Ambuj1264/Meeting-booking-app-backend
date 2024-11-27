import nodemailer from 'nodemailer';
export const tranportCreate = async () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pratik1264675@gmail.com',
      pass: 'ijsawgdnwvgknpib',
    },
  });
};
