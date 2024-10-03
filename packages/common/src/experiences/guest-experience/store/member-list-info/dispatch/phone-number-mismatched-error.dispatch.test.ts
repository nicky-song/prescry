// Copyright 2018 Prescryptive Health, Inc.

import { phoneNumberMismatchedErrorDispatch } from './phone-number-mismatched-error.dispatch';
import { handleAuthenticationErrorAction } from '../../error-handling.actions';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../error-handling.actions', () => ({
  handleAuthenticationErrorAction: jest.fn(),
}));

const handleAuthenticationErrorActionMock =
  handleAuthenticationErrorAction as jest.Mock;

beforeEach(() => {
  handleAuthenticationErrorActionMock.mockReset();
});

describe('phoneNumberMismatchedErrorDispatch', () => {
  it('dispatches authentication error action if no phone number', async () => {
    const dispatch = jest.fn();
    await phoneNumberMismatchedErrorDispatch(dispatch, rootStackNavigationMock);
    expect(handleAuthenticationErrorAction).toHaveBeenNthCalledWith(
      1,
      dispatch,
      rootStackNavigationMock
    );
  });
});
