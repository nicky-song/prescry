// Copyright 2021 Prescryptive Health, Inc.

import React, { Fragment, useState } from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ISessionContext } from '../context-providers/session/session.context';
import { defaultSessionState } from '../state/session/session.state';
import { getNewDate } from '../../../utils/date-time/get-new-date';
import { useSessionContext } from '../context-providers/session/use-session-context.hook';
import {
  IPickAPharmacyPrescribedMedicationProps,
  IPickAPharmacyPrescriptionTitleProps,
  IPickAPharmacyProps,
  PickAPharmacy,
} from './pick-a-pharmacy';
import {
  pharmacyDrugPrice1Mock,
  pharmacyDrugPrice2Mock,
} from '../__mocks__/pharmacy-drug-price.mock';
import { IPharmacyDrugPrice } from '../../../models/pharmacy-drug-price';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { pickAPharmacyStyles } from './pick-a-pharmacy.styles';
import { PrescriptionTitle } from '../../../components/member/prescription-title/prescription-title';
import { LineSeparator } from '../../../components/member/line-separator/line-separator';
import { PromotionLinkButton } from '../../../components/buttons/promotion-link/promotion-link.button';
import { Heading } from '../../../components/member/heading/heading';
import { LocationButton } from '../../../components/buttons/location.button/location.button';
import { FilterButton } from '../../../components/buttons/filter/filter.button';
import { PrescriptionValueCard } from '../../../components/member/cards/prescription-value/prescription-value.card';
import pickAPharmacyFormatter from '../../../utils/formatters/pick-a-pharmacy.formatter';
import { InformationButton } from '../../../components/buttons/information/information.button';
import { PopupModal } from '../../../components/modal/popup-modal/popup-modal';
import { useNavigation } from '@react-navigation/native';
import {
  IConfigureFiltersScreenRouteProps,
  ISortOptions,
  SortByOption,
} from '../screens/drug-search/configure-filters/configure-filters.screen';
import { SkeletonPharmacyCard } from '../../../components/member/cards/skeleton-pharmacy/skeleton-pharmacy.card';
import { ErrorConstants } from '../api/api-response-messages';
import { PharmacyGroup } from '../../../components/member/pharmacy-group/pharmacy-group';
import { locationCoordinatesMock } from '../__mocks__/location-coordinate.mock';
import { LogoClickActionEnum } from '../../../components/app/application-header/application-header';
import { favoritePharmaciesGroupLeaderGrouper } from '../../../utils/pharmacies/favorite-pharmacies.group-leaders.grouper';
import { useMembershipContext } from '../context-providers/membership/use-membership-context.hook';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { IPickAPharmacyContent } from './pick-a-pharmacy.content';
import { IOpenStatusContent } from '../../../utils/formatters/date.formatter';
import { AlternativeSavingsCard } from '../../../components/cards/alternative-savings/alternative-savings.card';
import { BaseText } from '../../../components/text/base-text/base-text';
import { PrescribedMedication } from '../../../components/member/prescribed-medication/prescribed-medication';
import { getChildren } from '../../../testing/test.helper';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { IDualDrugPrice } from '../../../models/drug-price';
import { ILimitedPatient } from '../../../models/patient-profile/limited-patient';
import { PrescriptionPatientName } from '../screens/shopping/prescription-patient/prescription-patient-name';

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = useFlags as jest.Mock;

jest.mock(
  '../../../utils/pharmacies/favorite-pharmacies.group-leaders.grouper'
);
const favoritePharmaciesGroupLeaderGrouperMock =
  favoritePharmaciesGroupLeaderGrouper as jest.Mock;

jest.mock('../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../components/member/pharmacy-group/pharmacy-group', () => ({
  PharmacyGroup: () => <div />,
}));

jest.mock('../api/api-response-messages', () => ({
  ErrorConstants: {
    INVALID_ZIPCODE_SEARCH: 'invalid-zipcode-search',
    PHARMACY_SEARCH_FAILURE: 'pharmacy-search-failure',
  },
}));

jest.mock(
  '../../../components/member/cards/skeleton-pharmacy/skeleton-pharmacy.card',
  () => ({
    SkeletonPharmacyCard: () => <div />,
  })
);

jest.mock('../../../utils/formatters/pick-a-pharmacy.formatter', () => ({
  formatOpenStatus: jest.fn(),
}));

const formatOpenStatusMock =
  pickAPharmacyFormatter.formatOpenStatus as jest.Mock;
jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../../../utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

jest.mock('../state/drug-search/async-actions/get-drug-price.async-action');

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('../../../components/buttons/filter/filter.button', () => ({
  FilterButton: () => <div />,
}));

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const rootStackNavigationMock = { navigate: jest.fn() };

