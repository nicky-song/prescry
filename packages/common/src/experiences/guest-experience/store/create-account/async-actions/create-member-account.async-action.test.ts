// Copyright 2021 Prescryptive Health, Inc.

import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { ErrorInternalServer } from '../../../../../errors/error-internal-server';
import { TooManyRequestError } from '../../../../../errors/error-too-many-requests';
import { SmsNotSupportedError } from '../../../../../errors/sms-not-supported.error';
import { IVerifyMembershipRequestBody } from '../../../../../models/api-request-body/verify-membership.request-body';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { handleTwilioErrorAction } from '../../error-handling.actions';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { verifyMembershipDispatch } from '../../identity-verification/dispatch/verify-membership.dispatch';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { sendOneTimeVerificationCodeDispatch } from '../../navigation/dispatch/sign-in/send-one-time-verification-code.dispatch';
import {
  createMemberAccountAsyncAction,
  ICreateMemberAccountAsyncActionArgs,
} from './create-member-account.async-action';

jest.mock('../../modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../../identity-verification/dispatch/verify-membership.dispatch');
const verifyMembershipDispatchMock = verifyMembershipDispatch as jest.Mock;

jest.mock(
  '../../navigation/dispatch/sign-in/send-one-time-verification-code.dispatch'
);
const sendOneTimeVerificationCodeDispatchMock =
  sendOneTimeVerificationCodeDispatch as jest.Mock;

jest.mock('../../error-handling.actions');
const handleTwilioErrorActionMock = handleTwilioErrorAction as jest.Mock;

jest.mock('../../error-handling/dispatch/internal-error.dispatch');
const internalErrorDispatchMock = internalErrorDispatch as jest.Mock;

