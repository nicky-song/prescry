// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { PrescriptionTitle } from '../../../../../../../components/member/prescription-title/prescription-title';
import { SectionView } from '../../../../../../../components/primitives/section-view';
import { ConfirmedAmountText } from '../../../../../../../components/text/confirmed-amount/confirmed-amount.text';
import { BaseText } from '../../../../../../../components/text/base-text/base-text';
import { IDrugDetails } from '../../../../../../../utils/formatters/drug.formatter';
import { MoneyFormatter } from '../../../../../../../utils/formatters/money-formatter';
import { DrugWithPriceSection } from './drug-with-price.section';
import { drugWithPriceSectionStyles } from './drug-with-price.section.styles';
import { PrescriptionPriceContainer } from '../../../../../../../components/containers/prescription-price/prescription-price.container';
import { getChildren } from '../../../../../../../testing/test.helper';
import { IPrescriptionPriceSectionContent } from '../../../../../../../components/member/prescription-price/prescription-price-section.cms-content-wrapper';
import { useContent } from '../../../../../context-providers/session/ui-content-hooks/use-content';

jest.mock('../../../../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock(
  '../../../../../../../components/member/prescription-title/prescription-title',
  () => ({
    PrescriptionTitle: () => <div />,
  })
);

jest.mock(
  '../../../../../context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const contentMock: Partial<IPrescriptionPriceSectionContent> = {
  price: 'price-mock',
  noPrice: 'no-price-mock',
  youPay: 'you-pay-mock',
  planPays: 'plan-pays-mock',
};

