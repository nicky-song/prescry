// Copyright 2022 Prescryptive Health, Inc.

import { IUpdateFavoritedPharmaciesRequestBody } from '../../../../../models/api-request-body/update-favorited-pharmacies.request-body';
import {
  ILimitedAccount,
  IPrimaryProfile,
  IProfile,
} from '../../../../../models/member-profile/member-profile-info';
import { IApiConfig } from '../../../../../utils/api.helper';
import { updateFavoritedPharmacies } from '../../../api/api-v1.update-favorited-pharmacies';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { setFavoritingStatusDispatch } from '../../../state/membership/dispatch/set-favoriting-status.dispatch';
import { IFavoritePharmacyAsyncActionArgs } from '../async-actions/favorite-pharmacy.async-action';
import {
  favoritePharmacyDispatch,
  IFavoritePharmacyDispatchArgs,
} from './favorite-pharmacy.dispatch';

jest.mock('../../../state/membership/dispatch/set-favoriting-status.dispatch');
const setFavoritingStatusDispatchMock =
  setFavoritingStatusDispatch as jest.Mock;

jest.mock('../../../api/api-v1.update-favorited-pharmacies');
const updateFavoritedPharmaciesMock = updateFavoritedPharmacies as jest.Mock;

describe('favoritePharmacyDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    updateFavoritedPharmaciesMock.mockResolvedValue(true);
  });
  it('calls updateFavoritedPharmacies with expected args', async () => {
    const ncpdpMock = 'ncpdp-mock';
    const dispatchMock = jest.fn();
    const phoneNumberMock = 'phone-number-mock';
    const ncpdpMock1 = 'ncpdp-mock-1';
    const ncpdpMock2 = 'ncpdp-mock-2';
    const initialFavoritedPharmaciesMock = [ncpdpMock1, ncpdpMock2];
    const accountMock: ILimitedAccount = {
      phoneNumber: phoneNumberMock,
      favoritedPharmacies: initialFavoritedPharmaciesMock,
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

    const favoritePharmacyAsyncActionArgsMock: IFavoritePharmacyAsyncActionArgs =
      {
        ncpdp: ncpdpMock,
        navigation: rootStackNavigationMock,
        reduxDispatch: dispatchMock,
        reduxGetState: getStateMock,
        membershipDispatch: membershipDispatchMock,
      };

    const updatedFavoritedPharmacies = [
      ...initialFavoritedPharmaciesMock,
      ncpdpMock,
    ];

    const updateFavoritedPharmaciesRequestBody: IUpdateFavoritedPharmaciesRequestBody =
      {
        favoritedPharmacies: updatedFavoritedPharmacies,
      };

    const favoritePharmacyDispatchArgsMock: IFavoritePharmacyDispatchArgs = {
      ...favoritePharmacyAsyncActionArgsMock,
      updateFavoritedPharmaciesRequestBody,
    };

    await favoritePharmacyDispatch(favoritePharmacyDispatchArgsMock);

    expect(updateFavoritedPharmaciesMock).toBeCalledTimes(1);
    expect(updateFavoritedPharmaciesMock).toBeCalledWith(
      guestExperienceApiMock,
      updateFavoritedPharmaciesRequestBody,
      deviceTokenMock,
      tokenMock
    );
  });

  it('dispatches setMemberProfileAction with expected args on updateFavoritedPharmacies success + returns true', async () => {
    const ncpdpMock = 'ncpdp-mock';
    const dispatchMock = jest.fn();
    const phoneNumberMock = 'phone-number-mock';
    const ncpdpMock1 = 'ncpdp-mock-1';
    const ncpdpMock2 = 'ncpdp-mock-2';
    const initialFavoritedPharmaciesMock = [ncpdpMock1, ncpdpMock2];
    const accountMock: ILimitedAccount = {
      phoneNumber: phoneNumberMock,
      favoritedPharmacies: initialFavoritedPharmaciesMock,
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

    const favoritePharmacyAsyncActionArgsMock: IFavoritePharmacyAsyncActionArgs =
      {
        ncpdp: ncpdpMock,
        navigation: rootStackNavigationMock,
        reduxDispatch: dispatchMock,
        reduxGetState: getStateMock,
        membershipDispatch: membershipDispatchMock,
      };

    const updatedFavoritedPharmacies = [
      ...initialFavoritedPharmaciesMock,
      ncpdpMock,
    ];

    const updateFavoritedPharmaciesRequestBody: IUpdateFavoritedPharmaciesRequestBody =
      {
        favoritedPharmacies: updatedFavoritedPharmacies,
      };

    const favoritePharmacyDispatchArgsMock: IFavoritePharmacyDispatchArgs = {
      ...favoritePharmacyAsyncActionArgsMock,
      updateFavoritedPharmaciesRequestBody,
    };

    const result = await favoritePharmacyDispatch(
      favoritePharmacyDispatchArgsMock
    );

    expect(updateFavoritedPharmaciesMock).toBeCalledTimes(1);
    expect(updateFavoritedPharmaciesMock).toBeCalledWith(
      guestExperienceApiMock,
      updateFavoritedPharmaciesRequestBody,
      deviceTokenMock,
      tokenMock
    );

    expect(setFavoritingStatusDispatchMock).toBeCalledTimes(1);
    expect(setFavoritingStatusDispatchMock).toBeCalledWith(
      membershipDispatchMock,
      'success'
    );

    expect(result).toEqual(true);
  });

  it('does not dispatch setMemberProfileAction on updateFavoritedPharmacies failure + returns false', async () => {
    updateFavoritedPharmaciesMock.mockResolvedValue(false);

    const ncpdpMock = 'ncpdp-mock';
    const dispatchMock = jest.fn();
    const phoneNumberMock = 'phone-number-mock';
    const ncpdpMock1 = 'ncpdp-mock-1';
    const ncpdpMock2 = 'ncpdp-mock-2';
    const initialFavoritedPharmaciesMock = [ncpdpMock1, ncpdpMock2];
    const accountMock: ILimitedAccount = {
      phoneNumber: phoneNumberMock,
      favoritedPharmacies: initialFavoritedPharmaciesMock,
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

    const favoritePharmacyAsyncActionArgsMock: IFavoritePharmacyAsyncActionArgs =
      {
        ncpdp: ncpdpMock,
        navigation: rootStackNavigationMock,
        reduxDispatch: dispatchMock,
        reduxGetState: getStateMock,
        membershipDispatch: membershipDispatchMock,
      };

    const updatedFavoritedPharmacies = [
      ...initialFavoritedPharmaciesMock,
      ncpdpMock,
    ];

    const updateFavoritedPharmaciesRequestBody: IUpdateFavoritedPharmaciesRequestBody =
      {
        favoritedPharmacies: updatedFavoritedPharmacies,
      };

    const favoritePharmacyDispatchArgsMock: IFavoritePharmacyDispatchArgs = {
      ...favoritePharmacyAsyncActionArgsMock,
      updateFavoritedPharmaciesRequestBody,
    };

    const result = await favoritePharmacyDispatch(
      favoritePharmacyDispatchArgsMock
    );

    expect(updateFavoritedPharmaciesMock).toBeCalledTimes(1);
    expect(updateFavoritedPharmaciesMock).toBeCalledWith(
      guestExperienceApiMock,
      updateFavoritedPharmaciesRequestBody,
      deviceTokenMock,
      tokenMock
    );

    expect(setFavoritingStatusDispatchMock).not.toBeCalled();

    expect(result).toEqual(false);
  });
});
