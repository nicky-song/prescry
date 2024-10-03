// Copyright 2020 Prescryptive Health, Inc.

import { verifySessionDispatch } from './verify-session.dispatch';

import { getSession } from '../../../api/api-v1.session';
import { dispatchResetStackToPhoneLoginScreen } from '../../navigation/navigation-reducer.actions';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import {
  GuestExperienceConfig,
  IGuestExperienceConfig,
} from '../../../guest-experience-config';
import { RootState } from '../../root-reducer';
import { ISettings } from '../../../guest-experience-settings';
import { setUserAuthenticatedAction } from '../../secure-pin/secure-pin-reducer.actions';
import { ILocation } from '../../../../../utils/api.helper';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { getClaimAlertOrPrescriptionIdFromUrl } from '../../../../../utils/claimalert-prescription.helper';
import { IFeaturesState } from '../../../guest-experience-features';

jest.mock('../../navigation/navigation-reducer.actions');
const dispatchResetStackToPhoneLoginScreenMock =
  dispatchResetStackToPhoneLoginScreen as jest.Mock;

jest.mock('../../../../../utils/claimalert-prescription.helper');
const getClaimAlertPrescriptionInfoMock =
  getClaimAlertOrPrescriptionIdFromUrl as jest.Mock;
jest.mock('../../../api/api-v1.session');
const getSessionMock = getSession as jest.Mock;

jest.mock('../../error-handling/dispatch/internal-error.dispatch');
const internalErrorDispatchMock = internalErrorDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/sign-in/login-pin-navigate.dispatch');

jest.mock('../../secure-pin/secure-pin-reducer.actions');
const setUserAuthenticatedActionMock = setUserAuthenticatedAction as jest.Mock;
const settingsMock: ISettings = {
  deviceToken: 'device-token',
  isDeviceRestricted: false,
  lastZipCode: 'unknown',
  token: 'mock-token',
};
const configMock: IGuestExperienceConfig = {
  ...GuestExperienceConfig,
};
const stateMock: Partial<RootState> = {
  config: configMock,
  features: {} as IFeaturesState,
  settings: settingsMock,
};

