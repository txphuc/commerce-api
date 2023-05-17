import * as bcrypt from 'bcrypt';
import { App } from '../constants/app.constant';

export const hash = async (str: string): Promise<string> => {
  const salt = await bcrypt.genSalt(App.SALT_OR_ROUND);

  return await bcrypt.hash(str, salt);
};

export const compare = async (str: string, hashed: string): Promise<boolean> => {
  return await bcrypt.compare(str, hashed);
};
