import { ValidationOptions, registerDecorator } from '@nestjs/class-validator';
export function IsDistinctListOfObject(options?: ValidationOptions) {
  return (object: { constructor: any }, propertyName: string) => {
    registerDecorator({
      name: 'isDistinctListOfObject',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(array: object[]): boolean {
          const fields: string[] = options?.context;
          if (fields.length === 0) {
            return true;
          }
          const arrayWithFields = array.map((obj) => {
            if (fields.every((field) => Object.keys(obj).includes(field))) {
              const result: object = {};
              fields.forEach((field) => (result[field] = obj[field]));
              return JSON.stringify(result);
            }
          });
          return new Set(arrayWithFields).size === array.length;
        },
      },
    });
  };
}
