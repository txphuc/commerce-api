import { ValidationOptions, registerDecorator } from '@nestjs/class-validator';
import { Common } from '../constants/common.constant';

export function IsValidSpecificationList(options?: ValidationOptions) {
  return (object: { constructor: any }, propertyName: string) => {
    registerDecorator({
      name: 'isValidSpecificationList',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(specificationList: any): boolean {
          if (specificationList === null || specificationList === undefined) {
            return true;
          }
          if (!Array.isArray(specificationList)) {
            return false;
          }
          if (specificationList.length > Common.SpecificationList.MAX_LENGTH) {
            return false;
          }
          for (let i = 0; i < specificationList.length; i++) {
            const item = specificationList[i];
            if (typeof item !== 'string') {
              return false;
            }
            if (item.length > Common.SpecificationList.ITEM_MAX_LENGTH) {
              return false;
            }
            const firstChar = item.charAt(0);
            if (!/[a-z]/.test(firstChar)) {
              return false;
            }
            if (!/^[a-z0-9]+$/.test(item)) {
              return false;
            }
          }
          return true;
        },
      },
    });
  };
}
