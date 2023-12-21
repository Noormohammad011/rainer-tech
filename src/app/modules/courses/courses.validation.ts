
import { z } from 'zod';
import { ClassDays, Level } from './courses.constants';

const createCourseZodSchema = z.object({
  body: z.object({
    user: z.string().optional(),
    name: z.string().min(5).max(255),
    description: z.string().min(5).max(255).optional(),
    price: z.number(),
    duration: z.string(),
    level: z.enum([...Level] as [string, ...string[]], {
      required_error: 'Level is required',
    }),
    topics: z.array(z.string()).nonempty(),
    schedule: z.object({
      startDate: z.string(),
      endDate: z.string(),
      classDays: z.array(z.enum([...ClassDays] as [string, ...string[]])).nonempty(),
      classTime: z.string(),
    }),
  }),
});

const updateCourseZodSchema = z.object({
  body: z.object({
    user: z.string().optional(),
    name: z.string().min(5).max(255).optional(),
    description: z.string().min(5).max(255).optional(),
    price: z.number().optional(),
    duration: z.string().optional(),
    level: z.enum([...Level] as [string, ...string[]]).optional(),
    topics: z.array(z.string()).nonempty().optional(),
    schedule: z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      classDays: z.array(z.enum([...ClassDays] as [string, ...string[]])).nonempty().optional(),
      classTime: z.string().optional(),
    }).optional(),
  }),
});

export const coursesSchemaValidator = {
  createCourseZodSchema,
  updateCourseZodSchema,
};
