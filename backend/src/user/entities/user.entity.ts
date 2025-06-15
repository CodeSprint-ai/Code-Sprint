import { User } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  full_name: string;
  email: string;
  email_verified: boolean;
  email_verifiedAt: Date;
  password: string;
  last_password_change_At: Date;
  last_login_At: Date;
  createdAt: Date;
  updatedAt: Date;
}
