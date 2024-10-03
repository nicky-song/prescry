// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { PrescriptionTitle } from '../../member/prescription-title/prescription-title';
import { PharmacyInfoText } from '../../text/pharmacy-info/pharmacy-info.text';
import { ProtectedView } from '../protected-view/protected-view';
import { PricingOptionContextContainer } from './pricing-option-context.container';
import { pricingOptionContextContainerStyles } from './pricing-option-context.container.styles';

jest.mock('../protected-view/protected-view', () => ({
  ProtectedView: () => <div />,
}));

describe('PricingOptionContextContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockData = {
    drugName: 'QUININE SULFATE',
    drugDetails: {
      strength: '500',
      unit: 'mg',
      formCode: 'tablets',
      quantity: 60,
      supply: 30,
      refills: 1,
    },
    pharmacyInfo: {
      name: 'Pharmacy',
      address: {
        city: 'Seattle',
        lineOne: '2607 Denny Way',
        zip: '1234',
        state: 'WA',
      },
    },
  };

  it('renders container View', () => {
    const viewStyleMock: ViewStyle = { width: 1 };

    const testRenderer = renderer.create(
      <PricingOptionContextContainer
        drugName={mockData.drugName}
        drugDetails={mockData.drugDetails}
        pharmacyInfo={mockData.pharmacyInfo}
        viewStyle={viewStyleMock}
        testID='testId'
      ></PricingOptionContextContainer>
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual(viewStyleMock);
    expect(view.props.testID).toEqual('testId');
  });

  it('renders protected View', () => {
    const testRenderer = renderer.create(
      <PricingOptionContextContainer
        drugName={mockData.drugName}
        drugDetails={mockData.drugDetails}
        pharmacyInfo={mockData.pharmacyInfo}
      ></PricingOptionContextContainer>
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    const protectedView = getChildren(view)[0];
    expect(protectedView.type).toEqual(ProtectedView);
    expect(protectedView.props.style).toEqual(
      pricingOptionContextContainerStyles.prescpritionTitleViewStyle
    );
  });

  it('renders prescription title component', () => {
    const testRenderer = renderer.create(
      <PricingOptionContextContainer
        drugName={mockData.drugName}
        drugDetails={mockData.drugDetails}
        pharmacyInfo={mockData.pharmacyInfo}
      ></PricingOptionContextContainer>
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    const protectedView = getChildren(view)[0];
    const prescriptionTitle = getChildren(protectedView)[0];
    expect(prescriptionTitle.type).toEqual(PrescriptionTitle);
    expect(prescriptionTitle.props.productName).toEqual(mockData.drugName);
    expect(prescriptionTitle.props.formCode).toEqual(
      mockData.drugDetails.formCode
    );
    expect(prescriptionTitle.props.strength).toEqual(
      mockData.drugDetails.strength
    );
    expect(prescriptionTitle.props.quantity).toEqual(
      mockData.drugDetails.quantity
    );
    expect(prescriptionTitle.props.refills).toEqual(
      mockData.drugDetails.refills
    );

    expect(prescriptionTitle.props.supply).toEqual(mockData.drugDetails.supply);
    expect(prescriptionTitle.props.hideSeparator).toEqual(true);
    expect(prescriptionTitle.props.headingLevel).toEqual(2);
  });

  it('renders pharmacyInfo component', () => {
    const testRenderer = renderer.create(
      <PricingOptionContextContainer
        drugName={mockData.drugName}
        drugDetails={mockData.drugDetails}
        pharmacyInfo={mockData.pharmacyInfo}
        testID='testId'
      ></PricingOptionContextContainer>
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    const pharmacyInfoContainer = getChildren(view)[1];

    expect(pharmacyInfoContainer.type).toEqual(PharmacyInfoText);
    expect(pharmacyInfoContainer.props.pharmacyInfo).toEqual(
      mockData.pharmacyInfo
    );
  });
});
