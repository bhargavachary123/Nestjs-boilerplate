import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = host.switchToHttp().getRequest();

    if (exception.response == 'ThrottlerException: Too Many Requests') {
      return response.json({
        Error: true,
        statusCode: 401,
        message: 'Too Many Requests',
      });
    }
    if (exception?.response) {

      if (exception.response != undefined) {
        if (exception?.response['message'] != undefined) {
          console.log(exception.response['message'], "1")
          console.log(request.originalUrl, " url")
        } else {
          console.log(exception.response, "2")
          console.log(request.originalUrl, " url")
        }
      } else {
        console.log(exception.response, "3")
        console.log(request.originalUrl, " url")
      }
    }

    if (exception.response?.statusCode === 401)
      return response.json({
        Error: true,
        statusCode: 401,
        message: exception.response['message'],
      });
    if (exception.response?.status === 'error')
      return response.json({
        Error: true,
        statusCode: 404,
        message: exception.response.error,
      });

    // Handle the exception and send an appropriate response to the client
    if (exception?.response) {
      return response.json({
        Error: true,
        statusCode: 500,
        message: 'Internal server error - ' + exception.response['message'],
      });
    }
  }
}
