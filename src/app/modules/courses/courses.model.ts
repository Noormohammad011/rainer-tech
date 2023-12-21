import { Schema, model } from 'mongoose';
import { CourseModel, TCourses } from './courses.interface';
import { ClassDays, Level } from './courses.constants';

export const coursesSchema = new Schema<TCourses, CourseModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: Object.values(Level),
    },
    topics: {
      type: [String],
      required: true,
    },
    schedule: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      classDays: {
        type: [Object.values(ClassDays)],
        required: true,
      },
      classTime: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Course = model<TCourses, CourseModel>('Courses', coursesSchema);
