import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationFailedException extends HttpException {
  constructor(devMessage: string);
  constructor(userMessage: string, devMessage: string);
  constructor(arg1: string, arg2?: string) {
    const message = arg2 ? arg1 : 'Validation failed';
    const devMessage = arg2 ?? arg1;

    super(
      {
        message,
        devMessage,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
