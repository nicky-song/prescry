// Copyright 2018 Prescryptive Health, Inc.

import { Response } from 'express';
import { ErrorRequestInitialization } from '@phx/common/src/errors/error-request-initialization';
import { IAppLocals } from '../../models/app-locals';
import { getField, getRequiredField } from '../types/get-required-field';

export function getRequiredResponseLocal<K extends keyof IAppLocals>(
  response: Response,
  key: K
) {
  const locals = response.locals as IAppLocals;
  return getRequiredField(
    locals,
    key,
    () => new ErrorRequestInitialization(`locals.${key}`)
  );
}

export function getResponseLocal<K extends keyof IAppLocals>(
  response: Response,
  key: K
) {
  const locals = response.locals as IAppLocals;
  return getField(locals, key);
}
