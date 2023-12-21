import { Document, Model } from 'mongoose';

export type IUser = {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
} & Document;

export type ILoginUser = {
  email: string;
  password: string;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type UserModel = {
  isUserExist: (
    email: string,
  ) => Promise<Pick<IUser, 'password' | 'email' | '_id' | 'name' | 'isAdmin'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser, Record<string, unknown>>;
