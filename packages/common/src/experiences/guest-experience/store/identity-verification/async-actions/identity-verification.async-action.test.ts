// Copyright 2021 Prescryptive Health, Inc.

import { IVerifyIdentityRequestBody } from '../../../../../models/api-request-body/verify-identity.request-body';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { identityVerificationDispatch } from '../dispatch/identity-verification.dispatch';
import {
  identityVerificationAsyncAction,
  IIdentityVerificationAsyncActionArgs,
} from './identity-verification.async-action';

jest.mock('../dispatch/identity-verification.dispatch');

const identityVerificationDispatchMock =
  identityVerificationDispatch as jest.Mock;

describe('identityVerificationAsyncAction', () => {
  beforeEach(() => {
    identityVerificationDispatchMock.mockReset();
  });
  it('returns true when dispatch works correctly', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const requestBodyMock = {
      phoneNumber: 'phone',
      emailAddress: 'test@test.com',
      dateOfBirth: 'dob',
    } as IVerifyIdentityRequestBody;
    const args: IIdentityVerificationAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      requestBody: requestBodyMock,
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
    };
    await identityVerificationAsyncAction(args)();
    expect(identityVerificationDispatchMock).toBeCalledWith(
      rootStackNavigationMock,
      dispatchMock,
      getStateMock,
      requestBodyMock
    );
  });
});
