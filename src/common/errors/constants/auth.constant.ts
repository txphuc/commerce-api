import { User } from 'src/api/users/entities/user.entity';

export const authError = {
  isExistEmail: {
    code: 'auth-2000',
    field: 'email',
    resource: User.name,
  },
  isNoPassword: {
    code: 'auth-2001',
    field: 'password',
    resource: User.name,
  },
  isIncorrectPassword: {
    code: 'auth-2002',
    field: 'password',
    resource: User.name,
  },
};
