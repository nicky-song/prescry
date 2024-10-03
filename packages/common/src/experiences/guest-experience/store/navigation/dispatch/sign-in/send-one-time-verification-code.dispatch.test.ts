// Copyright 2021 Prescryptive Health, Inc.

import { ICreateAccount } from '../../../../../../models/create-account';
import { Workflow } from '../../../../../../models/workflow';

import { sendOneTimePassword } from '../../../../api/api-v1';
import { GuestExperienceConfig } from '../../../../guest-experience-config';
import { rootStackNavigationMock } from '../../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IPhoneNumberVerificationScreenRouteProps } from '../../../../phone-number-verification-screen/phone-number-verification-screen';
import { phoneNumberVerificationNavigateDispatch } from './phone-number-verification-navigate.dispatch';
import { sendOneTimeVerificationCodeDispatch } from './send-one-time-verification-code.dispatch';

jest.mock('../../../../api/api-v1');
const sendOneTimePasswordMock = sendOneTimePassword as jest.Mock;

jest.mock('./phone-number-verification-navigate.dispatch');
const phoneNumberVerificationNavigateDispatchMock =
  phoneNumberVerificationNavigateDispatch as jest.Mock;

describe('sendOneTimeVerificationCodeDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sendOneTimePasswordMock.mockReturnValue({
      data: {},
    });
  });

  it('makes API request, calls navigate phone verificationdispatch', async () => {
    const phoneMock = '123.456.7890';
    const phoneMockWithCountryCode = '+11234567890';
    const workflowMock: Workflow = 'prescriptionTransfer';

    const accountMock: ICreateAccount = {
      firstName: 'Johnny',
      lastName: 'AppleSeed',
      email: 'test@test.com',
      dateOfBirth: 'January-01-2010',
      phoneNumber: phoneMock,
      isTermAccepted: true,
    };
    const configMock = GuestExperienceConfig;

    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: configMock, settings: {}, features: {} });
    const expectedPhoneVerificationScreenParams: IPhoneNumberVerificationScreenRouteProps =
      {
        account: { ...accountMock, phoneNumber: phoneMock },
        workflow: workflowMock,
        phoneNumber: phoneMock,
      };
    await sendOneTimeVerificationCodeDispatch(
      accountMock,
      workflowMock,
      reduxGetStateMock,
      rootStackNavigationMock
    );

    expect(sendOneTimePasswordMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      phoneMockWithCountryCode,
      undefined
    );
    expect(phoneNumberVerificationNavigateDispatchMock).toBeCalledWith(
      rootStackNavigationMock,
      expectedPhoneVerificationScreenParams
    );
  });

  it('makes API request using countrycode', async () => {
    const workflowMock: Workflow = 'prescriptionTransfer';
    const phoneMock = '123.456.7890';
    const phoneMockWithAlternateCountryCode = '+911234567890';

    const accountMock: ICreateAccount = {
      firstName: 'Johnny',
      lastName: 'AppleSeed',
      email: 'test@test.com',
      dateOfBirth: 'January-01-2010',
      phoneNumber: phoneMock,
      isTermAccepted: true,
    };
    const configMock = GuestExperienceConfig;
    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: configMock,
      settings: {},
      features: { usecountrycode: true },
    });
    const expectedPhoneVerificationScreenParams: IPhoneNumberVerificationScreenRouteProps =
      {
        account: {
          ...accountMock,
          phoneNumber: phoneMock,
        },
        workflow: workflowMock,
        phoneNumber: phoneMock,
      };
    await sendOneTimeVerificationCodeDispatch(
      accountMock,
      workflowMock,
      reduxGetStateMock,
      rootStackNavigationMock
    );

    expect(sendOneTimePasswordMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      phoneMockWithAlternateCountryCode,
      undefined
    );
    expect(phoneNumberVerificationNavigateDispatchMock).toBeCalledWith(
      rootStackNavigationMock,
      expectedPhoneVerificationScreenParams
    );
  });

  it('does not dispatch phoneVerificationNavigateDispatch if API fails', async () => {
    const accountMock: ICreateAccount = {
      firstName: 'Johnny',
      lastName: 'AppleSeed',
      email: 'test@test.com',
      dateOfBirth: 'January-01-2010',
      phoneNumber: '123.456.7890',
      isTermAccepted: true,
    };
    const configMock = GuestExperienceConfig;
    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: configMock,
      settings: {},
      features: {},
    });
    const errorMock = new Error('Error');
    sendOneTimePasswordMock.mockImplementation(() => {
      throw errorMock;
    });

    try {
      await sendOneTimeVerificationCodeDispatch(
        accountMock,
        'prescriptionTransfer',
        reduxGetStateMock,
        rootStackNavigationMock
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(errorMock);
    }
    expect(phoneNumberVerificationNavigateDispatchMock).not.toHaveBeenCalled();
  });
});
