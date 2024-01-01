import express, { Router } from 'express';
import userRoutes from './user.route';

const routes: Router = express.Router();

routes.use('/', userRoutes);

export default routes;