/**
 * @file server.ts
 * @description Main file for setting up the Express server and defining routes.
 */
import express, { Application, Request, Response } from 'express';
import http from 'http';
import apiRoutes from './routers/index.route';
import swaggerRoute from './routers/swaggerRoute';
import config from './config/config.json';
import cors from 'cors';
import bodyParser from 'body-parser';
import i18n from './helper/locale.helper';
import handleErrorMessage from './middleware/validate';
import { db } from './models/index';

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
app.use('/', apiRoutes, swaggerRoute); // update value of API_BASE_PREFIX in configuration file to access swagger

// Handle error message
app.use(handleErrorMessage);
app.use('/src/pictures/', express.static(__dirname + '/pictures/'));

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