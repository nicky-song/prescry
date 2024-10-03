// Copyright 2023 Prescryptive Health, Inc.

import { IAddConsent } from '../../../../../models/air/add-consent.response';
import { addConsent } from '../../../api/membership/api-v1.add-consent';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { ISettings } from '../../../guest-experience-settings';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { IAddConsentAsyncActionArgs } from '../async-actions/add-consent.async-action';
import { addConsentDispatch } from './add-consent.dispatch';
import { setAddConsentDispatch } from './set-add-consent.dispatch';

jest.mock('../../../api/membership/api-v1.add-consent');
const addConsentMock = addConsent as jest.Mock;

jest.mock('../../../store/settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

jest.mock('./set-add-consent.dispatch');
const setAddConsentDispatchMock = setAddConsentDispatch as jest.Mock;

describe('addConsentDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    addConsentMock.mockResolvedValue({});
    tokenUpdateDispatchMock.mockResolvedValue(true);
  });

  it('makes API request', async () => {
    const accountIdMock = 'account-id-mock';
    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';
    const consentMock = true;

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
    addConsentMock.mockReturnValueOnce({});
    const argsMock: IAddConsentAsyncActionArgs = {
      accountId: accountIdMock,
      smartContractAddress: smartContractAddressMock,
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      consent: consentMock,
      membershipDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };
    await addConsentDispatch(argsMock);

    expect(addConsentMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      accountIdMock,
      smartContractAddressMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      consentMock,
      tokenMock,
      deviceTokenMock,
      undefined
    );
  });

  it('updates account token', async () => {
    const accountIdMock = 'account-id-mock';
    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';
    const consentMock = true;

    const refreshTokenMock = 'refresh-token';
    addConsentMock.mockResolvedValue({
      refreshToken: refreshTokenMock,
    });
    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig, settings: {} });

    const reduxDispatchMock = jest.fn();

    const argsMock: IAddConsentAsyncActionArgs = {
      accountId: accountIdMock,
      smartContractAddress: smartContractAddressMock,
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      consent: consentMock,
      membershipDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    await addConsentDispatch(argsMock);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      reduxDispatchMock,
      refreshTokenMock
    );
  });

  it('dispatches add consent on success', async () => {
    const accountIdMock = 'account-id-mock';
    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';
    const consentMock = true;

    const membershipDispatchMock = jest.fn();
    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig, settings: {} });
    const argsMock: IAddConsentAsyncActionArgs = {
      accountId: accountIdMock,
      smartContractAddress: smartContractAddressMock,
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      consent: consentMock,
      membershipDispatch: membershipDispatchMock,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    const addConsentResponseMock: IAddConsent = {
      success: true,
      error: '',
    };

    addConsentMock.mockReturnValueOnce({
      data: addConsentResponseMock,
    });

    await addConsentDispatch(argsMock);

    expect(setAddConsentDispatchMock).toHaveBeenCalledWith(
      membershipDispatchMock,
      addConsentResponseMock
    );
  });
});
