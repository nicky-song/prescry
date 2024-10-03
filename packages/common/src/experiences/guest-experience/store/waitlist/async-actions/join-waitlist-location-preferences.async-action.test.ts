// Copyright 2021 Prescryptive Health, Inc.

import { joinWaitlistLocationPreferencesDispatch } from '../dispatch/join-waitlist-location-preferences.dispatch';
import { joinWaitlistLocationPreferencesAsyncAction } from './join-waitlist-location-preferences.async-action';

jest.mock('../dispatch/join-waitlist-location-preferences.dispatch');
const joinWaitlistLocationPreferencesDispatchMock =
  joinWaitlistLocationPreferencesDispatch as jest.Mock;

const getStateMock = jest.fn();
const dispatchMock = jest.fn();
const zipCode = '12345';
const distance = 10;

describe('joinWaitlistLocationPreferencesAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls joinWaitlistLocationPreferencesDispatch as expected', () => {
    const asyncAction = joinWaitlistLocationPreferencesAsyncAction(
      zipCode,
      distance
    );

    asyncAction(dispatchMock, getStateMock);

    expect(joinWaitlistLocationPreferencesDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      zipCode,
      distance
    );
  });
});
