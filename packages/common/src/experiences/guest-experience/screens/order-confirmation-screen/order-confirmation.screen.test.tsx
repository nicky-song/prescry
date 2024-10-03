// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { Heading } from '../../../../components/member/heading/heading';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { OrderSection } from './sections/order/order.section';
import { PickUpSection } from './sections/pick-up/pick-up.section';
import { WhatIsNextSection } from './sections/what-is-next/what-is-next.section';
import { orderConfirmationScreenStyles } from './order-confirmation.screen.styles';
import { IReduxContext } from '../../context-providers/redux/redux.context';
import { OrderConfirmationScreen } from './order-confirmation.screen';
import { selectedPharmacyMock } from '../../__mocks__/selected-pharmacy.mock';
import { IDrugDetails } from '../../../../utils/formatters/drug.formatter';
import {
  ICouponDetails,
  ICouponDetailsLogo,
} from '../../../../models/coupon-details/coupon-details';
import {
  ISummarySectionProps,
  SummarySection,
} from './sections/summary/summary.section';
import {
  IPrescriberDetailsProps,
  PrescriberDetails,
} from '../../../../components/member/prescriber-details/prescriber-details';
import {
  Coupon,
  ICouponProps,
} from '../../../../components/member/coupon/coupon';
import { IPharmacyDrugPrice } from '../../../../models/pharmacy-drug-price';
import { OfferDeliveryInfo } from '../../../../components/member/offer-delivery-info/offer-delivery-info';
import { LinkButton } from '../../../../components/buttons/link/link.button';
import { useMembershipContext } from '../../context-providers/membership/use-membership-context.hook';
import { getProfilesByGroup } from '../../../../utils/profile.helper';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { PharmacyHoursContainer } from '../../../../components/member/pharmacy-hours-container/pharmacy-hours-container';
import { LineSeparator } from '../../../../components/member/line-separator/line-separator';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useNavigation } from '@react-navigation/native';
import { NotificationColor } from '../../../../theming/colors';
import { callPhoneNumber, goToUrl } from '../../../../utils/link.helper';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IUIContentGroup } from '../../../../models/ui-content';
import { useSessionContext } from '../../context-providers/session/use-session-context.hook';
import { ISessionContext } from '../../context-providers/session/session.context';
import { defaultSessionState } from '../../state/session/session.state';
import { HomeButton } from '../../../../components/buttons/home/home.button';
import { IOrderConfirmationScreenContent } from './order-confirmation.screen.content';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { IconSize } from '../../../../theming/icons';
import { isPharmacyFavorited } from '../../../../utils/validators/is-pharmacy-favorited.validator';
import { FavoritingAction } from '../../../../components/buttons/favorite-icon/favorite-icon.button';
import {
  AllFavoriteNotifications,
  FavoritingStatus,
} from '../../../../components/notifications/all-favorite/all-favorite.notifications';
import { favoritePharmacyAsyncAction } from '../../store/set-favorite-pharmacy/async-actions/favorite-pharmacy.async-action';
import { setFavoritingStatusDispatch } from '../../state/membership/dispatch/set-favoriting-status.dispatch';
import { IHours } from '../../../../models/date-time/hours';
import { getChildren } from '../../../../testing/test.helper';
import { convertHoursToMap } from '../../../../utils/pharmacy-info.helper';
import { IMedicineCabinetScreenRouteProps } from '../medicine-cabinet/medicine-cabinet.screen';
import { useTalkativeWidget } from '../../../../hooks/use-talkative-widget/use-talkative-widget';
import { useShoppingContext } from '../../context-providers/shopping/use-shopping-context.hook';
import { IShoppingContext } from '../../context-providers/shopping/shopping.context';
import { defaultShoppingState } from '../../state/shopping/shopping.state';
import { prescriptionInfoMock } from '../../__mocks__/prescription-info.mock';
import { getDependentWithMemberId } from '../shopping/prescription-patient/get-dependent-with-member-id';
import { ILimitedPatient } from '../../../../models/patient-profile/limited-patient';
import { PrescriptionPatientName } from '../shopping/prescription-patient/prescription-patient-name';
import { PricingOption } from '../../../../models/pricing-option';

