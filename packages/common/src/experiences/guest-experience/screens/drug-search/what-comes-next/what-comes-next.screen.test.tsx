// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { ActionCard } from '../../../../../components/cards/action/action.card';
import { LineSeparator } from '../../../../../components/member/line-separator/line-separator';
import { PrescriptionPharmacyInfo } from '../../../../../components/member/prescription-pharmacy-info/prescription-pharmacy-info';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { ICouponDetails } from '../../../../../models/coupon-details/coupon-details';
import { IDrugConfiguration } from '../../../../../models/drug-configuration';
import { IProfile } from '../../../../../models/member-profile/member-profile-info';
import { getNewDate } from '../../../../../utils/date-time/get-new-date';
import dateFormatter, {
  IOpenStatusContent,
} from '../../../../../utils/formatters/date.formatter';
import { IDrugDetails } from '../../../../../utils/formatters/drug.formatter';
import { IDrugSearchContext } from '../../../context-providers/drug-search/drug-search.context';
import { useDrugSearchContext } from '../../../context-providers/drug-search/use-drug-search-context.hook';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import { IReduxContext } from '../../../context-providers/redux/redux.context';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import {
  defaultDrugSearchState,
  IDrugSearchState,
} from '../../../state/drug-search/drug-search.state';
import { selectedDrugMock } from '../../../__mocks__/drug-search-state.mock';
import {
  pharmacyDrugPrice1Mock,
  pharmacyDrugPrice2Mock,
} from '../../../__mocks__/pharmacy-drug-price.mock';
import { profileListMock } from '../../../__mocks__/profile-list.mock';
import { DrugWithPriceSection } from './sections/drug-with-price/drug-with-price.section';
import { PrescriptionAtThisPharmacySection } from './sections/prescription-at-this-pharmacy/prescription-at-this-pharmacy.section';
import { WhatComesNextScreen } from './what-comes-next.screen';
import { whatComesNextScreenStyles } from './what-comes-next.screen.styles';
import { PrescriptionPriceSection } from '../../../../../components/member/prescription-price/prescription-price.section';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IFindYourPharmacyScreenRouteProps } from '../find-pharmacy/find-your-pharmacy.screen';
import { getChildren } from '../../../../../testing/test.helper';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { IWhatComesNextScreenContent } from '../../../../../models/cms-content/what-comes-next-ui-content.model';
import { useFeaturesContext } from '../../../context-providers/features/use-features-context.hook';
import { getProfilesByGroup } from '../../../../../utils/profile.helper';
import { LogoClickActionEnum } from '../../../../../components/app/application-header/application-header';
import {
  FavoriteIconButton,
  FavoritingAction,
} from '../../../../../components/buttons/favorite-icon/favorite-icon.button';
import { Heading } from '../../../../../components/member/heading/heading';
import { useFavorites } from '../../../../../hooks/use-favorites/use-favorites.hook';
import { View } from 'react-native';
import { AllFavoriteNotifications } from '../../../../../components/notifications/all-favorite/all-favorite.notifications';
import { favoritePharmacyAsyncAction } from '../../../store/set-favorite-pharmacy/async-actions/favorite-pharmacy.async-action';
import { setFavoritingStatusDispatch } from '../../../state/membership/dispatch/set-favoriting-status.dispatch';
import { useTalkativeWidget } from '../../../../../hooks/use-talkative-widget/use-talkative-widget';
import { assertIsDefined } from '../../../../../assertions/assert-is-defined';
import drugSearchResultHelper from '../../../../../utils/drug-search/drug-search-result.helper';
import { PricingOption } from '../../../../../models/pricing-option';

jest.mock('../../../state/membership/dispatch/set-favoriting-status.dispatch');
const setFavoritingStatusDispatchMock =
  setFavoritingStatusDispatch as jest.Mock;

jest.mock(
  '../../../store/set-favorite-pharmacy/async-actions/favorite-pharmacy.async-action'
);
const favoritePharmacyAsyncActionMock =
  favoritePharmacyAsyncAction as jest.Mock;

jest.mock(
  '../../../../../components/buttons/favorite-icon/favorite-icon.button',
  () => ({
    ...jest.requireActual(
      '../../../../../components/buttons/favorite-icon/favorite-icon.button'
    ),
    FavoriteIconButton: () => <div />,
  })
);

