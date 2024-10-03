// Copyright 2022 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { IContentWithIsLoading } from '../../../../models/cms-content/content-with-isloading.model';
import { getChildren } from '../../../../testing/test.helper';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { FavoritePharmaciesScreen } from './favorite-pharmacies.screen';
import { IFavoritePharmaciesScreenContent } from './favorite-pharmacies.screen.cms-content-wrapper';
import { useNavigation } from '@react-navigation/native';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { getFavoritedPharmaciesDispatch } from '../../store/member-list-info/dispatch/get-favorited-pharmacies.dispatch';
import { IPharmacy } from '../../../../models/pharmacy';
import { favoritePharmaciesScreenStyles } from './favorite-pharmacies.screen.styles';
import { IAddress } from '../../../../models/address';
import { FavoritePharmacyCard } from '../../../../components/member/cards/favorite-pharmacy/favorite-pharmacy.card';
import { FavoritingAction } from '../../../../components/buttons/favorite-icon/favorite-icon.button';
import { View } from 'react-native';
import { useIsMounted } from '../../../../hooks/use-is-mounted/use-is-mounted.hook';
import { useMembershipContext } from '../../context-providers/membership/use-membership-context.hook';
import {
  AllFavoriteNotifications,
  FavoritingStatus,
} from '../../../../components/notifications/all-favorite/all-favorite.notifications';
import { setFavoritingStatusDispatch } from '../../state/membership/dispatch/set-favoriting-status.dispatch';
import { favoritePharmacyAsyncAction } from '../../store/set-favorite-pharmacy/async-actions/favorite-pharmacy.async-action';

jest.mock(
  '../../store/set-favorite-pharmacy/async-actions/favorite-pharmacy.async-action'
);
const favoritePharmacyAsyncActionMock =
  favoritePharmacyAsyncAction as jest.Mock;

jest.mock('../../state/membership/dispatch/set-favoriting-status.dispatch');
const setFavoritingStatusDispatchMock =
  setFavoritingStatusDispatch as jest.Mock;

void setFavoritingStatusDispatchMock;

jest.mock(
  '../../../../components/notifications/all-favorite/all-favorite.notifications',
  () => ({
    AllFavoriteNotifications: () => <div />,
  })
);

jest.mock('../../../../hooks/use-is-mounted/use-is-mounted.hook');
const useIsMountedMock = useIsMounted as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock(
  '../../../../components/member/cards/favorite-pharmacy/favorite-pharmacy.card',
  () => ({
    FavoritePharmacyCard: () => <div />,
  })
);

jest.mock('../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../store/member-list-info/dispatch/get-favorited-pharmacies.dispatch'
);
const getFavoritedPharmaciesDispatchMock =
  getFavoritedPharmaciesDispatch as jest.Mock;