jest.mock('../shopping/prescription-patient/get-dependent-with-member-id');
const getDependentWithMemberIdMock = getDependentWithMemberId as jest.Mock;

jest.mock(
  '../../store/set-favorite-pharmacy/async-actions/favorite-pharmacy.async-action'
);
const favoritePharmacyAsyncActionMock =
  favoritePharmacyAsyncAction as jest.Mock;

jest.mock('../../state/membership/dispatch/set-favoriting-status.dispatch');
const setFavoritingStatusDispatchMock =
  setFavoritingStatusDispatch as jest.Mock;

jest.mock(
  '../../../../components/notifications/all-favorite/all-favorite.notifications',
  () => ({
    AllFavoriteNotifications: () => <div />,
  })
);

jest.mock('../../../../utils/validators/is-pharmacy-favorited.validator');
const isPharmacyFavoritedMock = isPharmacyFavorited as jest.Mock;

jest.mock(
  '../../../../components/notifications/favorited-pharmacy/favorited-pharmacy.notification',
  () => ({
    FavoritedPharmacyNotification: () => <div />,
  })
);

jest.mock(
  '../../../../components/notifications/unfavorited-pharmacy/unfavorited-pharmacy.notification',
  () => ({
    UnfavoritedPharmacyNotification: () => <div />,
  })
);

jest.mock(
  '../../../../components/notifications/favoriting-error/favoriting-error.notification',
  () => ({
    FavoritingErrorNotification: () => <div />,
  })
);

jest.mock(
  '../../../../components/notifications/unfavoriting-error/unfavoriting-error.notification',
  () => ({
    UnfavoritingErrorNotification: () => <div />,
  })
);

jest.mock(
  '../../../../components/screen-containers/fade-view/fade-view',
  () => ({
    FadeView: () => <div />,
  })
);

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock(
  '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch'
);
const navigateHomeScreenNoApiRefreshDispatchMock =
  navigateHomeScreenNoApiRefreshDispatch as jest.Mock;

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../../../components/containers/body-content/body-content.container',
  () => ({
    BodyContentContainer: () => <div />,
  })
);

jest.mock('../../../../utils/link.helper');
const goToUrlMock = goToUrl as jest.Mock;
const callPhoneNumberMock = callPhoneNumber as jest.Mock;

jest.mock('../../../../utils/profile.helper');
const getProfilesByGroupMock = getProfilesByGroup as jest.Mock;

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock(
  '../../../../components/icons/font-awesome/font-awesome.icon',
  () => ({
    FontAwesomeIcon: () => <div />,
  })
);

jest.mock('../../../../hooks/use-talkative-widget/use-talkative-widget');
const useTalkativeWidgetMock = useTalkativeWidget as jest.Mock;

jest.mock('../../context-providers/shopping/use-shopping-context.hook');
const useShoppingContextMock = useShoppingContext as jest.Mock;

const mockPatient = {
  firstName: 'first-name',
  lastName: 'last-name',
  dateOfBirth: '2000-01-01',
  phoneNumber: '+11111111111',
  recoveryEmail: 'email',
} as ILimitedPatient;

const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
  [
    CmsGroupKey.orderConfirmation,
    {
      content: [
        {
          fieldKey: 'order-confirmation-title-text',
          language: 'English',
          type: 'text',
          value: 'order-confirmation-title-text-mock',
        },
      ],
      lastUpdated: 0,
      isContentLoading: true,
    },
  ],
]);

