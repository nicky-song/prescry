// Copyright 2022 Prescryptive Health, Inc.

import { IUpdateFavoritedPharmaciesRequestBody } from '../../../../../models/api-request-body/update-favorited-pharmacies.request-body';
import {
  ILimitedAccount,
  IPrimaryProfile,
  IProfile,
} from '../../../../../models/member-profile/member-profile-info';
import { IApiConfig } from '../../../../../utils/api.helper';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import {
  favoritePharmacyAsyncAction,
  IFavoritePharmacyAsyncActionArgs,
} from './favorite-pharmacy.async-action';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import {
  favoritePharmacyDispatch,
  IFavoritePharmacyDispatchArgs,
} from '../dispatch/favorite-pharmacy.dispatch';
import { ErrorFavoritingPharmacy } from '../../../../../errors/error-favoriting-pharmacy';
import { setFavoritingStatusDispatch } from '../../../state/membership/dispatch/set-favoriting-status.dispatch';
import { toggleFavoritedPharmaciesDispatch } from '../../../state/membership/dispatch/toggle-favorite-pharmacies.dispatch';
import { toggleFavoritedPharmacyHelper } from '../../../state/membership/helpers/toggle-favorited-pharmacy.helper';
import { FavoritingStatus } from '../../../../../components/notifications/all-favorite/all-favorite.notifications';

jest.mock('../../../state/membership/dispatch/set-favoriting-status.dispatch');
const setFavoritingStatusDispatchMock =
  setFavoritingStatusDispatch as jest.Mock;

jest.mock(
  '../../../state/membership/dispatch/toggle-favorite-pharmacies.dispatch'
);
const toggleFavoritedPharmaciesDispatchMock =
  toggleFavoritedPharmaciesDispatch as jest.Mock;

jest.mock('../../../state/membership/helpers/toggle-favorited-pharmacy.helper');
const toggleFavoritedPharmacyHelperMock =
  toggleFavoritedPharmacyHelper as jest.Mock;

jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

jest.mock('../dispatch/favorite-pharmacy.dispatch');
const favoritePharmacyDispatchMock = favoritePharmacyDispatch as jest.Mock;

