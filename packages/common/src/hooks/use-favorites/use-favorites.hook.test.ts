// Copyright 2022 Prescryptive Health, Inc.

import { useFavorites } from './use-favorites.hook';
import { useSessionContext } from '../../experiences/guest-experience/context-providers/session/use-session-context.hook';
import { useMembershipContext } from '../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';

jest.mock(
  '../../experiences/guest-experience/context-providers/session/use-session-context.hook'
);
jest.mock(
  '../../experiences/guest-experience/context-providers/membership/use-membership-context.hook'
);

const useSessionContextMock = useSessionContext as jest.Mock;
const useMembershipContextMock = useMembershipContext as jest.Mock;

describe('useFavorites', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useSessionContextMock.mockReturnValueOnce({
      sessionState: { isUserAuthenticated: true },
    });

    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: { favoritedPharmacies: undefined },
      },
    });
  });

  it('returns isFavorites true if user is authenticated', () => {
    const { isFavorites } = useFavorites();

    expect(isFavorites).toEqual(true);
  });

  it('returns isFavorites false if user is not authenticated', () => {
    useSessionContextMock.mockReset();
    useSessionContextMock.mockReturnValueOnce({
      sessionState: { isUserAuthenticated: false },
    });

    const { isFavorites } = useFavorites();

    expect(isFavorites).toEqual(false);
  });

  it('returns isPharmacyFavorited true if ncpdp exists in favorited pharmacies', () => {
    const ncpdpMock = 'ncpdp-mock';

    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: { favoritedPharmacies: [ncpdpMock] },
      },
    });

    const { isPharmacyFavorited } = useFavorites(ncpdpMock);

    expect(isPharmacyFavorited).toEqual(true);
  });

  it('returns isPharmacyFavorited false if ncpdp does not exist in favorited pharmacies', () => {
    const ncpdpMock = 'ncpdp-mock';

    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: { favoritedPharmacies: [] },
      },
    });

    const { isPharmacyFavorited } = useFavorites(ncpdpMock);

    expect(isPharmacyFavorited).toEqual(false);
  });
});
