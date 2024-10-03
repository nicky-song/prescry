// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { Heading } from '../../../../../components/member/heading/heading';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { PharmacyHoursContainer } from '../../../../../components/member/pharmacy-hours-container/pharmacy-hours-container';
import { PharmacyText } from '../../../../../components/member/pharmacy-text/pharmacy-text';
import { PrescriptionPharmacyInfo } from '../../../../../components/member/prescription-pharmacy-info/prescription-pharmacy-info';
import { PrescriptionPriceSection } from '../../../../../components/member/prescription-price/prescription-price.section';
import { PrescriptionTitle } from '../../../../../components/member/prescription-title/prescription-title';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { SectionView } from '../../../../../components/primitives/section-view';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { ICouponDetails } from '../../../../../models/coupon-details/coupon-details';
import { IHours } from '../../../../../models/date-time/hours';
import { IPharmacy } from '../../../../../models/pharmacy';
import { IPharmacyDrugPrice } from '../../../../../models/pharmacy-drug-price';
import { getNewDate } from '../../../../../utils/date-time/get-new-date';
import { convertHoursToMap } from '../../../../../utils/pharmacy-info.helper';
import { IDrugInformation } from '../../../claim-alert-screen/claim-alert-screen';
import { IReduxContext } from '../../../context-providers/redux/redux.context';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { IShoppingContext } from '../../../context-providers/shopping/shopping.context';
import { useShoppingContext } from '../../../context-providers/shopping/use-shopping-context.hook';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import {
  ISendPrescriptionAsyncActionArgs,
  sendPrescriptionAsyncAction,
} from '../../../state/shopping/async-actions/send-prescription.async-action';
import {
  defaultShoppingState,
  IShoppingState,
} from '../../../state/shopping/shopping.state';
import { confirmationNavigateDispatch } from '../../../store/navigation/dispatch/shopping/confirmation-navigate.dispatch';
import {
  pharmacyDrugPrice1Mock,
  pharmacyDrugPrice2Mock,
  pharmacyDrugPrice2OutOfNetworkMock,
} from '../../../__mocks__/pharmacy-drug-price.mock';
import { prescriptionInfoMock } from '../../../__mocks__/prescription-info.mock';
import {
  IOrderPreviewScreenRouteProps,
  OrderPreviewScreen,
} from './order-preview.screen';
import { orderPreviewScreenStyles } from './order-preview.screen.styles';
import { useRoute, useNavigation } from '@react-navigation/native';
import { shoppingStackNavigationMock } from '../../../navigation/stack-navigators/shopping/__mocks__/shopping.stack-navigation.mock';
import { ITransferFlowContent } from './transfer-flow.ui-content.model';
import { ITransferFlowCMSContent } from '../../../../../models/cms-content/transfer-flow.cms-content';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { findPharmacy } from '../../../../../utils/pharmacies/find-pharmacy.helper';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import { FavoritingAction } from '../../../../../components/buttons/favorite-icon/favorite-icon.button';
import { LogoClickActionEnum } from '../../../../../components/app/application-header/application-header';
import { AllFavoriteNotifications } from '../../../../../components/notifications/all-favorite/all-favorite.notifications';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { setFavoritingStatusDispatch } from '../../../state/membership/dispatch/set-favoriting-status.dispatch';
import { favoritePharmacyAsyncAction } from '../../../store/set-favorite-pharmacy/async-actions/favorite-pharmacy.async-action';
import { IShoppingConfirmationScreenRouteProps } from '../confirmation/shopping-confirmation.screen';
import { ErrorConstants } from '../../../../../theming/constants';
import { getChildren } from '../../../../../testing/test.helper';

import { sendNotificationEvent } from '../../../api/api-v1.send-notification-event';
import { formatZipCode } from '../../../../../utils/formatters/address.formatter';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { IContentWithIsLoading } from '../../../../../models/cms-content/content-with-isloading.model';
import { sendErrorEvent } from '../../../api/api-v1.send-error-event';
import { getDependentWithMemberId } from '../prescription-patient/get-dependent-with-member-id';
import { ILimitedPatient } from '../../../../../models/patient-profile/limited-patient';
import { PrescriptionPatientName } from '../prescription-patient/prescription-patient-name';
import { PbmPricingOptionInformativePanel } from '../../../../../components/member/panels/pbm-pricing-option-informative/pbm-pricing-option-informative.panel';
import { ThirdPartyPricingOptionInformativePanel } from '../../../../../components/member/panels/third-party-pricing-option-informative/third-party-pricing-option-informative.panel';
import { SmartPricePricingOptionInformativePanel } from '../../../../../components/member/panels/smart-pricing-option-informative/smart-price-pricing-option-informative.panel';
import { PricingOption } from '../../../../../models/pricing-option';

jest.mock('../prescription-patient/get-dependent-with-member-id');
const getDependentWithMemberIdMock = getDependentWithMemberId as jest.Mock;

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = useFlags as jest.Mock;

jest.mock(
  '../../../store/set-favorite-pharmacy/async-actions/favorite-pharmacy.async-action'
);
const favoritePharmacyAsyncActionMock =
  favoritePharmacyAsyncAction as jest.Mock;

jest.mock('../../../state/membership/dispatch/set-favoriting-status.dispatch');
const setFavoritingStatusDispatchMock =
  setFavoritingStatusDispatch as jest.Mock;

jest.mock(
  '../../../../../components/notifications/all-favorite/all-favorite.notifications',
  () => ({
    AllFavoriteNotifications: () => <div />,
  })
);

jest.mock('../../../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../../../utils/pharmacies/find-pharmacy.helper');
const findPharmacyMock = findPharmacy as jest.Mock;

jest.mock('@react-navigation/native');

const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../../../utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

jest.mock('../../../context-providers/shopping/use-shopping-context.hook');
const useShoppingContextMock = useShoppingContext as jest.Mock;

jest.mock('../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../context-providers/session/ui-content-hooks/use-content');

const useContentMock = useContent as jest.Mock;

jest.mock('../../../../../utils/cms-content.helper');

jest.mock('../../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../../../../components/containers/body-content/body-content.container',
  () => ({
    BodyContentContainer: () => <div />,
  })
);

jest.mock(
  '../../../../../components/member/prescription-title/prescription-title',
  () => ({
    PrescriptionTitle: () => <div />,
  })
);

jest.mock(
  '../../../../../components/member/pharmacy-hours-container/pharmacy-hours-container',
  () => ({
    PharmacyHoursContainer: () => <div />,
  })
);

jest.mock(
  '../../../state/shopping/async-actions/send-prescription.async-action'
);
const sendPrescriptionAsyncActionMock =
  sendPrescriptionAsyncAction as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/shopping/confirmation-navigate.dispatch'
);
const confirmationNavigateDispatchMock =
  confirmationNavigateDispatch as jest.Mock;

jest.mock('../../../guest-experience-logger.middleware');
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

jest.mock('../../../context-providers/features/use-features-context.hook');

jest.mock('../../../api/api-v1.send-notification-event');
const sendNotificationEventMock = sendNotificationEvent as unknown as jest.Mock;

jest.mock('../../../api/api-v1.send-error-event');
const sendErrorEventMock = sendErrorEvent as unknown as jest.Mock;

const mockPatient = {
  firstName: 'first-name',
  lastName: 'last-name',
  dateOfBirth: '2000-01-01',
  phoneNumber: '+11111111111',
  recoveryEmail: 'email',
} as ILimitedPatient;

