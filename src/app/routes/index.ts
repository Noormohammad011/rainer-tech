import express from 'express';
import { AuthRoute } from '../modules/auth/auth.route';
import { CoursesRoute } from '../modules/courses/courses.route';

const router = express.Router();
const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/course',
    route: CoursesRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
