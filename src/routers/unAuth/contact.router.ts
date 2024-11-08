import { Router } from 'express';
import { ContactController } from '../../controllers/contact.controller';

const contactrouter = Router();
contactrouter.post('/us', ContactController.create);
export default contactrouter;
