import { Document, Model, Types } from 'mongoose';
import { IUser } from '../auth/auth.interface';

export type TClassDays = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type TLevel = 'beginner' | 'intermediate' | 'advanced';
export type TCourses = {
  user?: Types.ObjectId | IUser;
  name: string;
  description: string;
  price: number;
  duration: string;
  level: TLevel;
  topics: string[];
  schedule: {
    startDate: string;
    endDate: string;
    classDays: TClassDays[];
    classTime: string;
  };
} & Document;


export const ICourseSearchableFiels = ['name'];
export type ICoursesFilters = {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  level?: TLevel;
};

export type CourseModel = Model<TCourses, Record<string, unknown>>;
