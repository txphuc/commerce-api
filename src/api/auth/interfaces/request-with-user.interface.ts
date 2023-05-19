import { Request } from 'express';
import { CurrentUserType } from 'src/common/types/current-user.type';

interface RequestWithUser extends Request {
  user: CurrentUserType;
}

export default RequestWithUser;
