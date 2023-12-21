import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TCourses } from './courses.interface';
import { CoursekService } from './courses.service';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { courseFilterableFields } from './courses.constants';

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const {
    _id: userID,
    email,
    isAdmin,
  } = req.user as { _id: string; isAdmin: boolean; email: string };
  const result = await CoursekService.createCourse(
    userID,
    isAdmin,
    email,
    req.body,
  );
  sendResponse<TCourses>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'The course has been added successfully',
    data: result,
  });
});


const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, courseFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await CoursekService.getAllCourses(filters, paginationOptions);
  sendResponse<TCourses[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CoursekService.getSingleCourse(id);
  sendResponse<TCourses>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course fetched successfully',
    data: result,
  });
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    _id: userID,
    email,
    isAdmin,
  } = req.user as { _id: string; isAdmin: boolean; email: string };
  const { ...courseData } = req.body;
  const result = await CoursekService.updateCourse(
    id,
    userID,
    email,
    isAdmin,
    courseData,
  );
  sendResponse<TCourses>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    _id: userID,
    email,
    isAdmin,
  } = req.user as { _id: string; isAdmin: boolean; email: string };
  const result = await CoursekService.deleteCourse(userID, email, isAdmin, id);
  sendResponse<TCourses>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course deleted successfully',
    data: result,
  });
});

export const CourseController = {
  getAllCourses,
  createCourse,
  getSingleCourse,
  updateCourse,
  deleteTask,
};
