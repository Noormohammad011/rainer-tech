import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { UserValidator } from './auth.validation';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidator.createUserZodSchema),
  AuthController.createUser,
);

router.post(
  '/login',
  validateRequest(UserValidator.loginZodSchema),
  AuthController.loginUser,
);



router.post(
  '/refresh-token',
  validateRequest(UserValidator.refreshTokenZodSchema),
  AuthController.refreshToken,
);

router.post(
  '/reset-password',
  auth(),
  validateRequest(UserValidator.resetPassword),
  AuthController.resetPassword,
);

router.get('/me', auth(), AuthController.userProfile);

// Future implementation for deleting user and all tasks associated with it || When role based auth is implemented
// router.delete('/delete', auth(), AuthController.deleteUser);

export const AuthRoute = router;
