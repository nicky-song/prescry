// Copyright 2021 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '../../../../../testing/test.helper';
import { joinWaitlistResetErrorDispatch } from '../dispatch/join-waitlist-reset-error.dispatch';
import { joinWaitlistResetErrorAsyncAction } from './join-waitlist-reset-error.async-action';

jest.mock('../dispatch/join-waitlist-reset-error.dispatch');
const joinWaitlistResetErrorDispatchMock =
  joinWaitlistResetErrorDispatch as jest.Mock;

describe('joinWaitlistResetErrorAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls joinWaitlistResetErrorDispatch as expected', () => {
    const dispatchMock = jest.fn();

    const asyncAction = joinWaitlistResetErrorAsyncAction();

    asyncAction(dispatchMock, jest.fn());

    expectToHaveBeenCalledOnceOnlyWith(
      joinWaitlistResetErrorDispatchMock,
      dispatchMock
    );
  });
});
