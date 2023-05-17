import { Role } from '../enums/role.enum';

export type CurrentUserType = {
  userId?: number;
  email?: string;
  role?: Role;
};
