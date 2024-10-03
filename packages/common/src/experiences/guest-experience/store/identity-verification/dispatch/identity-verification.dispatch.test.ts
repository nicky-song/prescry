// Copyright 2021 Prescryptive Health, Inc.

import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { ErrorMaxVerificationAttempt } from '../../../../../errors/error-max-verification-attempts';
import { IVerifyIdentityRequestBody } from '../../../../../models/api-request-body/verify-identity.request-body';
import { IApiConfig } from '../../../../../utils/api.helper';
import { verifyIdentity } from '../../../api/api-v1.verify-identity';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { RootState } from '../../root-reducer';
import { accountTokenClearDispatch } from '../../settings/dispatch/account-token-clear.dispatch';
import { setIdentityVerificationDataAction } from '../actions/set-identity-verification-data.action';
import { identityVerificationDispatch } from './identity-verification.dispatch';

jest.mock('../../../../../errors/error-bad-request');
jest.mock('../../../api/api-v1.verify-identity');
jest.mock('../actions/set-identity-verification-data.action');
jest.mock('../../error-handling/dispatch/internal-error.dispatch');
jest.mock('../../settings/dispatch/account-token-clear.dispatch');
jest.mock('../../../guest-experience-logger.middleware');

const verifyIdentityMock = verifyIdentity as jest.Mock;
const accountTokenClearDispatchMock = accountTokenClearDispatch as jest.Mock;
const internalErrorDispatchMock = internalErrorDispatch as jest.Mock;
const setIdentityVerificationDataActionMock =
  setIdentityVerificationDataAction as jest.Mock;

const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

const apiMock = {} as IApiConfig;
const identityVerificationRequestBodyMock = {} as IVerifyIdentityRequestBody;

describe('identityVerificationDispatch', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('returns and navigates correctly when data is valid', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn(() => {
      return {
        config: { apis: { guestExperienceApi: apiMock } },
        settings: { deviceToken: 'test-device-token', token: 'test-token' },
      } as unknown as RootState;
    });
    const responseMock = {
      data: {
        maskedPhoneNumber: '(XXX) XXX-1234',
        maskedEmailAddress: 'e***l@email.com',
      },
      status: 'success',
    };
    setIdentityVerificationDataActionMock.mockReturnValue('Test value');
    verifyIdentityMock.mockResolvedValue(responseMock);
    await identityVerificationDispatch(
      rootStackNavigationMock,
      dispatchMock,
      getStateMock,
      identityVerificationRequestBodyMock
    );
    expect(verifyIdentityMock).toBeCalledWith(
      apiMock,
      identityVerificationRequestBodyMock,
      'test-device-token',
      'test-token'
    );
    expect(setIdentityVerificationDataActionMock).toBeCalledWith({
      maskedPhoneNumber: responseMock.data.maskedPhoneNumber,
      maskedEmail: responseMock.data.maskedEmailAddress,
    });
    expect(rootStackNavigationMock.navigate).toBeCalledWith(
      'VerifyIdentitySendCode'
    );
  });
  it('handles thrown ErrorBadRequest correctly', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn(() => {
      return {
        config: { apis: { guestExperienceApi: apiMock } },
        settings: { deviceToken: 'test-device-token', token: 'test-token' },
      } as unknown as RootState;
    });
    const badRequestErrorMock = new ErrorBadRequest('test-error-message');
    verifyIdentityMock.mockImplementation(() => {
      throw badRequestErrorMock;
    });
    try {
      await identityVerificationDispatch(
        rootStackNavigationMock,
        dispatchMock,
        getStateMock,
        identityVerificationRequestBodyMock
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(badRequestErrorMock);
    }
    expect(verifyIdentityMock).toBeCalledWith(
      apiMock,
      identityVerificationRequestBodyMock,
      'test-device-token',
      'test-token'
    );
  });
  it('handles thrown ErrorMaxVerificationAttempt correctly', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn(() => {
      return {
        config: { apis: { guestExperienceApi: apiMock } },
        settings: { deviceToken: 'test-device-token', token: 'test-token' },
      } as unknown as RootState;
    });
    const maxVerificationAttemptsErrorMock = new ErrorMaxVerificationAttempt(
      'test-error-message',
      true
    );
    verifyIdentityMock.mockImplementation(() => {
      throw maxVerificationAttemptsErrorMock;
    });
    await identityVerificationDispatch(
      rootStackNavigationMock,
      dispatchMock,
      getStateMock,
      identityVerificationRequestBodyMock
    );
    expect(verifyIdentityMock).toBeCalledWith(
      apiMock,
      identityVerificationRequestBodyMock,
      'test-device-token',
      'test-token'
    );
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.REACHED_MAX_IDENTITY_VERIFICATION_ATTEMPTS,
      {}
    );
    expect(accountTokenClearDispatchMock).toBeCalledWith(dispatchMock);
    expect(rootStackNavigationMock.navigate).toBeCalledWith('AccountLocked', {
      accountLockedResponse: true,
    });
  });
  it('handles thrown Error correctly', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn(() => {
      return {
        config: { apis: { guestExperienceApi: apiMock } },
        settings: { deviceToken: 'test-device-token', token: 'test-token' },
      } as unknown as RootState;
    });
    const errorMock = {
      message: 'test-error-message',
    } as Error;
    verifyIdentityMock.mockImplementation(() => {
      throw errorMock;
    });
    await identityVerificationDispatch(
      rootStackNavigationMock,
      dispatchMock,
      getStateMock,
      identityVerificationRequestBodyMock
    );
    expect(verifyIdentityMock).toBeCalledWith(
      apiMock,
      identityVerificationRequestBodyMock,
      'test-device-token',
      'test-token'
    );
    expect(dispatchMock).not.toBeCalled();
    expect(internalErrorDispatchMock).toBeCalledWith(
      rootStackNavigationMock,
      errorMock
    );
  });
});
