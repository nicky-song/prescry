// Copyright 2021 Prescryptive Health, Inc.

import { IReduxLoadingState } from '../loading.state';

type ActionKey = 'LOADING_HIDE' | 'LOADING_SHOW';

export interface ILoadingAction<T extends ActionKey> {
  readonly type: T;
  readonly payload: Partial<IReduxLoadingState>;
}

export type LoadingAction = ILoadingAction<ActionKey>;
