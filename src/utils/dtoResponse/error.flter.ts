import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseDto } from './response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    let errorMessage: string;

    // Check if the response contains validation errors
    if (Array.isArray(exceptionResponse.message)) {
      // Use the first message from the array
      errorMessage = exceptionResponse.message[0] || 'Internal server error';
    } else {
      // Use the string message as is
      errorMessage = exceptionResponse.message || 'Internal server error';
    }

    const errorResponse = new ResponseDto<any>(
      status,
      errorMessage, // Use the selected error message
      null,
    );

    response.status(status).json({
      statusCode: errorResponse.statusCode,
      message: errorResponse.message,
      data: errorResponse.data,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
