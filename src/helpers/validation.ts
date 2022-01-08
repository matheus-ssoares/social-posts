import { Response, Request, NextFunction } from 'express';
import Joi from 'joi';

export function validationBody(
  schema: Joi.ObjectSchema<any>,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    res.status(422).send({
      message: 'Validation error',
      details: error.details,
    });
  } else {
    next();
  }
}
