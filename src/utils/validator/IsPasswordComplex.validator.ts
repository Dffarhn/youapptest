import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'IsPasswordComplex', async: false })
export class IsPasswordComplexConstraint implements ValidatorConstraintInterface {
  validate(password: string) {
    return (
      typeof password === 'string' &&
      /[A-Z]/.test(password) && // Contains uppercase letter
      /[a-z]/.test(password) && // Contains lowercase letter
      /\d/.test(password)   // Contains number
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must contain uppercase and lowercase letters,and a number';
  }
}

export function IsPasswordComplex(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordComplexConstraint,
    });
  };
}
