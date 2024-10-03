// Copyright 2023 Prescryptive Health, Inc.

import React, { useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { HealthPlanScreen } from './health-plan.screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View } from 'react-native';
import { ChevronCard } from '../../../../components/cards/chevron/chevron.card';
import { RxCardCarousel } from '../../../../components/carousels/rx-card/rx-card.carousel';
import { CustomerSupport } from '../../../../components/member/customer-support/customer-support';
import { Heading } from '../../../../components/member/heading/heading';
import { LineSeparator } from '../../../../components/member/line-separator/line-separator';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { IPrimaryProfile } from '../../../../models/member-profile/member-profile-info';
import { RxCardType } from '../../../../models/rx-id-card';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { PharmaciesSection } from '../digital-id-card/sections/pharmacies/pharmacies.section';
import { PrescribersSection } from '../digital-id-card/sections/prescribers/prescribers.section';
import { SmartPriceSection } from '../digital-id-card/sections/smart-price/smart-price.section';
import { BenefitPlanSection } from '../digital-id-card/sections/benefit-plan/benefit-plan.section';
import { SmartPriceLearnMoreModal } from '../digital-id-card/smart-price-learn-more-modal/smart-price.learn-more-modal';
import { BenefitPlanLearnMoreModal } from '../digital-id-card/benefit-plan-learn-more-modal/benefit-plan.learn-more-modal';
import { IHealthPlanScreenContent } from './health-plan.screen.content';
import { healthPlanScreenStyles } from './health-plan.screen.styles';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { getChildren } from '../../../../testing/test.helper';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../../../../components/cards/chevron/chevron.card', () => ({
  ChevronCard: () => <div />,
}));

jest.mock('../../../../components/carousels/rx-card/rx-card.carousel', () => ({
  RxCardCarousel: () => <div />,
}));

jest.mock(
  '../../../../components/member/customer-support/customer-support',
  () => ({
    CustomerSupport: () => <div />,
  })
);

jest.mock('../../../../components/member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock(
  '../../../../components/member/line-separator/line-separator',
  () => ({
    LineSeparator: () => <div />,
  })
);

jest.mock('../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../digital-id-card/sections/pharmacies/pharmacies.section', () => ({
  PharmaciesSection: () => <div />,
}));

jest.mock(
  '../digital-id-card/sections/prescribers/prescribers.section',
  () => ({
    PrescribersSection: () => <div />,
  })
);

jest.mock(
  '../digital-id-card/sections/smart-price/smart-price.section',
  () => ({
    SmartPriceSection: () => <div />,
  })
);

jest.mock(
  '../digital-id-card/sections/benefit-plan/benefit-plan.section',
  () => ({
    BenefitPlanSection: () => <div />,
  })
);

jest.mock(
  '../digital-id-card/smart-price-learn-more-modal/smart-price.learn-more-modal',
  () => ({
    SmartPriceLearnMoreModal: () => <div />,
  })
);

jest.mock(
  '../digital-id-card/benefit-plan-learn-more-modal/benefit-plan.learn-more-modal',
  () => ({
    BenefitPlanLearnMoreModal: () => <div />,
  })
);

