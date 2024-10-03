// Copyright 2018 Prescryptive Health, Inc.

import { Dispatch, Middleware, MiddlewareAPI } from 'redux';

export function setupLogger<T>(
  actionTypes: T,
  builder: (actionTypes: T) => ILogActionMiddleware
): Middleware {
  return builder(actionTypes);
}

export interface ILogAction {
  type: string;
  routeName?: string;
  key?: string;
  payload?: unknown;
  params?: unknown;
}

export type ILogActionLogger = (action: ILogAction) => void;
export type ILogActionNext = (next: Dispatch<ILogAction>) => ILogActionLogger;

export type ILogDispatcher = Dispatch<ILogAction>;

export interface ILogActionMiddleware extends Middleware {
  (api: MiddlewareAPI): ILogActionNext;
}
