// Copyright 2022 Prescryptive Health, Inc.

import { verifyPrescription } from '../../../api/api-v1.verify-prescription';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { verifyPrescriptionDispatch } from './verify-prescription.dispatch';
import { IPrescriptionVerificationResponse } from '../../../../../models/api-response/prescription-verification-response';
import { IVerifyPrescriptionAsyncActionArgs } from '../../create-account/async-actions/verify-prescription.async-action';
import { handleTwilioErrorAction } from '../../error-handling.actions';
import { phoneNumberVerificationNavigateDispatch } from '../../navigation/dispatch/sign-in/phone-number-verification-navigate.dispatch';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { IVerifyPrescriptionRequestBody } from '../../../../../models/api-request-body/verify-prescription.request-body';
import { TooManyRequestError } from '../../../../../errors/error-too-many-requests';
import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { ErrorInternalServer } from '../../../../../errors/error-internal-server';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../../api/api-v1.verify-prescription');
const verifyPrescriptionMock = verifyPrescription as jest.Mock;

jest.mock('../../error-handling/dispatch/internal-error.dispatch');
const internalErrorDispatchMock = internalErrorDispatch as jest.Mock;

jest.mock(
  '../../navigation/dispatch/sign-in/phone-number-verification-navigate.dispatch'
);
const phoneNumberVerificationNavigateDispatchMock =
  phoneNumberVerificationNavigateDispatch as jest.Mock;

jest.mock('../../error-handling.actions');
const handleTwilioErrorActionMock = handleTwilioErrorAction as jest.Mock;

const prescriptionVerificationResponse: IPrescriptionVerificationResponse = {
  data: {
    phoneNumber: '+11234567890',
  },
  message: 'test',
  status: 'test-status',
};

describe('verifyPrescriptionDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    verifyPrescriptionMock.mockReturnValue(prescriptionVerificationResponse);
  });

  it.each([[undefined], [true]])(
    'calls API with expected arguments when blockchain is %p',
    async (blockchainMock?: boolean) => {
      const dispatchMock = jest.fn();
      const getStateMock = jest
        .fn()
        .mockReturnValue({ config: GuestExperienceConfig });
      const argsMock: IVerifyPrescriptionAsyncActionArgs = {
        account: {
          firstName: 'first-name',
          lastName: 'last-name',
          email: 'test@test.com',
          dateOfBirth: 'January-10-2010',
          isTermAccepted: true,
          prescriptionId: 'prescription-id',
        },
        workflow: 'prescriptionInvite',
        navigation: rootStackNavigationMock,
        reduxDispatch: dispatchMock,
        reduxGetState: getStateMock,
        blockchain: blockchainMock,
      };

      await verifyPrescriptionDispatch(argsMock);
      const verifyPrescriptionArgs: IVerifyPrescriptionRequestBody = {
        firstName: argsMock.account.firstName,
        lastName: argsMock.account.lastName,
        dateOfBirth: argsMock.account.dateOfBirth,
        blockchain: argsMock.blockchain,
      };
      expect(verifyPrescriptionMock).toHaveBeenCalledWith(
        GuestExperienceConfig.apis.guestExperienceApi,
        verifyPrescriptionArgs,
        'prescription-id'
      );
    }
  );
  it('dispatches to phoneNumberVerificationScreen when API returns success response', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig });
    const argsMock: IVerifyPrescriptionAsyncActionArgs = {
      account: {
        firstName: 'first-name',
        lastName: 'last-name',
        email: 'test@test.com',
        dateOfBirth: 'January-10-2010',
        isTermAccepted: true,
        prescriptionId: 'prescription-id',
      },
      workflow: 'prescriptionInvite',
      navigation: rootStackNavigationMock,
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
      blockchain: true,
    };

    await verifyPrescriptionDispatch(argsMock);
    expect(phoneNumberVerificationNavigateDispatchMock).toBeCalledWith(
      rootStackNavigationMock,
      {
        account: {
          ...argsMock.account,
          phoneNumber: '+11234567890',
          isBlockchain: true,
        },
        phoneNumber: '+11234567890',
        workflow: 'prescriptionInvite',
      }
    );
  });

  it('re-throws errors', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig });
    const argsMock: IVerifyPrescriptionAsyncActionArgs = {
      account: {
        firstName: 'first-name',
        lastName: 'last-name',
        email: 'test@test.com',
        dateOfBirth: 'January-10-2010',
        isTermAccepted: true,
        prescriptionId: 'prescription-id',
      },
      workflow: 'prescriptionInvite',
      navigation: rootStackNavigationMock,
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
    };

    const errorMock = new ErrorBadRequest('bad request');
    verifyPrescriptionMock.mockImplementationOnce(() => {
      throw errorMock;
    });

    try {
      await verifyPrescriptionDispatch(argsMock);
      fail('Expected exception but none thrown!');
    } catch (error) {
      expect(error).toEqual(errorMock);
    }
  });

  it('dispatches to support error screen in case of twilio errors', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig });
    const argsMock: IVerifyPrescriptionAsyncActionArgs = {
      account: {
        firstName: 'first-name',
        lastName: 'last-name',
        email: 'test@test.com',
        dateOfBirth: 'January-10-2010',
        isTermAccepted: true,
        prescriptionId: 'prescription-id',
      },
      workflow: 'prescriptionInvite',
      navigation: rootStackNavigationMock,
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
    };

    const errorMock = new TooManyRequestError('too many requests');
    verifyPrescriptionMock.mockImplementationOnce(() => {
      throw errorMock;
    });

    await verifyPrescriptionDispatch(argsMock);
    expect(handleTwilioErrorActionMock).toBeCalledWith(
      dispatchMock,
      rootStackNavigationMock,
      'too many requests'
    );
  });
  it('handles internal server error', async () => {
    const dispatchMock = jest.fn();

    const getStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig });

    const errorMock = new ErrorInternalServer('Nope on a rope!');
    verifyPrescriptionMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IVerifyPrescriptionAsyncActionArgs = {
      account: {
        firstName: 'first-name',
        lastName: 'last-name',
        email: 'test@test.com',
        dateOfBirth: 'January-10-2010',
        isTermAccepted: true,
        prescriptionId: 'prescription-id',
      },
      workflow: 'prescriptionInvite',
      navigation: rootStackNavigationMock,
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
    };

    await verifyPrescriptionDispatch(argsMock);
    expect(internalErrorDispatchMock).toHaveBeenCalledWith(
      argsMock.navigation,
      errorMock
    );
  });
});