describe('HealthPlanScreen', () => {
  const profileMock = {} as IPrimaryProfile;

  const healthPlanScreenContentMock: IHealthPlanScreenContent = {
    heading: 'heading-mock',
    addToWallet: 'add-to-wallet-mock',
    viewPlanAccumulators: 'view-plan-accumulators-mock',
  };

  const isContentLoadingMock = false;

  const setCardTypeMock = jest.fn();
  const setIsSmartPriceLearnMoreModalShowingMock = jest.fn();
  const setIsBenefitPlanLearnMoreModalShowingMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({ params: { profile: profileMock } });

    useContentMock.mockReturnValue({
      content: healthPlanScreenContentMock,
      isContentLoading: isContentLoadingMock,
    });

    useStateMock.mockReturnValueOnce(['pbm' as RxCardType, setCardTypeMock]);
    useStateMock.mockReturnValueOnce([
      false,
      setIsSmartPriceLearnMoreModalShowingMock,
    ]);
    useStateMock.mockReturnValueOnce([
      false,
      setIsBenefitPlanLearnMoreModalShowingMock,
    ]);
  });

  it('calls useNavigation and useRoute', () => {
    renderer.create(<HealthPlanScreen />);

    expect(useNavigationMock).toHaveBeenCalledTimes(1);
    expect(useRouteMock).toHaveBeenCalledTimes(1);
  });

  it('calls useContent with expected props', () => {
    renderer.create(<HealthPlanScreen />);

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.healthPlanScreen,
      2
    );
  });

  it('renders as a BasicPageConnected with expected props', () => {
    const testRenderer = renderer.create(<HealthPlanScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(basicPageConnected.type).toEqual(BasicPageConnected);
    expect(basicPageConnected.props.body).toBeDefined();
    expect(basicPageConnected.props.navigateBack).toEqual(
      rootStackNavigationMock.goBack
    );
    expect(basicPageConnected.props.showProfileAvatar).toEqual(true);
    expect(basicPageConnected.props.modals.length).toEqual(2);

    const smartPriceLearnMoreModal = basicPageConnected.props.modals[0];

    expect(smartPriceLearnMoreModal.type).toEqual(SmartPriceLearnMoreModal);

    smartPriceLearnMoreModal.props.onClosePress();

    expect(setIsSmartPriceLearnMoreModalShowingMock).toHaveBeenCalledTimes(1);
    expect(setIsSmartPriceLearnMoreModalShowingMock).toHaveBeenNthCalledWith(
      1,
      false
    );

    expect(smartPriceLearnMoreModal.props.showModal).toEqual(false);

    const benefitPlanLearnMoreModal = basicPageConnected.props.modals[1];

    expect(benefitPlanLearnMoreModal.type).toEqual(BenefitPlanLearnMoreModal);

    benefitPlanLearnMoreModal.props.onClosePress();

    expect(setIsBenefitPlanLearnMoreModalShowingMock).toHaveBeenCalledTimes(1);
    expect(setIsBenefitPlanLearnMoreModalShowingMock).toHaveBeenNthCalledWith(
      1,
      false
    );

    expect(benefitPlanLearnMoreModal.props.showModal).toEqual(false);
  });

  it('renders Heading in body as expected', () => {
    const testRenderer = renderer.create(<HealthPlanScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    expect(body.type).toEqual(View);

    const heading = getChildren(body)[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(1);
    expect(heading.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(heading.props.textStyle).toEqual(
      healthPlanScreenStyles.headingTextStyle
    );
    expect(heading.props.children).toEqual(healthPlanScreenContentMock.heading);
  });

  it('renders RxCardCarousel in body as expected', () => {
    const testRenderer = renderer.create(<HealthPlanScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    expect(body.type).toEqual(View);

    const rxCardCarousel = getChildren(body)[1];

    expect(rxCardCarousel.type).toEqual(RxCardCarousel);
    expect(rxCardCarousel.props.profile).toEqual(profileMock);
    expect(rxCardCarousel.props.cards).toEqual(['pbm', 'smartPrice']);

    rxCardCarousel.props.onSelect('smartPrice' as RxCardType);

    expect(setCardTypeMock).toHaveBeenCalledTimes(1);
    expect(setCardTypeMock).toHaveBeenNthCalledWith(
      1,
      'smartPrice' as RxCardType
    );

    rxCardCarousel.props.onSelect('pbm' as RxCardType);

    expect(setCardTypeMock).toHaveBeenCalledTimes(2);
    expect(setCardTypeMock).toHaveBeenNthCalledWith(2, 'pbm' as RxCardType);

    expect(rxCardCarousel.props.viewStyle).toEqual(
      healthPlanScreenStyles.rxCardCarouselViewStyle
    );
  });

  it('renders cardTypeSection in body as expected', () => {
    const testRenderer = renderer.create(<HealthPlanScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    expect(body.type).toEqual(View);

    const cardTypeSection = getChildren(body)[2];

    expect(cardTypeSection.type).toEqual(BenefitPlanSection);
    expect(cardTypeSection.props.viewStyle).toEqual(
      healthPlanScreenStyles.sectionViewStyle
    );
    expect(cardTypeSection.props.onLearnMorePress).toEqual(
      expect.any(Function)
    );

    cardTypeSection.props.onLearnMorePress();

    expect(setIsBenefitPlanLearnMoreModalShowingMock).toHaveBeenCalledTimes(1);
    expect(setIsBenefitPlanLearnMoreModalShowingMock).toHaveBeenNthCalledWith(
      1,
      true
    );
  });

  it('renders cardTypeSection as SmartPriceSection when cardType is smartPrice', () => {
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([
      'smartPrice' as RxCardType,
      setCardTypeMock,
    ]);
    useStateMock.mockReturnValueOnce([
      false,
      setIsSmartPriceLearnMoreModalShowingMock,
    ]);
    useStateMock.mockReturnValueOnce([
      false,
      setIsBenefitPlanLearnMoreModalShowingMock,
    ]);

    const testRenderer = renderer.create(<HealthPlanScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    expect(body.type).toEqual(View);

    const cardTypeSection = getChildren(body)[2];

    expect(cardTypeSection.type).toEqual(SmartPriceSection);

    cardTypeSection.props.onLearnMorePress();

    expect(setIsSmartPriceLearnMoreModalShowingMock).toHaveBeenCalledTimes(1);
    expect(setIsSmartPriceLearnMoreModalShowingMock).toHaveBeenNthCalledWith(
      1,
      true
    );

    expect(cardTypeSection.props.viewStyle).toEqual(
      healthPlanScreenStyles.sectionViewStyle
    );
  });

  it('renders first and third LineSeparator as expected', () => {
    const testRenderer = renderer.create(<HealthPlanScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    expect(body.type).toEqual(View);

    const lineSeparatorOne = getChildren(body)[3];
    const lineSeparatorThree = getChildren(body)[7];

    expect(lineSeparatorOne.type).toEqual(LineSeparator);
    expect(lineSeparatorOne.props.viewStyle).toEqual(
      healthPlanScreenStyles.lineSeparatorOneViewStyle
    );

    expect(lineSeparatorThree.type).toEqual(LineSeparator);
    expect(lineSeparatorThree.props.viewStyle).toEqual(
      healthPlanScreenStyles.lineSeparatorThreeViewStyle
    );
  });

  it('renders viewPlanAccumulatorsSection as expected', () => {
    const testRenderer = renderer.create(<HealthPlanScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    expect(body.type).toEqual(View);

    const viewPlanAccumulatorsSection = getChildren(body)[4];

    expect(viewPlanAccumulatorsSection.type).toEqual(View);

    const chevronCard = getChildren(viewPlanAccumulatorsSection)[0];

    expect(chevronCard.type).toEqual(ChevronCard);

    chevronCard.props.onPress();

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'PrescriptionBenefitPlan'
    );

    expect(chevronCard.props.viewStyle).toEqual(
      healthPlanScreenStyles.viewPlanAccumulatorsSectionViewStyle
    );

    const baseText = getChildren(chevronCard)[0];

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual(
      healthPlanScreenStyles.viewPlanAccumulatorsTextStyle
    );
    expect(baseText.props.children).toEqual(
      healthPlanScreenContentMock.viewPlanAccumulators
    );

    const lineSeparatorTwo = getChildren(viewPlanAccumulatorsSection)[1];

    expect(lineSeparatorTwo.type).toEqual(LineSeparator);
    expect(lineSeparatorTwo.props.viewStyle).toEqual(
      healthPlanScreenStyles.lineSeparatorTwoViewStyle
    );
  });

  it('renders viewPlanAccumulatorsSection as null when smartPrice cardType', () => {
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([
      'smartPrice' as RxCardType,
      setCardTypeMock,
    ]);
    useStateMock.mockReturnValueOnce([
      false,
      setIsSmartPriceLearnMoreModalShowingMock,
    ]);
    useStateMock.mockReturnValueOnce([
      false,
      setIsBenefitPlanLearnMoreModalShowingMock,
    ]);

    const testRenderer = renderer.create(<HealthPlanScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    expect(body.type).toEqual(View);

    const viewPlanAccumulatorsSection = getChildren(body)[4];

    expect(viewPlanAccumulatorsSection).toBeNull();
  });

  it('renders PrescribersSection in body as expected', () => {
    const testRenderer = renderer.create(<HealthPlanScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    expect(body.type).toEqual(View);

    const prescribersSection = getChildren(body)[5];

    expect(prescribersSection.type).toEqual(PrescribersSection);
    expect(prescribersSection.props.viewStyle).toEqual(
      healthPlanScreenStyles.prescribersSectionViewStyle
    );
  });

  it('renders PharmaciesSection in body as expected', () => {
    const testRenderer = renderer.create(<HealthPlanScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    expect(body.type).toEqual(View);

    const pharmaciesSection = getChildren(body)[6];

    expect(pharmaciesSection.type).toEqual(PharmaciesSection);
    expect(pharmaciesSection.props.viewStyle).toEqual(
      healthPlanScreenStyles.pharmaciesSectionViewStyle
    );
  });

  it('renders Customers in body as expected', () => {
    const testRenderer = renderer.create(<HealthPlanScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    expect(body.type).toEqual(View);

    const customerSupport = getChildren(body)[8];

    expect(customerSupport.type).toEqual(CustomerSupport);
    expect(customerSupport.props.viewStyle).toEqual(
      healthPlanScreenStyles.customerSupportViewStyle
    );
  });
});
