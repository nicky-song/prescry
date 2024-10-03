// Copyright 2021 Prescryptive Health, Inc.

import { IMemberInfoResponseData } from '../../../../models/api-response/member-info-response';
import { ILimitedAccount } from '../../../../models/member-profile/member-profile-info';
import { profileListMock } from '../../__mocks__/profile-list.mock';
import { membershipSetAction } from './actions/membership-set.action';
import { toggleFavoritedPharmaciesAction } from './actions/toggle-favorited-pharmacies.action';
import { setLanguageCodeAction } from './actions/set-language-code.action';
import { membershipReducer } from './membership.reducer';
import { IMembershipState, defaultMembershipState } from './membership.state';
import { toggleFavoritedPharmacyHelper } from './helpers/toggle-favorited-pharmacy.helper';

jest.mock('./helpers/toggle-favorited-pharmacy.helper');
const toggleFavoritedPharmacyHelperMock =
  toggleFavoritedPharmacyHelper as jest.Mock;

const accountMock: ILimitedAccount = {
  firstName: 'fake-first',
  lastName: 'fake-last',
  dateOfBirth: '01-01-2000',
  phoneNumber: 'fake-phone',
  recoveryEmail: 'test@test.com',
  favoritedPharmacies: [],
  languageCode: 'en',
};

const mockResponseData: IMemberInfoResponseData = {
  account: accountMock,
  profileList: profileListMock,
};

describe('membershipReducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    toggleFavoritedPharmacyHelperMock.mockReturnValue([]);
  });

  it('reduces membership info set action', () => {
    const action = membershipSetAction(mockResponseData);

    const initialState: IMembershipState = {
      ...defaultMembershipState,
    };
    const reducedState = membershipReducer(initialState, action);

    const expectedState: IMembershipState = {
      ...initialState,
      account: accountMock,
      profileList: profileListMock,
    };

    expect(reducedState).toEqual(expectedState);
  });

  it('reduces toggle favorited pharmacies action', () => {
    const favoritePharmacyNcpdpMock = 'favorite-pharmacy-ncpdp-mock';

    const action = toggleFavoritedPharmaciesAction(favoritePharmacyNcpdpMock);

    const favoritedPharmaciesMock = [favoritePharmacyNcpdpMock];

    toggleFavoritedPharmacyHelperMock.mockReturnValue(favoritedPharmaciesMock);

    const initialState: IMembershipState = {
      ...defaultMembershipState,
    };

    const reducedState = membershipReducer(initialState, action);

    const expectedState: IMembershipState = {
      ...initialState,
      account: {
        ...initialState.account,
        favoritedPharmacies: favoritedPharmaciesMock,
      },
      favoritingAction: 'favoriting',
    };

    expect(reducedState).toEqual(expectedState);
  });

  it('reduces set language code action', () => {
    const languageCodeMock = 'es';
    const action = setLanguageCodeAction(languageCodeMock);

    const initialState: IMembershipState = {
      ...defaultMembershipState,
    };

    const reducedState = membershipReducer(initialState, action);

    const expectedState: IMembershipState = {
      ...initialState,
      account: {
        ...initialState.account,
        languageCode: languageCodeMock,
      },
    };

    expect(reducedState).toEqual(expectedState);
  });
});
