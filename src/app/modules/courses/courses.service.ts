import { SortOrder } from 'mongoose';
import { IGenericResponse } from './../../../interfaces/common';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../auth/auth.model';
import { ICoursesFilters, TCourses } from './courses.interface';
import { Course } from './courses.model';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { courseSearchableFields } from './courses.constants';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const createCourse = async (
  userID: string,
  isAdmin: boolean,
  email: string,
  payload: TCourses,
): Promise<TCourses | null> => {
  const isUserExist = await User.findOne({
    _id: userID,
    isAdmin: isAdmin,
    email: email,
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const result = await Course.create({
    ...payload,
    user: isUserExist._id,
  });
  return result;
};

const getAllCoursesByAdmin = async (
  userID: string,
  isAdmin: boolean,
  email: string,
): Promise<TCourses[] | null> => {
  const isUserExist = await User.findOne({
    _id: userID,
    email,
    isAdmin,
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
  const result = await Course.find({
    user: {
      $in: await User.find({ _id: userID }),
    },
  }).populate('user');
  return result;
};

const getAllCourses = async (
  filters: ICoursesFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<TCourses[]>> => {
  const { searchTerm, minPrice, maxPrice, ...otherFilters } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: courseSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (minPrice && maxPrice) {
    andConditions.push({
      price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    });
  } else if (minPrice) {
    andConditions.push({
      price: {
        $gte: minPrice,
      },
    });
  } else if (maxPrice) {
    andConditions.push({
      price: {
        $lte: maxPrice,
      },
    });
  }

  if (Object.keys(otherFilters).length) {
    Object.entries(otherFilters).forEach(([field, value]) => {
      if (Array.isArray(value)) {
        andConditions.push({
          [field]: {
            $in: value,
          },
        });
      } else {
        andConditions.push({
          [field]: value,
        });
      }
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Course.find(whereConditions)
    .populate({
      path: 'user',
    })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Course.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCourse = async (id: string): Promise<TCourses | null> => {
  const result = await Course.findById({ _id: id }).populate('user');
  return result;
};

const updateCourse = async (
  id: string,
  userID: string,
  email: string,
  isAdmin: boolean,
  payload: TCourses,
): Promise<TCourses | null> => {
  const isUserExist = await User.findOne({ _id: userID, email, isAdmin });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
  const { ...courseData } = payload;
  const updateBookData: Partial<TCourses> = { ...courseData };
  const result = await Course.findOneAndUpdate({ _id: id }, updateBookData, {
    new: true,
    validateBeforeSave: true,
  }).populate('user');
  return result;
};

const deleteCourse = async (
  userID: string,
  email: string,
  isAdmin: boolean,
  id: string,
): Promise<TCourses | null> => {
  const isUserExist = await User.findOne({ _id: userID, email, isAdmin });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
  const result = await Course.findOneAndDelete({ _id: id });
  return result;
};

export const CoursekService = {
  getAllCoursesByAdmin,
  createCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
};
