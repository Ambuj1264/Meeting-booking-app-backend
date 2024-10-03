
import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import {connectDB} from "./Database/Connection/mongoose";
connectDB();
import {router} from "./routers/index.route";
import cors from 'cors';
const port = process.env.PORT;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}   

const app = express();
app.use(cors(corsOptions));
app.use(router);

// Middleware to parse JSON
app.use(express.json());



// Define a basic route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});