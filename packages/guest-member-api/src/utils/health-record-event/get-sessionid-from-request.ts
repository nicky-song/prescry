// Copyright 2020 Prescryptive Health, Inc.

import { Request } from 'express';
import { fetchRequestHeader } from '../request-helper';

export function getSessionIdFromRequest(request: Request): string {
  const requestHeader: string | undefined = fetchRequestHeader(
    request,
    'request-id'
  );

  if (requestHeader) {
    const sessionId = requestHeader.split('.')[0];
    return sessionId && sessionId.startsWith('|')
      ? sessionId.replace(/^\|+/, '')
      : sessionId;
  }
  return '';
}