const contentMock: IOrderConfirmationScreenContent = {
  orderConfirmationTitleText: 'order-confirmation-title-text-mock',
  orderConfirmationConfirmationText:
    'order-confirmation-confirmation-text-mock',
  orderConfirmationEligibilityText: 'order-confirmation-eligibility-text-mock',
  offerDeliveryInfoTitle: '',
  offerDeliveryInfoDescription: '',
  pickUpHeading: '',
  pickUpPreamble: '',
  whatIsNextHeader: '',
  whatIsNextInstructions: '',
  orderSectionHeader: '',
  summaryTitle: '',
  summaryOrderDate: '',
  summaryOrderNumber: '',
  summaryPlanPays: '',
  summaryYouPay: '',
  pickUpOpen24Hours: '',
  pickUpOpen: '',
  pickUpClosed: '',
  pickUpOpensAt: '',
  pickUpClosesAt: '',
  prescriberInfoTitle: '',
  insuranceCardNoticeText: '',
  estimatedPriceNoticeText: '',
};

const couponLogoMock: ICouponDetailsLogo = {
  name: 'logo-string',
  alternativeText: 'logo-string',
  caption: 'logo-string',
  hash: 'logo-string',
  ext: 'logo-string',
  mime: 'logo-string',
  size: 54.33,
  url: 'logo-string',
  provider: 'logo-string',
  width: 10,
  height: 20,
  id: 'logo-string',
};

const couponDetailsMock1: ICouponDetails = {
  productManufacturerName: 'product-manufacturer-name-1',
  price: 1,
  ageLimit: 1,
  introductionDialog: 'introduction-dialog-1',
  eligibilityURL: 'eligibility-url-1',
  copayText: 'copay-text-1',
  copayAmount: 1,
  groupNumber: 'group-number-1',
  pcn: 'pcn-1',
  memberId: 'member-id-1',
  bin: 'bin-1',
  featuredPharmacy: 'featured-pharmacy-1',
  logo: couponLogoMock,
};

const pharmacyDrugPriceMock1: IPharmacyDrugPrice = {
  pharmacy: selectedPharmacyMock,
  coupon: couponDetailsMock1,
};

const pharmacyDrugPriceMock2: IPharmacyDrugPrice = {
  pharmacy: selectedPharmacyMock,
};
const hasInsuranceMock = false;
const pricingOptionMock: PricingOption = 'pbm';

const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();
const membershipDispatchMock = jest.fn();

describe('OrderConfirmationScreen (no coupon)', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: {
        ...defaultShoppingState,
        hasInsurance: hasInsuranceMock,
      },
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        profileList: [{}],
        account: { favoritedPharmacies: ['favorited-ncpdp-mock'] },
        favoritingStatus: 'success' as FavoritingStatus,
      },
      membershipDispatch: membershipDispatchMock,
    });
    getProfilesByGroupMock.mockReturnValue([{}]);

    useNavigationMock.mockReturnValueOnce(rootStackNavigationMock);

    const sessionContextMock: ISessionContext = {
      sessionState: {
        ...defaultSessionState,
        uiCMSContentMap: cmsContentMapMock,
      },
      sessionDispatch: jest.fn(),
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });

    isPharmacyFavoritedMock.mockReturnValue(false);
  });

  const drugDetailsMock: IDrugDetails = {
    strength: '15',
    unit: 'ML',
    quantity: 5,
    formCode: 'KIT',
  };

  const orderSectionProps = {
    drugDetails: drugDetailsMock,
    drugName: 'drug-name',
    showPlanPays: true,
    drugFormMap: new Map(),
    orderConfirmationContent: { content: contentMock, isContentLoading: false },
  };

  it('renders null coupon section when coupon is absent', () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock2}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const couponSection = bodyContainer.props.children[6];

    expect(couponSection).toBeNull();
  });
});

