// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View } from 'react-native';
import { BaseText } from '../../text/base-text/base-text';
import { ConfirmedAmountText } from '../../text/confirmed-amount/confirmed-amount.text';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { prescriptionPriceStyles as styles } from './prescription-price.section.styles';
import { PrescriptionPriceSection } from './prescription-price.section';
import {
  couponDetailsMock1,
  couponDetailsMock3,
} from '../../../experiences/guest-experience/__mocks__/coupon-details.mock';
import { getChildren } from '../../../testing/test.helper';
import { PrescriptionPriceContainer } from '../../containers/prescription-price/prescription-price.container';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IPrescriptionPriceSectionContent } from './prescription-price-section.cms-content-wrapper';
import { PricingText } from '../../text/pricing/pricing.text';

jest.mock('../../text/pricing/pricing.text', () => ({
  PricingText: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));
const hasAssistanceProgramMock = [true, false];
const showPlanPaysMock = [true, false];
const memberPaysMock = [2, 0, undefined];
const planPaysMock = [3, 0, undefined];
const couponDetailsMock = [couponDetailsMock1, couponDetailsMock3, undefined];
const insurancePriceMock = 7;
const viewStyleMock = {};

const uiContentMock: Partial<IPrescriptionPriceSectionContent> = {
  price: 'price',
  noPrice: 'no-price',
  youPay: 'you-pay',
  planPays: 'plan-pays',
  assistanceProgram: 'assistance-program',
  contactPharmacyForPricing: 'contact-pharmacy-for-pricing',
  skeletonPlaceHolder: 'skeleton-place-holder',
  withInsurance: 'with-insurance',
  verifyRealPrice: 'verify-real-price',
};
const isContentLoadingMock = false;

describe('PrescriptionPriceSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: isContentLoadingMock,
    });
  });

  it.each([[true], [false]])(
    'renders as View with body or skeleton',
    (isContentLoading: boolean) => {
      const testRenderer = renderer.create(
        <PrescriptionPriceSection
          hasAssistanceProgram={hasAssistanceProgramMock[1]}
          showPlanPays={showPlanPaysMock[1]}
          memberPays={memberPaysMock[2]}
          planPays={planPaysMock[2]}
          couponDetails={couponDetailsMock[2]}
          viewStyle={viewStyleMock}
          isSkeleton={isContentLoading}
        />
      );

      const parentView = testRenderer.root.children[0] as ReactTestInstance;

      expect(parentView.type).toEqual(View);
      expect(parentView.props.style).toEqual(viewStyleMock);
      expect(getChildren(parentView).length).toEqual(1);

      if (isContentLoading) {
        expect(getChildren(parentView)[0].type).toEqual(BaseText);
      } else {
        expect(getChildren(parentView)[0].type).toEqual(View);
      }
    }
  );

  it('renders inside view', () => {
    const testRenderer = renderer.create(
      <PrescriptionPriceSection
        hasAssistanceProgram={hasAssistanceProgramMock[1]}
        showPlanPays={showPlanPaysMock[1]}
        memberPays={memberPaysMock[2]}
        planPays={planPaysMock[2]}
        couponDetails={couponDetailsMock[2]}
      />
    );

    const view = getChildren(testRenderer.root.findByType(View))[0];
    expect(view.type).toEqual(View);
    expect(getChildren(view).length).toEqual(3);
  });

  it('renders assistance program as null', () => {
    const testRenderer = renderer.create(
      <PrescriptionPriceSection
        hasAssistanceProgram={hasAssistanceProgramMock[1]}
        showPlanPays={showPlanPaysMock[1]}
        memberPays={memberPaysMock[2]}
        planPays={planPaysMock[2]}
        couponDetails={couponDetailsMock[2]}
      />
    );

    const view = getChildren(testRenderer.root.findByType(View))[0];
    const assistanceProgram = getChildren(view)[2];
    expect(assistanceProgram).toBeNull();
  });

  it('renders assistance program with expected content', () => {
    const testRenderer = renderer.create(
      <PrescriptionPriceSection
        hasAssistanceProgram={hasAssistanceProgramMock[0]}
        showPlanPays={showPlanPaysMock[1]}
        memberPays={memberPaysMock[2]}
        planPays={planPaysMock[2]}
        couponDetails={couponDetailsMock[2]}
      />
    );

    const view = getChildren(testRenderer.root.findByType(View))[0];
    const assistanceProgram = getChildren(view)[2];
    expect(assistanceProgram.type).toEqual(BaseText);
    expect(assistanceProgram.props.style).toEqual(
      styles.assistanceProgramTextStyle
    );
    expect(assistanceProgram.props.children).toEqual(
      uiContentMock.assistanceProgram
    );
    expect(assistanceProgram.props.isSkeleton).toEqual(false);
    expect(assistanceProgram.props.skeletonWidth).toEqual('long');
  });

  it('renders contact pharmacy and content when there are no prices', () => {
    const testRenderer = renderer.create(
      <PrescriptionPriceSection
        hasAssistanceProgram={hasAssistanceProgramMock[0]}
        showPlanPays={showPlanPaysMock[1]}
        memberPays={memberPaysMock[2]}
        planPays={planPaysMock[2]}
        couponDetails={couponDetailsMock[2]}
      />
    );

    const view = getChildren(testRenderer.root.findByType(View))[0];
    const contactPharmacyAndContent = getChildren(view)[0];
    expect(contactPharmacyAndContent.type).toEqual(BaseText);
    expect(contactPharmacyAndContent.props.style).toEqual(
      styles.contactPharmacyViewStyle
    );
    expect(contactPharmacyAndContent.props.children).toEqual(
      uiContentMock.contactPharmacyForPricing
    );
    expect(contactPharmacyAndContent.props.isSkeleton).toEqual(false);
    expect(contactPharmacyAndContent.props.skeletonWidth).toEqual('long');
  });

  it('[hasCouponAndPrice] renders coupon and member pays price (Given: couponDetails, memberPays)', () => {
    const testRenderer = renderer.create(
      <PrescriptionPriceSection
        hasAssistanceProgram={hasAssistanceProgramMock[0]}
        showPlanPays={showPlanPaysMock[1]}
        memberPays={memberPaysMock[0]}
        planPays={planPaysMock[2]}
        couponDetails={couponDetailsMock[0]}
      />
    );

    const view = getChildren(testRenderer.root.findByType(View))[0];
    const priceWrapper = getChildren(view)[0];
    const lowestPricing = getChildren(priceWrapper)[0];
    expect(lowestPricing.type).toEqual(View);
    expect(lowestPricing.props.testID).toEqual('hasCouponAndPrice-lowestValue');
    const amountContainerView = getChildren(lowestPricing)[0];
    expect(amountContainerView.type).toEqual(PrescriptionPriceContainer);
    expect(getChildren(amountContainerView).length).toEqual(2);
    expect(amountContainerView.props.viewStyle).toEqual(
      styles.amountContainerViewStyle
    );

    const copayText = getChildren(amountContainerView)[0];
    expect(copayText.type).toEqual(BaseText);
    expect(copayText.props.children).toEqual(couponDetailsMock[0]?.copayText);

    const couponPrice = getChildren(amountContainerView)[1];
    expect(couponPrice.type).toEqual(ConfirmedAmountText);
    expect(couponPrice.props.children).toEqual(
      MoneyFormatter.format(couponDetailsMock[0]?.price)
    );

    const mediumPricing = getChildren(priceWrapper)[1];
    expect(mediumPricing.type).toEqual(View);
    expect(mediumPricing.props.testID).toEqual(
      'hasCouponAndPrice-highestValue'
    );
    const priceContainerView = getChildren(mediumPricing)[0];
    expect(priceContainerView.type).toEqual(View);
    expect(getChildren(priceContainerView).length).toEqual(2);
    expect(priceContainerView.props.style).toEqual(
      styles.amountHighContainerViewStyle
    );

    const priceText = getChildren(priceContainerView)[0];
    expect(priceText.type).toEqual(BaseText);
    expect(priceText.props.children).toEqual(uiContentMock.price);
    expect(priceText.props.isSkeleton).toEqual(false);
    expect(priceText.props.skeletonWidth).toEqual('medium');

    const memberPaysPrice = getChildren(priceContainerView)[1];
    expect(memberPaysPrice.type).toEqual(BaseText);
    expect(memberPaysPrice.props.children).toEqual(
      MoneyFormatter.format(memberPaysMock[0])
    );
  });

  it('[hasCouponAndPrice] renders coupon and member pays price (Given: couponDetails, memberPays, planPays)', () => {
    const testRenderer = renderer.create(
      <PrescriptionPriceSection
        hasAssistanceProgram={hasAssistanceProgramMock[0]}
        showPlanPays={showPlanPaysMock[1]}
        memberPays={memberPaysMock[0]}
        planPays={planPaysMock[0]}
        couponDetails={couponDetailsMock[0]}
      />
    );

    const view = getChildren(testRenderer.root.findByType(View))[0];
    const priceWrapper = getChildren(view)[0];
    const lowestPricing = getChildren(priceWrapper)[0];
    expect(lowestPricing.type).toEqual(View);
    expect(lowestPricing.props.testID).toEqual('hasCouponAndPrice-lowestValue');
    const amountContainerView = getChildren(lowestPricing)[0];
    expect(amountContainerView.type).toEqual(PrescriptionPriceContainer);
    expect(getChildren(amountContainerView).length).toEqual(2);
    expect(amountContainerView.props.viewStyle).toEqual(
      styles.amountContainerViewStyle
    );

    const copayText = getChildren(amountContainerView)[0];
    expect(copayText.type).toEqual(BaseText);
    expect(copayText.props.children).toEqual(couponDetailsMock[0]?.copayText);

    const couponPrice = getChildren(amountContainerView)[1];
    expect(couponPrice.type).toEqual(ConfirmedAmountText);
    expect(couponPrice.props.children).toEqual(
      MoneyFormatter.format(couponDetailsMock[0]?.price)
    );

    const mediumPricing = getChildren(priceWrapper)[1];
    expect(mediumPricing.type).toEqual(View);
    expect(mediumPricing.props.testID).toEqual(
      'hasCouponAndPrice-highestValue'
    );
    const priceContainerView = getChildren(mediumPricing)[0];
    expect(priceContainerView.type).toEqual(View);
    expect(getChildren(priceContainerView).length).toEqual(2);
    expect(priceContainerView.props.style).toEqual(
      styles.amountHighContainerViewStyle
    );

    const priceText = getChildren(priceContainerView)[0];
    expect(priceText.type).toEqual(BaseText);
    expect(priceText.props.children).toEqual(uiContentMock.price);
    expect(priceText.props.isSkeleton).toEqual(false);
    expect(priceText.props.skeletonWidth).toEqual('medium');

    const memberPaysPrice = getChildren(priceContainerView)[1];
    expect(memberPaysPrice.type).toEqual(BaseText);
    expect(memberPaysPrice.props.children).toEqual(
      MoneyFormatter.format(memberPaysMock[0])
    );
  });

  it('[hasCouponAndPrice] renders coupon and member pays price (Given: couponDetails, memberPays, showPlanPays)', () => {
    const testRenderer = renderer.create(
      <PrescriptionPriceSection
        hasAssistanceProgram={hasAssistanceProgramMock[0]}
        showPlanPays={showPlanPaysMock[1]}
        memberPays={memberPaysMock[0]}
        planPays={planPaysMock[2]}
        couponDetails={couponDetailsMock[0]}
      />
    );

    const view = getChildren(testRenderer.root.findByType(View))[0];
    const priceWrapper = getChildren(view)[0];
    const lowestPricing = getChildren(priceWrapper)[0];
    expect(lowestPricing.type).toEqual(View);
    expect(lowestPricing.props.testID).toEqual('hasCouponAndPrice-lowestValue');
    const amountContainerView = getChildren(lowestPricing)[0];
    expect(amountContainerView.type).toEqual(PrescriptionPriceContainer);
    expect(getChildren(amountContainerView).length).toEqual(2);
    expect(amountContainerView.props.viewStyle).toEqual(
      styles.amountContainerViewStyle
    );

    const copayText = getChildren(amountContainerView)[0];
    expect(copayText.type).toEqual(BaseText);
    expect(copayText.props.children).toEqual(couponDetailsMock[0]?.copayText);

    const couponPrice = getChildren(amountContainerView)[1];
    expect(couponPrice.type).toEqual(ConfirmedAmountText);
    expect(couponPrice.props.children).toEqual(
      MoneyFormatter.format(couponDetailsMock[0]?.price)
    );

    const mediumPricing = getChildren(priceWrapper)[1];
    expect(mediumPricing.type).toEqual(View);
    expect(mediumPricing.props.testID).toEqual(
      'hasCouponAndPrice-highestValue'
    );
    const priceContainerView = getChildren(mediumPricing)[0];
    expect(priceContainerView.type).toEqual(View);
    expect(getChildren(priceContainerView).length).toEqual(2);
    expect(priceContainerView.props.style).toEqual(
      styles.amountHighContainerViewStyle
    );

    const priceText = getChildren(priceContainerView)[0];
    expect(priceText.type).toEqual(BaseText);
    expect(priceText.props.children).toEqual(uiContentMock.price);
    expect(priceText.props.isSkeleton).toEqual(false);
    expect(priceText.props.skeletonWidth).toEqual('medium');

    const memberPaysPrice = getChildren(priceContainerView)[1];
    expect(memberPaysPrice.type).toEqual(BaseText);
    expect(memberPaysPrice.props.children).toEqual(
      MoneyFormatter.format(memberPaysMock[0])
    );
  });

  it('[hasCouponAndPrice] renders coupon and member pays price as 0 (Given: couponDetails, memberPays, showPlanPays)', () => {
    const testRenderer = renderer.create(
      <PrescriptionPriceSection
        hasAssistanceProgram={hasAssistanceProgramMock[0]}
        showPlanPays={showPlanPaysMock[1]}
        memberPays={memberPaysMock[1]}
        planPays={planPaysMock[2]}
        couponDetails={couponDetailsMock[0]}
      />
    );

    const view = getChildren(testRenderer.root.findByType(View))[0];
    const priceWrapper = getChildren(view)[0];
    const lowestPricing = getChildren(priceWrapper)[0];
    expect(lowestPricing.type).toEqual(View);
    expect(lowestPricing.props.testID).toEqual('hasCouponAndPrice-lowestValue');
    const amountContainerView = getChildren(lowestPricing)[0];
    expect(amountContainerView.type).toEqual(PrescriptionPriceContainer);
    expect(getChildren(amountContainerView).length).toEqual(2);
    expect(amountContainerView.props.viewStyle).toEqual(
      styles.amountContainerViewStyle
    );

    const priceText = getChildren(amountContainerView)[0];
    expect(priceText.type).toEqual(BaseText);
    expect(priceText.props.children).toEqual(uiContentMock.price);
    expect(priceText.props.isSkeleton).toEqual(false);
    expect(priceText.props.skeletonWidth).toEqual('medium');

    const memberPaysPrice = getChildren(amountContainerView)[1];
    expect(memberPaysPrice.type).toEqual(ConfirmedAmountText);
    expect(memberPaysPrice.props.children).toEqual(
      MoneyFormatter.format(memberPaysMock[1])
    );

    const mediumPricing = getChildren(priceWrapper)[1];
    expect(mediumPricing.type).toEqual(View);
    expect(mediumPricing.props.testID).toEqual(
      'hasCouponAndPrice-highestValue'
    );
    const priceContainerView = getChildren(mediumPricing)[0];
    expect(priceContainerView.type).toEqual(View);
    expect(getChildren(priceContainerView).length).toEqual(2);
    expect(priceContainerView.props.style).toEqual(
      styles.amountHighContainerViewStyle
    );

    const copayText = getChildren(priceContainerView)[0];
    expect(copayText.type).toEqual(BaseText);
    expect(copayText.props.children).toEqual(couponDetailsMock[0]?.copayText);

    const couponPrice = getChildren(priceContainerView)[1];
    expect(couponPrice.type).toEqual(BaseText);
    expect(couponPrice.props.children).toEqual(
      MoneyFormatter.format(couponDetailsMock[0]?.price)
    );
  });

  it('[hasJustCouponPrice] renders coupon and member pays price (Given: couponDetails)', () => {
    const testRenderer = renderer.create(
      <PrescriptionPriceSection
        hasAssistanceProgram={hasAssistanceProgramMock[1]}
        showPlanPays={showPlanPaysMock[1]}
        memberPays={memberPaysMock[2]}
        planPays={planPaysMock[2]}
        couponDetails={couponDetailsMock[0]}
      />
    );

    const view = getChildren(testRenderer.root.findByType(View))[0];
    const pricing = getChildren(view)[0];
    expect(pricing.type).toEqual(View);
    expect(pricing.props.testID).toEqual('hasJustCouponPrice');

    const priceContainer = pricing;

    expect(getChildren(priceContainer).length).toEqual(2);

    const amountContainerView = getChildren(priceContainer)[0];
    expect(amountContainerView.type).toEqual(PrescriptionPriceContainer);
    expect(getChildren(amountContainerView).length).toEqual(2);
    expect(amountContainerView.props.viewStyle).toEqual(
      styles.amountContainerViewStyle
    );

    const copayText = getChildren(amountContainerView)[0];
    expect(copayText.type).toEqual(BaseText);
    expect(copayText.props.children).toEqual(couponDetailsMock1.copayText);

    const couponPrice = getChildren(amountContainerView)[1];
    expect(couponPrice.type).toEqual(ConfirmedAmountText);
    expect(couponPrice.props.children).toEqual(
      MoneyFormatter.format(couponDetailsMock1.price)
    );

    const priceContainerView = getChildren(priceContainer)[1];
    expect(priceContainerView.type).toEqual(View);
    expect(getChildren(priceContainerView).length).toEqual(2);
    expect(priceContainerView.props.style).toEqual(
      styles.priceContainerViewStyle
    );

    const priceText = getChildren(priceContainerView)[0];
    expect(priceText.type).toEqual(BaseText);
    expect(priceText.props.children).toEqual(uiContentMock.price);
    expect(priceText.props.isSkeleton).toEqual(false);
    expect(priceText.props.skeletonWidth).toEqual('short');

    const seePriceAtPharmacy = getChildren(priceContainerView)[1];
    expect(seePriceAtPharmacy.type).toEqual(BaseText);
    expect(seePriceAtPharmacy.props.style).toEqual(styles.rightTextStyle);
    expect(seePriceAtPharmacy.props.children).toEqual(uiContentMock.noPrice);
    expect(seePriceAtPharmacy.props.isSkeleton).toEqual(false);
    expect(seePriceAtPharmacy.props.skeletonWidth).toEqual('long');
  });

  it('[hasJustCouponPrice] renders coupon and member pays price (Given: couponDetails, showPlanPays)', () => {
    const testRenderer = renderer.create(
      <PrescriptionPriceSection
        hasAssistanceProgram={hasAssistanceProgramMock[1]}
        showPlanPays={showPlanPaysMock[1]}
        memberPays={memberPaysMock[2]}
        planPays={planPaysMock[2]}
        couponDetails={couponDetailsMock[0]}
      />
    );

    const view = getChildren(testRenderer.root.findByType(View))[0];
    const pricing = getChildren(view)[0];
    expect(pricing.type).toEqual(View);
    expect(pricing.props.testID).toEqual('hasJustCouponPrice');

    const priceContainer = pricing;

    expect(getChildren(priceContainer).length).toEqual(2);

    const amountContainerView = getChildren(priceContainer)[0];
    expect(amountContainerView.type).toEqual(PrescriptionPriceContainer);
    expect(getChildren(amountContainerView).length).toEqual(2);
    expect(amountContainerView.props.viewStyle).toEqual(
      styles.amountContainerViewStyle
    );

    const copayText = getChildren(amountContainerView)[0];
    expect(copayText.type).toEqual(BaseText);
    expect(copayText.props.children).toEqual(couponDetailsMock1.copayText);

    const couponPrice = getChildren(amountContainerView)[1];
    expect(couponPrice.type).toEqual(ConfirmedAmountText);
    expect(couponPrice.props.children).toEqual(
      MoneyFormatter.format(couponDetailsMock1.price)
    );

    const priceContainerView = getChildren(priceContainer)[1];
    expect(priceContainerView.type).toEqual(View);
    expect(getChildren(priceContainerView).length).toEqual(2);
    expect(priceContainerView.props.style).toEqual(
      styles.priceContainerViewStyle
    );

    const priceText = getChildren(priceContainerView)[0];
    expect(priceText.type).toEqual(BaseText);
    expect(priceText.props.children).toEqual(uiContentMock.price);
    expect(priceText.props.isSkeleton).toEqual(false);
    expect(priceText.props.skeletonWidth).toEqual('short');

    const seePriceAtPharmacy = getChildren(priceContainerView)[1];
    expect(seePriceAtPharmacy.type).toEqual(BaseText);
    expect(seePriceAtPharmacy.props.style).toEqual(styles.rightTextStyle);
    expect(seePriceAtPharmacy.props.children).toEqual(uiContentMock.noPrice);
    expect(seePriceAtPharmacy.props.isSkeleton).toEqual(false);
    expect(seePriceAtPharmacy.props.skeletonWidth).toEqual('long');
  });

  it('[default] renders PricingText by default if memberPays price (Given: couponDetails, showPlanPays)', () => {
    const testRenderer = renderer.create(
      <PrescriptionPriceSection
        hasAssistanceProgram={hasAssistanceProgramMock[1]}
        showPlanPays={showPlanPaysMock[1]}
        memberPays={memberPaysMock[0]}
        planPays={planPaysMock[0]}
        couponDetails={couponDetailsMock[2]}
        insurancePrice={insurancePriceMock}
      />
    );

    const view = getChildren(testRenderer.root.findByType(View))[0];
    const pricing = getChildren(view)[0];
    expect(pricing.type).toEqual(PricingText);
    expect(pricing.props.drugPricing).toEqual({
      memberPays: memberPaysMock[0],
      planPays: planPaysMock[0],
      insurancePrice: insurancePriceMock,
    });
    expect(pricing.props.pricingTextFormat).toEqual('summary');
  });

  it('renders skeletons when isSkeleton is true', () => {
    const testRenderer = renderer.create(
      <PrescriptionPriceSection
        hasAssistanceProgram={hasAssistanceProgramMock[1]}
        showPlanPays={showPlanPaysMock[1]}
        memberPays={memberPaysMock[2]}
        planPays={planPaysMock[2]}
        couponDetails={couponDetailsMock[2]}
        isSkeleton={true}
      />
    );

    const skeleton = getChildren(testRenderer.root.findByType(View))[0];

    expect(skeleton.type).toEqual(BaseText);
    expect(skeleton.props.isSkeleton).toEqual(true);
    expect(skeleton.props.skeletonWidth).toEqual('long');
  });
});
