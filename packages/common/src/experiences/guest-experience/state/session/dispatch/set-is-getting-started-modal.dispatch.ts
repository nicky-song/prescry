// Copyright 2021 Prescryptive Health, Inc.

import { setIsGettingStartedModalOpenAction } from '../actions/set-is-getting-started-modal-open.action';
import { SessionDispatch } from './session.dispatch';

export const setIsGettingStartedModalOpenDispatch = (
  dispatch: SessionDispatch,
  isGettingStartedModalOpen: boolean
): void => {
  dispatch(setIsGettingStartedModalOpenAction(isGettingStartedModalOpen));
};
