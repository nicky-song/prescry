// Copyright 2018 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { configureStore } from '../../store/store';
import { guestExperienceLogger } from '../guest-experience-logger.middleware';
import { rootReducer } from './root-reducer';

export type DispatchThunk<T> = (dispatch: Dispatch<T>) => void;

// pass an optional param to rehydrate state on app start
export const buildGuestExperienceStore = () =>
  configureStore(rootReducer, {}, [guestExperienceLogger()]);
