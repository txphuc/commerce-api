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
  unConfirmedEmail: {
    code: 'auth-2003',
    field: 'email',
    resource: User.name,
  },
  alreadyConfirmedEmail: {
    code: 'auth-2004',
    field: 'email',
    resource: User.name,
  },
  expiredActivationKey: {
    code: 'auth-2005',
    field: 'email',
    resource: User.name,
  },
  wrongActivationKey: {
    code: 'auth-2006',
    field: 'email',
    resource: User.name,
  },
  expiredResetToken: {
    code: 'auth-2007',
    field: 'email',
    resource: User.name,
  },
  wrongResetToken: {
    code: 'auth-2008',
    field: 'email',
    resource: User.name,
  },
};
