// Copyright 2021 Prescryptive Health, Inc.

import { ISessionAction } from './session.action';

export type ISetIsGettingStartedModalOpenAction = ISessionAction<
  'SET_IS_GETTING_STARTED_MODAL_OPEN'
>;

export const setIsGettingStartedModalOpenAction = (
  isGettingStartedModalOpen: boolean
): ISetIsGettingStartedModalOpenAction => ({
  type: 'SET_IS_GETTING_STARTED_MODAL_OPEN',
  payload: {
    isGettingStartedModalOpen,
  },
});
