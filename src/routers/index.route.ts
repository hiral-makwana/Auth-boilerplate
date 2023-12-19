import express, { Router } from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';

const routes: Router = express.Router();

routes.use('/', authRoutes);
routes.use('/', userRoutes);

export default routes;
