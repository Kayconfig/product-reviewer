import { HttpStatusCode } from 'axios';
import 'dotenv';
import express, {
    type NextFunction,
    type Request,
    type Response,
} from 'express';
import morgan from 'morgan';

export const app = express();

const isProd = process.env.NODE_ENV === 'production';

/* set middleware */
app.use(morgan(isProd ? 'tiny' : 'dev'));

/* unhandled routes */
app.use('/', (req, res) => {
    res.status(HttpStatusCode.NotFound).json({
        statusCode: HttpStatusCode.NotFound,
        message: 'Path not found',
        data: null,
        errors: [],
    });
});

/* catch exceptions */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(HttpStatusCode.InternalServerError).json({
        statusCode: HttpStatusCode,
        message: 'Unable to process request, please try again later.',
        data: null,
        errors: [],
    });
});