jest.mock('../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

interface IStateCalls {
  isInformationModalOpenCall: [boolean, jest.Mock];
  featuredAdded: [boolean, jest.Mock];
  stickyHeightCall: [number, jest.Mock];
  showNewFeatureNotificationCall: [boolean, jest.Mock];
}

function stateReset({
  isInformationModalOpenCall = [false, jest.fn()],
  stickyHeightCall = [0, jest.fn()],
  featuredAdded = [false, jest.fn()],
  showNewFeatureNotificationCall = [true, jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(isInformationModalOpenCall);
  useStateMock.mockReturnValueOnce(featuredAdded);
  useStateMock.mockReturnValueOnce(stickyHeightCall);
  useStateMock.mockReturnValueOnce(showNewFeatureNotificationCall);
}

const dualPriceMock: IDualDrugPrice = {
  smartPriceMemberPays: 23,
  pbmType: 'phx',
  pbmMemberPays: 25,
  pbmPlanPays: 25,
};

const pharmaciesMock: IPharmacyDrugPrice[] = [
  pharmacyDrugPrice1Mock,
  pharmacyDrugPrice2Mock,
];

const eligibilityMock = 'elegibility-label-mock';
const pickYourPharmacyMock = 'pick-your-pharmacy-label-mock';
const informationButtonLabelMock = 'information-button-label-mock';
const locationMock = 'location-label-mock';
const noPharmacyFoundMock = 'no-pharmacy-found-label-mock';
const youPayLabelMock = 'you-pay-label-mock';
const planPaysLabelMock = 'plan-pays-label-mock';
const distanceLabelMock = 'distance-label-mock';
const popUpModalTextMock = 'popup-modal-text-label-mock';
const popUpModalLabelMock = 'popup-modal-label-mock';
const popUpModalContentMock = 'popup-modal-content-label-mock';
const noPharmaciesFoundErrorMessagePrefix =
  'no-pharmacies-found-error-message-label';
const noPharmaciesFoundErrorMessagePluralPrefix =
  'no-pharmacies-found-error-message-plural-label';
const noPharmaciesFoundErrorMessageMock =
  noPharmaciesFoundErrorMessagePrefix + '{distance}';
const noPharmaciesFoundErrorMessagePluralMock =
  noPharmaciesFoundErrorMessagePluralPrefix + '{distance}';
const pickYourPharmacySubTextMock = 'pick-your-pharmacy-sub-text-mock';
const rtpbDescriptionMock = 'rtpb-description-mock';

const pickAPharmacyContentMock: Partial<IPickAPharmacyContent> = {
  eligibility: eligibilityMock,
  pickYourPharmacy: pickYourPharmacyMock,
  informationButtonLabel: informationButtonLabelMock,
  location: locationMock,
  noPharmacyFound: noPharmacyFoundMock,
  youPayLabel: youPayLabelMock,
  planPaysLabel: planPaysLabelMock,
  distanceLabel: distanceLabelMock,
  popUpModalText: popUpModalTextMock,
  popUpModalLabel: popUpModalLabelMock,
  popUpModalContent: popUpModalContentMock,
  noPharmaciesFoundErrorMessage: noPharmaciesFoundErrorMessageMock,
  noPharmaciesFoundErrorMessagePlural: noPharmaciesFoundErrorMessagePluralMock,
  pickYourPharmacySubText: pickYourPharmacySubTextMock,
  rtpbDescription: rtpbDescriptionMock,
};

const mockPatient = {
  firstName: 'first-name',
  lastName: 'last-name',
  dateOfBirth: '2000-01-01',
  phoneNumber: '+11111111111',
  recoveryEmail: 'email',
} as ILimitedPatient;

const openStatusContentMock: IOpenStatusContent = {
  closed: 'closed',
  open: 'open',
  open24Hours: 'open-24-hours',
  opensAt: 'opens-at-label',
  closesAt: 'closes-at-label',
};

describe('PickAPharmacy', () => {
  beforeEach(() => {
    useContentMock.mockReturnValue({ content: {} });
  });
  const props: IPickAPharmacyProps = {
    showNoPharmaciesFoundErrorMessage: false,
    showProfileAvatar: true,
    bestPricePharmacy: pharmacyDrugPrice1Mock,
    pharmacies: pharmaciesMock,
    onPharmacyPress: jest.fn(),
    navigateBack: jest.fn(),
    hasStickyView: true,
    isGettingPharmacies: false,
    isGettingUserLocation: false,
    logoClickAction: LogoClickActionEnum.CONFIRM,
  };
  const propsNoPharmaciesFound: IPickAPharmacyProps = {
    showNoPharmaciesFoundErrorMessage: true,
    showProfileAvatar: true,
    bestPricePharmacy: pharmacyDrugPrice1Mock,
    pharmacies: pharmaciesMock,
    onPharmacyPress: jest.fn(),
    navigateBack: jest.fn(),
    hasStickyView: true,
    isGettingPharmacies: false,
    isGettingUserLocation: false,
  };

  useFlagsMock.mockReturnValue({ usePointOfCare: false });

  beforeEach(() => {
    jest.clearAllMocks();

    stateReset({});
    getNewDateMock.mockReturnValue(new Date());

    const sessionContextMock: ISessionContext = {
      sessionDispatch: jest.fn(),
      sessionState: defaultSessionState,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);
    rootStackNavigationMock.navigate.mockReset();
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    useFlagsMock.mockReturnValue({ usertpb: true });

    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: {
          favoritedPharmacies: [],
        },
      },
    });

    favoritePharmaciesGroupLeaderGrouperMock.mockImplementation(
      (pharmacyDrugPrice: IPharmacyDrugPrice, _favoritedPharmacies: string[]) =>
        pharmacyDrugPrice
    );
  });

  it.each([[false], [false], [true], [false]])(
    'renders as basic page (informationModalOpen: %p)',
    (isInformationModalOpenMock: boolean) => {
      stateReset({
        isInformationModalOpenCall: [isInformationModalOpenMock, jest.fn()],
      });

      const testRenderer = renderer.create(<PickAPharmacy {...props} />);
      const basicPage = testRenderer.root.children[0] as ReactTestInstance;

      expect(basicPage.type).toEqual(BasicPageConnected);
      expect(basicPage.props.stickyIndices).toEqual([1]);
      expect(basicPage.props.showProfileAvatar).toEqual(true);
      expect(basicPage.props.headerViewStyle).toEqual(
        pickAPharmacyStyles.headerViewStyle
      );
      expect(basicPage.props.logoClickAction).toEqual(
        LogoClickActionEnum.CONFIRM
      );
      expect(basicPage.props.translateContent);
    }
  );

  it('renders sticky view if passed from props', () => {
    const prescriptionTitlePropsMock: IPickAPharmacyPrescriptionTitleProps = {
      drugName: 'drug-name-mock',
      formCode: 'form-code-mock',
      quantity: 33,
      refills: 0,
    };
    const testRenderer = renderer.create(
      <PickAPharmacy
        {...props}
        prescriptionTitleProps={prescriptionTitlePropsMock}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const stickyViews = basicPage.props.stickyViews;
    expect(stickyViews.length).toEqual(1);

    const stickyView = stickyViews[0];

    expect(stickyView.view.type).toEqual(View);
    expect(stickyView.view.props.style).toEqual(
      pickAPharmacyStyles.stickyViewStyle
    );
    expect(stickyView.view.props.onLayout).toEqual(expect.any(Function));
  });

  it('renders prescription Title if passed in the props', () => {
    const sessionContextMock: ISessionContext = {
      sessionDispatch: jest.fn(),
      sessionState: defaultSessionState,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    const prescriptionTitleProps: IPickAPharmacyPrescriptionTitleProps = {
      drugName: 'drug-name',
      strength: '100',
      formCode: 'tablet',
      unit: 'mg',
      quantity: 10,
      refills: 0,
    };

    const mockConfigureMedication = jest.fn();

    const propsWithStickView: IPickAPharmacyProps = {
      ...props,
      hasStickyView: true,
      prescriptionTitleProps,
      canShowContent: true,
      configureMedication: mockConfigureMedication,
    };

    const testRenderer = renderer.create(
      <PickAPharmacy {...propsWithStickView} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const stickyViews = basicPage.props.stickyViews;

    expect(stickyViews.length).toEqual(1);

    const stickyView = stickyViews[0];

    const stickyViewContainer = stickyView.view;

    expect(stickyViewContainer.type).toEqual(View);
    expect(stickyViewContainer.props.style).toEqual(
      pickAPharmacyStyles.stickyViewStyle
    );
    expect(stickyViewContainer.props.onLayout).toEqual(expect.any(Function));
    expect(stickyViewContainer.props.children[1].type).toEqual(View);
    const prescriptionTitle = getChildren(
      stickyViewContainer.props.children[1]
    )[0];

    expect(prescriptionTitle.type).toEqual(PrescriptionTitle);
    expect(prescriptionTitle.props.productName).toEqual(
      prescriptionTitleProps.drugName
    );
    expect(prescriptionTitle.props.strength).toEqual(
      prescriptionTitleProps.strength
    );
    expect(prescriptionTitle.props.formCode).toEqual(
      prescriptionTitleProps.formCode
    );
    expect(prescriptionTitle.props.unit).toEqual(prescriptionTitleProps.unit);
    expect(prescriptionTitle.props.quantity).toEqual(
      prescriptionTitleProps.quantity
    );
    expect(prescriptionTitle.props.refills).toEqual(0);
    expect(prescriptionTitle.props.onPressButton).toEqual(
      mockConfigureMedication
    );
    const lineSeparator = getChildren(stickyViewContainer.props.children[1])[1];
    expect(lineSeparator.type).toEqual(LineSeparator);
    expect(lineSeparator.props.viewStyle).toEqual(
      pickAPharmacyStyles.lineSeparatorViewStyle
    );
  });

  it('render prescribed medication if prescriptionTitleProps not passed in props', () => {
    const prescribedMedicationProps: IPickAPharmacyPrescribedMedicationProps = {
      drugName: 'drug-name',
      drugDetails: {
        quantity: 10,
        formCode: 'tablet',
        strength: '100',
        refills: 0,
        unit: 'mg',
      },
    };

    const propsWithStickView: IPickAPharmacyProps = {
      ...props,
      hasStickyView: true,
      prescribedMedicationProps,
      canShowContent: true,
    };

    const testRenderer = renderer.create(
      <PickAPharmacy {...propsWithStickView} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const stickyViews = basicPage.props.stickyViews;

    expect(stickyViews.length).toEqual(1);

    const stickyView = stickyViews[0];

    const stickyViewContainer = stickyView.view;

    expect(stickyViewContainer.type).toEqual(View);
    expect(stickyViewContainer.props.style).toEqual(
      pickAPharmacyStyles.stickyViewStyle
    );
    expect(stickyViewContainer.props.onLayout).toEqual(expect.any(Function));

    const prescribedMedication = stickyViewContainer.props.children[1];

    expect(prescribedMedication.type).toEqual(PrescribedMedication);
    expect(prescribedMedication.props.drugDetails).toEqual(
      prescribedMedicationProps.drugDetails
    );
    expect(prescribedMedication.props.drugName).toEqual(
      prescribedMedicationProps.drugName
    );
    expect(prescribedMedication.props.viewStyle).toEqual(
      pickAPharmacyStyles.prescribedMedicationViewStyle
    );
  });

  it('renders a promotion link button when valid coupon exists in response', () => {
    useContentMock.mockReturnValue({
      content: pickAPharmacyContentMock,
      isContentLoading: false,
    });

    const propsWithCoupon: IPickAPharmacyProps = {
      ...props,
      bestPricePharmacy: pharmacyDrugPrice2Mock,
      canShowContent: true,
    };
    stateReset({ stickyHeightCall: [145, jest.fn()] });

    const testRenderer = renderer.create(
      <PickAPharmacy {...propsWithCoupon} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyView = body.props.children;
    const promotionLinkButton = bodyView.props.children[0];
    expect(promotionLinkButton.type).toEqual(PromotionLinkButton);
    expect(promotionLinkButton.props.image).toEqual('couponIcon');
    expect(promotionLinkButton.props.viewStyle).toEqual(
      pickAPharmacyStyles.promotionLinkViewStyle
    );
    expect(promotionLinkButton.props.onPress).toEqual(expect.any(Function));
    expect(promotionLinkButton.props.linkText).toEqual(
      pickAPharmacyContentMock.eligibility
    );
    expect(promotionLinkButton.props.promotionText).toEqual(
      'Pay as little as $28 with manufacturer coupon.'
    );
  });

  it.todo('handles sticky view onLayout change');

  it('renders "Pick your pharmacy" section', () => {
    useContentMock.mockReturnValue({
      content: pickAPharmacyContentMock,
      isContentLoading: false,
    });

    stateReset({ stickyHeightCall: [145, jest.fn()] });
    const propsWithCoupon: IPickAPharmacyProps = {
      ...props,
      bestPricePharmacy: pharmacyDrugPrice2Mock,
      canShowContent: true,
    };

    const testRenderer = renderer.create(
      <PickAPharmacy {...propsWithCoupon} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyContainer = body.props.children;
    const headingView = bodyContainer.props.children[2];

    expect(headingView.type).toEqual(View);
    expect(headingView.props.style).toEqual(
      pickAPharmacyStyles.pickYourPharmacyViewStyle
    );

    const heading = headingView.props.children[0];
    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(2);
    expect(heading.props.textStyle).toEqual(
      pickAPharmacyStyles.pickYourPharmacyTextStyle
    );
    expect(heading.props.children).toEqual(
      pickAPharmacyContentMock.pickYourPharmacy
    );
  });

  it('renders InformationButton on modal state open', () => {
    useContentMock.mockReturnValue({
      content: pickAPharmacyContentMock,
      isContentLoading: false,
    });

    const propsWithContent: IPickAPharmacyProps = {
      ...props,
      bestPricePharmacy: pharmacyDrugPrice2Mock,
      canShowContent: true,
    };

    stateReset({
      isInformationModalOpenCall: [true, jest.fn()],
    });

    const testRenderer = renderer.create(
      <PickAPharmacy {...propsWithContent} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPage.props.body;

    const bodyContainer = body.props.children;
    const infoButtonView = bodyContainer.props.children[2];

    const informationButton = infoButtonView.props.children[1];
    expect(informationButton.type).toEqual(InformationButton);
    expect(informationButton.props.accessibilityLabel).toEqual(
      pickAPharmacyContentMock.informationButtonLabel
    );
    const modal = basicPage.props.modals[0];
    expect(modal.props.isOpen).toEqual(true);
  });

  it.each([
    [jest.fn(), true],
    [undefined, true],
    [jest.fn(), false],
    [undefined, false],
  ])(
    'renders pick your pharmacy rtpb description when hasInsurance',
    (configureMedication: (() => void) | undefined, hasInsurance: boolean) => {
      useContentMock.mockReturnValue({
        content: pickAPharmacyContentMock,
        isContentLoading: false,
      });

      useFlagsMock.mockReturnValue({ usertpb: true });
      stateReset({ stickyHeightCall: [145, jest.fn()] });
      const propsWithCoupon: IPickAPharmacyProps = {
        ...props,
        bestPricePharmacy: pharmacyDrugPrice2Mock,
        canShowContent: true,
        hasInsurance,
        configureMedication,
      };

      const testRenderer = renderer.create(
        <PickAPharmacy {...propsWithCoupon} />
      );

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const body = basicPage.props.body;

      const bodyContainer = body.props.children;
      const description = bodyContainer.props.children[3];

      if (!configureMedication && hasInsurance) {
        expect(description.type).toEqual(BaseText);
        expect(description.props.isSkeleton).toEqual(false);
        expect(description.props.skeletonWidth).toEqual('long');
        expect(description.props.children).toEqual(
          pickAPharmacyContentMock.rtpbDescription
        );
        expect(description.props.style).toEqual(
          pickAPharmacyStyles.pickYourPharmacySubTextStyle
        );
      } else {
        expect(description).toBeNull();
      }
    }
  );

  it.each([[dualPriceMock], [undefined]])(
    'renders pharmacy cards with dualPrice %p',
    (dualPriceMock?: IDualDrugPrice) => {
      const nowMock = new Date();
      getNewDateMock.mockReturnValue(nowMock);

      useContentMock.mockReturnValue({
        content: openStatusContentMock,
        isContentLoading: false,
      });

      const openStatusMock = 'open-status';
      formatOpenStatusMock.mockReturnValue(openStatusMock);

      const otherPharmaciesMock = [
        {
          ...pharmacyDrugPrice2Mock,
          pharmacy: { ...pharmacyDrugPrice2Mock.pharmacy, ncpdp: '1' },
          dualPrice: dualPriceMock,
        },
        {
          ...pharmacyDrugPrice2Mock,
          pharmacy: { ...pharmacyDrugPrice2Mock.pharmacy, ncpdp: '2' },
          dualPrice: dualPriceMock,
        },
      ];

      const propsWithContent: IPickAPharmacyProps = {
        ...props,
        bestPricePharmacy: {
          ...pharmacyDrugPrice2Mock,
          otherPharmacies: otherPharmaciesMock,
        },
        canShowContent: true,
      };

      const testRenderer = renderer.create(
        <PickAPharmacy {...propsWithContent} />
      );

      expect(favoritePharmaciesGroupLeaderGrouperMock).toHaveBeenCalledTimes(0);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);

      const body = basicPage.props.body;
      const bodyContainer = body.props.children;

      const pharmacyFragment = bodyContainer.props.children[5];
      expect(pharmacyFragment.type).toEqual(Fragment);

      const bestPricePharmacyCard =
        pharmacyFragment.props.children[0][0].props.children[0];
      const bestPricePharmacyGroup =
        pharmacyFragment.props.children[0][0].props.children[1];

      expect(bestPricePharmacyCard.type).toEqual(PrescriptionValueCard);
      expect(bestPricePharmacyGroup.type).toEqual(PharmacyGroup);

      const pharmacyCards = pharmacyFragment.props.children[1];

      expect(pharmacyCards.length).toEqual(pharmaciesMock.length); // Modify after actual response implementation JPM 5/16/2022

      pharmacyCards.forEach(
        (currentPharmacyPair: ReactTestInstance, index: number) => {
          const currentOtherPharmacies = pharmaciesMock[index].otherPharmacies;
          const hasOtherPharmacies = !!currentOtherPharmacies;
          const pharmacyCard = currentPharmacyPair.props.children[0];
          const pharmacyGroup = currentPharmacyPair.props.children[1];

          expect(pharmacyCard.type).toEqual(PrescriptionValueCard);

          const {
            name,
            ncpdp,
            hours,
            twentyFourHours,
            address,
            distance,
            isMailOrderOnly,
          } = pharmaciesMock[index].pharmacy;

          const coupon = pharmaciesMock.find(
            (pharm: IPharmacyDrugPrice) => pharm.coupon
          )?.coupon;
          const couponPrice = coupon?.price;
          const price = pharmaciesMock[index].price;
          const memberPays = price ? price.memberPays : undefined;
          const dualPrice = pharmaciesMock[index].dualPrice;
          expect(pharmacyCard.props.pharmacyName).toEqual(name);
          expect(pharmacyCard.props.ncpdp).toEqual(ncpdp);
          expect(pharmacyCard.props.userGroup).toEqual('CASH');
          expect(pharmacyCard.props.isMailOrderOnly).toEqual(isMailOrderOnly);
          expect(pharmacyCard.props.address).toEqual(address);
          expect(pharmacyCard.props.distance).toEqual(distance);
          expect(pharmacyCard.props.patientAssistance).toEqual(false);
          expect(pharmacyCard.props.serviceStatus).toEqual(openStatusMock);
          expect(pharmacyCard.props.priceYouPay).toEqual(memberPays);
          expect(pharmacyCard.props.viewStyle).toEqual(
            pickAPharmacyStyles.pharmacyCardViewStyle
          );
          expect(pharmacyCard.props.couponDetails.price).toEqual(couponPrice);
          expect(pharmacyCard.props.testID).toEqual(
            'prescriptionValueCard-IsNotBestValue-IsNotMailOrderOnly-ncpdp-' +
              (index + 1)
          );
          expect(pharmacyCard.props.dualPrice).toEqual(dualPrice);
          expect(pharmacyCard.props.insurancePrice).toEqual(
            price?.insurancePrice
          );

          expect(formatOpenStatusMock).toHaveBeenCalledWith(
            nowMock,
            hours,
            twentyFourHours,
            openStatusContentMock
          );

          if (hasOtherPharmacies) {
            expect(pharmacyGroup.type).toEqual(PharmacyGroup);
            expect(pharmacyGroup.props.onPharmacyPress).toEqual(
              expect.any(Function)
            );
            expect(pharmacyGroup.props.pharmacyInfoList).toEqual(
              currentOtherPharmacies
            );
            expect(pharmacyGroup.props.viewStyle).toEqual(
              pickAPharmacyStyles.pharmacyGroupViewStyle
            );
          } else {
            expect(pharmacyGroup).toBeNull();
          }
        }
      );
    }
  );

  it('renders pharmacy cards after calling favorite pharmacies group leaders grouper if favoritedPharmacies length', () => {
    const ncpdpMock1 = 'ncpdp-mock-1';
    const ncpdpMock2 = 'ncpdp-mock-2';
    const favoritedPharmaciesMock = [ncpdpMock1, ncpdpMock2];

    useContentMock.mockReturnValue({
      content: openStatusContentMock,
      isContentLoading: false,
    });

    useMembershipContextMock.mockReset();
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: {
          favoritedPharmacies: favoritedPharmaciesMock,
        },
      },
    });
    const nowMock = new Date();
    getNewDateMock.mockReturnValue(nowMock);

    const openStatusMock = 'open-status';
    formatOpenStatusMock.mockReturnValue(openStatusMock);

    const otherPharmaciesMock = [
      {
        ...pharmacyDrugPrice2Mock,
        pharmacy: { ...pharmacyDrugPrice2Mock.pharmacy, ncpdp: ncpdpMock1 },
      },
      {
        ...pharmacyDrugPrice2Mock,
        pharmacy: { ...pharmacyDrugPrice2Mock.pharmacy, ncpdp: ncpdpMock2 },
      },
    ];

    const bestPricePharmacyMock = {
      ...pharmacyDrugPrice2Mock,
      otherPharmacies: otherPharmaciesMock,
    };

    const propsWithContent: IPickAPharmacyProps = {
      ...props,
      bestPricePharmacy: bestPricePharmacyMock,
      canShowContent: true,
    };

    const testRenderer = renderer.create(
      <PickAPharmacy {...propsWithContent} />
    );

    expect(favoritePharmaciesGroupLeaderGrouperMock).toHaveBeenCalledTimes(
      pharmaciesMock.length + (props.bestPricePharmacy ? 1 : 0)
    );

    if (props.bestPricePharmacy) {
      expect(favoritePharmaciesGroupLeaderGrouperMock).toHaveBeenNthCalledWith(
        1,
        bestPricePharmacyMock,
        favoritedPharmaciesMock
      );

      props.pharmacies.forEach((pharmacy, index) => {
        expect(
          favoritePharmaciesGroupLeaderGrouperMock
        ).toHaveBeenNthCalledWith(index + 2, pharmacy, favoritedPharmaciesMock);
      });
    } else {
      props.pharmacies.forEach((pharmacy, index) => {
        expect(
          favoritePharmaciesGroupLeaderGrouperMock
        ).toHaveBeenNthCalledWith(index + 1, pharmacy, favoritedPharmaciesMock);
      });
    }

    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPage.props.body;
    const bodyContainer = body.props.children;

    const pharmacyFragment = bodyContainer.props.children[5];
    expect(pharmacyFragment.type).toEqual(Fragment);

    const bestPricePharmacyCard =
      pharmacyFragment.props.children[0][0].props.children[0];
    const bestPricePharmacyGroup =
      pharmacyFragment.props.children[0][0].props.children[1];

    expect(bestPricePharmacyCard.type).toEqual(PrescriptionValueCard);
    expect(bestPricePharmacyGroup.type).toEqual(PharmacyGroup);

    const pharmacyCards = pharmacyFragment.props.children[1];

    expect(pharmacyCards.length).toEqual(pharmaciesMock.length); // Modify after actual response implementation JPM 5/16/2022

    pharmacyCards.forEach(
      (currentPharmacyPair: ReactTestInstance, index: number) => {
        const currentOtherPharmacies = pharmaciesMock[index].otherPharmacies;
        const hasOtherPharmacies = !!currentOtherPharmacies;
        const pharmacyCard = currentPharmacyPair.props.children[0];
        const pharmacyGroup = currentPharmacyPair.props.children[1];

        expect(pharmacyCard.type).toEqual(PrescriptionValueCard);

        const {
          name,
          ncpdp,
          hours,
          twentyFourHours,
          address,
          distance,
          isMailOrderOnly,
        } = pharmaciesMock[index].pharmacy;

        const coupon = pharmaciesMock.find(
          (pharm: IPharmacyDrugPrice) => pharm.coupon
        )?.coupon;
        const couponPrice = coupon?.price;
        const price = pharmaciesMock[index].price;
        const memberPays = price ? price.memberPays : undefined;

        expect(pharmacyCard.props.pharmacyName).toEqual(name);
        expect(pharmacyCard.props.ncpdp).toEqual(ncpdp);
        expect(pharmacyCard.props.userGroup).toEqual('CASH');
        expect(pharmacyCard.props.isMailOrderOnly).toEqual(isMailOrderOnly);
        expect(pharmacyCard.props.address).toEqual(address);
        expect(pharmacyCard.props.distance).toEqual(distance);
        expect(pharmacyCard.props.patientAssistance).toEqual(false);
        expect(pharmacyCard.props.serviceStatus).toEqual(openStatusMock);
        expect(pharmacyCard.props.priceYouPay).toEqual(memberPays);
        expect(pharmacyCard.props.viewStyle).toEqual(
          pickAPharmacyStyles.pharmacyCardViewStyle
        );
        expect(pharmacyCard.props.couponDetails.price).toEqual(couponPrice);
        expect(pharmacyCard.props.testID).toEqual(
          'prescriptionValueCard-IsNotBestValue-IsNotMailOrderOnly-ncpdp-' +
            (index + 1)
        );
        expect(pharmacyCard.props.insurancePrice).toEqual(
          price?.insurancePrice
        );

        expect(formatOpenStatusMock).toHaveBeenCalledWith(
          nowMock,
          hours,
          twentyFourHours,
          openStatusContentMock
        );

        if (hasOtherPharmacies) {
          expect(pharmacyGroup.type).toEqual(PharmacyGroup);
          expect(pharmacyGroup.props.onPharmacyPress).toEqual(
            expect.any(Function)
          );
          expect(pharmacyGroup.props.pharmacyInfoList).toEqual(
            currentOtherPharmacies
          );
          expect(pharmacyGroup.props.viewStyle).toEqual(
            pickAPharmacyStyles.pharmacyGroupViewStyle
          );
        } else {
          expect(pharmacyGroup).toBeNull();
        }
      }
    );
  });

  it.each([[undefined], ['brand-mock']])(
    'renders pharmacy cards with pharmacy brand or name (brand: %s)',
    (brandMock?: string) => {
      const nowMock = new Date();
      getNewDateMock.mockReturnValue(nowMock);

      const openStatusMock = 'open-status';
      formatOpenStatusMock.mockReturnValue(openStatusMock);

      const propsWithContent: IPickAPharmacyProps = {
        ...{
          ...props,
          pharmacies: [
            {
              ...pharmacyDrugPrice1Mock,
              pharmacy: {
                ...pharmacyDrugPrice1Mock.pharmacy,
                brand: brandMock,
              },
            },
          ],
        },
        bestPricePharmacy: {
          ...pharmacyDrugPrice2Mock,
          pharmacy: {
            ...pharmacyDrugPrice2Mock.pharmacy,
            brand: brandMock,
          },
        },
        canShowContent: true,
      };

      const testRenderer = renderer.create(
        <PickAPharmacy {...propsWithContent} />
      );

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const body = basicPage.props.body;
      const bodyContainer = body.props.children;
      const pharmacyFragment = bodyContainer.props.children[5];
      const pharmacyCards = pharmacyFragment.props.children[1];

      pharmacyCards.forEach(
        (currentPharmacyPair: ReactTestInstance, index: number) => {
          const pharmacyCard = currentPharmacyPair.props.children[0];
          const { name } = pharmaciesMock[index].pharmacy;
          const pharmacyBrandOrName = brandMock ?? name;
          expect(pharmacyCard.props.pharmacyName).toEqual(pharmacyBrandOrName);
        }
      );
    }
  );

  it('renders skeleton pharmacy cards when isGettingPharmacies is true', () => {
    const nowMock = new Date();
    getNewDateMock.mockReturnValue(nowMock);

    const openStatusMock = 'open-status';
    formatOpenStatusMock.mockReturnValue(openStatusMock);

    const propsWithContent: IPickAPharmacyProps = {
      ...props,
      bestPricePharmacy: {
        ...pharmacyDrugPrice2Mock,
      },
      canShowContent: true,
      isGettingPharmacies: true,
    };

    const testRenderer = renderer.create(
      <PickAPharmacy {...propsWithContent} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPage.props.body;
    const bodyContainer = body.props.children;

    const skeletonPharmacyCardsFragment = bodyContainer.props.children[5];

    expect(skeletonPharmacyCardsFragment.type).toEqual(Fragment);

    const skeletonPharmacyContent =
      skeletonPharmacyCardsFragment.props.children;

    expect(skeletonPharmacyContent.length).toEqual(5);

    const bestPriceSkeletonPharmacyCard = skeletonPharmacyContent[0];
    const firstLineSeparator = skeletonPharmacyContent[1];
    const firstskeletonPharmacyCard = skeletonPharmacyContent[2];
    const secondLineSeparator = skeletonPharmacyContent[3];
    const secondSkeletonPharmacyCard = skeletonPharmacyContent[4];

    expect(bestPriceSkeletonPharmacyCard.type).toEqual(SkeletonPharmacyCard);
    expect(bestPriceSkeletonPharmacyCard.props.isBestPricePharmacy).toEqual(
      true
    );
    expect(firstskeletonPharmacyCard.type).toEqual(SkeletonPharmacyCard);
    expect(firstskeletonPharmacyCard.props.isBestPricePharmacy).toBeUndefined();
    expect(secondSkeletonPharmacyCard.type).toEqual(SkeletonPharmacyCard);
    expect(firstskeletonPharmacyCard.props.isBestPricePharmacy).toBeUndefined();

    expect(firstLineSeparator.type).toEqual(LineSeparator);
    expect(secondLineSeparator.type).toEqual(LineSeparator);
  });

  it('displays error message when pharmacy cards doesnt exist', () => {
    useContentMock.mockReturnValue({
      content: pickAPharmacyContentMock,
      isContentLoading: false,
    });

    const nowMock = new Date();
    getNewDateMock.mockReturnValue(nowMock);

    const openStatusMock = 'open-status';
    formatOpenStatusMock.mockReturnValue(openStatusMock);

    const propsWithNoPharmacies: IPickAPharmacyProps = {
      ...propsNoPharmaciesFound,
      pharmacies: [],
      bestPricePharmacy: undefined,
      canShowContent: true,
    };

    const testRenderer = renderer.create(
      <PickAPharmacy {...propsWithNoPharmacies} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPage.props.body;
    const bodyContainer = body.props.children;
    const errorText = bodyContainer.props.children[5];
    expect(errorText.props.children).toEqual(
      `${noPharmaciesFoundErrorMessagePluralPrefix}${25}`
    );
  });

  it('renders error message when error occurs on zipcode search', () => {
    const nowMock = new Date();
    getNewDateMock.mockReturnValue(nowMock);

    const openStatusMock = 'open-status';
    formatOpenStatusMock.mockReturnValue(openStatusMock);
    const propsWithErrorMessage: IPickAPharmacyProps = {
      ...props,
      errorMessage: ErrorConstants.INVALID_ZIPCODE_SEARCH,
      bestPricePharmacy: undefined,
      canShowContent: true,
      showNoPharmaciesFoundErrorMessage: true,
    };

    const testRenderer = renderer.create(
      <PickAPharmacy {...propsWithErrorMessage} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const body = basicPage.props.body;
    const bodyContainer = body.props.children;
    expect(bodyContainer.props.children[5].props.children).toEqual(
      ErrorConstants.INVALID_ZIPCODE_SEARCH
    );
  });

  it('renders price information modal', () => {
    const isOpen = false;
    const propsWithContent: IPickAPharmacyProps = {
      ...props,
      bestPricePharmacy: pharmacyDrugPrice2Mock,
      canShowContent: true,
    };

    const testRenderer = renderer.create(
      <PickAPharmacy {...propsWithContent} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const modal = basicPage.props.modals[0];
    expect(modal.type).toEqual(PopupModal);
    expect(modal.props.isOpen).toEqual(isOpen);
  });

  it('renders "Filter" option in FilterButton', () => {
    const propsWithContent: IPickAPharmacyProps = {
      ...props,
      bestPricePharmacy: pharmacyDrugPrice2Mock,
      canShowContent: true,
      memberProfileType: 'CASH',
    };

    const testRenderer = renderer.create(
      <PickAPharmacy {...propsWithContent} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyViewContainer = body.props.children;
    const buttonView = bodyViewContainer.props.children[4];
    const button = buttonView.props.children[1];
    expect(button.type).toEqual(FilterButton);
  });

  it('navigates to ConfigureFilterScreen on Filter button press', () => {
    useContentMock.mockReturnValue({
      content: pickAPharmacyContentMock,
      isContentLoading: false,
    });

    const sortOptionsMock: ISortOptions[] = [
      {
        label: distanceLabelMock,
        value: 0,
        sortBy: 'distance' as SortByOption,
      },
      {
        label: youPayLabelMock,
        value: 1,
        sortBy: 'youpay' as SortByOption,
      },
    ];

    const propsWithContent: IPickAPharmacyProps = {
      ...props,
      bestPricePharmacy: pharmacyDrugPrice2Mock,
      canShowContent: true,
      memberProfileType: 'CASH',
    };
    const configureFiltersScreenProps: IConfigureFiltersScreenRouteProps = {
      defaultDistanceSliderPosition: 25,
      defaultSort: 'distance' as SortByOption,
      sortOptions: sortOptionsMock,
    };

    const testRenderer = renderer.create(
      <PickAPharmacy {...propsWithContent} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyViewContainer = body.props.children;
    const buttonView = bodyViewContainer.props.children[4];
    const button = buttonView.props.children[1];
    expect(button.type).toEqual(FilterButton);
    const configFilterNavigate = button.props.onPress;
    configFilterNavigate();
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'ConfigureFilters',
      configureFiltersScreenProps
    );
  });

  it('navigate to FindLocation screen when modal press with feature flag on', () => {
    const propsWithContent: IPickAPharmacyProps = {
      ...props,
      bestPricePharmacy: pharmacyDrugPrice2Mock,
      canShowContent: true,
    };
    const sessionContextMock: ISessionContext = {
      sessionDispatch: jest.fn(),
      sessionState: {
        ...defaultSessionState,
        userLocation: locationCoordinatesMock,
      },
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    const testRenderer = renderer.create(
      <PickAPharmacy {...propsWithContent} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyViewContainer = body.props.children;
    const buttonView = bodyViewContainer.props.children[4];
    const button = buttonView.props.children[0];
    expect(button.type).toEqual(LocationButton);
    const locationButtonNavigate = button.props.onPress;
    locationButtonNavigate();
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'FindLocation'
    );
  });

  it.each([
    [true, 12],
    [true, undefined],
    [false, 12],
    [false, undefined],
  ])(
    'Render alternatives savings card when usePointOfCare is %p and savings amount is %p',
    (pointOfCareFlag: boolean, savingsAmount?: number) => {
      useFlagsMock.mockReturnValue({ usePointOfCare: pointOfCareFlag });

      stateReset({ stickyHeightCall: [145, jest.fn()] });
      const propsWithNavigation: IPickAPharmacyProps = {
        ...props,
        bestPricePharmacy: pharmacyDrugPrice2Mock,
        canShowContent: true,
        navigateToPointOfCare: jest.fn(),
        savingsAmount,
      };

      const testRenderer = renderer.create(
        <PickAPharmacy {...propsWithNavigation} />
      );

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const body = basicPage.props.body;
      const bodyContainer = body.props.children;
      const alternativeSavings = bodyContainer.props.children[1];
      if (savingsAmount && pointOfCareFlag) {
        expect(alternativeSavings.type).toEqual(AlternativeSavingsCard);
        expect(alternativeSavings.props.viewStyle).toEqual(
          pickAPharmacyStyles.alternativeSavingsCardViewStyle
        );
        expect(alternativeSavings.props.savingsAmount).toEqual(savingsAmount);
        expect(alternativeSavings.props.onPress).toEqual(expect.any(Function));

        alternativeSavings.props.onPress();

        expect(propsWithNavigation.navigateToPointOfCare).toHaveBeenCalled();
      } else {
        expect(alternativeSavings).toBeFalsy();
      }
    }
  );
  it('renders prescription patient name', () => {
    const prescriptionTitlePropsMock: IPickAPharmacyPrescriptionTitleProps = {
      drugName: 'drug-name-mock',
      formCode: 'form-code-mock',
      quantity: 33,
      refills: 0,
    };
    const testRenderer = renderer.create(
      <PickAPharmacy
        {...props}
        prescriptionTitleProps={prescriptionTitlePropsMock}
        prescriptionPatient={mockPatient}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const stickyViews = basicPage.props.stickyViews;
    const stickyView = stickyViews[0];
    const patientNameView = stickyView.view.props.children[0];

    expect(patientNameView.type).toEqual(View);
    expect(patientNameView.props.style).toEqual(
      pickAPharmacyStyles.forPatientViewStyle
    );
    expect(patientNameView.props.children.type).toEqual(
      PrescriptionPatientName
    );
  });
});
