// Copyright 2021 Prescryptive Health, Inc.

import { ICobrandingContent } from '../../../../../models/cms-content/co-branding.ui-content';
import { RxGroupTypesEnum } from '../../../../../models/member-profile/member-profile-info';
import { getProfilesByGroup } from '../../../../../utils/profile.helper';
import { useMembershipContext } from '../../membership/use-membership-context.hook';
import { useCobrandingContent } from './use-cobranding-content';

export const usePbmProfileCobrandingContent = (): ICobrandingContent => {
  const { membershipState } = useMembershipContext();

  const pbmProfiles = getProfilesByGroup(
    membershipState.profileList ?? [],
    RxGroupTypesEnum.SIE
  );
  const hasPBMProfile = pbmProfiles && pbmProfiles.length > 0;

  const profile = hasPBMProfile ? pbmProfiles[0].primary : undefined;

  return useCobrandingContent(profile?.rxGroup, profile?.brokerAssociation);
};
