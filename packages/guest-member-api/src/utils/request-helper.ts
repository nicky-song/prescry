// Copyright 2018 Prescryptive Health, Inc.

import { Request } from 'express';

export const fetchRequestHeader = (request: Request, type: string) => {
  const headerValue = request.headers[type];
  return Array.isArray(headerValue) ? headerValue[0] : headerValue;
};
