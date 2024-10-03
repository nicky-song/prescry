// Copyright 2023 Prescryptive Health, Inc.

import { IValidateIdentity } from '../../../../../models/air/validate-identity.response';
import { validateIdentity } from '../../../api/membership/api-v1.validate-identity';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { ISettings } from '../../../guest-experience-settings';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { IValidateIdentityAsyncActionArgs } from '../async-actions/validate-identity.async-action';
import { setValidateIdentityDispatch } from './set-validate-identity.dispatch';
import { validateIdentityDispatch } from './validate-identity.dispatch';

jest.mock('../../../api/membership/api-v1.validate-identity');
const validateIdentityMock = validateIdentity as jest.Mock;

jest.mock('../../../store/settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

jest.mock('./set-validate-identity.dispatch');
const setValidateIdentityDispatchMock =
  setValidateIdentityDispatch as jest.Mock;

describe('validateIdentityDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    validateIdentityMock.mockResolvedValue({});
    tokenUpdateDispatchMock.mockResolvedValue(true);
  });

  it('makes API request', async () => {
    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';

    const tokenMock = 'token';
    const deviceTokenMock = 'device-token';
    const settingsMock: Partial<ISettings> = {
      token: tokenMock,
      deviceToken: deviceTokenMock,
    };

    const configMock = GuestExperienceConfig;

    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: configMock, settings: settingsMock });
    validateIdentityMock.mockReturnValueOnce({});
    const argsMock: IValidateIdentityAsyncActionArgs = {
      smartContractAddress: smartContractAddressMock,
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      membershipDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };
    await validateIdentityDispatch(argsMock);

    expect(validateIdentityMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      smartContractAddressMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      tokenMock,
      deviceTokenMock,
      undefined
    );
  });

  it('updates account token', async () => {
    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';

    const refreshTokenMock = 'refresh-token';
    validateIdentityMock.mockResolvedValue({
      refreshToken: refreshTokenMock,
    });
    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig, settings: {} });

    const reduxDispatchMock = jest.fn();

    const argsMock: IValidateIdentityAsyncActionArgs = {
      smartContractAddress: smartContractAddressMock,
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      membershipDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    await validateIdentityDispatch(argsMock);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      reduxDispatchMock,
      refreshTokenMock
    );
  });

  it('dispatches validate identity on success', async () => {
    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';

    const membershipDispatchMock = jest.fn();
    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig, settings: {} });
    const argsMock: IValidateIdentityAsyncActionArgs = {
      smartContractAddress: smartContractAddressMock,
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      membershipDispatch: membershipDispatchMock,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    const validateIdentityResponseMock: IValidateIdentity = {
      success: true,
      error: '',
    };

    validateIdentityMock.mockReturnValueOnce({
      data: validateIdentityResponseMock,
    });

    await validateIdentityDispatch(argsMock);

    expect(setValidateIdentityDispatchMock).toHaveBeenCalledWith(
      membershipDispatchMock,
      validateIdentityResponseMock
    );
  });
});
