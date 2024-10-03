// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { Heading } from '../../../../../../components/member/heading/heading';
import { SectionView } from '../../../../../../components/primitives/section-view';
import { IDrugDetails } from '../../../../../../utils/formatters/drug.formatter';
import { OrderSection } from './order.section';
import { orderSectionStyle as styles } from './order.section.style';
import { PrescriptionPriceSection } from '../../../../../../components/member/prescription-price/prescription-price.section';
import { couponDetailsMock1 } from '../../../../__mocks__/coupon-details.mock';
import { IOrderConfirmationScreenContent } from '../../order-confirmation.screen.content';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { DrugDetailsText } from '../../../../../../components/text/drug-details/drug-details.text';
import { getChildren } from '../../../../../../testing/test.helper';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { PricingOption } from '../../../../../../models/pricing-option';
import { SmartPricePricingOptionInformativePanel } from '../../../../../../components/member/panels/smart-pricing-option-informative/smart-price-pricing-option-informative.panel';
import { PbmPricingOptionInformativePanel } from '../../../../../../components/member/panels/pbm-pricing-option-informative/pbm-pricing-option-informative.panel';
import { ThirdPartyPricingOptionInformativePanel } from '../../../../../../components/member/panels/third-party-pricing-option-informative/third-party-pricing-option-informative.panel';

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = useFlags as jest.Mock;

jest.mock('../../../../context-providers/session/ui-content-hooks/use-content');

jest.mock('../../../../../../components/member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock(
  '../../../../../../components/member/prescription-price/prescription-price.section',
  () => ({
    PrescriptionPriceSection: () => <div />,
  })
);

jest.mock(
  '../../../../../../components/text/drug-details/drug-details.text',
  () => ({
    DrugDetailsText: () => <div />,
  })
);

jest.mock('../../../../../../components/member/panels/smart-pricing-option-informative/smart-price-pricing-option-informative.panel', () => ({
  SmartPricePricingOptionInformativePanel: () => <div />,
}));

jest.mock('../../../../../../components/member/panels/pbm-pricing-option-informative/pbm-pricing-option-informative.panel', () => ({
  PbmPricingOptionInformativePanel: () => <div />,
}));

jest.mock('../../../../../../components/member/panels/third-party-pricing-option-informative/third-party-pricing-option-informative.panel', () => ({
  ThirdPartyPricingOptionInformativePanel: () => <div />,
}));

const useContentMock = useContent as jest.Mock;

const contentMock: Partial<IOrderConfirmationScreenContent> = {
  orderSectionHeader: 'order-section-header-mock',
  estimatedPriceNoticeText: 'estimated-pricing-notice-text-mock',
};

