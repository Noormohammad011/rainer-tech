import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z
    .object({
      name: z.string().min(3).max(100),
      email: z.string().email(),
      password: z.string().min(6).max(100),
      confirmPassword: z.string().min(6).max(100),
      isAdmin: z.boolean().optional(),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
    }),
});

const loginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

const resetPassword = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old Password is required',
    }),
    newPassword: z.string({
      required_error: 'New Password is required',
    }),
  }),
});

export const UserValidator = {
  createUserZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
  resetPassword,
};
