// Copyright 2021 Prescryptive Health, Inc.

import { ILoadingAction } from './loading.action';

export type IShowLoadingAction = ILoadingAction<'LOADING_SHOW'>;

export const showLoadingAction = (
  showMessage?: boolean,
  message?: string
): IShowLoadingAction => ({
  type: 'LOADING_SHOW',
  payload: {
    showMessage,
    message,
  },
});
