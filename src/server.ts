/**
 * @file server.ts
 * @description Main file for setting up the Express server and defining routes.
 */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config()
const env = process.env.NODE_ENV || 'development'
let config = require('./config/config.json')[env];
global.config = config
import swaggerRoute from './routers/swaggerRoute';
import i18n from './helper/locale.helper';
import handleErrorMessage from './middleware/validate';
import { db } from './models/index';
import { userAuth } from './middleware/auth';
import { privateRoutes, publicRoutes } from './routers/index.route'
db.sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((error: any) => {
        console.error('Error syncing database:', error);
    });

// Create an Express application
const app: Application = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(i18n.init);

// Create routes
app.all('/v1/private/*', userAuth)
app.use('/v1/private', privateRoutes)
app.use('/v1/public', publicRoutes)
app.set('trust proxy', true);
app.use('/', swaggerRoute); // update value of API_BASE_PREFIX in configuration file to access swagger

// Handle error message
app.use(handleErrorMessage);
app.use('/src/pictures/', express.static(__dirname + '/uploads/'));

// Define a simple root route
app.get('/', (req: Request, res: Response) => {
    res.send({
        status: true,
        message: "Hello! there.."
    });
});

// Start the server
const port: number = config.PORT || 3000;
let server = app.listen(port, () => {
    console.log(`Server is started on port:`, port);
});

export default server