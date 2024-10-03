// Copyright 2022 Prescryptive Health, Inc.

import { createContext } from 'react';
import {
  defaultLoadingState,
  ILoadingState,
} from '../../state/loading/loading.state';

export interface ILoadingContext {
  readonly loadingState: ILoadingState;
}

export const LoadingContext = createContext<ILoadingContext>({
  loadingState: defaultLoadingState,
});
