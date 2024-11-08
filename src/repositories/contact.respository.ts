import { ContactModel } from '../models/contact.model';

export class ContactRepository {
  async createContact({
    name,
    email,
    message,
  }: {
    name: string;
    email: string;
    message: string;
  }) {
    return await ContactModel.create({ name, email, message });
  }
}
