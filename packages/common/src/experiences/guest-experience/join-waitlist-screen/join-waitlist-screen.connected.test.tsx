// Copyright 2021 Prescryptive Health, Inc.

import {
  IDependentProfile,
  IPrimaryProfile,
  IProfile,
} from '../../../models/member-profile/member-profile-info';
import { ServiceTypes } from '../../../models/provider-location';
import { getProfilesByGroup } from '../../../utils/profile.helper';
import { RootState } from '../store/root-reducer';
import { IServiceTypeState } from '../store/service-type/service-type.reducer';
import { joinWaitlistDataLoadingAsyncAction } from '../store/waitlist/async-actions/join-waitlist-data-loading.async-action';
import { joinWaitlistLocationPreferencesAsyncAction } from '../store/waitlist/async-actions/join-waitlist-location-preferences.async-action';
import { joinWaitlistResetErrorAsyncAction } from '../store/waitlist/async-actions/join-waitlist-reset-error.async-action';
import {
  IJoinWaitlistScreenActionProps,
  IJoinWaitlistScreenDataProps,
} from './join-waitlist-screen';
import { actions, mapStateToProps } from './join-waitlist-screen.connected';

jest.mock('../../../utils/profile.helper');

const getProfilesByGroupMock = getProfilesByGroup as jest.Mock;

const serviceTypeMock: IServiceTypeState = {
  type: ServiceTypes.c19VaccineDose1,
  serviceNameMyRx: undefined,
  minimumAge: 18,
};

describe('JoinWaitlistScreenConnected', () => {
  beforeEach(() => {
    getProfilesByGroupMock.mockReturnValue([] as IProfile[]);
  });

  it('maps state correctly if profileList exists', () => {
    const testProfile = {
      rxGroupType: 'test-group',
      primary: {} as IPrimaryProfile,
      childMembers: [] as IDependentProfile[],
      adultMembers: [] as IDependentProfile[],
    } as IProfile;
    const childMember = {} as IDependentProfile;
    const adultMember = {} as IDependentProfile;
    getProfilesByGroupMock.mockReturnValue([
      {
        childMembers: [childMember],
        adultMembers: [adultMember],
      } as IProfile,
    ]);

    const mappedProps: IJoinWaitlistScreenDataProps = mapStateToProps({
      serviceType: serviceTypeMock,
      memberProfile: { profileList: [testProfile] as IProfile[] },
    } as RootState);

    const expectedProps: IJoinWaitlistScreenDataProps = {
      serviceType: serviceTypeMock,
      availableWaitlistMembers: [childMember, adultMember],
    };
    expect(mappedProps).toEqual(expectedProps);
  });

  it('maps state correctly if profileList does not exist', () => {
    const mappedProps: IJoinWaitlistScreenDataProps = mapStateToProps({
      serviceType: serviceTypeMock,
      memberProfile: { profileList: [] as IProfile[] },
    } as RootState);
    const expectedProps: IJoinWaitlistScreenDataProps = {
      serviceType: serviceTypeMock,
      availableWaitlistMembers: [],
    };
    expect(mappedProps).toEqual(expectedProps);
  });

  it('maps dispatch actions', () => {
    const expectedActions: IJoinWaitlistScreenActionProps = {
      onJoinPress: joinWaitlistDataLoadingAsyncAction,
      resetErrorMessage: joinWaitlistResetErrorAsyncAction,
      updateLocationPreferences: joinWaitlistLocationPreferencesAsyncAction,
    };
    expect(actions).toEqual(expectedActions);
  });
});
