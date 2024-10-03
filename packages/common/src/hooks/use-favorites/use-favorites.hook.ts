// Copyright 2022 Prescryptive Health, Inc.

import { useMembershipContext } from '../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';
import { useSessionContext } from '../../experiences/guest-experience/context-providers/session/use-session-context.hook';

export interface IUseFavorites {
  isFavorites: boolean;
  isPharmacyFavorited: boolean;
}

export const useFavorites = (ncpdp?: string): IUseFavorites => {
  const {
    sessionState: { isUserAuthenticated },
  } = useSessionContext();

  const {
    membershipState: {
      account: { favoritedPharmacies },
    },
  } = useMembershipContext();

  const isFavorites = !!isUserAuthenticated;

  const isPharmacyFavorited =
    !!favoritedPharmacies && !!ncpdp && favoritedPharmacies.includes(ncpdp);

  return { isFavorites, isPharmacyFavorited };
};
