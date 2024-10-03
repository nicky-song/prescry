// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { IDrugPricing, PricingText, PricingTextFormat } from './pricing.text';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { getChildren } from '../../../testing/test.helper';
import { PrescriptionPriceContainer } from '../../containers/prescription-price/prescription-price.container';
import { pricingTextStyles } from './pricing.text.styles';
import { BaseText } from '../base-text/base-text';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { ConfirmedAmountText } from '../confirmed-amount/confirmed-amount.text';
import { IPrescriptionPriceSectionContent } from '../../member/prescription-price/prescription-price-section.cms-content-wrapper';
import { useFlags } from 'launchdarkly-react-client-sdk';

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = useFlags as jest.Mock;

jest.mock(
  '../../containers/prescription-price/prescription-price.container',
  () => ({
    PrescriptionPriceContainer: () => <div />,
  })
);

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../confirmed-amount/confirmed-amount.text', () => ({
  ConfirmedAmountText: () => <div />,
}));

const drugPricingMock: IDrugPricing = {
  memberPays: 7.77,
  planPays: 3.33,
};

const drugPricingMockWithPlanPaysUndefined: IDrugPricing = {
  memberPays: 7.77,
};
const viewStyleMock = {};

const contentMock: Partial<IPrescriptionPriceSectionContent> = {
  youPay: 'you-pay-mock',
  planPays: 'plan-pays-mock',
  totalPrice: 'total-price-mock',
  withInsurance: 'with-insurance-mock',
};

const isContentLoadingMock = false;

