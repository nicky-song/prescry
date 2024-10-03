// Copyright 2020 Prescryptive Health, Inc.

import {
  IPrimaryProfile,
  IProfile,
  RxGroupTypesEnum,
} from '../../../../../models/member-profile/member-profile-info';
import { getProfilesByGroup } from '../../../../../utils/profile.helper';
import {
  defaultMembershipState,
  IMembershipState,
} from '../../../state/membership/membership.state';
import { profileListMock } from '../../../__mocks__/profile-list.mock';
import { useMembershipContext } from '../../membership/use-membership-context.hook';
import { useCobrandingContent } from './use-cobranding-content';
import { usePbmProfileCobrandingContent } from './use-pbm-profile-cobranding-content';

jest.mock('../../membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../../../utils/profile.helper');
const getProfilesByGroupMock = getProfilesByGroup as jest.Mock;

jest.mock('./use-cobranding-content');
const useCobrandingContentMock = useCobrandingContent as jest.Mock;

const rxGroupMock = 'rx-group-mock';
const brokerAssociationMock = 'broker-association';

const primaryProfileMock: IPrimaryProfile = {
  identifier: 'identifier-mock',
  firstName: 'first-name-mock',
  lastName: 'last-name-mock',
  dateOfBirth: 'date-of-birth-mock',
  rxGroupType: 'COVID19',
  rxSubGroup: 'rx-sub-group-mock',
  primaryMemberRxId: 'primary-member-rx-id-mock',
  phoneNumber: 'phone-number-mock',
  rxGroup: rxGroupMock,
  brokerAssociation: brokerAssociationMock,
};

const profileMock: IProfile = {
  rxGroupType: rxGroupMock,
  primary: primaryProfileMock,
};

describe('usePbmProfileCobrandingContent', () => {
  it('should get user profile from useMembershipContext calling getProfilesByGroup', () => {
    const membershipStateMock: Partial<IMembershipState> = {
      ...defaultMembershipState,
      profileList: profileListMock,
    };

    useMembershipContextMock.mockReturnValue({
      membershipState: membershipStateMock,
      membershipDispatch: jest.fn(),
    });

    getProfilesByGroupMock.mockReturnValue([profileMock]);

    usePbmProfileCobrandingContent();

    expect(getProfilesByGroupMock).toHaveBeenCalledWith(
      membershipStateMock.profileList,
      RxGroupTypesEnum.SIE
    );
    expect(useCobrandingContentMock).toHaveBeenCalledWith(
      rxGroupMock,
      brokerAssociationMock
    );
  });
});
