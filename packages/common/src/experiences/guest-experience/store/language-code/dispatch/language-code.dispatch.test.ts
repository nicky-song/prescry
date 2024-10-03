// Copyright 2022 Prescryptive Health, Inc.

import { IUpdateLanguageCodeRequestBody } from '../../../../../models/api-request-body/update-language-code.request-body';
import {
  ILimitedAccount,
  IPrimaryProfile,
  IProfile,
} from '../../../../../models/member-profile/member-profile-info';
import { IApiConfig } from '../../../../../utils/api.helper';
import { updateLanguageCode } from '../../../api/api-v1.update-language-code';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { ILanguageCodeAsyncActionArgs } from '../async-actions/language-code.async-action';
import {
  languageCodeDispatch,
  ILanguageCodeDispatchArgs,
} from './language-code.dispatch';

jest.mock('../../../api/api-v1.update-language-code');
const updateLanguageCodeMock = updateLanguageCode as jest.Mock;

const languageCodeRequestBodyMock: IUpdateLanguageCodeRequestBody = {
  languageCode: 'en',
};

describe('languageCodeDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    updateLanguageCodeMock.mockResolvedValue(true);
  });
  it('calls updateLanguageCode with expected args', async () => {
    const dispatchMock = jest.fn();
    const phoneNumberMock = 'phone-number-mock';
    const accountMock: ILimitedAccount = {
      phoneNumber: phoneNumberMock,
      languageCode: 'es',
      favoritedPharmacies: [],
    };
    const rxGroupTypeMock = 'CASH';
    const primaryProfileMock: IPrimaryProfile = {
      identifier: 'identifier-mock',
      firstName: 'first-name-mock',
      lastName: 'last-name-mock',
      dateOfBirth: 'date-of-birth-mock',
      primaryMemberRxId: 'primary-member-rx-id-mock',
      phoneNumber: 'phone-number-mock',
      rxGroupType: rxGroupTypeMock,
      rxSubGroup: 'rx-sub-group-mock',
    };
    const profileMock: IProfile = {
      rxGroupType: rxGroupTypeMock,
      primary: primaryProfileMock,
    };
    const profileListMock: IProfile[] = [profileMock];
    const guestExperienceApiMock = {} as IApiConfig;
    const deviceTokenMock = 'device-token-mock';
    const tokenMock = 'token-mock';
    const getStateMock = jest.fn().mockReturnValue({
      memberProfile: { account: accountMock, profileList: profileListMock },
      config: {
        apis: { guestExperienceApi: guestExperienceApiMock },
      },
      settings: { deviceToken: deviceTokenMock, token: tokenMock },
    });
    const membershipDispatchMock = jest.fn();

    const languageCodeAsyncActionArgsMock: ILanguageCodeAsyncActionArgs = {
      languageCode: 'es',
      navigation: rootStackNavigationMock,
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
      membershipDispatch: membershipDispatchMock,
    };

    const languageCodeDispatchArgsMock: ILanguageCodeDispatchArgs = {
      ...languageCodeAsyncActionArgsMock,
      updateLanguageCodeRequestBody: languageCodeRequestBodyMock,
    };

    await languageCodeDispatch(languageCodeDispatchArgsMock);

    expect(updateLanguageCodeMock).toBeCalledTimes(1);
    expect(updateLanguageCodeMock).toBeCalledWith(
      guestExperienceApiMock,
      languageCodeRequestBodyMock,
      deviceTokenMock,
      tokenMock
    );
  });

  it('dispatches setMemberProfileAction with expected args on updateLanguageCode success + returns true', async () => {
    const dispatchMock = jest.fn();
    const phoneNumberMock = 'phone-number-mock';
    const accountMock: ILimitedAccount = {
      phoneNumber: phoneNumberMock,
      favoritedPharmacies: [],
    };
    const rxGroupTypeMock = 'CASH';
    const primaryProfileMock: IPrimaryProfile = {
      identifier: 'identifier-mock',
      firstName: 'first-name-mock',
      lastName: 'last-name-mock',
      dateOfBirth: 'date-of-birth-mock',
      primaryMemberRxId: 'primary-member-rx-id-mock',
      phoneNumber: 'phone-number-mock',
      rxGroupType: rxGroupTypeMock,
      rxSubGroup: 'rx-sub-group-mock',
    };
    const profileMock: IProfile = {
      rxGroupType: rxGroupTypeMock,
      primary: primaryProfileMock,
    };
    const profileListMock: IProfile[] = [profileMock];
    const guestExperienceApiMock = {} as IApiConfig;
    const deviceTokenMock = 'device-token-mock';
    const tokenMock = 'token-mock';
    const getStateMock = jest.fn().mockReturnValue({
      memberProfile: { account: accountMock, profileList: profileListMock },
      config: {
        apis: { guestExperienceApi: guestExperienceApiMock },
      },
      settings: { deviceToken: deviceTokenMock, token: tokenMock },
    });
    const membershipDispatchMock = jest.fn();

    const languageCodeAsyncActionArgsMock: ILanguageCodeAsyncActionArgs = {
      languageCode: 'es',
      navigation: rootStackNavigationMock,
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
      membershipDispatch: membershipDispatchMock,
    };

    const languageCodeDispatchArgsMock: ILanguageCodeDispatchArgs = {
      ...languageCodeAsyncActionArgsMock,
      updateLanguageCodeRequestBody: languageCodeRequestBodyMock,
    };

    const result = await languageCodeDispatch(languageCodeDispatchArgsMock);

    expect(updateLanguageCodeMock).toBeCalledTimes(1);
    expect(updateLanguageCodeMock).toBeCalledWith(
      guestExperienceApiMock,
      languageCodeRequestBodyMock,
      deviceTokenMock,
      tokenMock
    );

    expect(result).toEqual(true);
  });

  it('does not dispatch setMemberProfileAction on updateLanguageCode failure + returns false', async () => {
    updateLanguageCodeMock.mockResolvedValue(false);

    const dispatchMock = jest.fn();
    const phoneNumberMock = 'phone-number-mock';
    const accountMock: ILimitedAccount = {
      phoneNumber: phoneNumberMock,
      languageCode: 'es',
      favoritedPharmacies: [],
    };
    const rxGroupTypeMock = 'CASH';
    const primaryProfileMock: IPrimaryProfile = {
      identifier: 'identifier-mock',
      firstName: 'first-name-mock',
      lastName: 'last-name-mock',
      dateOfBirth: 'date-of-birth-mock',
      primaryMemberRxId: 'primary-member-rx-id-mock',
      phoneNumber: 'phone-number-mock',
      rxGroupType: rxGroupTypeMock,
      rxSubGroup: 'rx-sub-group-mock',
    };
    const profileMock: IProfile = {
      rxGroupType: rxGroupTypeMock,
      primary: primaryProfileMock,
    };
    const profileListMock: IProfile[] = [profileMock];
    const guestExperienceApiMock = {} as IApiConfig;
    const deviceTokenMock = 'device-token-mock';
    const tokenMock = 'token-mock';
    const getStateMock = jest.fn().mockReturnValue({
      memberProfile: { account: accountMock, profileList: profileListMock },
      config: {
        apis: { guestExperienceApi: guestExperienceApiMock },
      },
      settings: { deviceToken: deviceTokenMock, token: tokenMock },
    });
    const membershipDispatchMock = jest.fn();

    const languageCodeAsyncActionArgsMock: ILanguageCodeAsyncActionArgs = {
      languageCode: 'es',
      navigation: rootStackNavigationMock,
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
      membershipDispatch: membershipDispatchMock,
    };

    const languageCodeDispatchArgsMock: ILanguageCodeDispatchArgs = {
      ...languageCodeAsyncActionArgsMock,
      updateLanguageCodeRequestBody: languageCodeRequestBodyMock,
    };

    const result = await languageCodeDispatch(languageCodeDispatchArgsMock);

    expect(updateLanguageCodeMock).toBeCalledTimes(1);
    expect(updateLanguageCodeMock).toBeCalledWith(
      guestExperienceApiMock,
      languageCodeRequestBodyMock,
      deviceTokenMock,
      tokenMock
    );

    expect(result).toEqual(false);
  });

  it('returns false on error boundary', async () => {
    const errorMock = new Error('error');
    updateLanguageCodeMock.mockImplementation(() => {
      throw errorMock;
    });

    const dispatchMock = jest.fn();
    const phoneNumberMock = 'phone-number-mock';
    const accountMock: ILimitedAccount = {
      phoneNumber: phoneNumberMock,
      languageCode: 'es',
      favoritedPharmacies: [],
    };
    const rxGroupTypeMock = 'CASH';
    const primaryProfileMock: IPrimaryProfile = {
      identifier: 'identifier-mock',
      firstName: 'first-name-mock',
      lastName: 'last-name-mock',
      dateOfBirth: 'date-of-birth-mock',
      primaryMemberRxId: 'primary-member-rx-id-mock',
      phoneNumber: 'phone-number-mock',
      rxGroupType: rxGroupTypeMock,
      rxSubGroup: 'rx-sub-group-mock',
    };
    const profileMock: IProfile = {
      rxGroupType: rxGroupTypeMock,
      primary: primaryProfileMock,
    };
    const profileListMock: IProfile[] = [profileMock];
    const guestExperienceApiMock = {} as IApiConfig;
    const deviceTokenMock = 'device-token-mock';
    const tokenMock = 'token-mock';
    const getStateMock = jest.fn().mockReturnValue({
      memberProfile: { account: accountMock, profileList: profileListMock },
      config: {
        apis: { guestExperienceApi: guestExperienceApiMock },
      },
      settings: { deviceToken: deviceTokenMock, token: tokenMock },
    });
    const membershipDispatchMock = jest.fn();

    const languageCodeAsyncActionArgsMock: ILanguageCodeAsyncActionArgs = {
      languageCode: 'es',
      navigation: rootStackNavigationMock,
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
      membershipDispatch: membershipDispatchMock,
    };

    const languageCodeDispatchArgsMock: ILanguageCodeDispatchArgs = {
      ...languageCodeAsyncActionArgsMock,
      updateLanguageCodeRequestBody: languageCodeRequestBodyMock,
    };

    const result = await languageCodeDispatch(languageCodeDispatchArgsMock);

    expect(updateLanguageCodeMock).toBeCalledTimes(1);
    expect(updateLanguageCodeMock).toBeCalledWith(
      guestExperienceApiMock,
      languageCodeRequestBodyMock,
      deviceTokenMock,
      tokenMock
    );

    expect(result).toEqual(false);
  });
});