jest.mock('../../../../../components/member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../../../../hooks/use-favorites/use-favorites.hook');
const useFavoritesMock = useFavorites as jest.Mock;

jest.mock(
  '../../../../../components/containers/body-content/body-content.container',
  () => ({
    BodyContentContainer: () => <div />,
  })
);

jest.mock('../../../context-providers/features/use-features-context.hook');
const useFeaturesContextMock = useFeaturesContext as jest.Mock;

jest.mock(
  '../../../../../components/member/prescription-pharmacy-info/prescription-pharmacy-info',
  () => ({
    PrescriptionPharmacyInfo: () => <div />,
  })
);

jest.mock('../../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock(
  '../../../context-providers/drug-search/use-drug-search-context.hook'
);
const useDrugSearchContextMock = useDrugSearchContext as jest.Mock;

jest.mock('./sections/drug-with-price/drug-with-price.section', () => ({
  DrugWithPriceSection: () => <div />,
}));

jest.mock('../../../../../components/cards/action/action.card', () => ({
  ActionCard: () => <div />,
}));

jest.mock('../../../../../components/primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

jest.mock('../../../../../utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

jest.mock(
  './sections/prescription-at-this-pharmacy/prescription-at-this-pharmacy.section',
  () => ({
    PrescriptionAtThisPharmacySection: () => <div />,
  })
);

jest.mock('../../../../../utils/formatters/date.formatter');
const formatOpenStatusMock = dateFormatter.formatOpenStatus as jest.Mock;

jest.mock('../../../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../../../../../hooks/use-talkative-widget/use-talkative-widget');
const useTalkativeWidgetMock = useTalkativeWidget as jest.Mock;

jest.mock(
  '../../../../../hooks/use-talkative-widget/helpers/hide-talkative-element-style-display'
);

jest.mock('../../../../../assertions/assert-is-defined');
const assertIsDefinedMock = assertIsDefined as jest.Mock;

const useRouteMock = useRoute as jest.Mock;

const cashUserProfile = profileListMock[0];
const sieProfile = profileListMock[1];

const contentMock: IWhatComesNextScreenContent = {
  anotherPharmacyLabel: 'another-pharmacy-label-mock',
  anotherPharmacySubtitle: 'another-pharmacy-subtitle-mock',
  getStartedLabel: 'get-started-label-mock',
  newPrescriptionLabel: 'new-prescription-label-mock',
  newPrescriptionSubtitle: 'new-prescription-subtitle-mock',
  prescriptionAtThisPharmacy: {
    instructions: '',
    heading: '',
    unAuthInformation: '',
    signUpButtonLabel: '',
  },
};

const openStatusContentMock: IOpenStatusContent = {
  closed: 'closed',
  open: 'open',
  open24Hours: 'open-24-hours',
  opensAt: 'opens-at-label',
  closesAt: 'closes-at-label',
};

const pricingOptionMock = 'smartPrice' as PricingOption;

describe('WhatComesNextScreen', () => {
  const reduxDispatchMock = jest.fn();
  const reduxGetStateMock = jest.fn();
  const reduxContextMock: IReduxContext = {
    dispatch: reduxDispatchMock,
    getState: reduxGetStateMock,
  };

  const membershipDispatchMock = jest.fn();

  const selectedConfigurationMock: IDrugConfiguration = {
    ndc: selectedDrugMock.drugVariants[0].ndc,
    quantity: 1,
    supply: 30,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });

    useReduxContextMock.mockReturnValue(reduxContextMock);

    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      selectedPharmacy: pharmacyDrugPrice1Mock,
      selectedDrug: selectedDrugMock,
      selectedConfiguration: selectedConfigurationMock,
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);
    formatOpenStatusMock.mockReturnValue(openStatusContentMock.open);
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        profileList: [],
        account: { favoritedPharmacies: [] },
      },
      membershipDispatch: membershipDispatchMock,
    });
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useFeaturesContextMock.mockReturnValue({
      featuresState: {
        usegrouptypesie: false,
        usegrouptypecash: false,
      },
    });
    useFavoritesMock.mockReturnValue({
      isFavorites: false,
      isPharmacyFavorited: false,
    });
    useRouteMock.mockReturnValue({
      params: { pricingOption: pricingOptionMock },
    });
  });

  it('has expected number of assertions', () => {
    renderer.create(<WhatComesNextScreen />);

    expect(assertIsDefinedMock).toHaveBeenCalledTimes(4);
  });

  it('useNavigation and useRoute have been called only once', () => {
    renderer.create(<WhatComesNextScreen />);

    expect(useNavigationMock).toHaveBeenNthCalledWith(1);
    expect(useRouteMock).toHaveBeenNthCalledWith(1);
  });

  it('asserts pharmacy selected', () => {
    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      selectedPharmacy: pharmacyDrugPrice1Mock,
      selectedDrug: selectedDrugMock,
      selectedConfiguration: selectedConfigurationMock,
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    renderer.create(<WhatComesNextScreen />);

    expect(assertIsDefinedMock).toHaveBeenNthCalledWith(
      1,
      pharmacyDrugPrice1Mock
    );
  });

  it('asserts configuration selected', () => {
    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      selectedPharmacy: pharmacyDrugPrice1Mock,
      selectedDrug: selectedDrugMock,
      selectedConfiguration: selectedConfigurationMock,
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    renderer.create(<WhatComesNextScreen />);

    expect(assertIsDefinedMock).toHaveBeenNthCalledWith(
      2,
      selectedConfigurationMock
    );
  });

  it('asserts drug selected', () => {
    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      selectedPharmacy: pharmacyDrugPrice1Mock,
      selectedDrug: selectedDrugMock,
      selectedConfiguration: selectedConfigurationMock,
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    renderer.create(<WhatComesNextScreen />);

    expect(assertIsDefinedMock).toHaveBeenNthCalledWith(3, selectedDrugMock);
  });

  it('asserts drug variant found', () => {
    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      selectedPharmacy: pharmacyDrugPrice1Mock,
      selectedDrug: selectedDrugMock,
      selectedConfiguration: selectedConfigurationMock,
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    renderer.create(<WhatComesNextScreen />);

    const expectedVariant = drugSearchResultHelper.getVariantByNdc(
      selectedConfigurationMock.ndc,
      selectedDrugMock
    );
    expect(assertIsDefinedMock).toHaveBeenNthCalledWith(4, expectedVariant);
  });

  it('renders as Basic Page', () => {
    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.translateContent).toEqual(true);
    expect(basicPage.props.applicationHeaderHamburgerTestID).toEqual(
      'whatComesNextScreenHeaderHamburgerButton'
    );
  });

  it('renders body in content container', () => {
    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const contentContainer = bodyRenderer.root.findByType(BodyContentContainer);
    expect(contentContainer.props.translateTitle).toEqual(false);

    expect(getChildren(contentContainer).length).toEqual(6);
  });

  it('renders notification as AllFavoriteNotifications', () => {
    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    expect(basicPage.props.notification.type).toEqual(AllFavoriteNotifications);
  });

  it('renders AllFavoriteNotifications with expected props', () => {
    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const notification = basicPage.props.notification;

    expect(notification.props.onNotificationClose).toEqual(
      expect.any(Function)
    );

    notification.props.onNotificationClose();

    expect(setFavoritingStatusDispatchMock).toHaveBeenCalledTimes(1);
    expect(setFavoritingStatusDispatchMock).toHaveBeenNthCalledWith(
      1,
      membershipDispatchMock,
      'none'
    );
  });

  it('calls favoritePharmacyAsyncAction with expected args on FavoriteIconButton press', async () => {
    useFavoritesMock.mockReturnValue({
      isFavorites: true,
      isPharmacyFavorited: false,
    });
    useMembershipContextMock.mockReset();
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        profileList: [],
        account: { favoritedPharmacies: ['favorited-ncpdp-mock'] },
      },
      membershipDispatch: membershipDispatchMock,
    });

    const testRenderer = renderer.create(<WhatComesNextScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyRenderer = renderer.create(body);
    const bodyContentContainer =
      bodyRenderer.root.findByType(BodyContentContainer);
    const heading = bodyContentContainer.props.title;

    expect(heading.props.style).toEqual(
      whatComesNextScreenStyles.bodyContentContainerTitleViewStyle
    );
    expect(bodyContentContainer.props.translateTitle).toEqual(false);

    const actualHeading = getChildren(heading)[0];
    const favoriteIconButton = getChildren(heading)[1];

    expect(actualHeading.type).toEqual(Heading);
    expect(actualHeading.props.children).toEqual(
      pharmacyDrugPrice1Mock.pharmacy.name
    );
    expect(favoriteIconButton.type).toEqual(FavoriteIconButton);
    expect(favoriteIconButton.props.onPress).toEqual(expect.any(Function));
    expect(favoriteIconButton.props.testID).toEqual(
      'favoriteIconButtonInBodyContentContainer'
    );
    expect(favoriteIconButton.props.ncpdp).toEqual(
      pharmacyDrugPrice1Mock.pharmacy.ncpdp
    );

    const onFavoriteIconButtonPress = favoriteIconButton.props.onPress;
    const favoritingActionMock: FavoritingAction = 'favoriting';

    await onFavoriteIconButtonPress(favoritingActionMock);

    expect(favoritePharmacyAsyncActionMock).toHaveBeenCalledTimes(1);
    expect(favoritePharmacyAsyncActionMock).toHaveBeenNthCalledWith(1, {
      ncpdp: pharmacyDrugPrice1Mock.pharmacy.ncpdp,
      navigation: rootStackNavigationMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      membershipDispatch: membershipDispatchMock,
    });
  });

  it.each([[undefined], ['brand-mock']])(
    'renders heading (pharmacy name)',
    (brandMock?: string) => {
      const selectedConfigurationMock: IDrugConfiguration = {
        ndc: selectedDrugMock.drugVariants[0].ndc,
        quantity: 1,
        supply: 30,
      };
      const drugSearchStateMock: IDrugSearchState = {
        ...defaultDrugSearchState,
        selectedPharmacy: {
          ...pharmacyDrugPrice1Mock,
          pharmacy: { ...pharmacyDrugPrice1Mock.pharmacy, brand: brandMock },
        },
        selectedDrug: selectedDrugMock,
        selectedConfiguration: selectedConfigurationMock,
      };
      const drugSearchContextMock: IDrugSearchContext = {
        drugSearchState: drugSearchStateMock,
        drugSearchDispatch: jest.fn(),
      };
      useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

      const testRenderer = renderer.create(<WhatComesNextScreen />);
      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const body = basicPage.props.body;
      const bodyRenderer = renderer.create(body);
      const bodyContentContainer =
        bodyRenderer.root.findByType(BodyContentContainer);
      const pharmacyBrandOrName =
        brandMock ?? pharmacyDrugPrice1Mock.pharmacy.name;

      const heading = bodyContentContainer.props.title;

      if (typeof heading === 'string') {
        expect(heading).toEqual(pharmacyBrandOrName);
      } else if (heading.type === View) {
        expect(heading.props.style).toEqual(
          whatComesNextScreenStyles.bodyContentContainerTitleViewStyle
        );
        const actualHeading = getChildren(heading)[0];

        expect(actualHeading.type).toEqual(Heading);
        expect(actualHeading.props.children).toEqual(pharmacyBrandOrName);
        expect(actualHeading.props.testID).toEqual(
          'whatComesNextScreenTitleHeading'
        );
      }
    }
  );

  it('renders pharmacy information', () => {
    const nowMock = {} as Date;
    getNewDateMock.mockReturnValue(nowMock);

    const selectedConfigurationMock: IDrugConfiguration = {
      ndc: selectedDrugMock.drugVariants[0].ndc,
      quantity: 1,
      supply: 30,
    };
    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      selectedPharmacy: pharmacyDrugPrice1Mock,
      selectedDrug: selectedDrugMock,
      selectedConfiguration: selectedConfigurationMock,
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const contentContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const pharmacyInfo = getChildren(contentContainer)[0];

    expect(pharmacyInfo.type).toEqual(PrescriptionPharmacyInfo);
    expect(pharmacyInfo.props.phoneNumber).toEqual(
      pharmacyDrugPrice1Mock.pharmacy.phoneNumber
    );
    expect(pharmacyInfo.props.pharmacyAddress1).toEqual(
      pharmacyDrugPrice1Mock.pharmacy.address.lineOne
    );
    expect(pharmacyInfo.props.pharmacyState).toEqual(
      pharmacyDrugPrice1Mock.pharmacy.address.state
    );
    expect(pharmacyInfo.props.pharmacyCity).toEqual(
      pharmacyDrugPrice1Mock.pharmacy.address.city
    );
    expect(pharmacyInfo.props.pharmacyZipCode).toEqual(
      pharmacyDrugPrice1Mock.pharmacy.address.zip
    );
    expect(pharmacyInfo.props.hideLinkButtons).toEqual(true);

    const expectedOpenStatus = openStatusContentMock.open;
    expect(pharmacyInfo.props.openStatus).toEqual(expectedOpenStatus);
  });

  it('renders first separator', () => {
    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const contentContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const separator = getChildren(contentContainer)[1];

    expect(separator.type).toEqual(LineSeparator);
    expect(separator.props.viewStyle).toEqual(
      whatComesNextScreenStyles.separatorViewStyle
    );
  });

  it.each([
    [[], undefined, false, false],
    [[], undefined, true, false],
    [[], pharmacyDrugPrice2Mock.price?.planPays, false, true],

    [[cashUserProfile], undefined, false, false],
    [[cashUserProfile], undefined, true, false],
    [[cashUserProfile], pharmacyDrugPrice2Mock.price?.planPays, false, true],

    [[sieProfile], pharmacyDrugPrice2Mock.price?.planPays, false, false],
    [[sieProfile], undefined, true, false],
    [[sieProfile], pharmacyDrugPrice2Mock.price?.planPays, false, true],
    [
      [sieProfile, cashUserProfile],
      pharmacyDrugPrice2Mock.price?.planPays,
      false,
      false,
    ],
    [[sieProfile, cashUserProfile], undefined, true, false],
    [
      [sieProfile, cashUserProfile],
      pharmacyDrugPrice2Mock.price?.planPays,
      false,
      true,
    ],
  ])(
    'renders drug with price section based on the user profiles and feature flags (profiles: %p; planPrice: %p)',
    (
      memberProfiles: IProfile[],
      planPrice: number | undefined,
      cashFeatureFlag: boolean,
      sieFeatureFlag: boolean
    ) => {
      useMembershipContextMock.mockReturnValue({
        membershipState: {
          profileList: memberProfiles,
          account: { favoritedPharmacies: [] },
        },
      });

      useFeaturesContextMock.mockReturnValue({
        featuresState: {
          usegrouptypecash: cashFeatureFlag,
          usegrouptypesie: sieFeatureFlag,
        },
      });

      const selectedConfigurationMock: IDrugConfiguration = {
        ndc: selectedDrugMock.drugVariants[0].ndc,
        quantity: 1,
        supply: 30,
      };
      const drugSearchStateMock: IDrugSearchState = {
        ...defaultDrugSearchState,
        selectedPharmacy: { ...pharmacyDrugPrice2Mock, coupon: undefined },
        selectedDrug: selectedDrugMock,
        selectedConfiguration: selectedConfigurationMock,
      };
      const drugSearchContextMock: IDrugSearchContext = {
        drugSearchState: drugSearchStateMock,
        drugSearchDispatch: jest.fn(),
      };
      useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

      const testRenderer = renderer.create(<WhatComesNextScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const body = basicPage.props.body;

      const bodyRenderer = renderer.create(body);

      const contentContainer =
        bodyRenderer.root.findByType(BodyContentContainer);
      const drugWithPriceSection = contentContainer.props.children[2];

      expect(drugWithPriceSection.type).toEqual(DrugWithPriceSection);
      expect(drugWithPriceSection.props.drugName).toEqual(
        selectedDrugMock.name
      );

      const expectedVariant = selectedDrugMock.drugVariants[0];
      const expectedDrugDetails: IDrugDetails = {
        formCode: expectedVariant.formCode,
        strength: expectedVariant.strength,
        unit: expectedVariant.strengthUnit,
        quantity: selectedConfigurationMock.quantity,
        supply: selectedConfigurationMock.supply,
      };
      expect(drugWithPriceSection.props.drugDetails).toEqual(
        expectedDrugDetails
      );

      expect(drugWithPriceSection.props.price).toEqual(
        pharmacyDrugPrice2Mock.price?.memberPays
      );
      expect(drugWithPriceSection.props.hideSeparator).toEqual(true);

      const sieProfile = getProfilesByGroup(memberProfiles, 'SIE');
      const isSieMember = sieProfile && sieProfile.length > 0;

      if (isSieMember)
        expect(drugWithPriceSection.props.planPrice).toEqual(planPrice);
      else expect(drugWithPriceSection.props.planPays).toBeUndefined();
    }
  );

  it('renders drug with undefined price section if price is undefined', () => {
    const selectedConfigurationMock: IDrugConfiguration = {
      ndc: selectedDrugMock.drugVariants[0].ndc,
      quantity: 1,
      supply: 30,
    };
    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      selectedPharmacy: {
        ...pharmacyDrugPrice1Mock,
        price: undefined,
      },
      selectedDrug: selectedDrugMock,
      selectedConfiguration: selectedConfigurationMock,
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const contentContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const drugWithPriceSection = getChildren(contentContainer)[2];

    expect(drugWithPriceSection.type).toEqual(DrugWithPriceSection);
    expect(drugWithPriceSection.props.drugName).toEqual(selectedDrugMock.name);

    const expectedVariant = selectedDrugMock.drugVariants[0];
    const expectedDrugDetails: IDrugDetails = {
      formCode: expectedVariant.formCode,
      strength: expectedVariant.strength,
      unit: expectedVariant.strengthUnit,
      quantity: selectedConfigurationMock.quantity,
      supply: selectedConfigurationMock.supply,
    };
    expect(drugWithPriceSection.props.drugDetails).toEqual(expectedDrugDetails);

    expect(drugWithPriceSection.props.price).toEqual(undefined);
    expect(drugWithPriceSection.props.hideSeparator).toEqual(true);
  });

  it('renders PrescriptionPriceSection when expected', () => {
    const selectedConfigurationMock: IDrugConfiguration = {
      ndc: selectedDrugMock.drugVariants[0].ndc,
      quantity: 1,
      supply: 30,
    };

    const couponMock = pharmacyDrugPrice2Mock.coupon as ICouponDetails;
    couponMock.featuredPharmacy = 'ncpdp-2';
    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      selectedPharmacy: pharmacyDrugPrice2Mock,
      selectedDrug: selectedDrugMock,
      selectedConfiguration: selectedConfigurationMock,
      pharmacies: [pharmacyDrugPrice2Mock, pharmacyDrugPrice2Mock],
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const contentContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const prescriptionPriceSection = getChildren(contentContainer)[2];

    expect(prescriptionPriceSection.type).toEqual(PrescriptionPriceSection);
    expect(prescriptionPriceSection.props.hasAssistanceProgram).toEqual(true);
    expect(prescriptionPriceSection.props.showPlanPays).toEqual(false);
    expect(prescriptionPriceSection.props.memberPays).toEqual(
      pharmacyDrugPrice2Mock.price?.memberPays
    );
    expect(prescriptionPriceSection.props.planPays).toEqual(
      pharmacyDrugPrice2Mock.price?.planPays
    );
    expect(prescriptionPriceSection.props.couponDetails).toEqual(
      pharmacyDrugPrice2Mock.coupon
    );
  });

  it('renders "Is your prescription at this pharmacy" section', () => {
    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyRenderer = renderer.create(body);

    const contentContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const prescriptionAtThisPharmacySectionView =
      getChildren(contentContainer)[3];
    const prescriptionAtThisPharmacySection =
      prescriptionAtThisPharmacySectionView.props.children;
    expect(prescriptionAtThisPharmacySection.type).toEqual(
      PrescriptionAtThisPharmacySection
    );
    expect(prescriptionAtThisPharmacySection.props.onSignUpPress).toEqual(
      expect.any(Function)
    );
  });

  it('renders "prescription at another pharmacy" section', () => {
    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const contentContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const prescriptionTransferCard = getChildren(contentContainer)[4];
    expect(prescriptionTransferCard.type).toEqual(ActionCard);
    expect(prescriptionTransferCard.props.imageName).toEqual('pillBottleIcon');
    expect(prescriptionTransferCard.props.title).toEqual(
      contentMock.anotherPharmacyLabel
    );
    expect(prescriptionTransferCard.props.subTitle).toEqual(
      contentMock.anotherPharmacySubtitle
    );
    expect(prescriptionTransferCard.props.viewStyle).toEqual(
      whatComesNextScreenStyles.prescriptionAtAnotherPharmacyViewStyle
    );
    expect(prescriptionTransferCard.props.button).toEqual({
      label: contentMock.getStartedLabel,
      onPress: expect.any(Function),
    });
    expect(prescriptionTransferCard.props.testID).toEqual(
      'actionCardPillBottleIcon'
    );
    expect(prescriptionTransferCard.props.isSingleton).toEqual(true);
  });

  it('handles transfer prescription get started button press', () => {
    const expectedRouteProps: IFindYourPharmacyScreenRouteProps = {
      workflow: 'prescriptionTransfer',
      pricingOption: pricingOptionMock,
    };

    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const contentContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const prescriptionTransferSection = getChildren(contentContainer)[4];
    const onGetStartedPress = prescriptionTransferSection.props.button.onPress;

    onGetStartedPress();

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'FindYourPharmacy',
      expectedRouteProps
    );
  });

  it('renders "new prescription" section', () => {
    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyRenderer = renderer.create(body);

    const contentContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const newPrescriptionCard = getChildren(contentContainer)[5];

    expect(newPrescriptionCard.type).toEqual(ActionCard);
    expect(newPrescriptionCard.props.imageName).toEqual('newPrescriptionIcon');
    expect(newPrescriptionCard.props.title).toEqual(
      contentMock.newPrescriptionLabel
    );
    expect(newPrescriptionCard.props.subTitle).toEqual(
      contentMock.newPrescriptionSubtitle
    );
    expect(newPrescriptionCard.props.button).toEqual({
      label: contentMock.getStartedLabel,
      onPress: expect.any(Function),
    });
    expect(newPrescriptionCard.props.viewStyle).toEqual(
      whatComesNextScreenStyles.newPrescriptionViewStyle
    );
    expect(newPrescriptionCard.props.testID).toEqual(
      'actionCardNewPrescriptionIcon'
    );
    expect(newPrescriptionCard.props.isSingleton).toEqual(true);
  });

  it('doesnt display "get started" button for auth users in "new prescription" section', () => {
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        profileList: profileListMock,
        account: { favoritedPharmacies: [] },
      },
    });

    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyRenderer = renderer.create(body);

    const contentContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const newPrescriptionCard = getChildren(contentContainer)[5];

    expect(newPrescriptionCard.type).toEqual(ActionCard);
    expect(newPrescriptionCard.props.imageName).toEqual('newPrescriptionIcon');
    expect(newPrescriptionCard.props.title).toEqual(
      contentMock.newPrescriptionLabel
    );
    expect(newPrescriptionCard.props.subTitle).toEqual(
      contentMock.newPrescriptionSubtitle
    );
    expect(newPrescriptionCard.props.button).toBeUndefined();
    expect(newPrescriptionCard.props.viewStyle).toEqual(
      whatComesNextScreenStyles.newPrescriptionViewStyle
    );
    expect(newPrescriptionCard.props.isSingleton).toEqual(true);
  });

  it('handles new prescription get started button press', () => {
    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyRenderer = renderer.create(body);
    const contentContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const newPrescriptionSection = getChildren(contentContainer)[5];

    const onGetStartedPress = newPrescriptionSection.props.button.onPress;

    onGetStartedPress();
    expect(rootStackNavigationMock.navigate).toBeCalled();
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith('RootStack', {
      screen: 'CreateAccount',
      params: {
        workflow: 'startSaving',
      },
    });
  });

  it('handles navigates back', () => {
    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const navigateBack = basicPage.props.navigateBack;

    navigateBack();

    expect(rootStackNavigationMock.goBack).toBeCalled();
  });

  it('handles open side menu', () => {
    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    expect(basicPage.props.showProfileAvatar).toEqual(true);
  });

  it('logoClickAction should be true', () => {
    const testRenderer = renderer.create(<WhatComesNextScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    expect(basicPage.props.logoClickAction).toEqual(
      LogoClickActionEnum.CONFIRM
    );
  });

  it('calls custom hook to display talkative functionality', () => {
    renderer.create(<WhatComesNextScreen />);
    expect(useTalkativeWidgetMock).toHaveBeenCalledTimes(1);
    expect(useTalkativeWidgetMock).toHaveBeenNthCalledWith(1, {
      showHeader: false,
      forceExpandedView: false,
    });
  });
});
