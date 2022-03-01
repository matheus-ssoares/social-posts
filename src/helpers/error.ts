import { Response } from 'express';

class GenericError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

class NotFoundError extends Error {
  statusCode: number;
  customMessage?: string;
  constructor(customMessage?: string) {
    super();
    this.statusCode = 404;
    this.message = customMessage ? customMessage : 'Not found';
  }
}

const handleError = (err: unknown, res: Response) => {
  if (err instanceof GenericError || err instanceof NotFoundError) {
    const { statusCode, message } = err;
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
    });
    return;
  }
  res.status(500).json({
    status: 'error',
  });
};

export { GenericError, NotFoundError, handleError };