const contentMock: ITransferFlowContent = {
  hoursNotSpecified: 'Hours not specified',
  pharmacyHoursHeading: 'Pharmacy hours',
  pharmacyInfoHeading: 'Pharmacy info',
  sendButton: 'Send to pharmacy',
  title: 'Order preview',
  premierDescription:
    'The pharmacy will contact you to verify your eligibility and determine if you qualify for a patient assistance program. They will also collect payment and arrange mail delivery.',
  mailDelivery: 'Mail delivery',
  mailOrderInstructions: (pharmacyName: string) =>
    `Once your order is submitted, ${pharmacyName} will contact you to verify your eligibility and determine if you qualify for a patient assistance program.\n\nIf you decide to follow through with your order, they will arrange for payment and shipment.`,
  outOfNetworkDescription:
    'Contact the pharmacy directly for pricing. If you choose this pharmacy, you will likely pay full price and then need to submit a request for reimbursement from your benefits, if applicable.',
  outOfNetworkPrefix: 'Out of network.',
  couponDeliveryInfoDescription: 'coupon-delivery-info-description-mock',
  deliveryInfoDescription: 'delivery-info-description-mock',
  deliveryInfoHeader: 'delivery-info-header-mock',
  pickUpHeader: 'pick-up-header-mock',
  estimatedPriceNoticeText: 'estimated-price-notice-text-mock',
};

const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();

const membershipDispatchMock = jest.fn();

