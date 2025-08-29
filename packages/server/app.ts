import { HttpStatusCode } from 'axios';
import 'dotenv';
import express, {
    type NextFunction,
    type Request,
    type Response,
} from 'express';
import morgan from 'morgan';
import { chatRouter } from './chat/chat.router';
import { productRouter } from './products/product.router';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isProd = process.env.NODE_ENV === 'production';

/* set middleware */
app.use(morgan(isProd ? 'tiny' : 'dev'));

/* set routes */
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/product', productRouter);

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
        statusCode: HttpStatusCode.InternalServerError,
        message: 'Unable to process request, please try again later.',
        data: null,
        errors: [],
    });
});
