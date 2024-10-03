// Copyright 2021 Prescryptive Health, Inc.

import { joinWaitlistResetErrorAction } from '../actions/join-waitlist-reset-error.action';
import { joinWaitlistResetErrorDispatch } from './join-waitlist-reset-error.dispatch';

jest.mock('../actions/join-waitlist-reset-error.action');
const joinWaitlistResetErrorActionMock =
  joinWaitlistResetErrorAction as jest.Mock;

describe('joinWaitlistResetErrorDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches joinWaitlistResetErrorAction', () => {
    const dispatchMock = jest.fn();

    joinWaitlistResetErrorDispatch(dispatchMock);

    expect(dispatchMock).toHaveBeenCalled();
    expect(joinWaitlistResetErrorActionMock).toHaveBeenCalled();
  });
});