describe('OrderPreviewScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getDependentWithMemberIdMock.mockReturnValue(undefined);

    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: {
        ...defaultShoppingState,
        prescriptionInfo: prescriptionInfoMock,
        hasInsurance: false,
      },
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    useNavigationMock.mockReturnValue(shoppingStackNavigationMock);

    useRouteMock.mockReturnValue({ params: {} });

    findPharmacyMock.mockReturnValue(pharmacyDrugPrice2Mock);

    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: { favoritedPharmacies: ['favorited-ncpdp-mock'] },
      },
      membershipDispatch: membershipDispatchMock,
    });

    useFlagsMock.mockReturnValue({ usertpb: false, useDualPrice: true });
  });

  it('throws exception if no prescription in context', () => {
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: {
        ...defaultShoppingState,
        prescriptionInfo: undefined,
      },
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    try {
      renderer.create(<OrderPreviewScreen />);
      fail('Expected exception but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(
        new Error(ErrorConstants.errorForGettingPrescriptionInfo)
      );
    }
  });

  it('renders as basic page', () => {
    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.headerViewStyle).toEqual(
      orderPreviewScreenStyles.headerViewStyle
    );
    expect(basicPage.props.bodyViewStyle).toEqual(
      orderPreviewScreenStyles.bodyViewStyle
    );
    expect(basicPage.props.showProfileAvatar).toEqual(true);
    expect(basicPage.props.logoClickAction).toEqual(
      LogoClickActionEnum.CONFIRM
    );
    expect(basicPage.props.translateContent).toEqual(true);

    const navigateBack = basicPage.props.navigateBack;
    navigateBack();

    expect(shoppingStackNavigationMock.goBack).toHaveBeenCalledTimes(1);
  });

  it('renders AllFavoriteNotifications as notification', () => {
    const favoritedPharmaciesMock = ['favorited-ncpdp-mock'];

    useMembershipContextMock.mockReset();
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: { favoritedPharmacies: favoritedPharmaciesMock },
      },
    });

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;
    const notification = basicPage.props.notification;

    expect(notification.type).toEqual(AllFavoriteNotifications);
  });

  it('renders AllFavoriteNotifications with expected props', () => {
    const favoritedPharmaciesMock = ['favorited-ncpdp-mock'];

    useMembershipContextMock.mockReset();
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: { favoritedPharmacies: favoritedPharmaciesMock },
      },
      membershipDispatch: membershipDispatchMock,
    });

    const testRenderer = renderer.create(<OrderPreviewScreen />);

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
      'none'
    );
  });

  it('calls favoritedPharmacyAsyncActionHandler with expected args', async () => {
    const favoritingActionMock: FavoritingAction = 'favoriting';

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: true,
    });
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
      prescriptionPharmacies: [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock],
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const pharmacyNcpdpMock = pharmacyDrugPrice2Mock.pharmacy.ncpdp;

    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pharmacyNcpdp: pharmacyNcpdpMock,
      isSieMemberPrescription: true,
    };
    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });

    const testRenderer = renderer.create(<OrderPreviewScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const couponSectionView = getChildren(pharmacyInfoSection)[0];
    const pharmacyNameView = getChildren(couponSectionView)[0];

    expect(pharmacyNameView.type).toEqual(PharmacyText);
    expect(pharmacyNameView.props.onFavoriteIconButtonPress).toEqual(
      expect.any(Function)
    );

    await pharmacyNameView.props.onFavoriteIconButtonPress(
      favoritingActionMock
    );

    expect(favoritePharmacyAsyncActionMock).toHaveBeenCalledTimes(1);
    expect(favoritePharmacyAsyncActionMock).toHaveBeenNthCalledWith(1, {
      ncpdp: pharmacyNcpdpMock,
      navigation: rootStackNavigationMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      membershipDispatch: membershipDispatchMock,
    });
  });

  it('lazy load order preview content', () => {
    const uiCMSContentMock: ITransferFlowCMSContent = {
      mailOrderPharmacyDescription: 'pharmacy-description-mail-order-mock',
      outOfNetworkPharmacyDescription:
        'pharmacy-description-out-of-network-mock',
      deliveryInfoHeader: 'delivery-info-header-mock',
      deliveryInfoDescription: 'delivery-info-description-mock',
      couponDeliveryInfoDescription: 'delivery-info-coupon-description-mock',
      pickUpHeader: 'pick-up-header-mock',
      sendButton: 'send-button-lazy-mock',
      estimatedPriceNoticeText: 'estimated-price-notice-text-mock',
    };

    const lazyLoadedContent = {
      ...contentMock,
      sendButton: uiCMSContentMock.sendButton,
      premierDescription: uiCMSContentMock.mailOrderPharmacyDescription,
      outOfNetworkDescription: uiCMSContentMock.outOfNetworkPharmacyDescription,
      deliveryInfoHeader: uiCMSContentMock.deliveryInfoHeader,
      deliveryInfoDescription: uiCMSContentMock.deliveryInfoDescription,
      couponDeliveryInfoDescription:
        uiCMSContentMock.couponDeliveryInfoDescription,
      pickUpHeader: uiCMSContentMock.pickUpHeader,
    };

    useContentMock.mockReturnValue({
      content: lazyLoadedContent,
      isContentLoading: false,
    });

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const footer = basicPage.props.footer;
    const sendButton = footer;

    expect(sendButton.type).toEqual(BaseButton);
    expect(sendButton.props.children).toEqual(lazyLoadedContent.sendButton);
    expect(sendButton.props.onPress).toEqual(expect.any(Function));
    expect(sendButton.props.testID).toEqual(
      'orderPreviewScreenSendtoPharmacyButton'
    );
  });

  it.each([
    [true, false],
    [false, false],
    [false, true],
    [true, true],
    [true, undefined],
    [false, undefined],
  ])(
    'renders skeleton when content is loading with usertpb %p, hasInsurance %p',
    (usertpb: boolean, hasInsurance?: boolean) => {
      useContentMock.mockReturnValue({
        content: contentMock,
        isContentLoading: true,
      });
      const shoppingStateMock: IShoppingState = {
        ...defaultShoppingState,
        prescriptionInfo: prescriptionInfoMock,
        prescriptionPharmacies: [
          pharmacyDrugPrice1Mock,
          pharmacyDrugPrice2Mock,
        ],
        hasInsurance,
      };
      const shoppingContextMock: IShoppingContext = {
        shoppingDispatch: jest.fn(),
        shoppingState: shoppingStateMock,
      };
      useShoppingContextMock.mockReturnValue(shoppingContextMock);
      useFlagsMock.mockReturnValue({ usertpb });
      const pharmacyNcpdpMock = pharmacyDrugPrice2Mock.pharmacy.ncpdp;

      const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
        pharmacyNcpdp: pharmacyNcpdpMock,
        isSieMemberPrescription: true,
      };

      useRouteMock.mockReturnValueOnce({
        params: paramsMock,
      });

      const testRenderer = renderer.create(<OrderPreviewScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);

      const bodyRenderer = renderer.create(basicPage.props.body);
      const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
      const prescriptionTitle = getChildren(bodyContainer)[0];

      expect(prescriptionTitle.type).toEqual(PrescriptionTitle);
      expect(prescriptionTitle.props.isSkeleton).toEqual(true);

      const pharmacyInfoSection = getChildren(bodyContainer)[1];
      const couponSectionView = getChildren(pharmacyInfoSection)[0];
      const pharmacyNameView = couponSectionView.props.children[0];

      expect(pharmacyNameView.type).toEqual(PharmacyText);
      expect(pharmacyNameView.props.onFavoriteIconButtonPress).toEqual(
        expect.any(Function)
      );
      expect(pharmacyNameView.props.ncpdp).toEqual(pharmacyNcpdpMock);

      const prescriptionPriceView = couponSectionView.props.children[1];
      const prescriptionPriceSection = getChildren(prescriptionPriceView)[0];
      expect(prescriptionPriceSection.type).toEqual(PrescriptionPriceSection);
      expect(prescriptionPriceSection.props.isSkeleton).toEqual(true);
      expect(prescriptionPriceSection.props.isConfirmed).toEqual(true);
      expect(prescriptionPriceSection.props.insurancePrice).toEqual(
        pharmacyDrugPrice2Mock.price?.insurancePrice
      );
      const estimatedPriceNoticeText = getChildren(prescriptionPriceView)[1];
      if (usertpb && hasInsurance) {
        expect(estimatedPriceNoticeText.type).toEqual(BaseText);
        expect(estimatedPriceNoticeText.props.isSkeleton).toEqual(true);
        expect(estimatedPriceNoticeText.props.skeletonWidth).toEqual('long');
        expect(estimatedPriceNoticeText.props.style).toEqual(
          orderPreviewScreenStyles.estimatedPriceNoticeTextStyle
        );
      } else {
        expect(estimatedPriceNoticeText).toBeFalsy();
      }
      const pharmacyContactSection = pharmacyInfoSection.props.children[1];

      expect(pharmacyContactSection.props.children[0].type).toEqual(Heading);
      expect(pharmacyContactSection.props.children[0].props.isSkeleton).toEqual(
        true
      );

      const prescriptionPharmacyInfo = pharmacyContactSection.props.children[1];

      expect(prescriptionPharmacyInfo.type).toEqual(PrescriptionPharmacyInfo);
      expect(prescriptionPharmacyInfo.props.isSkeleton).toEqual(true);

      const pharmacyHoursSection = pharmacyInfoSection.props.children[2];
      const hoursContainer = pharmacyHoursSection.props.children;

      expect(hoursContainer.type).toEqual(PharmacyHoursContainer);
      expect(hoursContainer.props.isSkeleton).toEqual(true);

      const footerFragment = basicPage.props.footer;

      expect(footerFragment.type).toEqual(BaseButton);
      expect(footerFragment.props.isSkeleton).toEqual(true);
    }
  );

  it('renders body container', () => {
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<ITransferFlowContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };

    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.title).toEqual(contentMock.title);
    expect(bodyContainer.props.testID).toEqual('orderPreviewScreen');
    expect(bodyContainer.props.isSkeleton).toEqual(isContentLoadingMock);

    expect(bodyContainer.props.children.length).toEqual(2);
  });

  it('renders prescription info', () => {
    const drugInformationMock: Partial<IDrugInformation> = {
      externalLink: 'external-link',
    };
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
      drugInformation: drugInformationMock as IDrugInformation,
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const prescriptionTitle = getChildren(bodyContainer)[0];

    expect(prescriptionTitle.type).toEqual(PrescriptionTitle);
    expect(prescriptionTitle.props.productName).toEqual(
      prescriptionInfoMock.drugName
    );
    expect(prescriptionTitle.props.strength).toEqual(
      prescriptionInfoMock.strength
    );
    expect(prescriptionTitle.props.formCode).toEqual(prescriptionInfoMock.form);
    expect(prescriptionTitle.props.unit).toEqual(prescriptionInfoMock.unit);
    expect(prescriptionTitle.props.quantity).toEqual(
      prescriptionInfoMock.quantity
    );
    expect(prescriptionTitle.props.refills).toEqual(
      prescriptionInfoMock.refills
    );
    expect(prescriptionTitle.props.infoLink).toEqual(
      drugInformationMock.externalLink
    );
  });

  it('renders pharmacy info section', () => {
    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];

    expect(pharmacyInfoSection.type).toEqual(SectionView);
    expect(pharmacyInfoSection.props.testID).toEqual('pharmacyInfoSection');
    expect(pharmacyInfoSection.props.children.length).toEqual(3);
  });

  it('renders pharmacy name with other pharmacy ncpdp', () => {
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
      prescriptionPharmacies: [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock],
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const otherPharmacy = (pharmacyDrugPrice1Mock.otherPharmacies ?? [])[0];

    findPharmacyMock.mockReturnValue(otherPharmacy);

    const pharmacyNcpdpMock = otherPharmacy.pharmacy.ncpdp;

    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pharmacyNcpdp: pharmacyNcpdpMock,
      isSieMemberPrescription: true,
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    expect(findPharmacyMock).toHaveBeenCalledTimes(1);
    expect(findPharmacyMock).toHaveBeenNthCalledWith(
      1,
      [...shoppingStateMock.prescriptionPharmacies],
      pharmacyNcpdpMock
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const pharmacyView = pharmacyInfoSection.props.children[0];
    const pharmacyText = pharmacyView.props.children[0];
    expect(pharmacyText.type).toEqual(PharmacyText);
    const pharmacyBrandOrName =
      otherPharmacy.pharmacy.brand ?? otherPharmacy.pharmacy.name;
    expect(pharmacyText.props.pharmacy).toEqual(pharmacyBrandOrName);
    expect(pharmacyText.props.headingLevel).toEqual(2);
    expect(pharmacyText.props.onFavoriteIconButtonPress).toEqual(
      expect.any(Function)
    );
    expect(pharmacyText.props.ncpdp).toEqual(pharmacyNcpdpMock);
  });

  it('renders pharmacy name', () => {
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
      prescriptionPharmacies: [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock],
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const pharmacyNcpdpMock = pharmacyDrugPrice2Mock.pharmacy.ncpdp;

    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pharmacyNcpdp: pharmacyNcpdpMock,
      isSieMemberPrescription: true,
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const pharmacyView = pharmacyInfoSection.props.children[0];

    const pharmacyText = pharmacyView.props.children[0];
    expect(pharmacyText.type).toEqual(PharmacyText);
    const pharmacyBrandOrName =
      pharmacyDrugPrice2Mock.pharmacy.brand ??
      pharmacyDrugPrice2Mock.pharmacy.name;
    expect(pharmacyText.props.pharmacy).toEqual(pharmacyBrandOrName);
    expect(pharmacyText.props.headingLevel).toEqual(2);
    expect(pharmacyText.props.onFavoriteIconButtonPress).toEqual(
      expect.any(Function)
    );
    expect(pharmacyText.props.ncpdp).toEqual(pharmacyNcpdpMock);
  });

  it('renders prices: PBM users', () => {
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
      prescriptionPharmacies: [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock],
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      isSieMemberPrescription: true,
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });
    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const couponSectionView = getChildren(pharmacyInfoSection)[0];
    const prescriptionPriceView = couponSectionView.props.children[1];

    expect(prescriptionPriceView.props.testID).toEqual('prescriptionPrice');
    expect(prescriptionPriceView.props.style).toEqual(
      orderPreviewScreenStyles.PrescriptionPriceSectionViewStyle
    );
    const prescriptionPriceSection = getChildren(prescriptionPriceView)[0];
    expect(prescriptionPriceSection.type).toEqual(PrescriptionPriceSection);
    expect(prescriptionPriceSection.props.hasAssistanceProgram).toEqual(false);
    expect(prescriptionPriceSection.props.showPlanPays).toEqual(true);
    expect(prescriptionPriceSection.props.memberPays).toEqual(
      pharmacyDrugPrice2Mock.price?.memberPays
    );
    expect(prescriptionPriceSection.props.planPays).toEqual(
      pharmacyDrugPrice2Mock.price?.planPays
    );
    expect(prescriptionPriceSection.props.couponDetails).toEqual(undefined);
    expect(prescriptionPriceSection.props.isConfirmed).toEqual(true);
  });

  it('renders prices for CASH users', () => {
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
      prescriptionPharmacies: [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock],
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      isSieMemberPrescription: false,
    };
    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const couponSectionView = getChildren(pharmacyInfoSection)[0];
    const prescriptionPriceView = couponSectionView.props.children[1];

    expect(prescriptionPriceView.props.testID).toEqual('prescriptionPrice');
    expect(prescriptionPriceView.props.style).toEqual(
      orderPreviewScreenStyles.PrescriptionPriceSectionViewStyle
    );
    const prescriptionPriceSection = getChildren(prescriptionPriceView)[0];
    expect(prescriptionPriceSection.type).toEqual(PrescriptionPriceSection);
    expect(prescriptionPriceSection.props.hasAssistanceProgram).toEqual(false);
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
    expect(prescriptionPriceSection.props.isConfirmed).toEqual(true);
  });

  it('renders prices for best value card', () => {
    const prescriptionInfoMockWithCoupon = {
      ...pharmacyDrugPrice1Mock,
      coupon: { price: 40 } as ICouponDetails,
    };
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
      bestPricePharmacy: prescriptionInfoMockWithCoupon,
      prescriptionPharmacies: [pharmacyDrugPrice2Mock],
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const pharmacyNcpdpMock = pharmacyDrugPrice1Mock.pharmacy.ncpdp;

    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pharmacyNcpdp: pharmacyNcpdpMock,
      isSieMemberPrescription: false,
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });

    findPharmacyMock.mockReturnValue(prescriptionInfoMockWithCoupon);

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    expect(findPharmacyMock).toHaveBeenCalledTimes(1);
    expect(findPharmacyMock).toHaveBeenNthCalledWith(
      1,
      [
        ...shoppingStateMock.prescriptionPharmacies,
        prescriptionInfoMockWithCoupon,
      ],
      pharmacyNcpdpMock
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const couponSectionView = getChildren(pharmacyInfoSection)[0];
    const prescriptionOrderCardView = pharmacyInfoSection.props.children[0];

    expect(prescriptionOrderCardView.type).toEqual(View);
    expect(prescriptionOrderCardView.props.children.length).toEqual(2);

    const prescriptionTitle = prescriptionOrderCardView.props.children[0];
    const pharmacyText = couponSectionView.props.children[0].props;
    expect(prescriptionTitle.type).toEqual(PharmacyText);
    expect(prescriptionTitle.props.onFavoriteIconButtonPress).toEqual(
      expect.any(Function)
    );
    expect(prescriptionTitle.props.ncpdp).toEqual(pharmacyNcpdpMock);
    expect(prescriptionTitle.props.headingLevel).toEqual(2);
    const pharmacyBrandOrName =
      pharmacyDrugPrice1Mock.pharmacy.brand ??
      pharmacyDrugPrice1Mock.pharmacy.name;
    expect(prescriptionTitle.props.pharmacy).toEqual(pharmacyBrandOrName);

    expect(prescriptionOrderCardView.props.children[1].type).toEqual(View);
    expect(prescriptionOrderCardView.props.children[1].props.style).toEqual(
      orderPreviewScreenStyles.PrescriptionPriceSectionViewStyle
    );
    const prescriptionPriceSection = getChildren(
      prescriptionOrderCardView.props.children[1]
    )[0];

    expect(prescriptionPriceSection.type).toEqual(PrescriptionPriceSection);
    expect(prescriptionPriceSection.props.hasAssistanceProgram).toEqual(false);
    expect(prescriptionPriceSection.props.showPlanPays).toEqual(false);
    expect(prescriptionPriceSection.props.memberPays).toEqual(
      pharmacyDrugPrice1Mock.price?.memberPays
    );
    expect(prescriptionPriceSection.props.planPays).toEqual(
      pharmacyDrugPrice1Mock.price?.planPays
    );
    expect(prescriptionPriceSection.props.couponDetails).toEqual({
      price: 40,
    });

    expect(pharmacyText.hasCoupon).toEqual(true);
    expect(pharmacyText.alternative).toEqual(undefined);
  });

  it.each([[undefined], ['brand-mock']])(
    'renders pharmacy brand as name if available (brand: %s)',
    (brandMock?: string) => {
      const prescriptionInfoMockWithCoupon = {
        ...pharmacyDrugPrice1Mock,
        coupon: { price: 40 } as ICouponDetails,
        pharmacy: {
          ...pharmacyDrugPrice1Mock.pharmacy,
          brand: brandMock,
        },
      };
      const shoppingStateMock: IShoppingState = {
        ...defaultShoppingState,
        prescriptionInfo: prescriptionInfoMock,
        bestPricePharmacy: prescriptionInfoMockWithCoupon,
        prescriptionPharmacies: [pharmacyDrugPrice2Mock],
      };
      const shoppingContextMock: IShoppingContext = {
        shoppingDispatch: jest.fn(),
        shoppingState: shoppingStateMock,
      };
      useShoppingContextMock.mockReturnValue(shoppingContextMock);

      const pharmacyNcpdpMock = pharmacyDrugPrice1Mock.pharmacy.ncpdp;

      const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
        pharmacyNcpdp: pharmacyNcpdpMock,
        isSieMemberPrescription: false,
      };

      useRouteMock.mockReturnValueOnce({
        params: paramsMock,
      });

      findPharmacyMock.mockReturnValue(prescriptionInfoMockWithCoupon);

      const testRenderer = renderer.create(<OrderPreviewScreen />);

      expect(findPharmacyMock).toHaveBeenCalledTimes(1);
      expect(findPharmacyMock).toHaveBeenNthCalledWith(
        1,
        [
          ...shoppingStateMock.prescriptionPharmacies,
          prescriptionInfoMockWithCoupon,
        ],
        pharmacyNcpdpMock
      );

      const basicPage = testRenderer.root.findByType(BasicPageConnected);

      const bodyRenderer = renderer.create(basicPage.props.body);
      const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

      const pharmacyInfoSection = getChildren(bodyContainer)[1];
      const prescriptionOrderCardView = pharmacyInfoSection.props.children[0];
      const prescriptionTitle = prescriptionOrderCardView.props.children[0];

      const pharmacyBrandOrName =
        brandMock ?? pharmacyDrugPrice1Mock.pharmacy.name;
      expect(prescriptionTitle.props.pharmacy).toEqual(pharmacyBrandOrName);
    }
  );

  it('renders alternative text for mail order when does not have coupon', () => {
    const pharmacyInfoMailOrder = {
      ...pharmacyDrugPrice1Mock.pharmacy,
      isMailOrderOnly: true,
    } as IPharmacy;
    const prescriptionInfoMockWithCoupon = {
      ...pharmacyDrugPrice1Mock,
      coupon: { price: Infinity } as ICouponDetails,
      pharmacy: pharmacyInfoMailOrder,
    };
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
      bestPricePharmacy: prescriptionInfoMockWithCoupon,
      prescriptionPharmacies: [pharmacyDrugPrice2Mock],
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const pharmacyNcpdpMock = pharmacyDrugPrice1Mock.pharmacy.ncpdp;

    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pharmacyNcpdp: pharmacyNcpdpMock,
      isSieMemberPrescription: false,
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });
    findPharmacyMock.mockReturnValue(prescriptionInfoMockWithCoupon);

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    expect(findPharmacyMock).toHaveBeenCalledTimes(1);
    expect(findPharmacyMock).toHaveBeenNthCalledWith(
      1,
      [
        ...shoppingStateMock.prescriptionPharmacies,
        prescriptionInfoMockWithCoupon,
      ],
      pharmacyNcpdpMock
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const couponSectionView = getChildren(pharmacyInfoSection)[0];
    const prescriptionOrderCardView = pharmacyInfoSection.props.children[0];

    expect(prescriptionOrderCardView.type).toEqual(View);
    expect(prescriptionOrderCardView.props.children.length).toEqual(2);

    const prescriptionTitle = prescriptionOrderCardView.props.children[0];
    const pharmacyText = couponSectionView.props.children[0].props;
    expect(prescriptionTitle.type).toEqual(PharmacyText);
    expect(prescriptionTitle.props.onFavoriteIconButtonPress).toEqual(
      expect.any(Function)
    );
    expect(prescriptionTitle.props.ncpdp).toEqual(pharmacyNcpdpMock);
    expect(prescriptionTitle.props.headingLevel).toEqual(2);
    expect(prescriptionTitle.props.pharmacy).toEqual(
      pharmacyDrugPrice1Mock.pharmacy.name
    );
    expect(pharmacyText.hasCoupon).toEqual(undefined);
    expect(pharmacyText.alternative).toEqual(contentMock.premierDescription);

    expect(prescriptionOrderCardView.props.children[1].type).toEqual(View);
    expect(prescriptionOrderCardView.props.children[1].props.style).toEqual(
      orderPreviewScreenStyles.PrescriptionPriceSectionViewStyle
    );
    const prescriptionPriceSection = getChildren(
      prescriptionOrderCardView.props.children[1]
    )[0];

    expect(prescriptionPriceSection.type).toEqual(PrescriptionPriceSection);
    expect(prescriptionPriceSection.props.hasAssistanceProgram).toEqual(false);
    expect(prescriptionPriceSection.props.showPlanPays).toEqual(false);
    expect(prescriptionPriceSection.props.memberPays).toEqual(
      pharmacyDrugPrice1Mock.price?.memberPays
    );
    expect(prescriptionPriceSection.props.planPays).toEqual(
      pharmacyDrugPrice1Mock.price?.planPays
    );
    expect(prescriptionPriceSection.props.couponDetails).toEqual(undefined);
  });

  it('renders alternative text when does not have coupon and not mail order', () => {
    const prescriptionInfoMockWithCoupon = {
      ...pharmacyDrugPrice1Mock,
      coupon: { price: Infinity } as ICouponDetails,
    };
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
      bestPricePharmacy: prescriptionInfoMockWithCoupon,
      prescriptionPharmacies: [pharmacyDrugPrice2Mock],
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const pharmacyNcpdpMock = pharmacyDrugPrice1Mock.pharmacy.ncpdp;

    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pharmacyNcpdp: pharmacyNcpdpMock,
      isSieMemberPrescription: false,
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });

    findPharmacyMock.mockReturnValue(prescriptionInfoMockWithCoupon);

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    expect(findPharmacyMock).toHaveBeenCalledTimes(1);
    expect(findPharmacyMock).toHaveBeenNthCalledWith(
      1,
      [
        ...shoppingStateMock.prescriptionPharmacies,
        prescriptionInfoMockWithCoupon,
      ],
      pharmacyNcpdpMock
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const couponSectionView = getChildren(pharmacyInfoSection)[0];
    const prescriptionOrderCardView = pharmacyInfoSection.props.children[0];

    expect(prescriptionOrderCardView.type).toEqual(View);
    expect(prescriptionOrderCardView.props.children.length).toEqual(2);

    const prescriptionTitle = prescriptionOrderCardView.props.children[0];
    const pharmacyText = couponSectionView.props.children[0].props;
    expect(prescriptionTitle.type).toEqual(PharmacyText);
    expect(prescriptionTitle.props.onFavoriteIconButtonPress).toEqual(
      expect.any(Function)
    );
    expect(prescriptionTitle.props.ncpdp).toEqual(pharmacyNcpdpMock);
    expect(prescriptionTitle.props.headingLevel).toEqual(2);
    expect(prescriptionTitle.props.pharmacy).toEqual(
      pharmacyDrugPrice1Mock.pharmacy.name
    );
    expect(pharmacyText.hasCoupon).toEqual(false);
    expect(pharmacyText.alternative).toEqual(undefined);

    expect(prescriptionOrderCardView.props.children[1].type).toEqual(View);
    expect(prescriptionOrderCardView.props.children[1].props.style).toEqual(
      orderPreviewScreenStyles.PrescriptionPriceSectionViewStyle
    );
    const prescriptionPriceSection = getChildren(
      prescriptionOrderCardView.props.children[1]
    )[0];

    expect(prescriptionPriceSection.type).toEqual(PrescriptionPriceSection);
    expect(prescriptionPriceSection.props.hasAssistanceProgram).toEqual(false);
    expect(prescriptionPriceSection.props.showPlanPays).toEqual(false);
    expect(prescriptionPriceSection.props.memberPays).toEqual(
      pharmacyDrugPrice1Mock.price?.memberPays
    );
    expect(prescriptionPriceSection.props.planPays).toEqual(
      pharmacyDrugPrice1Mock.price?.planPays
    );
    expect(prescriptionPriceSection.props.couponDetails).toEqual(undefined);
  });

  it('renders alternative text when pharmacy is out of network and not mail order', () => {
    const prescriptionInfoMockWithCoupon = {
      ...pharmacyDrugPrice2OutOfNetworkMock,
      coupon: { price: Infinity } as ICouponDetails,
    };
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
      bestPricePharmacy: prescriptionInfoMockWithCoupon,
      prescriptionPharmacies: [pharmacyDrugPrice1Mock],
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const pharmacyNcpdpMock = pharmacyDrugPrice2OutOfNetworkMock.pharmacy.ncpdp;

    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pharmacyNcpdp: pharmacyNcpdpMock,
      isSieMemberPrescription: false,
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });
    findPharmacyMock.mockReturnValue(pharmacyDrugPrice2OutOfNetworkMock);

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    expect(findPharmacyMock).toHaveBeenCalledTimes(1);
    expect(findPharmacyMock).toHaveBeenNthCalledWith(
      1,
      [
        ...shoppingStateMock.prescriptionPharmacies,
        prescriptionInfoMockWithCoupon,
      ],
      pharmacyNcpdpMock
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const couponSectionView = getChildren(pharmacyInfoSection)[0];
    const prescriptionOrderCardView = pharmacyInfoSection.props.children[0];

    expect(prescriptionOrderCardView.type).toEqual(View);
    expect(prescriptionOrderCardView.props.children.length).toEqual(2);

    const prescriptionTitle = prescriptionOrderCardView.props.children[0];
    const pharmacyText = couponSectionView.props.children[0].props;
    expect(prescriptionTitle.type).toEqual(PharmacyText);
    expect(prescriptionTitle.props.onFavoriteIconButtonPress).toEqual(
      expect.any(Function)
    );
    expect(prescriptionTitle.props.ncpdp).toEqual(pharmacyNcpdpMock);
    expect(pharmacyText.headingLevel).toEqual(2);
    const pharmacyBrandOrName =
      pharmacyDrugPrice2OutOfNetworkMock.pharmacy.brand ??
      pharmacyDrugPrice2OutOfNetworkMock.pharmacy.name;
    expect(pharmacyText.pharmacy).toEqual(pharmacyBrandOrName);
    expect(pharmacyText.hasCoupon).toEqual(undefined);
    expect(pharmacyText.alternative.props.children[0].props.weight).toEqual(
      'bold'
    );
    expect(pharmacyText.alternative.props.children[0].props.children).toEqual(
      contentMock.outOfNetworkPrefix
    );
    expect(pharmacyText.alternative.props.children[1]).toEqual(' ');
    expect(pharmacyText.alternative.props.children[2]).toEqual(
      contentMock.outOfNetworkDescription
    );
  });

  it('doesnt render price for out of network pharmacies and not mail order', () => {
    const prescriptionInfoMockWithCoupon = {
      ...pharmacyDrugPrice2OutOfNetworkMock,
      coupon: { price: Infinity } as ICouponDetails,
    };
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
      bestPricePharmacy: prescriptionInfoMockWithCoupon,
      prescriptionPharmacies: [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock],
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const pharmacyNcpdpMock = pharmacyDrugPrice2OutOfNetworkMock.pharmacy.ncpdp;

    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pharmacyNcpdp: pharmacyNcpdpMock,
      isSieMemberPrescription: false,
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });

    findPharmacyMock.mockReturnValue(pharmacyDrugPrice2OutOfNetworkMock);

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    expect(findPharmacyMock).toHaveBeenCalledTimes(1);
    expect(findPharmacyMock).toHaveBeenNthCalledWith(
      1,
      [
        ...shoppingStateMock.prescriptionPharmacies,
        prescriptionInfoMockWithCoupon,
      ],
      pharmacyNcpdpMock
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const prescriptionOrderCardView = pharmacyInfoSection.props.children[0];

    expect(prescriptionOrderCardView.type).toEqual(View);
    expect(prescriptionOrderCardView.props.children.length).toEqual(2);

    expect(prescriptionOrderCardView.props.children[1]).toBeNull();
  });

  it('renders pharmacy contact section', () => {
    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const pharmacyContactSection = pharmacyInfoSection.props.children[1];

    expect(pharmacyContactSection.type).toEqual(SectionView);
    expect(pharmacyContactSection.props.testID).toEqual(
      'pharmacyContactSection'
    );
    expect(pharmacyContactSection.props.children.length).toEqual(2);
  });

  it('renders pharmacy contact section heading', () => {
    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const pharmacyContactSection = pharmacyInfoSection.props.children[1];
    const heading = pharmacyContactSection.props.children[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(3);
    expect(heading.props.textStyle).toEqual(
      orderPreviewScreenStyles.pharmacyInfoHeadingTextStyle
    );
    expect(heading.props.children).toEqual(contentMock.pharmacyInfoHeading);
  });

  it('renders pharmacy contact section contact info', () => {
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
      prescriptionPharmacies: [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock],
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const pharmacyNcpdpMock = pharmacyDrugPrice2Mock.pharmacy.ncpdp;

    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pharmacyNcpdp: pharmacyNcpdpMock,
      isSieMemberPrescription: true,
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });

    findPharmacyMock.mockReturnValue(pharmacyDrugPrice2Mock);

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    expect(findPharmacyMock).toHaveBeenCalledTimes(1);
    expect(findPharmacyMock).toHaveBeenNthCalledWith(
      1,
      [...shoppingStateMock.prescriptionPharmacies],
      pharmacyNcpdpMock
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const pharmacyContactSection = pharmacyInfoSection.props.children[1];
    const prescriptionPharmacyInfo = pharmacyContactSection.props.children[1];

    const { phoneNumber: expectedPhoneNumber, address: expectedAddress } =
      pharmacyDrugPrice2Mock.pharmacy;
    expect(prescriptionPharmacyInfo.type).toEqual(PrescriptionPharmacyInfo);
    expect(prescriptionPharmacyInfo.props.phoneNumber).toEqual(
      expectedPhoneNumber
    );
    expect(prescriptionPharmacyInfo.props.pharmacyAddress1).toEqual(
      expectedAddress.lineOne
    );
    expect(prescriptionPharmacyInfo.props.pharmacyCity).toEqual(
      expectedAddress.city
    );
    expect(prescriptionPharmacyInfo.props.pharmacyState).toEqual(
      expectedAddress.state
    );
    expect(prescriptionPharmacyInfo.props.pharmacyZipCode).toEqual(
      expectedAddress.zip
    );
  });

  it('renders pharmacy hours section', () => {
    const pharmacyNcpdpMock = 'pharmacy-ncpdp';

    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pharmacyNcpdp: pharmacyNcpdpMock,
      isSieMemberPrescription: true,
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });

    findPharmacyMock.mockReturnValue(undefined);

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    expect(findPharmacyMock).toHaveBeenCalledTimes(1);
    expect(findPharmacyMock).toHaveBeenNthCalledWith(1, [], pharmacyNcpdpMock);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const pharmacyHoursSection = pharmacyInfoSection.props.children[2];

    expect(pharmacyHoursSection.type).toEqual(SectionView);
    expect(pharmacyHoursSection.props.testID).toEqual('pharmacyHoursSection');
    expect(pharmacyHoursSection.props.children.props.children).toBe(
      contentMock.hoursNotSpecified
    );
  });

  it.each([[[]], [pharmacyDrugPrice2Mock.pharmacy.hours]])(
    'renders pharmacy hours section container for %p',
    (hoursMock: IHours[]) => {
      const pharmacyDrugPriceMock: IPharmacyDrugPrice = {
        ...pharmacyDrugPrice2Mock,
        pharmacy: {
          ...pharmacyDrugPrice2Mock.pharmacy,
          hours: hoursMock,
        },
      };

      const shoppingStateMock: IShoppingState = {
        ...defaultShoppingState,
        prescriptionInfo: prescriptionInfoMock,
        prescriptionPharmacies: [pharmacyDrugPrice1Mock, pharmacyDrugPriceMock],
      };
      const shoppingContextMock: IShoppingContext = {
        shoppingDispatch: jest.fn(),
        shoppingState: shoppingStateMock,
      };
      useShoppingContextMock.mockReturnValue(shoppingContextMock);

      const pharmacyNcpdpMock = pharmacyDrugPriceMock.pharmacy.ncpdp;

      const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
        pharmacyNcpdp: pharmacyNcpdpMock,
        isSieMemberPrescription: false,
      };

      useRouteMock.mockReturnValueOnce({
        params: paramsMock,
      });

      findPharmacyMock.mockReturnValue(pharmacyDrugPriceMock);

      const testRenderer = renderer.create(<OrderPreviewScreen />);

      expect(findPharmacyMock).toHaveBeenCalledTimes(1);
      expect(findPharmacyMock).toHaveBeenNthCalledWith(
        1,
        [pharmacyDrugPrice1Mock, pharmacyDrugPriceMock],
        pharmacyNcpdpMock
      );

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyRenderer = renderer.create(basicPage.props.body);
      const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

      const pharmacyInfoSection = getChildren(bodyContainer)[1];
      const pharmacyHoursSection = pharmacyInfoSection.props.children[2];
      const hoursContainer = pharmacyHoursSection.props.children;

      if (hoursMock.length === 0) {
        expect(hoursContainer.type).toEqual(BaseText);
        expect(hoursContainer.props.children).toEqual(
          contentMock.hoursNotSpecified
        );
      } else {
        expect(hoursContainer.type).toEqual(PharmacyHoursContainer);
        expect(hoursContainer.props.visible).toEqual(undefined);
        expect(hoursContainer.props.pharmacyHours).toEqual(
          convertHoursToMap(hoursMock)
        );
        expect(hoursContainer.props.textStyle).toEqual(
          orderPreviewScreenStyles.hoursTextStyle
        );
      }
    }
  );

  it('renders page footer', () => {
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const footer = basicPage.props.footer;
    const sendButton = footer;

    expect(sendButton.type).toEqual(BaseButton);
    expect(sendButton.props.children).toEqual(contentMock.sendButton);
    expect(sendButton.props.onPress).toEqual(expect.any(Function));
  });

  it.each([[false], [true]])(
    'sends prescription when "Send" button pressed when blockchain is %p',
    async (blockchainMock: boolean) => {
      const reduxDispatchMock = jest.fn();
      const reduxGetStateMock = jest.fn();
      const reduxContextMock: Partial<IReduxContext> = {
        dispatch: reduxDispatchMock,
        getState: reduxGetStateMock,
      };
      useReduxContextMock.mockReturnValue(reduxContextMock);

      const shoppingDispatchMock = jest.fn();
      const shoppingStateMock: IShoppingState = {
        ...defaultShoppingState,
        prescriptionInfo: {
          ...prescriptionInfoMock,
          blockchain: blockchainMock,
        },
      };
      const shoppingContextMock: IShoppingContext = {
        shoppingDispatch: shoppingDispatchMock,
        shoppingState: shoppingStateMock,
      };
      useShoppingContextMock.mockReturnValue(shoppingContextMock);

      const pharmacyNcpdpMock = 'pharmacy-ncpdp';

      const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
        pharmacyNcpdp: pharmacyNcpdpMock,
        isSieMemberPrescription: true,
      };

      useRouteMock.mockReturnValueOnce({
        params: paramsMock,
      });
      const testRenderer = renderer.create(<OrderPreviewScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const footer = basicPage.props.footer;
      const sendButton = footer;

      const orderDateMock = new Date();
      getNewDateMock.mockReturnValue(orderDateMock);

      const onPress = sendButton.props.onPress;
      await onPress();

      const expectedArgs: ISendPrescriptionAsyncActionArgs = {
        ncpdp: pharmacyNcpdpMock,
        prescriptionId: prescriptionInfoMock.prescriptionId,
        orderDate: orderDateMock,
        navigation: shoppingStackNavigationMock,
        blockchain: blockchainMock,
        shoppingDispatch: shoppingDispatchMock,
        reduxGetState: reduxGetStateMock,
        reduxDispatch: reduxDispatchMock,
      };
      expect(sendPrescriptionAsyncActionMock).toHaveBeenCalledWith(
        expectedArgs
      );
      expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
        CustomAppInsightEvents.PRESCRIPTION_USER_SEND_TO_PHARMACY,
        {
          prescriptionId: 'prescription-id',
          ncpdp: pharmacyNcpdpMock,
        }
      );
    }
  );

  it('navigates to confirmation screen when send successful', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
      getState: jest.fn(),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const blockChainMock = true;
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: { ...prescriptionInfoMock, blockchain: blockChainMock },
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const pharmacyNcpdpMock = 'pharmacy-ncpdp';
    const pricingOptionMock: PricingOption = 'pbm';

    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pharmacyNcpdp: pharmacyNcpdpMock,
      isSieMemberPrescription: true,
      pricingOption: pricingOptionMock,
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const footer = basicPage.props.footer;
    const sendButton = footer;

    const onPress = sendButton.props.onPress;
    await onPress();

    const expectedRouteProps: IShoppingConfirmationScreenRouteProps = {
      pharmacyNcpdp: pharmacyNcpdpMock,
      canGoBack: false,
      pricingOption: pricingOptionMock,
    };
    expect(confirmationNavigateDispatchMock).toHaveBeenCalledWith(
      shoppingStackNavigationMock,
      expectedRouteProps
    );
  });

  it('does not navigate to confirmation screen when send fails', async () => {
    sendPrescriptionAsyncActionMock.mockImplementation(() => {
      throw new Error('Not today.');
    });

    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const footer = basicPage.props.footer;
    const sendButton = footer;

    const onPress = sendButton.props.onPress;
    await onPress();

    expect(confirmationNavigateDispatchMock).not.toHaveBeenCalled();
  });

  it('calls send notification event on click "Send to Pharmacy"', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    const blockchainMock = true;
    const pharmacyNcpdpMock = 'pharmacy-ncpdp';

    const pharmacyAddressFormattedMock = `${
      prescriptionInfoMock.pharmacy?.address.lineOne
    }, ${prescriptionInfoMock.pharmacy?.address.state}, ${formatZipCode(
      prescriptionInfoMock.pharmacy?.address.zip ?? ''
    )}`;

    const shoppingDispatchMock = jest.fn();
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: {
        ...prescriptionInfoMock,
        blockchain: blockchainMock,
      },
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: shoppingDispatchMock,
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pharmacyNcpdp: pharmacyNcpdpMock,
      isSieMemberPrescription: true,
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });
    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const footer = basicPage.props.footer;
    const sendButton = footer;

    const onPress = sendButton.props.onPress;
    await onPress();

    await sendNotificationEventMock(() => {
      expect(sendNotificationEventMock).toHaveBeenCalledWith(
        {},
        {
          idType: 'smartContractId',
          id: prescriptionInfoMock.prescriptionId,
          tags: ['dRx', 'supportDashboard'],
          subject: `Prescription has been sent to Pharmacy`,
          messageData: `Send to Pharmacy (Success) - ${prescriptionInfoMock.pharmacy?.name}, ${pharmacyAddressFormattedMock}, ${prescriptionInfoMock.pharmacy?.ncpdp}`,
        },
        'device-token',
        'token'
      );
    });
  });

  it('calls send error event on click "Send to Pharmacy" fails', async () => {
    sendPrescriptionAsyncActionMock.mockImplementation(() => {
      throw new Error('Not today.');
    });
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    const blockchainMock = true;
    const pharmacyNcpdpMock = 'pharmacy-ncpdp';

    const pharmacyAddressFormattedMock = `${
      prescriptionInfoMock.pharmacy?.address.lineOne
    }, ${prescriptionInfoMock.pharmacy?.address.state}, ${formatZipCode(
      prescriptionInfoMock.pharmacy?.address.zip ?? ''
    )}`;

    const shoppingDispatchMock = jest.fn();
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: {
        ...prescriptionInfoMock,
        blockchain: blockchainMock,
      },
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: shoppingDispatchMock,
      shoppingState: shoppingStateMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pharmacyNcpdp: pharmacyNcpdpMock,
      isSieMemberPrescription: true,
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });
    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const footer = basicPage.props.footer;
    const sendButton = footer;

    const onPress = sendButton.props.onPress;
    await onPress();

    expect(confirmationNavigateDispatchMock).not.toHaveBeenCalled();

    await sendErrorEventMock(() => {
      expect(sendErrorEventMock).toHaveBeenCalledWith(
        {},
        {
          idType: 'smartContractId',
          id: prescriptionInfoMock.prescriptionId,
          tags: ['dRx', 'supportDashboard'],
          subject: `Error sending to pharmacy for patient`,
          type: 'error',
          messageData: `Send to Pharmacy (Failure) - ${prescriptionInfoMock.pharmacy?.name}, ${pharmacyAddressFormattedMock}, ${prescriptionInfoMock.pharmacy?.ncpdp}`,
        },
        'device-token',
        'token'
      );
    });
  });

  it.each([
    [true, true],
    [false, false],
    [true, false],
    [false, true],
    [true, undefined],
    [false, undefined],
  ])(
    'render the estimated price notice text with usertpb %p , hasInsurance %p',
    (usertpb: boolean, hasInsurance?: boolean) => {
      const shoppingStateMock: IShoppingState = {
        ...defaultShoppingState,
        prescriptionInfo: prescriptionInfoMock,
        prescriptionPharmacies: [
          pharmacyDrugPrice1Mock,
          pharmacyDrugPrice2Mock,
        ],
        hasInsurance,
      };
      const shoppingContextMock: IShoppingContext = {
        shoppingDispatch: jest.fn(),
        shoppingState: shoppingStateMock,
      };

      useShoppingContextMock.mockReturnValue(shoppingContextMock);
      useFlagsMock.mockReturnValue({ usertpb });

      const testRenderer = renderer.create(<OrderPreviewScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyRenderer = renderer.create(basicPage.props.body);
      const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

      const pharmacyInfoSection = getChildren(bodyContainer)[1];
      const couponSectionView = getChildren(pharmacyInfoSection)[0];
      const prescriptionPriceView = couponSectionView.props.children[1];

      expect(prescriptionPriceView.props.testID).toEqual('prescriptionPrice');
      expect(prescriptionPriceView.props.style).toEqual(
        orderPreviewScreenStyles.PrescriptionPriceSectionViewStyle
      );
      const estimatedPriceNoticeText = getChildren(prescriptionPriceView)[1];
      if (usertpb && hasInsurance) {
        expect(estimatedPriceNoticeText.type).toEqual(BaseText);
        expect(estimatedPriceNoticeText.props.isSkeleton).toEqual(false);
        expect(estimatedPriceNoticeText.props.skeletonWidth).toEqual('long');
        expect(estimatedPriceNoticeText.props.style).toEqual(
          orderPreviewScreenStyles.estimatedPriceNoticeTextStyle
        );
        expect(estimatedPriceNoticeText.props.children).toEqual(
          contentMock.estimatedPriceNoticeText
        );
      } else {
        expect(estimatedPriceNoticeText).toBeFalsy();
      }
    }
  );

  it('call getDependentWithMemberId', () => {
    renderer.create(<OrderPreviewScreen />);

    expect(getDependentWithMemberIdMock).toHaveBeenCalledWith(
      undefined,
      prescriptionInfoMock.primaryMemberRxId
    );
  });

  it('renders prescription patient name', () => {
    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
      prescriptionPharmacies: [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock],
    };
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: shoppingStateMock,
    };

    useShoppingContextMock.mockReturnValue(shoppingContextMock);
    getDependentWithMemberIdMock.mockReturnValue(mockPatient);

    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const stickyViews = basicPage.props.stickyViews;
    const stickyView = stickyViews[0];
    const patientNameView = stickyView.view;

    expect(patientNameView.type).toEqual(View);
    expect(patientNameView.props.children.type).toEqual(
      PrescriptionPatientName
    );
  });

  it('renders prices: PBM Pricing Option', () => {
    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pricingOption: 'pbm',
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });
    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const couponSectionView = getChildren(pharmacyInfoSection)[0];
    const prescriptionPriceView = couponSectionView.props.children[1];

    expect(prescriptionPriceView.props.testID).toEqual('prescriptionPrice');
    expect(prescriptionPriceView.props.style).toEqual(
      orderPreviewScreenStyles.PrescriptionPriceSectionViewStyle
    );
    const prescriptionPriceSection = getChildren(prescriptionPriceView)[0];
    expect(prescriptionPriceSection.type).toEqual(
      PbmPricingOptionInformativePanel
    );
    expect(prescriptionPriceSection.props.memberPays).toEqual(
      pharmacyDrugPrice2Mock.price?.memberPays
    );
    expect(prescriptionPriceSection.props.planPays).toEqual(
      pharmacyDrugPrice2Mock.price?.planPays
    );
  });

  it('renders prices: Third Party Pricing Option', () => {
    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pricingOption: 'thirdParty',
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });
    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const couponSectionView = getChildren(pharmacyInfoSection)[0];
    const prescriptionPriceView = couponSectionView.props.children[1];

    expect(prescriptionPriceView.props.testID).toEqual('prescriptionPrice');
    expect(prescriptionPriceView.props.style).toEqual(
      orderPreviewScreenStyles.PrescriptionPriceSectionViewStyle
    );
    const prescriptionPriceSection = getChildren(prescriptionPriceView)[0];
    expect(prescriptionPriceSection.type).toEqual(
      ThirdPartyPricingOptionInformativePanel
    );
    expect(prescriptionPriceSection.props.memberPays).toEqual(
      pharmacyDrugPrice2Mock.price?.memberPays
    );
  });

  it('renders prices: Smart Price Pricing Option', () => {
    const paramsMock: Partial<IOrderPreviewScreenRouteProps> = {
      pricingOption: 'smartPrice',
    };

    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });
    const testRenderer = renderer.create(<OrderPreviewScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    const pharmacyInfoSection = getChildren(bodyContainer)[1];
    const couponSectionView = getChildren(pharmacyInfoSection)[0];
    const prescriptionPriceView = couponSectionView.props.children[1];

    expect(prescriptionPriceView.props.testID).toEqual('prescriptionPrice');
    expect(prescriptionPriceView.props.style).toEqual(
      orderPreviewScreenStyles.PrescriptionPriceSectionViewStyle
    );
    const prescriptionPriceSection = getChildren(prescriptionPriceView)[0];
    expect(prescriptionPriceSection.type).toEqual(
      SmartPricePricingOptionInformativePanel
    );
    expect(prescriptionPriceSection.props.memberPays).toEqual(
      pharmacyDrugPrice2Mock.price?.memberPays
    );
  });
});