jest.mock('../../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

describe('FavoritePharmaciesScreen', () => {
  const reduxDispatchMock = jest.fn();
  const reduxGetStateMock = jest.fn();
  const setErrorMessageMock = jest.fn();
  const setFavoritedPharmacyListMock = jest.fn();
  const setIsDisabledMock = jest.fn();
  const favoritedPharmaciesMock = [
    'ncpdp-mock-1',
    'ncdpd-mock-2',
    'ncpdp-mock-3',
  ];
  const membershipDispatchMock = jest.fn();

  const setState = ({
    errorMessage = '',
    favoritedPharmacyList = [] as IPharmacy[],
    isDisabled = false,
  }) => {
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([errorMessage, setErrorMessageMock]);
    useStateMock.mockReturnValueOnce([
      favoritedPharmacyList,
      setFavoritedPharmacyListMock,
    ]);
    useStateMock.mockReturnValueOnce([isDisabled, setIsDisabledMock]);
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IFavoritePharmaciesScreenContent>>
    > = {
      content: {},
      isContentLoading: false,
    };

    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    useReduxContextMock.mockReturnValue({
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    });

    getFavoritedPharmaciesDispatchMock.mockResolvedValue({
      data: { favoritedPharmacies: [] as IPharmacy[] },
    });

    setState({});

    useIsMountedMock.mockReturnValue({ current: true });

    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: {
          favoritedPharmacies: favoritedPharmaciesMock,
        },
        favoritingStatus: 'none' as FavoritingStatus,
      },
      membershipDispatch: membershipDispatchMock,
    });
  });

  it('renders notification as AllFavoriteNotifications', () => {
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: {
          favoritedPharmacies: favoritedPharmaciesMock,
        },
        favoritingStatus: 'success' as FavoritingStatus,
      },
      membershipDispatch: membershipDispatchMock,
    });

    const pharmacyMock1 = {
      ncpdp: 'ncpdp-mock-1',
      name: 'name-mock-1',
      address: {
        lineOne: 'line-one-mock-1',
        city: 'city-mock=1',
        state: 'state-mock-1',
      } as IAddress,
    } as IPharmacy;

    setState({
      favoritedPharmacyList: [pharmacyMock1],
    });

    const contentMock: Partial<IFavoritePharmaciesScreenContent> = {
      favoritePharmaciesTitle: 'favorite-pharmacies-title-mock',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IFavoritePharmaciesScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };

    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const testRenderer = renderer.create(<FavoritePharmaciesScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    const notification = basicPage.props.notification;

    expect(notification.type).toEqual(AllFavoriteNotifications);
  });

  it('renders AllFavoriteNotifications with expected props', () => {
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: {
          favoritedPharmacies: favoritedPharmaciesMock,
        },
        favoritingStatus: 'error' as FavoritingStatus,
      },
      membershipDispatch: membershipDispatchMock,
    });

    const pharmacyMock1 = {
      ncpdp: 'ncpdp-mock-1',
      name: 'name-mock-1',
      address: {
        lineOne: 'line-one-mock-1',
        city: 'city-mock=1',
        state: 'state-mock-1',
      } as IAddress,
    } as IPharmacy;

    setState({
      favoritedPharmacyList: [pharmacyMock1],
    });

    const contentMock: Partial<IFavoritePharmaciesScreenContent> = {
      favoritePharmaciesTitle: 'favorite-pharmacies-title-mock',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IFavoritePharmaciesScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };

    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const testRenderer = renderer.create(<FavoritePharmaciesScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    const notification = basicPage.props.notification;

    expect(notification.props.onNotificationClose).toEqual(
      expect.any(Function)
    );

    notification.props.onNotificationClose();

    expect(setFavoritingStatusDispatchMock).toHaveBeenCalledTimes(1);
    expect(setFavoritingStatusDispatchMock).toHaveBeenNthCalledWith(
      1,
      membershipDispatchMock,
      'none' as FavoritingStatus
    );
  });

  it('calls getFavoritedPharmaciesDispatch as expected on mount', async () => {
    const favoritedPharmaciesResponseMock = [
      { name: 'name-mock-1' } as IPharmacy,
      { name: 'name-mock-2' } as IPharmacy,
    ];

    getFavoritedPharmaciesDispatchMock.mockReset();
    getFavoritedPharmaciesDispatchMock.mockReturnValue({
      data: { favoritedPharmacies: favoritedPharmaciesResponseMock },
    });

    renderer.create(<FavoritePharmaciesScreen />);

    expect(useEffectMock.mock.calls).toEqual([[expect.any(Function), []]]);

    const useEffectCallback = useEffectMock.mock.calls[0][0];

    const callbackData = await useEffectCallback();

    expect(setErrorMessageMock).toHaveBeenCalledTimes(1);
    expect(setErrorMessageMock).toHaveBeenNthCalledWith(1, '');

    expect(getFavoritedPharmaciesDispatchMock).toHaveBeenCalledTimes(1);
    expect(getFavoritedPharmaciesDispatchMock).toHaveBeenNthCalledWith(
      1,
      reduxDispatchMock,
      reduxGetStateMock
    );

    if (callbackData) {
      expect(callbackData).toEqual(expect.any(Function));
      const data = callbackData();
      if (data) {
        expect(data).toEqual(favoritedPharmaciesResponseMock);
        expect(setFavoritedPharmacyListMock).toBeCalledTimes(1);
        expect(setFavoritedPharmacyListMock).toBeCalledWith();
      }
    }
  });

  it('sets error message as expected on mount if no favorited pharmacies', async () => {
    const contentMock: Partial<IFavoritePharmaciesScreenContent> = {
      favoritePharmaciesTitle: 'favorite-pharmacies-title-mock',
      favoritePharmaciesErrorMessage: 'favorite-pharmacies-error-message-mock',
    };
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IFavoritePharmaciesScreenContent>>
    > = {
      content: contentMock,
      isContentLoading: false,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const favoritedPharmaciesResponseMock = [] as IPharmacy[];

    getFavoritedPharmaciesDispatchMock.mockReset();
    getFavoritedPharmaciesDispatchMock.mockReturnValue({
      data: { favoritedPharmacies: favoritedPharmaciesResponseMock },
    });

    renderer.create(<FavoritePharmaciesScreen />);

    expect(useEffectMock.mock.calls).toEqual([[expect.any(Function), []]]);

    const useEffectCallback = useEffectMock.mock.calls[0][0];

    const callbackData = await useEffectCallback();

    if (callbackData) {
      expect(callbackData).toEqual(expect.any(Function));
      const data = callbackData();
      if (data) {
        expect(data).toEqual([]);
        expect(setErrorMessageMock).toHaveBeenCalledTimes(2);
        expect(setErrorMessageMock).toHaveBeenNthCalledWith(1, '');
        expect(setErrorMessageMock).toHaveBeenNthCalledWith(
          2,
          'favorite-pharmacies-error-message-mock'
        );
      }
    }
  });

  it('handles getFavoritedPharmaciesDispatch error as expected on mount', async () => {
    const contentMock: Partial<IFavoritePharmaciesScreenContent> = {
      favoritePharmaciesTitle: 'favorite-pharmacies-title-mock',
      favoritePharmaciesErrorMessage: 'favorite-pharmacies-error-message-mock',
    };
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IFavoritePharmaciesScreenContent>>
    > = {
      content: contentMock,
      isContentLoading: false,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const errorMock = new Error('error-mock');

    getFavoritedPharmaciesDispatchMock.mockReset();
    getFavoritedPharmaciesDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    renderer.create(<FavoritePharmaciesScreen />);

    expect(useEffectMock.mock.calls).toEqual([[expect.any(Function), []]]);

    const useEffectCallback = useEffectMock.mock.calls[0][0];

    await useEffectCallback();

    expect(setErrorMessageMock).toHaveBeenCalledTimes(2);
    expect(setErrorMessageMock).toHaveBeenNthCalledWith(1, '');
    expect(setErrorMessageMock).toHaveBeenNthCalledWith(
      2,
      'favorite-pharmacies-error-message-mock'
    );

    expect(getFavoritedPharmaciesDispatchMock).toHaveBeenCalledTimes(1);
    expect(getFavoritedPharmaciesDispatchMock).toHaveBeenNthCalledWith(
      1,
      reduxDispatchMock,
      reduxGetStateMock
    );

    expect(setFavoritedPharmacyListMock).toHaveBeenCalledTimes(0);
  });

  it('gets content', () => {
    renderer.create(<FavoritePharmaciesScreen />);

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.favoritePharmaciesScreen,
      2
    );
  });

  it('renders BasicPage as expected', () => {
    const testRenderer = renderer.create(<FavoritePharmaciesScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.body).toBeDefined();
    expect(basicPage.props.navigateBack).toEqual(
      rootStackNavigationMock.goBack
    );
    expect(basicPage.props.showProfileAvatar).toEqual(true);
    expect(basicPage.props.notification).toBeUndefined();
  });

  it('renders body container as expected', () => {
    const contentMock: Partial<IFavoritePharmaciesScreenContent> = {
      favoritePharmaciesTitle: 'favorite-pharmacies-title-mock',
      favoritePharmaciesErrorMessage: 'favorite-pharmacies-error-message-mock',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IFavoritePharmaciesScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };

    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const testRenderer = renderer.create(<FavoritePharmaciesScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.title).toEqual(
      contentMock.favoritePharmaciesTitle
    );
    expect(bodyContainer.props.testID).toEqual('favoritePharmaciesScreen');
    expect(bodyContainer.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(getChildren(bodyContainer).length).toEqual(2);

    const baseText = getChildren(bodyContainer)[0];

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual(
      favoritePharmaciesScreenStyles.errorMessageTextStyle
    );
    expect(baseText.props.children).toEqual('');

    const pageContent = getChildren(bodyContainer)[1];

    expect(pageContent.type).toEqual(View);

    const skeletonFavoritePharmacyCards = getChildren(pageContent);

    expect(skeletonFavoritePharmacyCards.length).toEqual(
      favoritedPharmaciesMock.length
    );
    expect(skeletonFavoritePharmacyCards[0].type).toEqual(FavoritePharmacyCard);
    expect(skeletonFavoritePharmacyCards[0].props.isSkeleton).toEqual(true);
    expect(skeletonFavoritePharmacyCards[0].props.pharmacyNcpdp).toEqual(
      favoritedPharmaciesMock[0]
    );
  });

  it('renders FavoritePharmacyCard list as expected', () => {
    const pharmacyMock1 = {
      ncpdp: 'ncpdp-mock-1',
      name: 'name-mock-1',
      address: {
        lineOne: 'line-one-mock-1',
        city: 'city-mock=1',
        state: 'state-mock-1',
      } as IAddress,
    } as IPharmacy;

    const pharmacyMock2 = {
      ncpdp: 'ncpdp-mock-2',
      name: 'name-mock-2',
      address: {
        lineOne: 'line-one-mock-2',
        city: 'city-mock=2',
        state: 'state-mock-2',
      } as IAddress,
    } as IPharmacy;

    setState({
      favoritedPharmacyList: [pharmacyMock1, pharmacyMock2],
    });

    const contentMock: Partial<IFavoritePharmaciesScreenContent> = {
      favoritePharmaciesTitle: 'favorite-pharmacies-title-mock',
      favoritePharmaciesErrorMessage: 'favorite-pharmacies-error-message-mock',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IFavoritePharmaciesScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };

    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const testRenderer = renderer.create(<FavoritePharmaciesScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;
    const bodyContainer = basicPage.props.body;
    const pageContent = getChildren(bodyContainer)[1];

    const favoritePharmacyCard1 = (pageContent as unknown as JSX.Element[])[0];
    const favoritePharmacyCard2 = (pageContent as unknown as JSX.Element[])[1];

    expect(favoritePharmacyCard1.type).toEqual(FavoritePharmacyCard);
    expect(favoritePharmacyCard1.props.onPress).toEqual(expect.any(Function));
    expect(favoritePharmacyCard1.props.pharmacyName).toEqual(
      pharmacyMock1.name
    );
    expect(favoritePharmacyCard1.props.pharmacyAddress).toEqual(
      `${pharmacyMock1.address.lineOne} ${pharmacyMock1.address.city}, ${pharmacyMock1.address.state}`
    );
    expect(favoritePharmacyCard1.props.pharmacyNcpdp).toEqual(
      pharmacyMock1.ncpdp
    );
    expect(favoritePharmacyCard1.props.testID).toEqual(
      `favoritePharmacyCard-${pharmacyMock1.ncpdp}`
    );

    expect(favoritePharmacyCard2.type).toEqual(FavoritePharmacyCard);
    expect(favoritePharmacyCard2.props.onPress).toEqual(expect.any(Function));
    expect(favoritePharmacyCard2.props.pharmacyName).toEqual(
      pharmacyMock2.name
    );
    expect(favoritePharmacyCard2.props.pharmacyAddress).toEqual(
      `${pharmacyMock2.address.lineOne} ${pharmacyMock2.address.city}, ${pharmacyMock2.address.state}`
    );
    expect(favoritePharmacyCard2.props.pharmacyNcpdp).toEqual(
      pharmacyMock2.ncpdp
    );
    expect(favoritePharmacyCard2.props.testID).toEqual(
      `favoritePharmacyCard-${pharmacyMock2.ncpdp}`
    );
  });

  it('calls favoritePharmacyAsyncActionHandler with expected args on FavoritePharmacyCardPress', async () => {
    const pharmacyMock1 = {
      ncpdp: 'ncpdp-mock-1',
      name: 'name-mock-1',
      address: {
        lineOne: 'line-one-mock-1',
        city: 'city-mock=1',
        state: 'state-mock-1',
      } as IAddress,
    } as IPharmacy;

    setState({
      favoritedPharmacyList: [pharmacyMock1],
    });

    const contentMock: Partial<IFavoritePharmaciesScreenContent> = {
      favoritePharmaciesTitle: 'favorite-pharmacies-title-mock',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IFavoritePharmaciesScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };

    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const testRenderer = renderer.create(<FavoritePharmaciesScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;
    const bodyContainer = basicPage.props.body;
    const pageContent = getChildren(bodyContainer)[1];

    const favoritePharmacyCard = (pageContent as unknown as JSX.Element[])[0];

    const favoritingActionMock: FavoritingAction = 'unfavoriting';

    await favoritePharmacyCard.props.onPress(favoritingActionMock);

    expect(favoritePharmacyAsyncActionMock).toHaveBeenCalledTimes(1);
    expect(favoritePharmacyAsyncActionMock).toHaveBeenNthCalledWith(1, {
      ncpdp: pharmacyMock1.ncpdp,
      navigation: rootStackNavigationMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      membershipDispatch: membershipDispatchMock,
    });
  });
});