describe('PricingText', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: isContentLoadingMock,
    });

    useFlagsMock.mockReturnValue({ usertpb: {} });
  });

  it.each([['details' as PricingTextFormat], ['summary' as PricingTextFormat]])(
    'renders in a View with expected ViewStyle with pricingTextFormat: %s',
    (pricingTextFormatMock: PricingTextFormat) => {
      const testRenderer = renderer.create(
        <PricingText
          drugPricing={drugPricingMock}
          pricingTextFormat={pricingTextFormatMock}
          viewStyle={viewStyleMock}
        />
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;

      expect(view.type).toEqual(View);
      expect(view.props.style).toEqual(viewStyleMock);
    }
  );

  it('renders expected PrescriptionPriceContainers for pricingTextFormat: details', () => {
    const testRenderer = renderer.create(
      <PricingText
        drugPricing={drugPricingMock}
        pricingTextFormat='details'
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(getChildren(view).length).toEqual(2);

    const prescriptionPriceContainerMember = getChildren(view)[0];
    const prescriptionPriceContainerPlan = getChildren(view)[1];

    expect(prescriptionPriceContainerMember.type).toEqual(
      PrescriptionPriceContainer
    );
    expect(prescriptionPriceContainerMember.props.viewStyle).toEqual(
      pricingTextStyles.detailsViewStyle
    );
    expect(prescriptionPriceContainerMember.props.containerFormat).toEqual(
      'plain'
    );

    expect(prescriptionPriceContainerPlan.type).toEqual(
      PrescriptionPriceContainer
    );
    expect(prescriptionPriceContainerPlan.props.viewStyle).toEqual(
      pricingTextStyles.detailsViewStyle
    );
    expect(prescriptionPriceContainerPlan.props.containerFormat).toEqual(
      'plain'
    );
  });

  it('renders expected labels and prices for pricingTextFormat: details', () => {
    const testRenderer = renderer.create(
      <PricingText
        drugPricing={drugPricingMock}
        pricingTextFormat='details'
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(getChildren(view).length).toEqual(2);

    const prescriptionPriceContainerMember = getChildren(view)[0];
    const prescriptionPriceContainerPlan = getChildren(view)[1];

    expect(getChildren(prescriptionPriceContainerMember).length).toEqual(2);
    expect(getChildren(prescriptionPriceContainerPlan).length).toEqual(2);

    const memberLabel = getChildren(prescriptionPriceContainerMember)[0];
    const memberPrice = getChildren(prescriptionPriceContainerMember)[1];
    const planLabel = getChildren(prescriptionPriceContainerPlan)[0];
    const planPrice = getChildren(prescriptionPriceContainerPlan)[1];

    expect(memberLabel.type).toEqual(BaseText);
    expect(memberLabel.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(memberLabel.props.children).toEqual(contentMock.youPay);

    expect(memberPrice.type).toEqual(BaseText);
    expect(memberPrice.props.style).toEqual(
      pricingTextStyles.detailsMemberPaysPricingTextStyle
    );
    expect(memberPrice.props.children).toEqual(
      MoneyFormatter.format(drugPricingMock.memberPays)
    );

    expect(planLabel.type).toEqual(BaseText);
    expect(planLabel.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(planLabel.props.children).toEqual(contentMock.planPays + ' ');

    expect(planPrice.type).toEqual(BaseText);
    expect(planPrice.props.children).toEqual(
      MoneyFormatter.format(drugPricingMock.planPays)
    );
  });

  it('renders expected labels and prices with plan pays undefined for pricingTextFormat : details', () => {
    const testRenderer = renderer.create(
      <PricingText
        drugPricing={drugPricingMockWithPlanPaysUndefined}
        pricingTextFormat='details'
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(getChildren(view).length).toEqual(2);

    const prescriptionPriceContainerMember = getChildren(view)[0];
    const prescriptionPriceContainerPlan = getChildren(view)[1];

    expect(getChildren(prescriptionPriceContainerMember).length).toEqual(2);
    expect(prescriptionPriceContainerPlan).toBeFalsy();

    const memberLabel = getChildren(prescriptionPriceContainerMember)[0];
    const memberPrice = getChildren(prescriptionPriceContainerMember)[1];

    expect(memberLabel.type).toEqual(BaseText);
    expect(memberLabel.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(memberLabel.props.children).toEqual(contentMock.youPay);

    expect(memberPrice.type).toEqual(BaseText);
    expect(memberPrice.props.style).toEqual(
      pricingTextStyles.detailsMemberPaysPricingTextStyle
    );
    expect(memberPrice.props.children).toEqual(
      MoneyFormatter.format(drugPricingMock.memberPays)
    );
  });

  it('renders expected PrescriptionPriceContainers for pricingTextFormat: summary', () => {
    const testRenderer = renderer.create(
      <PricingText
        drugPricing={drugPricingMock}
        pricingTextFormat='summary'
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(getChildren(view).length).toEqual(2);

    const prescriptionPriceContainerMember = getChildren(view)[0];
    const prescriptionPriceContainerPlan = getChildren(view)[1];

    expect(prescriptionPriceContainerMember.type).toEqual(
      PrescriptionPriceContainer
    );
    expect(prescriptionPriceContainerMember.props.isRounded).toEqual(true);

    expect(prescriptionPriceContainerPlan.type).toEqual(
      PrescriptionPriceContainer
    );
    expect(prescriptionPriceContainerPlan.props.viewStyle).toEqual(
      pricingTextStyles.planPaysViewStyle
    );
  });

  it('renders expected labels and prices for pricingTextFormat: summary', () => {
    const testRenderer = renderer.create(
      <PricingText
        drugPricing={drugPricingMock}
        pricingTextFormat='summary'
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(getChildren(view).length).toEqual(2);

    const prescriptionPriceContainerMember = getChildren(view)[0];
    const prescriptionPriceContainerPlan = getChildren(view)[1];

    expect(getChildren(prescriptionPriceContainerMember).length).toEqual(2);
    expect(getChildren(prescriptionPriceContainerPlan).length).toEqual(2);

    const memberLabel = getChildren(prescriptionPriceContainerMember)[0];
    const memberPrice = getChildren(prescriptionPriceContainerMember)[1];
    const planLabel = getChildren(prescriptionPriceContainerPlan)[0];
    const planPrice = getChildren(prescriptionPriceContainerPlan)[1];

    expect(memberLabel.type).toEqual(BaseText);
    expect(memberLabel.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(memberLabel.props.children).toEqual(contentMock.youPay);

    expect(memberPrice.type).toEqual(ConfirmedAmountText);
    expect(memberPrice.props.children).toEqual(
      MoneyFormatter.format(drugPricingMock.memberPays)
    );

    expect(planLabel.type).toEqual(BaseText);
    expect(planLabel.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(planLabel.props.children).toEqual(contentMock.planPays + ' ');

    expect(planPrice.type).toEqual(BaseText);
    expect(planPrice.props.children).toEqual(
      MoneyFormatter.format(drugPricingMock.planPays)
    );
  });

  it('renders expected labels and prices with plan pays undefined for pricingTextFormat: summary', () => {
    const testRenderer = renderer.create(
      <PricingText
        drugPricing={drugPricingMockWithPlanPaysUndefined}
        pricingTextFormat='summary'
        viewStyle={viewStyleMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(getChildren(view).length).toEqual(2);

    const prescriptionPriceContainerMember = getChildren(view)[0];
    const prescriptionPriceContainerPlan = getChildren(view)[1];

    expect(getChildren(prescriptionPriceContainerMember).length).toEqual(2);
    expect(prescriptionPriceContainerPlan).toBeFalsy();

    const memberLabel = getChildren(prescriptionPriceContainerMember)[0];
    const memberPrice = getChildren(prescriptionPriceContainerMember)[1];

    expect(memberLabel.type).toEqual(BaseText);
    expect(memberLabel.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(memberLabel.props.children).toEqual(contentMock.youPay);

    expect(memberPrice.type).toEqual(ConfirmedAmountText);
    expect(memberPrice.props.children).toEqual(
      MoneyFormatter.format(drugPricingMock.memberPays)
    );
  });

  it('renders expected label and price for insurance when usertpb is true', () => {
    useFlagsMock.mockReturnValue({
      usertpb: { usertpb: true },
    });

    const insurancePriceMock = 7;

    const testRenderer = renderer.create(
      <PricingText
        drugPricing={{ ...drugPricingMock, insurancePrice: insurancePriceMock }}
        pricingTextFormat='summary'
        viewStyle={viewStyleMock}
      />
    );

    const prescriptionPriceContainer = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(prescriptionPriceContainer.type).toEqual(PrescriptionPriceContainer);
    expect(prescriptionPriceContainer.props.isRounded).toEqual(true);
    expect(prescriptionPriceContainer.props.viewStyle).toEqual(viewStyleMock);
    expect(getChildren(prescriptionPriceContainer).length).toEqual(2);

    const label = getChildren(prescriptionPriceContainer)[0];
    const amount = getChildren(prescriptionPriceContainer)[1];

    expect(label.type).toEqual(BaseText);
    expect(label.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(label.props.children).toEqual(contentMock.withInsurance);

    expect(amount.type).toEqual(ConfirmedAmountText);
    expect(amount.props.children).toEqual(
      MoneyFormatter.format(insurancePriceMock)
    );
  });
});
