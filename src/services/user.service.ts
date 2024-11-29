import { Types } from 'mongoose';
import { UserRepository } from '../repositories/user.repository';
import jwt from 'jsonwebtoken';
import { tranportCreate } from '../utils/mails/index';
const userRepository = new UserRepository();

export class UserService {
  async createCompany(
    name: string,
    meetingRooms?: Types.ObjectId[],
    noOfMeetingRooms?: number
  ) {
    return await userRepository.createCompany(
      name,
      meetingRooms,
      noOfMeetingRooms
    );
  }
  async createMeetingRooms(meetingRooms: [{ name: string }]) {
    return await userRepository.createMeetingRooms(meetingRooms);
  }
  async isCompanyAlreadyExist(name: string) {
    return await userRepository.isCompanyAlreadyExist(name);
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
      return await userRepository.createUser({
        email,
        name,
        password,
        role,
        companyId,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.stack, 'error.stack');
      throw new Error(error.message + 'user service');
    }
    // You can add business logic here (e.g., password hashing)
  }

  async getUserByEmail(email: string) {
    return await userRepository.getUserByEmail(email);
  }

  async getAllUsers() {
    return await userRepository.getAllUsers();
  }

  async deleteUserById(id: string) {
    return await userRepository.deleteUserById(id);
  }

  async login(email: string, password: string) {
    return await userRepository.login(email, password);
  }
  async sentMail(email: string) {
    //first check user exist or not
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    const jwtToken = jwt.sign({ email }, process.env.APP_SECRET!, {
      expiresIn: '15m',
    });
    const replacedStr = jwtToken.replace(/\./g, '_dev_');
    // send mail to user

    const tranport = await tranportCreate();
    const mailOptions = {
      from: 'pratik1264675@gmail.com',
      to: user.email,
      subject: 'Password Reset Link',
      html: `
      <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Your Password</title>
<style>
    body {
        font-family: Arial, sans-serif;
        line-height: 1.5;
        color: #333333;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
    }
    .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
    }
    h1 {
        font-size: 30px;
       color: #37a0bf;
        margin-bottom: 20px;
    }
    p {
        font-size: 14px;
        margin-bottom: 10px;
    }
    a {
        color: #ffffff;
        text-decoration: none;
        color:"white";
        background-color: #37a0bf;
        padding: 10px 20px;
        border-radius: 5px;
    }
</style>
</head>
<body >
<div class="container">
    <h1>Reset Your Password</h1>
    <p>Dear <span>${user.name}</span>,</p>
    <p>We have received a request to reset your account password. To ensure the security of your account, please follow the instructions below to complete the password reset process.
</p>
<p><b>Step 1: Access the Password Reset Page</b></p>
<p>Click on the following link to access the password reset page</p>
    <p><a 
    href=${process.env.CLIENT_URL}/forgot-password/${replacedStr}>Reset Password</a></p>
    <p><b>Step 2: Verify Your Account</b></p>
<p>You will be prompted to enter your account information on the password reset page for verification purposes. Please provide the required details accuratel</p>
 <p><b>Step 3: Create a New Password</b></p>
<p>Once your account has been successfully verified, you will be directed to create a new password for it. Please ensure that you choose a strong password that is unique and not easily guessable.</p>
<p><b>Password Requirements:</b></p>
<li>Minimum length of 6 characters.</li>
<li>Must contain at least one uppercase letter, one lowercase letter, one digit, and one unique character (!@#$%&*)</li>
    <p>If you are still unable to log in or have any further questions or concerns, please do not hesitate to reach out to our support team.</p>
    <p>If you did not request a password reset, you can ignore this email. Your current password will remain unchanged.</p>
    <p>Thank you for your cooperation.</p>
    <p>Best regards
</p>
</div>
</body>
</html> `,
    };
    const sent = await tranport.sendMail(mailOptions);
    if (sent) {
      return {
        success: true,
        data: {
          emailResponse: sent.response,
          email: user.email,
        },
      };
    } else {
      throw new Error('Failed to send email');
    }
  }
  async checkTokenIsValid(token: string) {
    try {
      // replace all _dev_ with .
      const newToken = token.replace(/_dev_/g, '.');
      const decoded = jwt.verify(newToken, process.env.APP_SECRET!);
      return decoded;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  forgotPassword(password: string, token: string) {
    const newToken = token.replace(/_dev_/g, '.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwt.verify(newToken, process.env.APP_SECRET!);
    console.log(decoded, 'decoded');
    if (!decoded) {
      throw new Error('Token is not valid');
    }
    const email = decoded.email;
    return userRepository.forgotPassword(password, email);
  }
}
