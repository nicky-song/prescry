// Copyright 2021 Prescryptive Health, Inc.

import { IProfile } from '../../../../models/member-profile/member-profile-info';
import { IMemberProfileState } from '../../store/member-profile/member-profile-reducer';
import { RootState } from '../../store/root-reducer';
import { IMembershipContextProviderProps } from './membership.context-provider';
import { mapStateToProps } from './membership.context-provider.connected';

describe('MembershipContextProviderConnected', () => {
  it('maps state', () => {
    const mappedProps: IMembershipContextProviderProps = mapStateToProps({
      memberProfile: {
        account: { phoneNumber: '', favoritedPharmacies: [] },
        profileList: [] as IProfile[],
      } as IMemberProfileState,
    } as RootState);

    const expectedProps: IMembershipContextProviderProps = {
      memberProfileState: {
        account: { phoneNumber: '', favoritedPharmacies: [] },
        profileList: [],
      },
    };
    expect(mappedProps).toEqual(expectedProps);
  });
});
