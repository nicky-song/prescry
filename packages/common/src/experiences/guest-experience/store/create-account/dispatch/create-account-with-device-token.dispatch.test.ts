// Copyright 2021 Prescryptive Health, Inc.

import { InternalResponseCode } from '../../../../../errors/error-codes';
import { ILoginRequestBody } from '../../../../../models/api-request-body/login.request-body';
import { Workflow } from '../../../../../models/workflow';
import { loginUser } from '../../../api/api-v1';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { ICreatePinScreenRouteProps } from './../../../create-pin-screen/create-pin-screen';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { ICreateAccountDeviceTokenAsyncActionArgs } from '../async-actions/create-account-with-device-token.async-action';
import { createAccountWithDeviceTokenDispatch } from './create-account-with-device-token.dispatch';

jest.mock('../../../api/api-v1');
const loginUserMock = loginUser as jest.Mock;

describe('createAccountWithDeviceTokenDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    loginUserMock.mockReturnValue({
      message: '',
      responseCode: InternalResponseCode.REQUIRE_USER_SET_PIN,
      status: 'success',
    });
  });

  const configMock = GuestExperienceConfig;
  const reduxGetStateMock = jest.fn().mockReturnValue({
    config: configMock,
    settings: { deviceToken: 'device-token' },
  });
  const accountMock: ILoginRequestBody = {
    dateOfBirth: 'January-15-1947',
    firstName: 'fake firstName',
    lastName: 'fake lastName',
    accountRecoveryEmail: 'test@test.com',
  };
  const reduxDispatchMock = jest.fn();
  const workflowMock: Workflow = 'startSaving';
  const argsMock: ICreateAccountDeviceTokenAsyncActionArgs = {
    account: accountMock,
    workflow: workflowMock,
    reduxDispatch: reduxDispatchMock,
    reduxGetState: reduxGetStateMock,
    navigation: rootStackNavigationMock,
  };

  it('makes API request', async () => {
    await createAccountWithDeviceTokenDispatch(argsMock);
    expect(loginUserMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      argsMock.account,
      'device-token'
    );
  });

  it('dispatches createPinNavigateDispatch', async () => {
    await createAccountWithDeviceTokenDispatch(argsMock);
    const expectedCreatePinParams: ICreatePinScreenRouteProps = {
      workflow: workflowMock,
    };
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'CreatePin',
      expectedCreatePinParams
    );
  });
});
