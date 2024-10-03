// Copyright 2021 Prescryptive Health, Inc.

export interface IReduxLoadingState {
  readonly count: number;
  readonly showMessage?: boolean;
  readonly message?: string;
}

export const defaultLoadingState: IReduxLoadingState = {
  count: 0,
};
