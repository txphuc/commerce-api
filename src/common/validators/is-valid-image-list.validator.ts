import { ValidationOptions, registerDecorator } from '@nestjs/class-validator';
import { Common, Regex } from '../constants/common.constant';

export function IsValidImageList(options?: ValidationOptions) {
  return (object: { constructor: any }, propertyName: string) => {
    registerDecorator({
      name: 'isValidImageList',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(images: any): boolean {
          if (images === null || images === undefined) {
            return false;
          }
          if (!Array.isArray(images)) {
            return false;
          }
          if (images.length === 0) {
            return false;
          }
          if (images.length > Common.Images.MAX_LENGTH) {
            return false;
          }
          for (let i = 0; i < images.length; i++) {
            const item = images[i];
            if (typeof item !== 'string') {
              return false;
            }
            if (!item.match(Regex.IMAGE)) {
              return false;
            }
          }
          return true;
        },
      },
    });
  };
}
