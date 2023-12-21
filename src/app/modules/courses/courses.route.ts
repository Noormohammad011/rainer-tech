import express from 'express';
import { admin, auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './courses.controller';
import { coursesSchemaValidator,  } from './courses.validation';

const router = express.Router();

router.get('/', CourseController.getAllCourses);
router.post(
  '/',
  auth(),
  admin(),
  validateRequest(coursesSchemaValidator.createCourseZodSchema),
  CourseController.createCourse,
);
router
  .route('/:id')
  .get(CourseController.getSingleCourse)
  .delete(auth(), admin(), CourseController.deleteTask);

router.patch(
  '/:id',
  auth(),
  admin(),
  validateRequest(coursesSchemaValidator.updateCourseZodSchema),
  CourseController.updateCourse,
);
export const CoursesRoute = router;
