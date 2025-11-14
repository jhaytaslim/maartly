import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const env = process.env.NODE_ENV || "development";
    const isDev = env === "development";

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = "Internal server error";
    let errorType = "InternalServerError";

    // 🌐 Handle standard HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();

      message =
        typeof responseMessage === "string"
          ? responseMessage
          : (responseMessage as any).message || responseMessage;

      errorType = exception.name;
    }
    // ⚙️ Handle Prisma exceptions
    else if (exception instanceof PrismaClientKnownRequestError) {
      errorType = "PrismaClientKnownRequestError";
      message = isDev
        ? `${exception.message} (code: ${exception.code})`
        : "Internal server error";
    } else if (exception instanceof PrismaClientUnknownRequestError) {
      errorType = "PrismaClientUnknownRequestError";
      message = isDev ? exception.message : "Internal server error";
    } else if (exception instanceof PrismaClientValidationError) {
      errorType = "PrismaClientValidationError";
      message = isDev ? exception.message : "Internal server error";
    }
    // 🧩 Fallback for any other runtime error
    else if (exception instanceof Error) {
      errorType = exception.name || "Error";
      message = isDev ? exception.message : "Internal server error";
    }

    // 🧾 Standardized response object
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorType,
      message,
    };

    // 🪵 Log error details always (safe for production)
    if (isDev) {
      console.error("[Exception Filter - DEV]", exception);
    } else {
      // In production, still log but do not leak internal details
      console.error("[Exception Filter - PROD]", {
        name: exception instanceof Error ? exception.name : "Unknown",
        message: exception instanceof Error ? exception.message : exception,
      });
    }

    response.status(status).json(errorResponse);
  }
}
