// Copyright 2021 Prescryptive Health, Inc.

import { ISessionState } from '../session.state';
import { setIsGettingStartedModalOpenAction } from './set-is-getting-started-modal-open.action';

describe('setIsGettingStartedModalOpenAction', () => {
  it('returns action', () => {
    const isGettingStartedModalOpenMock = false;

    const action = setIsGettingStartedModalOpenAction(
      isGettingStartedModalOpenMock
    );

    expect(action.type).toEqual('SET_IS_GETTING_STARTED_MODAL_OPEN');

    const expectedPayload: Partial<ISessionState> = {
      isGettingStartedModalOpen: isGettingStartedModalOpenMock,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});