describe('verifySessionDispatch', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    setUserAuthenticatedActionMock.mockImplementation(() => false);
    getClaimAlertPrescriptionInfoMock.mockReturnValue(undefined);
  });

  it('should return session redirected false if session is valid', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
    });
    setUserAuthenticatedActionMock.mockImplementation(() => true);
    getSessionMock.mockResolvedValueOnce({ responseCode: 'SESSION_VALID' });
    const sessionStatusInvalid = await verifySessionDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );

    expect(sessionStatusInvalid).toBe(false);
    expect(dispatch).toHaveBeenLastCalledWith(true);
    expect(dispatchResetStackToPhoneLoginScreenMock).not.toHaveBeenCalled();
    expect(rootStackNavigationMock.navigate).not.toHaveBeenCalled();
  });

  it('should return session redirected true if account token is expired', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
    });
    getSessionMock.mockResolvedValueOnce({
      responseCode: 'REQUIRE_USER_VERIFY_PIN',
    });
    const sessionStatusInvalid = await verifySessionDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );

    expect(sessionStatusInvalid).toBe(true);
    expect(dispatch).toHaveBeenLastCalledWith(false);
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'LoginPin',
      {}
    );
    expect(dispatchResetStackToPhoneLoginScreenMock).not.toHaveBeenCalled();
    expect(rootStackNavigationMock.navigate).not.toHaveBeenCalledWith(
      'CreatePin',
      {}
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
  });

  it('should return session redirected true if account token is not set', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
    });
    getSessionMock.mockResolvedValueOnce({
      responseCode: 'REQUIRE_USER_SET_PIN',
    });
    const sessionStatusInvalid = await verifySessionDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );

    expect(sessionStatusInvalid).toBe(true);
    expect(dispatch).toHaveBeenLastCalledWith(false);
    expect(dispatchResetStackToPhoneLoginScreenMock).not.toHaveBeenCalled();
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'CreatePin',
      {}
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
  });

  it('should return session redirected true and dispatch to login screen if user has not registered', async () => {
    const dispatchMock = jest.fn();
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
    });
    getSessionMock.mockResolvedValueOnce({
      responseCode: 'REQUIRE_USER_REGISTRATION',
    });
    const sessionStatusInvalid = await verifySessionDispatch(
      dispatchMock,
      getState,
      rootStackNavigationMock
    );

    expect(sessionStatusInvalid).toBe(true);
    expect(dispatchMock).toHaveBeenLastCalledWith(false);
    expect(dispatchResetStackToPhoneLoginScreenMock).not.toHaveBeenCalled();
    expect(rootStackNavigationMock.navigate).not.toHaveBeenCalledWith(
      'CreatePin',
      {}
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith('Login', {});
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
  });

  it('should return session redirected true and pass claim alert id to login screen if user has not registered', async () => {
    const dispatchMock = jest.fn();
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
      features: {},
      config: { ...configMock, location: { pathname: 'test-claim-id' } },
    });
    getSessionMock.mockResolvedValueOnce({
      responseCode: 'REQUIRE_USER_REGISTRATION',
    });
    getClaimAlertPrescriptionInfoMock.mockReturnValueOnce({
      claimAlertId: 'test-claim-id',
    });
    const sessionStatusInvalid = await verifySessionDispatch(
      dispatchMock,
      getState,
      rootStackNavigationMock
    );

    expect(sessionStatusInvalid).toBe(true);
    expect(dispatchMock).toHaveBeenLastCalledWith(false);
    expect(dispatchResetStackToPhoneLoginScreenMock).not.toHaveBeenCalled();
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith('Login', {
      claimAlertId: 'test-claim-id',
    });
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
  });

  it.each([[undefined], [true]])(
    'should return session redirected true and pass prescription id to login screen if user has not registered (isBlockchain: %p)',
    async (isBlockchainMock?: boolean) => {
      const dispatchMock = jest.fn();
      const getState = jest.fn().mockReturnValue({
        ...stateMock,
        features: {},
        config: { ...configMock, location: { pathname: 'test-claim-id' } },
      });
      getSessionMock.mockResolvedValueOnce({
        responseCode: 'REQUIRE_USER_REGISTRATION',
      });
      getClaimAlertPrescriptionInfoMock.mockReturnValueOnce({
        prescriptionId: 'prescription-id',
        isBlockchain: isBlockchainMock,
      });
      const sessionStatusInvalid = await verifySessionDispatch(
        dispatchMock,
        getState,
        rootStackNavigationMock
      );

      expect(sessionStatusInvalid).toBe(true);
      expect(dispatchMock).toHaveBeenLastCalledWith(false);
      expect(dispatchResetStackToPhoneLoginScreenMock).not.toHaveBeenCalled();
      expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith('Login', {
        prescriptionId: 'prescription-id',
        isBlockchain: isBlockchainMock,
      });
      expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    }
  );

  it('should return session redirected true and dispatch to create account screen if user has not registered and path is "activate"', async () => {
    const dispatchMock = jest.fn();
    const configMockWithActivateUrl: IGuestExperienceConfig = {
      ...GuestExperienceConfig,
      location: {
        hash: '',
        host: 'test.myrx.io',
        hostname: 'test.myrx.io',
        href: 'https://test.myrx.io/activate',
        origin: 'https://test.myrx.io',
        pathname: '/activate',
        port: '',
        protocol: 'https:',
        search: '',
      } as ILocation,
    };
    const stateMockWithFeatureFlag: Partial<RootState> = {
      config: configMockWithActivateUrl,
      features: {} as IFeaturesState,
      settings: settingsMock,
    };
    const getState = jest.fn().mockReturnValue({
      ...stateMockWithFeatureFlag,
    });
    getSessionMock.mockResolvedValueOnce({
      responseCode: 'REQUIRE_USER_REGISTRATION',
    });
    const sessionStatusInvalid = await verifySessionDispatch(
      dispatchMock,
      getState,
      rootStackNavigationMock
    );

    expect(sessionStatusInvalid).toBe(true);
    expect(dispatchMock).toHaveBeenLastCalledWith(false);
    expect(dispatchResetStackToPhoneLoginScreenMock).not.toHaveBeenCalled();
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'CreateAccount',
      {
        workflow: 'pbmActivate',
      }
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
  });

  it('should return session redirected true if account is locked', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
    });
    getSessionMock.mockResolvedValueOnce({
      responseCode: 'SHOW_FORGET_PIN',
    });
    const sessionStatusInvalid = await verifySessionDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );

    expect(sessionStatusInvalid).toBe(true);
    expect(dispatch).toHaveBeenLastCalledWith(false);
    expect(dispatchResetStackToPhoneLoginScreenMock).not.toHaveBeenCalled();
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'AccountLocked',
      {}
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
  });

  it('should return session redirected true if returned code is unhandled', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
    });
    getSessionMock.mockResolvedValueOnce({
      responseCode: 'RANDOM_CODE',
    });
    const sessionStatusInvalid = await verifySessionDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );

    expect(sessionStatusInvalid).toBe(true);
    expect(dispatch).toHaveBeenLastCalledWith(false);
    expect(dispatchResetStackToPhoneLoginScreenMock).toHaveBeenCalled();
    expect(rootStackNavigationMock.navigate).not.toHaveBeenCalled();
  });

  it('should return session redirected true and internal error dispatch called if api returned error', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
    });
    const mockError = new Error('mockErrorMessage');
    getSessionMock.mockImplementation(() => {
      throw mockError;
    });
    const sessionStatusInvalid = await verifySessionDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );

    expect(sessionStatusInvalid).toBe(true);
    expect(dispatch).not.toHaveBeenCalled();
    expect(internalErrorDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      mockError
    );
    expect(dispatchResetStackToPhoneLoginScreenMock).not.toHaveBeenCalled();
    expect(rootStackNavigationMock.navigate).not.toHaveBeenCalled();
  });

  it('should return session redirected to true when account is locked', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
    });
    getSessionMock.mockResolvedValueOnce({
      responseCode: 'SHOW_ACCOUNT_LOCKED',
    });
    const sessionStatusInvalid = await verifySessionDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );

    expect(sessionStatusInvalid).toBe(true);
    expect(dispatch).toHaveBeenLastCalledWith(false);
    expect(dispatchResetStackToPhoneLoginScreenMock).not.toHaveBeenCalled();
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'AccountLocked',
      { accountLockedResponse: true }
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
  });

  it('should return session redirected true and dispatch to PBM Member benefits screen if device token is invalid and path is "activate"', async () => {
    const dispatchMock = jest.fn();
    const configMockWithActivateUrl: IGuestExperienceConfig = {
      ...GuestExperienceConfig,
      location: {
        hash: '',
        host: 'test.myrx.io',
        hostname: 'test.myrx.io',
        href: 'https://test.myrx.io/activate',
        origin: 'https://test.myrx.io',
        pathname: '/activate',
        port: '',
        protocol: 'https:',
        search: '',
      } as ILocation,
    };
    const stateMockWithFeatureFlag: Partial<RootState> = {
      config: configMockWithActivateUrl,
      features: {} as IFeaturesState,
      settings: settingsMock,
    };
    const getState = jest.fn().mockReturnValue({
      ...stateMockWithFeatureFlag,
    });
    getSessionMock.mockResolvedValueOnce({
      responseCode: 'INVALID_DEVICE_TOKEN',
    });
    const sessionStatusInvalid = await verifySessionDispatch(
      dispatchMock,
      getState,
      rootStackNavigationMock
    );

    expect(sessionStatusInvalid).toBe(true);
    expect(dispatchMock).toHaveBeenLastCalledWith(false);
    expect(dispatchResetStackToPhoneLoginScreenMock).not.toHaveBeenCalled();
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'PbmMemberBenefits',
      {
        showBackButton: false,
      }
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
  });
});
