import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
  IUser,
} from './auth.interface';
import { UserService } from './auth.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;
  const result = await UserService.createUser(userData);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully!',
    data: result,
  });
});


const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await UserService.loginUser(loginData);
  const { refreshToken, ...others } = result;

  const cookieOptions: {
    secure: boolean;
    httpOnly: boolean;
    sameSite?: 'none' | undefined;
  } = {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully!',
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await UserService.refreshToken(refreshToken);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully!',
    data: result,
  });
});



const userProfile = catchAsync(async (req: Request, res: Response) => {
  const { _id: userId } = req.user as { _id: string };
  const result = await UserService.userProfile(userId);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Profile fetched successfully!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const { _id: userId } = req.user as JwtPayload;
  const result = await UserService.resetPassword(
    userId,
    oldPassword,
    newPassword,
  );
  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully',
    data: result,
  });
});


// Future implementation for deleting user and all tasks associated with it || When role based auth is implemented

// const deleteUser = catchAsync(async (req: Request, res: Response) => {
//   const { _id: userId } = req.user as { _id: string };
//   const result = await UserService.deleteUser(userId);
//   sendResponse<IUser>(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: 'Profile fetched successfully!',
//     data: result,
//   });
// });


export const AuthController = {
  createUser,
  loginUser,
  refreshToken,
  userProfile,
  resetPassword,
};
