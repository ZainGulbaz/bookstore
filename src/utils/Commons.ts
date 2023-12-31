
import { ErrorCodes } from './Constatns';
import { EntityStringsType } from './types';
import * as bcrypt from 'bcrypt';

export const errorGenerator = (err: any) =>
  (err.meta?.target?.[0] +
    ' ' +
    ErrorCodes[err?.code]) as EntityStringsType[keyof EntityStringsType];

export const filterObject = (
  obj: object,
  key: string,
): string | number | null => {
  try {
    let deletedValue = obj[key];
    delete obj[key];
    return deletedValue;
  } catch (err) {
    return null;
  }
};

export const validatePassword = (password: string, hash: string) => {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (err) {
    return false;
  }
};


