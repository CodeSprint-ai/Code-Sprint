import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(devMessage: string);
  constructor(userMessage: string, devMessage: string);
  constructor(arg1: string, arg2?: string) {
    const message = arg2 ? arg1 : 'Resource not found';
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