describe('OrderSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });
    
    useFlagsMock.mockReturnValue({
      usertpb: false,
      useDualPrice: false,
    });
  });

  const drugDetailsMock: IDrugDetails = {
    formCode: 'form-code',
    quantity: 0,
    strength: '100',
    unit: 'MG',
    supply: 30,
  };
  const drugName = 'drug-name';

  it('renders in section', () => {
    const testRenderer = renderer.create(
      <OrderSection
        drugDetails={drugDetailsMock}
        drugName={drugName}
        showPlanPays={true}
      />
    );

    const section = testRenderer.root.children[0] as ReactTestInstance;

    expect(section.type).toEqual(SectionView);
    expect(section.props.testID).toEqual('orderSection');
    expect(section.props.style).toEqual(styles.sectionViewStyle);
    expect(section.props.children.length).toEqual(5);
  });

  it('renders heading', () => {
    const testRenderer = renderer.create(
      <OrderSection
        drugDetails={drugDetailsMock}
        drugName={drugName}
        showPlanPays={true}
      />
    );
    const section = testRenderer.root.findByType(SectionView);
    const heading = section.props.children[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(2);
    expect(heading.props.textStyle).toEqual(styles.heading2TextStyle);
    expect(heading.props.children).toEqual(contentMock.orderSectionHeader);
  });

  it('renders drug name', () => {
    const testRenderer = renderer.create(
      <OrderSection
        drugDetails={drugDetailsMock}
        drugName={drugName}
        showPlanPays={true}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const drugNameHeading = getChildren(section)[1];

    expect(drugNameHeading.type).toEqual(Heading);
    expect(drugNameHeading.props.level).toEqual(3);
    expect(drugNameHeading.props.children).toEqual(drugName);
    expect(drugNameHeading.props.translateContent).toEqual(false);
  });

  it('renders drug details', () => {
    const planPaysMock = 999;

    const testRenderer = renderer.create(
      <OrderSection
        drugDetails={drugDetailsMock}
        drugName={drugName}
        showPlanPays={true}
        planPays={planPaysMock}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const drugDetailsText = getChildren(section)[2];

    const { strength, unit, quantity, formCode, supply } = drugDetailsMock;

    expect(drugDetailsText.type).toEqual(DrugDetailsText);
    expect(drugDetailsText.props.viewStyle).toEqual(
      styles.drugDetailsViewStyle
    );
    expect(drugDetailsText.props.strength).toEqual(strength);
    expect(drugDetailsText.props.unit).toEqual(unit);
    expect(drugDetailsText.props.quantity).toEqual(quantity);
    expect(drugDetailsText.props.formCode).toEqual(formCode);
    expect(drugDetailsText.props.supply).toEqual(supply);
  });

  it('renders prescription price section', () => {
    const memberPaysMock = 2;
    const planPaysMock = 3;

    const testRenderer = renderer.create(
      <OrderSection
        drugDetails={drugDetailsMock}
        drugName={drugName}
        showPlanPays={false}
        planPays={planPaysMock}
        memberPays={memberPaysMock}
        couponDetails={couponDetailsMock1}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const prescriptionPriceSection = section.props.children[3];
    expect(prescriptionPriceSection.type).toEqual(PrescriptionPriceSection);
    expect(prescriptionPriceSection.props.hasAssistanceProgram).toEqual(false);
    expect(prescriptionPriceSection.props.showPlanPays).toEqual(false);
    expect(prescriptionPriceSection.props.memberPays).toEqual(memberPaysMock);
    expect(prescriptionPriceSection.props.planPays).toEqual(planPaysMock);
    expect(prescriptionPriceSection.props.couponDetails).toEqual(
      couponDetailsMock1
    );
    expect(prescriptionPriceSection.props.viewStyle).toEqual(
      styles.prescriptionPriceSectionViewStyle
    );
  });

  it('renders skeletons when isSkeleton is true', () => {
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: true,
    });
    const testRenderer = renderer.create(
      <OrderSection
        drugDetails={drugDetailsMock}
        drugName={drugName}
        showPlanPays={true}
      />
    );
    const section = testRenderer.root.findByType(SectionView);
    const heading = section.props.children[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.isSkeleton).toEqual(true);
    expect(heading.props.skeletonWidth).toEqual('long');

    const drugNameHeading = getChildren(section)[1];

    expect(drugNameHeading.type).toEqual(Heading);
    expect(drugNameHeading.props.level).toEqual(3);
    expect(drugNameHeading.props.isSkeleton).toEqual(true);
    expect(drugNameHeading.props.skeletonWidth).toEqual('medium');
    expect(drugNameHeading.props.translateContent).toEqual(false);

    const prescriptionPriceSection = section.props.children[3];
    expect(prescriptionPriceSection.props.isSkeleton).toEqual(true);
  });

  it.each([
    [true, false],
    [false, false],
    [true, true],
    [true, undefined],
    [false, undefined],
    [false, true],
  ])(
    'render the estimated price notice text with usertpb %p and hasInsurance %p',
    (usertpb: boolean, hasInsurance?: boolean) => {
      const memberPaysMock = 2;
      const planPaysMock = 3;
      useFlagsMock.mockReturnValue({ usertpb });
      const testRenderer = renderer.create(
        <OrderSection
          drugDetails={drugDetailsMock}
          drugName={drugName}
          showPlanPays={false}
          planPays={planPaysMock}
          memberPays={memberPaysMock}
          couponDetails={couponDetailsMock1}
          hasInsurance={hasInsurance}
        />
      );

      const section = testRenderer.root.findByType(SectionView);
      const estimatedPriceText = section.props.children[4];
      if (usertpb && hasInsurance) {
        expect(estimatedPriceText.type).toEqual(BaseText);
        expect(estimatedPriceText.props.isSkeleton).toEqual(false);
        expect(estimatedPriceText.props.skeletonWidth).toEqual('long');
        expect(estimatedPriceText.props.style).toEqual(
          styles.estimatedPriceNoticeTextStyle
        );
        expect(estimatedPriceText.props.children).toEqual(
          contentMock.estimatedPriceNoticeText
        );
      } else {
        expect(estimatedPriceText).toBeFalsy();
      }
    }
  );

  it.each([
    'smartPrice',
    'pbm',
    'thirdParty',
    'noPrice',
  ] as PricingOption[])(
    'render the correct dualPrice section if useDualPrice feature flag is enabled',
    (pricingOption: PricingOption) => {
      useFlagsMock.mockReturnValue({
        usertpb: false,
        useDualPrice: true,
      });

      const memberPaysMock = 2;
      const planPaysMock = 3;
      const hasInsuranceMock = false;

      const testRenderer = renderer.create(
        <OrderSection
          drugDetails={drugDetailsMock}
          drugName={drugName}
          showPlanPays={false}
          planPays={planPaysMock}
          memberPays={memberPaysMock}
          couponDetails={couponDetailsMock1}
          hasInsurance={hasInsuranceMock}
          pricingOption={pricingOption}
        />
      );

      const section = testRenderer.root.findByType(SectionView);
      const dualPriceSection = section.props.children[3];

      switch (pricingOption) {
        case 'smartPrice':
          expect(dualPriceSection.type).toEqual(SmartPricePricingOptionInformativePanel);
          expect(dualPriceSection.props.memberPays).toEqual(memberPaysMock);
          expect(dualPriceSection.props.viewStyle).toEqual(
            styles.dualPriceSectionViewStyle
          );
          break;
        case 'pbm':
          expect(dualPriceSection.type).toEqual(PbmPricingOptionInformativePanel);
          expect(dualPriceSection.props.memberPays).toEqual(memberPaysMock);
          expect(dualPriceSection.props.planPays).toEqual(planPaysMock);
          expect(dualPriceSection.props.viewStyle).toEqual(
            styles.dualPriceSectionViewStyle
          );
          break;
        case 'thirdParty':
          expect(dualPriceSection.type).toEqual(ThirdPartyPricingOptionInformativePanel);
          expect(dualPriceSection.props.memberPays).toEqual(memberPaysMock);
          expect(dualPriceSection.props.viewStyle).toEqual(
            styles.dualPriceSectionViewStyle
          );
          break;
        case 'noPrice':
          expect(dualPriceSection).toBeNull();
      }
    }
  );
});