describe('favoritePharmacyAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    favoritePharmacyDispatchMock.mockResolvedValue(true);
    toggleFavoritedPharmacyHelperMock.mockReturnValue([]);
  });

  it('(favoriting) dispatches favoritePharmacyDispatchMock with favoritedPharmacies plus ncpdp', async () => {
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

    toggleFavoritedPharmacyHelperMock.mockReturnValue(
      updatedFavoritedPharmacies
    );

    const result = await favoritePharmacyAsyncAction(
      favoritePharmacyAsyncActionArgsMock
    );

    const expectedUpdatedFavoritedPharmaciesRequestBody: IUpdateFavoritedPharmaciesRequestBody =
      {
        favoritedPharmacies: updatedFavoritedPharmacies,
      };

    const favoritePharmacyDispatchArgsMock: IFavoritePharmacyDispatchArgs = {
      ...favoritePharmacyAsyncActionArgsMock,
      updateFavoritedPharmaciesRequestBody:
        expectedUpdatedFavoritedPharmaciesRequestBody,
    };

    expect(favoritePharmacyDispatchMock).toBeCalledTimes(1);
    expect(favoritePharmacyDispatchMock).toBeCalledWith(
      favoritePharmacyDispatchArgsMock
    );

    expect(result).toEqual(true);
  });

  it('(favoriting) calls handlePostLoginApiErrorsAction on updateFavoritedPharmacies error', async () => {
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
    const errorMock = new Error('error-mock');
    favoritePharmacyDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const updatedFavoritedPharmacies = [
      ...initialFavoritedPharmaciesMock,
      ncpdpMock,
    ];

    toggleFavoritedPharmacyHelperMock.mockReturnValue(
      updatedFavoritedPharmacies
    );

    try {
      await favoritePharmacyAsyncAction(favoritePharmacyAsyncActionArgsMock);
    } catch (error) {
      expect(setFavoritingStatusDispatchMock).toHaveBeenCalledTimes(1);
      expect(setFavoritingStatusDispatchMock).toHaveBeenNthCalledWith(
        1,
        membershipDispatchMock,
        'error' as FavoritingStatus
      );
      expect(dispatchMock).toBeCalledTimes(0);
      expect(dispatchMock).not.toBeCalled();

      expect(error).toEqual(errorMock);

      expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledTimes(1);
      expect(handlePostLoginApiErrorsActionMock).toHaveBeenNthCalledWith(
        1,
        errorMock,
        dispatchMock,
        rootStackNavigationMock
      );
    }
  });

  it('(unfavoriting) dispatches favoritePharmacyDispatch with favoritedPharmacies minus ncpdp', async () => {
    const ncpdpMock = 'ncpdp-mock-2';
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

    const ncpdpIndex = initialFavoritedPharmaciesMock.indexOf(ncpdpMock);

    const updatedFavoritedPharmacies = [
      ...initialFavoritedPharmaciesMock.slice(0, ncpdpIndex),
      ...initialFavoritedPharmaciesMock.slice(ncpdpIndex + 1),
    ];

    toggleFavoritedPharmacyHelperMock.mockReturnValue(
      updatedFavoritedPharmacies
    );

    const result = await favoritePharmacyAsyncAction(
      favoritePharmacyAsyncActionArgsMock
    );

    const expectedUpdatedFavoritedPharmaciesRequestBody: IUpdateFavoritedPharmaciesRequestBody =
      {
        favoritedPharmacies: updatedFavoritedPharmacies,
      };

    const favoritePharmacyDispatchArgsMock: IFavoritePharmacyDispatchArgs = {
      ...favoritePharmacyAsyncActionArgsMock,
      updateFavoritedPharmaciesRequestBody:
        expectedUpdatedFavoritedPharmaciesRequestBody,
    };

    expect(favoritePharmacyDispatchMock).toBeCalledTimes(1);
    expect(favoritePharmacyDispatchMock).toBeCalledWith(
      favoritePharmacyDispatchArgsMock
    );

    expect(result).toEqual(true);
  });

  it('(unfavoriting) calls handlePostLoginApiErrorsAction on favoritePharmaciesDispatch error', async () => {
    const ncpdpMock = 'ncpdp-mock-2';
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
    const errorMock = new Error('error-mock');
    favoritePharmacyDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const ncpdpIndex = initialFavoritedPharmaciesMock.indexOf(ncpdpMock);

    const updatedFavoritedPharmacies = [
      ...initialFavoritedPharmaciesMock.slice(0, ncpdpIndex),
      ...initialFavoritedPharmaciesMock.slice(ncpdpIndex + 1),
    ];

    toggleFavoritedPharmaciesDispatchMock.mockReturnValue(
      updatedFavoritedPharmacies
    );

    try {
      await favoritePharmacyAsyncAction(favoritePharmacyAsyncActionArgsMock);
    } catch (error) {
      expect(error).toEqual(errorMock);

      expect(setFavoritingStatusDispatchMock).toHaveBeenCalledTimes(1);
      expect(setFavoritingStatusDispatchMock).toHaveBeenNthCalledWith(
        1,
        membershipDispatchMock,
        'error' as FavoritingStatus
      );

      expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledTimes(1);
      expect(handlePostLoginApiErrorsActionMock).toHaveBeenNthCalledWith(
        1,
        errorMock,
        dispatchMock,
        getStateMock,
        rootStackNavigationMock
      );
    }
  });

  it('sets currentFavoritingStatus to error on ErrorFavoritingPharmacy from favoritePharmaciesDispatch', async () => {
    const ncpdpMock = 'ncpdp-mock-2';
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
    const errorMock = new ErrorFavoritingPharmacy('error-mock');
    favoritePharmacyDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    try {
      await favoritePharmacyAsyncAction(favoritePharmacyAsyncActionArgsMock);
    } catch (error) {
      expect(error).toEqual(errorMock);

      expect(setFavoritingStatusDispatchMock).toHaveBeenCalledTimes(1);
      expect(setFavoritingStatusDispatchMock).toHaveBeenNthCalledWith(
        1,
        membershipDispatchMock,
        'error' as FavoritingStatus
      );

      expect(error instanceof ErrorFavoritingPharmacy).toBeTruthy();

      expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledTimes(0);
    }
  });
});
