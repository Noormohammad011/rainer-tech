import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { IUser, UserModel } from './auth.interface';
import { Course } from '../courses/courses.model';


const userSchema = new Schema<IUser, UserModel>(
  {
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);



userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bycrypt_salt_rounds),
  );
  next();
});

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.statics.isUserExist = async function (email: string) {
  return await this.findOne({ email }).select('_id email name password isAdmin');
};

userSchema.pre(
  'deleteOne',
  { document: false, query: true },
  async function () {
    const doc = await this.model.findOne(this.getFilter());
    await Course.deleteMany({ user: doc._id });
  },
);


//virtual populate
userSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });



export const User = model<IUser, UserModel>('User', userSchema);
