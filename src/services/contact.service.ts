import { ContactRepository } from '../repositories/contact.respository';
import nodemailer from 'nodemailer';

export class ContactService {
  private contactRepository = new ContactRepository();

  async create({
    name,
    email,
    message,
  }: {
    name: string;
    email: string;
    message: string;
  }) {
    try {
      // Send email with Nodemailer
      // await this.sendMail(name, email, message);
      return await this.contactRepository.createContact({
        name,
        email,
        message,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private async sendMail(name: string, email: string, message: string) {
    // Configure the SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'gmail', // Replace with your SMTP host
      auth: {
        user: 'heyambujsingh@gmail.com', // Replace with your email
        pass: 'your-email-password', // Replace with your password
      },
    });

    // Email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
        <h2 style="background-color: #4CAF50; color: white; padding: 15px; text-align: center;">
          New Contact Message
        </h2>
        <p style="font-size: 16px; color: #333;">Hello,</p>
        <p style="font-size: 16px; color: #333;">You have a new contact message from your website:</p>
        <div style="border-top: 1px solid #ddd; padding-top: 10px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="font-style: italic; color: #555;">"${message}"</p>
        </div>
        <p style="font-size: 14px; color: #888; margin-top: 20px;">
          Regards,<br>Your Company
        </p>
      </div>
    `;

    // Email options
    const mailOptions = {
      from: 'your-email@example.com', // Replace with your email and company name
      to: 'recipient@example.com', // Replace with the recipient's email
      subject: 'Thanks for the contacting us',
      html: htmlContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  }
}
