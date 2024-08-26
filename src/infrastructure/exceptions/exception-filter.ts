import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const httpStatus = exception.getStatus();

        if (httpStatus === 400) {
            const errorsResponse: any = {
                errorsMessages: [],
            };

            const responseBody: any = exception.getResponse();

            if (typeof responseBody.message === 'string') {
                response.status(400).json(errorsResponse);

                return;
            }

            responseBody.message.forEach(m => errorsResponse.errorsMessages.push(m));
            response.status(400).json(errorsResponse);
        } else {
            response.status(httpStatus).json({
                statusCode: httpStatus,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
    }
}