describe('createMemberAccountAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('calls data loading', async () => {
    const dataLoadingAsyncMock = jest.fn();
    dataLoadingActionMock.mockReturnValue(dataLoadingAsyncMock);

    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    const argsMock: ICreateMemberAccountAsyncActionArgs = {
      account: {
        dateOfBirth: 'date-of-birth',
        email: 'email',
        firstName: 'first-name',
        lastName: 'last-name',
        isTermAccepted: true,
        phoneNumber: 'phone-number',
        primaryMemberRxId: 'primary-member-rx-id',
      },
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
      navigation: rootStackNavigationMock,
    };
    await createMemberAccountAsyncAction(argsMock);

    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      expect.any(Function),
      argsMock
    );
    expect(dataLoadingAsyncMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock
    );
  });

  it.each([[undefined], [true]])(
    'dispatches verify membership request (isBlockchain: %p)',
    async (isBlockchainMock?: boolean) => {
      const argsMock: ICreateMemberAccountAsyncActionArgs = {
        account: {
          dateOfBirth: 'date-of-birth',
          email: 'email',
          firstName: 'first-name',
          lastName: 'last-name',
          isTermAccepted: true,
          phoneNumber: 'phone-number',
          primaryMemberRxId: 'primary-member-rx-id',
          isBlockchain: isBlockchainMock,
        },
        reduxDispatch: jest.fn(),
        reduxGetState: jest.fn(),
        navigation: rootStackNavigationMock,
      };
      await createMemberAccountAsyncAction(argsMock);

      const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
      await asyncAction();

      const expectedArgs: IVerifyMembershipRequestBody = {
        dateOfBirth: argsMock.account.dateOfBirth,
        email: argsMock.account.email,
        firstName: argsMock.account.firstName,
        lastName: argsMock.account.lastName,
        phoneNumber: argsMock.account.phoneNumber,
        primaryMemberRxId: argsMock.account.primaryMemberRxId,
        isBlockchain: argsMock.account.isBlockchain,
      };

      expect(verifyMembershipDispatchMock).toHaveBeenCalledWith(
        argsMock.reduxGetState,
        rootStackNavigationMock,
        expectedArgs
      );
    }
  );

  it.each([[false], [true]])(
    'dispatches One-time verification code (isVerified: %p)',
    async (isVerifiedMock: boolean) => {
      verifyMembershipDispatchMock.mockResolvedValue(isVerifiedMock);

      const argsMock: ICreateMemberAccountAsyncActionArgs = {
        account: {
          dateOfBirth: 'date-of-birth',
          email: 'email',
          firstName: 'first-name',
          lastName: 'last-name',
          isTermAccepted: true,
          phoneNumber: 'phone-number',
          primaryMemberRxId: 'primary-member-rx-id',
        },
        reduxDispatch: jest.fn(),
        reduxGetState: jest.fn(),
        navigation: rootStackNavigationMock,
      };
      await createMemberAccountAsyncAction(argsMock);

      const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
      await asyncAction();

      if (isVerifiedMock) {
        expect(sendOneTimeVerificationCodeDispatchMock).toHaveBeenCalledWith(
          argsMock.account,
          'pbmActivate',
          argsMock.reduxGetState,
          argsMock.navigation
        );
      } else {
        expect(sendOneTimeVerificationCodeDispatchMock).not.toHaveBeenCalled();
      }
    }
  );

  it('handles bad request from one-time verification', async () => {
    verifyMembershipDispatchMock.mockResolvedValue(true);
    sendOneTimeVerificationCodeDispatchMock.mockImplementation(() => {
      throw new ErrorBadRequest('');
    });

    const argsMock: ICreateMemberAccountAsyncActionArgs = {
      account: {
        dateOfBirth: 'date-of-birth',
        email: 'email',
        firstName: 'first-name',
        lastName: 'last-name',
        isTermAccepted: true,
        phoneNumber: 'phone-number',
        primaryMemberRxId: 'primary-member-rx-id',
      },
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await createMemberAccountAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);

    try {
      await asyncAction();
      fail('Expected exception but none thrown!');
    } catch (error) {
      expect(error).toEqual(new SmsNotSupportedError());
    }
  });

  it('handles too many requests from one-time verification', async () => {
    verifyMembershipDispatchMock.mockResolvedValue(true);

    const tooManyRequestsMessageMock = 'too-many-requests-message';
    sendOneTimeVerificationCodeDispatchMock.mockImplementation(() => {
      throw new TooManyRequestError(tooManyRequestsMessageMock);
    });

    const reduxDispatchMock = jest.fn();
    const argsMock: ICreateMemberAccountAsyncActionArgs = {
      account: {
        dateOfBirth: 'date-of-birth',
        email: 'email',
        firstName: 'first-name',
        lastName: 'last-name',
        isTermAccepted: true,
        phoneNumber: 'phone-number',
        primaryMemberRxId: 'primary-member-rx-id',
      },
      reduxDispatch: reduxDispatchMock,
      reduxGetState: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await createMemberAccountAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction();

    expect(handleTwilioErrorActionMock).toHaveBeenLastCalledWith(
      reduxDispatchMock,
      argsMock.navigation,
      tooManyRequestsMessageMock
    );
  });

  it('handles other errors from one-time verification', async () => {
    verifyMembershipDispatchMock.mockResolvedValue(true);

    const internalErrorMock = new ErrorInternalServer('error');
    sendOneTimeVerificationCodeDispatchMock.mockImplementation(() => {
      throw internalErrorMock;
    });

    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();
    const argsMock: ICreateMemberAccountAsyncActionArgs = {
      account: {
        dateOfBirth: 'date-of-birth',
        email: 'email',
        firstName: 'first-name',
        lastName: 'last-name',
        isTermAccepted: true,
        phoneNumber: 'phone-number',
        primaryMemberRxId: 'primary-member-rx-id',
      },
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };
    await createMemberAccountAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction();

    expect(internalErrorDispatchMock).toHaveBeenLastCalledWith(
      argsMock.navigation,
      internalErrorMock
    );
  });
});