describe('DrugWithPriceSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });
  });

  it('renders as section', () => {
    const drugDetailsMock: IDrugDetails = {
      formCode: 'form-code',
      quantity: 0,
    };
    const testRenderer = renderer.create(
      <DrugWithPriceSection
        drugName='drug-name'
        drugDetails={drugDetailsMock}
        price={0}
        hideSeparator={true}
      />
    );

    const section = testRenderer.root.children[0] as ReactTestInstance;

    expect(section.type).toEqual(SectionView);
    expect(getChildren(section).length).toEqual(2);
  });

  it('renders as prescription info', () => {
    const drugNameMock = 'drug-name';
    const drugDetailsMock: IDrugDetails = {
      formCode: 'form-code',
      strength: '10',
      unit: 'ml',
      quantity: 0,
      supply: 5,
    };

    const testRenderer = renderer.create(
      <DrugWithPriceSection
        drugName={drugNameMock}
        drugDetails={drugDetailsMock}
        price={10}
        hideSeparator={true}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const prescriptionTitle = getChildren(section)[0];

    expect(prescriptionTitle.type).toEqual(PrescriptionTitle);
    expect(prescriptionTitle.props.headingLevel).toEqual(2);
    expect(prescriptionTitle.props.productName).toEqual(drugNameMock);
    expect(prescriptionTitle.props.strength).toEqual(drugDetailsMock.strength);
    expect(prescriptionTitle.props.unit).toEqual(drugDetailsMock.unit);
    expect(prescriptionTitle.props.formCode).toEqual(drugDetailsMock.formCode);
    expect(prescriptionTitle.props.quantity).toEqual(drugDetailsMock.quantity);
    expect(prescriptionTitle.props.refills).toEqual(0);
    expect(prescriptionTitle.props.supply).toEqual(drugDetailsMock.supply);
    expect(prescriptionTitle.props.hideSeparator).toEqual(true);
  });

  it('renders only price container when planPrice is not provided', () => {
    const drugDetailsMock: IDrugDetails = {
      formCode: 'form-code',
      quantity: 0,
    };
    const testRenderer = renderer.create(
      <DrugWithPriceSection
        drugName='drug-name'
        drugDetails={drugDetailsMock}
        price={0}
        hideSeparator={true}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const amountContainer = getChildren(section)[1];

    expect(amountContainer.type).toEqual(PrescriptionPriceContainer);
    expect(amountContainer.props.viewStyle).toEqual(
      drugWithPriceSectionStyles.priceContainerViewStyle
    );
    expect(getChildren(amountContainer).length).toEqual(2);
  });

  it('renders price label when planPrice is not provided', () => {
    const drugDetailsMock: IDrugDetails = {
      formCode: 'form-code',
      quantity: 0,
    };
    const testRenderer = renderer.create(
      <DrugWithPriceSection
        drugName='drug-name'
        drugDetails={drugDetailsMock}
        price={0}
        hideSeparator={true}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const amountContainer = getChildren(section)[1];
    const label = getChildren(amountContainer)[0];

    expect(label.type).toEqual(BaseText);
    expect(label.props.children).toEqual(contentMock.price);
  });

  it('renders price value when planPrice is not provided', () => {
    const drugDetailsMock: IDrugDetails = {
      formCode: 'form-code',
      quantity: 0,
    };
    const priceMock = 10;
    const testRenderer = renderer.create(
      <DrugWithPriceSection
        drugName='drug-name'
        drugDetails={drugDetailsMock}
        price={priceMock}
        hideSeparator={true}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const amountContainer = getChildren(section)[1];
    const value = getChildren(amountContainer)[1];

    expect(value.type).toEqual(ConfirmedAmountText);
    expect(value.props.style).toEqual(
      drugWithPriceSectionStyles.priceTextStyle
    );
    expect(value.props.children).toEqual(MoneyFormatter.format(priceMock));
  });

  it('renders price value as default if undefined', () => {
    const drugDetailsMock: IDrugDetails = {
      formCode: 'form-code',
      quantity: 0,
    };
    const testRenderer = renderer.create(
      <DrugWithPriceSection
        drugName='drug-name'
        drugDetails={drugDetailsMock}
        price={undefined}
        hideSeparator={true}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const amountContainer = getChildren(section)[1];
    const value = getChildren(amountContainer)[1];

    expect(value.type).toEqual(ConfirmedAmountText);
    expect(value.props.style).toEqual(
      drugWithPriceSectionStyles.priceTextStyle
    );
    expect(value.props.children).toEqual(contentMock.noPrice);
    expect(value.props.isSkeleton).toEqual(false);
    expect(value.props.skeletonWidth).toEqual('long');
  });

  it('renders you pay and plan pay container when planPrice is provided', () => {
    const drugDetailsMock: IDrugDetails = {
      formCode: 'form-code',
      quantity: 0,
    };
    const testRenderer = renderer.create(
      <DrugWithPriceSection
        drugName='drug-name'
        drugDetails={drugDetailsMock}
        price={10}
        planPrice={20}
        hideSeparator={true}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const topContainer = getChildren(section)[1];
    expect(getChildren(topContainer).length).toEqual(2);

    const priceContainer = getChildren(topContainer)[0];
    expect(priceContainer.type).toEqual(PrescriptionPriceContainer);
    expect(priceContainer.props.viewStyle).toEqual(
      drugWithPriceSectionStyles.priceContainerViewStyle
    );
    expect(getChildren(priceContainer).length).toEqual(2);

    const planPriceContainer = getChildren(topContainer)[1];
    expect(planPriceContainer.type).toEqual(View);
    expect(planPriceContainer.props.style).toEqual(
      drugWithPriceSectionStyles.planPaysContainerViewStyle
    );
    expect(getChildren(planPriceContainer).length).toEqual(2);
  });

  it('renders correct labels and value for you pay and plan pay when planPrice is provided', () => {
    const drugDetailsMock: IDrugDetails = {
      formCode: 'form-code',
      quantity: 0,
    };
    const youPayMock = 10;
    const planPaysMock = 20;
    const testRenderer = renderer.create(
      <DrugWithPriceSection
        drugName='drug-name'
        drugDetails={drugDetailsMock}
        price={youPayMock}
        planPrice={planPaysMock}
        hideSeparator={true}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const topContainer = getChildren(section)[1];

    const priceContainer = getChildren(topContainer)[0];
    const youPayLabel = getChildren(priceContainer)[0];
    const youPayValue = getChildren(priceContainer)[1];

    expect(youPayLabel.type).toEqual(BaseText);
    expect(youPayLabel.props.children).toEqual(contentMock.youPay);
    expect(youPayLabel.props.isSkeleton).toEqual(false);
    expect(youPayLabel.props.skeletonWidth).toEqual('short');
    expect(youPayValue.type).toEqual(ConfirmedAmountText);
    expect(youPayValue.props.style).toEqual(
      drugWithPriceSectionStyles.priceTextStyle
    );
    expect(youPayValue.props.children).toEqual(
      MoneyFormatter.format(youPayMock)
    );

    const planPriceContainer = getChildren(topContainer)[1];
    const planPaysLabel = getChildren(planPriceContainer)[0];
    const planPaysValue = getChildren(planPriceContainer)[1];

    expect(planPaysLabel.type).toEqual(BaseText);
    expect(planPaysLabel.props.children).toEqual(contentMock.planPays);
    expect(planPaysLabel.props.isSkeleton).toEqual(false);
    expect(planPaysLabel.props.skeletonWidth).toEqual('short');
    expect(planPaysValue.type).toEqual(BaseText);
    expect(planPaysValue.props.style).toEqual(
      drugWithPriceSectionStyles.planPriceTextStyle
    );
    expect(planPaysValue.props.children).toEqual(
      MoneyFormatter.format(planPaysMock)
    );
  });

  it('renders plan pays section if planPays is 0', () => {
    const drugDetailsMock: IDrugDetails = {
      formCode: 'form-code',
      quantity: 0,
    };
    const youPayMock = 10;
    const planPaysMock = 0;

    const testRenderer = renderer.create(
      <DrugWithPriceSection
        drugName='drug-name'
        drugDetails={drugDetailsMock}
        price={youPayMock}
        planPrice={planPaysMock}
        hideSeparator={true}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const topContainer = getChildren(section)[1];

    const priceContainer = getChildren(topContainer)[0];
    const youPayLabel = getChildren(priceContainer)[0];
    const youPayValue = getChildren(priceContainer)[1];

    expect(youPayLabel.type).toEqual(BaseText);
    expect(youPayValue.type).toEqual(ConfirmedAmountText);

    const planPriceContainer = getChildren(topContainer)[1];
    const planPaysLabel = getChildren(planPriceContainer)[0];
    const planPaysValue = getChildren(planPriceContainer)[1];

    expect(planPaysLabel.type).toEqual(BaseText);
    expect(planPaysLabel.props.children).toEqual(contentMock.planPays);
    expect(planPaysLabel.props.isSkeleton).toEqual(false);
    expect(planPaysLabel.props.skeletonWidth).toEqual('short');
    expect(planPaysValue.type).toEqual(BaseText);
    expect(planPaysValue.props.style).toEqual(
      drugWithPriceSectionStyles.planPriceTextStyle
    );
    expect(planPaysValue.props.children).toEqual(
      MoneyFormatter.format(planPaysMock)
    );
  });
});
