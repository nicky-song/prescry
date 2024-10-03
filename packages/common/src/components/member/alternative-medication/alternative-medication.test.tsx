// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { PrescriptionTagList } from '../../tags/prescription/prescription-tag-list';
import { IDrugPricing, PricingText } from '../../text/pricing/pricing.text';
import { PrescriptionTitle } from '../prescription-title/prescription-title';
import { IPrescriptionDetails } from '../../../models/prescription-details';
import { alternativeMedicationStyles } from './alternative-medication.styles';
import {
  AlternativeMedication,
  IAlternativeMedicationProps,
} from './alternative-medication';

jest.mock('../../tags/prescription/prescription-tag-list', () => ({
  ...jest.requireActual('../../tags/prescription/prescription-tag-list'),
  PrescriptionTagList: () => <div />,
}));

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../text/pricing/pricing.text', () => ({
  ...jest.requireActual('../../text/pricing/pricing.text'),
  PricingText: () => <div />,
}));

jest.mock('../prescription-title/prescription-title', () => ({
  PrescriptionTitle: () => <div />,
}));

const savingsAmountMock = 11.11;
const memberPaysMock = 7.77;
const planPaysMock = 3.33;

const drugPricingMock: IDrugPricing = {
  memberPays: memberPaysMock,
  planPays: planPaysMock,
};

const defaultPrescriptionDetailsListMock: IPrescriptionDetails[] = [
  {
    productName: 'product-name-mock-1',
    quantity: 99,
    strength: '999',
    unit: 'unit-mock',
    formCode: 'form-code-mock',
  },
  {
    productName: 'product-name-mock-2',
    quantity: 99,
    strength: '999',
    unit: 'unit-mock',
    formCode: 'form-code-mock',
  },
];

const viewStyleMock: ViewStyle = {};

const defaultAlternativeMedicationPropsMock: IAlternativeMedicationProps = {
  memberSaves: savingsAmountMock,
  planSaves: 0,
  prescriptionDetailsList: defaultPrescriptionDetailsListMock,
  drugPricing: drugPricingMock,
  viewStyle: viewStyleMock,
};

describe('PrescriptionDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders as View with expected style & children', () => {
    const testRenderer = renderer.create(
      <AlternativeMedication {...defaultAlternativeMedicationPropsMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual(
      defaultAlternativeMedicationPropsMock.viewStyle
    );
    expect(getChildren(view).length).toEqual(3);
  });

  it('renders PrescriptionTagList as first child with expected memberSaves, planSaves, and viewStyle', () => {
    const testRenderer = renderer.create(
      <AlternativeMedication {...defaultAlternativeMedicationPropsMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const prescriptionTagList = getChildren(view)[0];

    expect(prescriptionTagList.type).toEqual(PrescriptionTagList);
    expect(prescriptionTagList.props.memberSaves).toEqual(
      defaultAlternativeMedicationPropsMock.memberSaves
    );
    expect(prescriptionTagList.props.planSaves).toEqual(
      defaultAlternativeMedicationPropsMock.planSaves
    );
    expect(prescriptionTagList.props.viewStyle).toEqual(
      alternativeMedicationStyles.prescriptionTagListViewStyle
    );
  });

  it('renders PrescriptionTitle(s) as children in ChevronCard with expected prescriptionDetails, viewStyle', () => {
    const testRenderer = renderer.create(
      <AlternativeMedication {...defaultAlternativeMedicationPropsMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const cardView = getChildren(view)[1];

    expect(cardView.type).toEqual(View);
    expect(cardView.props.style).toEqual(
      alternativeMedicationStyles.chevronCardViewStyle
    );

    const prescriptionTitle = getChildren(cardView)[0];

    expect(prescriptionTitle.type).toEqual(PrescriptionTitle);
    expect(prescriptionTitle.props.productName).toEqual(
      defaultAlternativeMedicationPropsMock.prescriptionDetailsList[0]
        .productName
    );
    expect(prescriptionTitle.props.strength).toEqual(
      defaultAlternativeMedicationPropsMock.prescriptionDetailsList[0].strength
    );
    expect(prescriptionTitle.props.unit).toEqual(
      defaultAlternativeMedicationPropsMock.prescriptionDetailsList[0].unit
    );
    expect(prescriptionTitle.props.quantity).toEqual(
      defaultAlternativeMedicationPropsMock.prescriptionDetailsList[0].quantity
    );
    expect(prescriptionTitle.props.supply).toEqual(
      defaultAlternativeMedicationPropsMock.prescriptionDetailsList[0].supply
    );
    expect(prescriptionTitle.props.formCode).toEqual(
      defaultAlternativeMedicationPropsMock.prescriptionDetailsList[0].formCode
    );
    expect(prescriptionTitle.props.viewStyle).toEqual(
      alternativeMedicationStyles.prescriptionTitleViewStyle
    );
    expect(prescriptionTitle.props.hideSeparator).toEqual(true);
    expect(prescriptionTitle.props.isClaimAlert).toEqual(true);

    const prescriptionTitle2 = getChildren(cardView)[1];

    expect(prescriptionTitle2.type).toEqual(PrescriptionTitle);
    expect(prescriptionTitle2.props.productName).toEqual(
      defaultAlternativeMedicationPropsMock.prescriptionDetailsList[1]
        .productName
    );
    expect(prescriptionTitle2.props.strength).toEqual(
      defaultAlternativeMedicationPropsMock.prescriptionDetailsList[1].strength
    );
    expect(prescriptionTitle2.props.unit).toEqual(
      defaultAlternativeMedicationPropsMock.prescriptionDetailsList[1].unit
    );
    expect(prescriptionTitle2.props.quantity).toEqual(
      defaultAlternativeMedicationPropsMock.prescriptionDetailsList[1].quantity
    );
    expect(prescriptionTitle2.props.supply).toEqual(
      defaultAlternativeMedicationPropsMock.prescriptionDetailsList[1].supply
    );
    expect(prescriptionTitle2.props.formCode).toEqual(
      defaultAlternativeMedicationPropsMock.prescriptionDetailsList[1].formCode
    );
    expect(prescriptionTitle2.props.viewStyle).toEqual(
      alternativeMedicationStyles.prescriptionTitleViewStyle
    );
    expect(prescriptionTitle2.props.hideSeparator).toEqual(true);
    expect(prescriptionTitle2.props.isClaimAlert).toEqual(true);
  });

  it('renders PricingText as third child with expected drugPricing, viewStyle', () => {
    const testRenderer = renderer.create(
      <AlternativeMedication {...defaultAlternativeMedicationPropsMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const pricingText = getChildren(view)[2];

    expect(pricingText.type).toEqual(PricingText);
    expect(pricingText.props.drugPricing).toEqual(
      defaultAlternativeMedicationPropsMock.drugPricing
    );
    expect(pricingText.props.viewStyle).toEqual(
      alternativeMedicationStyles.pricingTextViewStyle
    );
    expect(pricingText.props.pricingTextFormat).toEqual('summary');
  });
});