describe('OrderConfirmationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    const sessionContextMock: ISessionContext = {
      sessionState: {
        ...defaultSessionState,
        uiCMSContentMap: cmsContentMapMock,
      },
      sessionDispatch: jest.fn(),
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    isPharmacyFavoritedMock.mockReturnValue(false);
  });
  const drugDetailsMock: IDrugDetails = {
    strength: '15',
    unit: 'ML',
    quantity: 5,
    formCode: 'KIT',
  };

  const orderSectionProps = {
    drugDetails: drugDetailsMock,
    drugName: 'drug-name',
    showPlanPays: true,
    drugFormMap: new Map(),
    orderConfirmationContent: { content: contentMock, isContentLoading: false },
    hasInsurance: false,
    pricingOption: pricingOptionMock,
  };

  it.each([[undefined], [false], [true]])(
    'renders as basic page (canGoBack: %p)',
    (canGoBackMock: undefined | boolean) => {
      const testRenderer = renderer.create(
        <OrderConfirmationScreen
          navigation={rootStackNavigationMock}
          pharmacyDrugPrice={pharmacyDrugPriceMock1}
          orderSectionProps={orderSectionProps}
          canGoBack={canGoBackMock}
        />
      );

      const basicPage = testRenderer.root.children[0] as ReactTestInstance;

      expect(basicPage.type).toEqual(BasicPageConnected);
      expect(basicPage.props.headerViewStyle).toEqual(
        orderConfirmationScreenStyles.headerViewStyle
      );
      expect(basicPage.props.bodyViewStyle).toEqual(
        orderConfirmationScreenStyles.bodyViewStyle
      );
      expect(basicPage.props.translateContent).toEqual(true);

      if (canGoBackMock) {
        expect(basicPage.props.navigateBack).toEqual(expect.any(Function));
      } else {
        expect(basicPage.props.navigateBack).toBeUndefined();
      }
    }
  );

  it('handles navigate back (canGoBack=true)', () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
        canGoBack={true}
      />
    );

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;
    basicPage.props.navigateBack();

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);

    const expectedRouteProps: IMedicineCabinetScreenRouteProps = {
      backToHome: true,
    };
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'MedicineCabinet',
      expectedRouteProps
    );
  });

  it('renders AllFavoriteNotifications as notification', () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.notification.type).toEqual(AllFavoriteNotifications);
  });

  it('renders AllFavoriteNotifications with expected props', () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);

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

  it('renders body container', () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.testID).toEqual('orderConfirmationScreen');
    expect(bodyContainer.props.children.length).toEqual(7);

    const titleContainer = bodyContainer.props.title;
    expect(titleContainer.type).toEqual(View);
    expect(titleContainer.props.style).toEqual(
      orderConfirmationScreenStyles.titleViewStyle
    );
    expect(titleContainer.props.children.length).toEqual(2);

    const checkIcon = titleContainer.props.children[0];
    expect(checkIcon.props.name).toEqual('check-circle');
    expect(checkIcon.props.size).toEqual(IconSize.regular);
    expect(checkIcon.props.color).toEqual(NotificationColor.green);
    expect(checkIcon.props.solid).toEqual(true);

    const titleView = titleContainer.props.children[1];

    expect(titleView.type).toEqual(View);
    expect(titleView.props.style).toEqual(
      orderConfirmationScreenStyles.orderConfirmationTitleViewStyle
    );

    const title = titleView.props.children;
    expect(title.type).toEqual(Heading);
    expect(title.props.level).toEqual(1);
    expect(title.props.isSkeleton).toEqual(false);
    expect(title.props.children).toEqual(
      contentMock.orderConfirmationTitleText
    );
    expect(title.props.textStyle).toEqual(
      orderConfirmationScreenStyles.orderConfirmationTitleTextStyle
    );
  });

  it('renders "What\'s next" section as null when isOrderBooked is false', () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const whatIsNextSection = bodyContainer.props.children[0];

    expect(whatIsNextSection).toEqual(null);
  });

  it('renders "What\'s next" section', () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
        isNewOrder={true}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const whatIsNextSection = bodyContainer.props.children[0];

    expect(whatIsNextSection.type).toEqual(WhatIsNextSection);
    expect(whatIsNextSection.props.viewStyle).toEqual(
      orderConfirmationScreenStyles.whatIsNextSectionViewStyle
    );
  });

  it('renders "Your order" section based on the passed "orderSectionProps" props', () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const yourOrderSection = bodyContainer.props.children[1];

    expect(yourOrderSection.type).toEqual(OrderSection);
    expect(yourOrderSection.props.drugDetails).toEqual(drugDetailsMock);
    expect(yourOrderSection.props.showPlanPays).toEqual(true);
    expect(yourOrderSection.props.planPays).toBeUndefined();
    expect(yourOrderSection.props.memberPays).toBeUndefined();
    expect(yourOrderSection.props.hasInsurance).toEqual(false);
  });

  it('shouldnt render "Order Summary" section if not passed in props', () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const summarySection = bodyContainer.props.children[2];

    expect(summarySection).toBeNull();
  });

  it('renders "Order Summary" section if passed in props', () => {
    const summarySectionProps: ISummarySectionProps = {
      orderDate: new Date(),
      orderNumber: 'order-number',
    };
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
        summarySectionProps={summarySectionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const summarySection = bodyContainer.props.children[2];

    expect(summarySection.type).toEqual(SummarySection);
    expect(summarySection.props.orderDate).toEqual(
      summarySectionProps.orderDate
    );
    expect(summarySection.props.orderNumber).toEqual(
      summarySectionProps.orderNumber
    );
  });

  it('renders "Prescriber details" section', () => {
    const prescriberInfoMock: IPrescriberDetailsProps = {
      doctorName: 'ABC',
      doctorContactNumber: '(888) 888-8888',
    };

    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
        prescriberSectionContent={prescriberInfoMock}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const prescriberDetailsSection =
      bodyContainer.props.children[3].props.children[1];

    expect(prescriberDetailsSection.type).toEqual(PrescriberDetails);
    expect(prescriberDetailsSection.props.doctorName).toEqual('ABC');
    expect(prescriberDetailsSection.props.doctorContactNumber).toEqual(
      '(888) 888-8888'
    );
  });

  it('calls prescriber phone number correctly', () => {
    const prescriberInfoMock: IPrescriberDetailsProps = {
      doctorName: 'ABC',
      doctorContactNumber: '(888) 888-8888',
    };

    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
        prescriberSectionContent={prescriberInfoMock}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const prescriberDetailsSection =
      bodyContainer.props.children[3].props.children[1];

    prescriberDetailsSection.props.callToDoctor();
    expect(callPhoneNumberMock).toBeCalledTimes(1);
    expect(callPhoneNumberMock).toBeCalledWith('+18888888888');
  });

  it('doesnt render "Prescriber details" section when details are not passed', () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const prescriberDetailsSection = bodyContainer.props.children[3];

    expect(prescriberDetailsSection).toEqual(null);
  });

  it('renders "Pick up" section', () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const pickupSection = bodyContainer.props.children[4];

    expect(pickupSection.type).toEqual(PickUpSection);
    expect(pickupSection.props.pharmacy).toEqual(selectedPharmacyMock);
    expect(pickupSection.props.onFavoriteIconButtonPress).toEqual(
      expect.any(Function)
    );
    expect(pickupSection.props.hasInsurance).toEqual(hasInsuranceMock);
    expect(pickupSection.props.pricingOption).toEqual(pricingOptionMock);
  });

  it('calls favoritePharmacyAsyncActionHandler on FavoriteIconButton press in PickUpSection', async () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const pickupSection = bodyContainer.props.children[4];

    const favoritingActionMock: FavoritingAction = 'favoriting';

    await pickupSection.props.onFavoriteIconButtonPress(favoritingActionMock);

    expect(favoritePharmacyAsyncActionMock).toHaveBeenCalledTimes(1);
    expect(favoritePharmacyAsyncActionMock).toHaveBeenNthCalledWith(1, {
      ncpdp: pharmacyDrugPriceMock1.pharmacy.ncpdp,
      navigation: rootStackNavigationMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      membershipDispatch: membershipDispatchMock,
    });
  });

  it('renders "Pick up" section as OfferDeliveryInfo if premier ncpdp is given', () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={{
          ...pharmacyDrugPriceMock1,
          pharmacy: {
            ...pharmacyDrugPriceMock1.pharmacy,
            isMailOrderOnly: true,
          },
        }}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const pickupSection = bodyContainer.props.children[4];

    expect(pickupSection.type).toEqual(OfferDeliveryInfo);
    const pharmacyBrandOrName =
      selectedPharmacyMock.brand ?? selectedPharmacyMock.name;
    expect(pickupSection.props.pharmacyName).toEqual(pharmacyBrandOrName);
    expect(pickupSection.props.pharmacyNcpdp).toEqual(
      selectedPharmacyMock.ncpdp
    );
    expect(pickupSection.props.phoneNumber).toEqual(
      selectedPharmacyMock.phoneNumber
    );
  });

  it.each([[undefined], ['brand-mock']])(
    'renders "Pick up" section name as brand if available',
    (brandMock?: string) => {
      const testRenderer = renderer.create(
        <OrderConfirmationScreen
          navigation={rootStackNavigationMock}
          pharmacyDrugPrice={{
            ...pharmacyDrugPriceMock1,
            pharmacy: {
              ...pharmacyDrugPriceMock1.pharmacy,
              isMailOrderOnly: true,
              brand: brandMock,
            },
          }}
          orderSectionProps={orderSectionProps}
        />
      );

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyRenderer = renderer.create(basicPage.props.body);
      const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
      const pickupSection = bodyContainer.props.children[4];

      const pharmacyBrandOrName = brandMock ?? selectedPharmacyMock.name;

      expect(pickupSection.props.pharmacyName).toEqual(pharmacyBrandOrName);
    }
  );

  it('renders "Coupon" section', () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const couponSection = bodyContainer.props.children[6].props.children[0];

    const expectedCouponProps: ICouponProps = {
      bin: couponDetailsMock1.bin,
      group: couponDetailsMock1.groupNumber,
      // TODO: logoUrl: couponLogoMock.url,
      memberId: couponDetailsMock1.memberId,
      pcn: couponDetailsMock1.pcn,
      price: couponDetailsMock1.price,
      productName: couponDetailsMock1.productManufacturerName,
      viewStyle: orderConfirmationScreenStyles.couponViewStyle,
      eligibilityUrl: couponDetailsMock1.eligibilityURL,
    };

    expect(couponSection.type).toEqual(Coupon);
    expect(couponSection.props).toEqual(expectedCouponProps);
  });

  it.each([
    [[]],
    [
      [
        {
          day: 'day',
          opens: { h: 12, pm: true },
          closes: { h: 1, pm: true },
        },
      ],
    ],
  ])('renders "Hours" section (hours: %p)', (hoursMock: IHours[]) => {
    const pharmacyDrugPriceMock: IPharmacyDrugPrice = {
      ...pharmacyDrugPriceMock1,
      pharmacy: {
        ...pharmacyDrugPriceMock1.pharmacy,
        hours: hoursMock,
      },
    };
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const hoursFragment = bodyContainer.props.children[5];

    if (hoursMock.length) {
      const fragmentChildren = getChildren(hoursFragment);
      expect(fragmentChildren.length).toEqual(2);

      const lineSeparator = fragmentChildren[0];
      expect(lineSeparator.type).toEqual(LineSeparator);
      expect(lineSeparator.props.viewStyle).toEqual(
        orderConfirmationScreenStyles.separatorViewStyle
      );

      const hoursSection = fragmentChildren[1];
      expect(hoursSection.type).toEqual(PharmacyHoursContainer);
      expect(hoursSection.props.pharmacyHours).toEqual(
        convertHoursToMap(hoursMock)
      );
    } else {
      expect(hoursFragment).toBeNull();
    }
  });

  it('renders eligibility url link button', () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const linkButton = bodyContainer.props.children[6].props.children[1];
    expect(linkButton.type).toEqual(LinkButton);
    expect(linkButton.props.linkText).toEqual(
      contentMock.orderConfirmationEligibilityText
    );
    expect(linkButton.props.textStyle).toEqual(
      orderConfirmationScreenStyles.linkTextStyle
    );

    expect(linkButton.props.onPress).toEqual(expect.any(Function));
  });

  it.each([[undefined], [false], [true]])(
    'renders page footer (canGoBack: %p)',
    (canGoBackMock: boolean | undefined) => {
      const testRenderer = renderer.create(
        <OrderConfirmationScreen
          navigation={rootStackNavigationMock}
          pharmacyDrugPrice={pharmacyDrugPriceMock1}
          orderSectionProps={orderSectionProps}
          canGoBack={canGoBackMock}
        />
      );

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const footer = basicPage.props.footer;
      const homeButton = footer;

      if (canGoBackMock) {
        expect(homeButton).toBeNull();
      } else {
        expect(homeButton.type).toEqual(HomeButton);
        expect(homeButton.props.onPress).toEqual(expect.any(Function));
        expect(homeButton.props.testID).toEqual(
          'orderConfirmationScreenHomeButton'
        );
      }
    }
  );

  it('navigates to home screen when button pressed', async () => {
    const asyncActionMock = jest.fn();
    navigateHomeScreenNoApiRefreshDispatchMock.mockReturnValue(asyncActionMock);

    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const footer = basicPage.props.footer;
    const homeButton = footer;

    const onPress = homeButton.props.onPress;
    await onPress();

    expect(navigateHomeScreenNoApiRefreshDispatchMock).toHaveBeenCalledWith(
      reduxGetStateMock,
      rootStackNavigationMock
    );
  });

  it('opens eligibilityURL navigation link as expected', () => {
    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const linkButton = bodyContainer.props.children[6].props.children[1];

    linkButton.props.onPress();

    expect(goToUrlMock).toHaveBeenCalledTimes(1);
    expect(goToUrlMock).toHaveBeenCalledWith('eligibility-url-1');
  });

  it('calls custom hook to display talkative functionality', () => {
    renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
      />
    );
    expect(useTalkativeWidgetMock).toHaveBeenCalledTimes(1);
    expect(useTalkativeWidgetMock).toHaveBeenNthCalledWith(1, {
      showHeader: false,
      forceExpandedView: false,
    });
  });

  it('calls getDependentWithMemberId', () => {
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: {
        ...defaultShoppingState,
        prescriptionInfo: prescriptionInfoMock,
        hasInsurance: hasInsuranceMock,
      },
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
        canGoBack={true}
      />
    );

    expect(getDependentWithMemberIdMock).toBeCalledWith(
      undefined,
      prescriptionInfoMock.primaryMemberRxId
    );
  });

  it('renders prescription patient name', () => {
    getDependentWithMemberIdMock.mockReturnValue(mockPatient);

    const testRenderer = renderer.create(
      <OrderConfirmationScreen
        navigation={rootStackNavigationMock}
        pharmacyDrugPrice={pharmacyDrugPriceMock1}
        orderSectionProps={orderSectionProps}
        canGoBack={true}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const stickyViews = basicPage.props.stickyViews;
    const stickyView = stickyViews[0];
    const patientNameView = stickyView.view;

    expect(patientNameView.type).toEqual(View);
    expect(patientNameView.props.children.type).toEqual(
      PrescriptionPatientName
    );
  });
});
