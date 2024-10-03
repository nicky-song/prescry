// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { PrescriptionTagList } from '../../tags/prescription/prescription-tag-list';
import { BaseText } from '../../text/base-text/base-text';
import { IDrugPricing, PricingText } from '../../text/pricing/pricing.text';
import { PrescriptionTitle } from '../prescription-title/prescription-title';
import {
  IPrescriptionDetailsProps,
  PrescriptionDetails,
} from './prescription-details';
import { IPrescriptionDetails } from '../../../models/prescription-details';
import { prescriptionDetailsStyles } from './prescription-details.styles';

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

const titleMock = 'title-mock';
const savingsAmountMock = 11.11;
const memberPaysMock = 7.77;
const planPaysMock = 3.33;

const drugPricingMock: IDrugPricing = {
  memberPays: memberPaysMock,
  planPays: planPaysMock,
};

const defaultPrescriptionDetailsMock: IPrescriptionDetails = {
  productName: 'product-name-mock',
  quantity: 99,
  strength: '999',
  unit: 'unit-mock',
  formCode: 'form-code-mock',
  memberPays: 99,
  planPays: 999,
};

const defaultPrescriptionDetailsMock2: IPrescriptionDetails = {
  productName: 'product-name-mock-2',
  quantity: 992,
  strength: '9992',
  unit: 'unit-mock-2',
  formCode: 'form-code-mock-2',
  memberPays: 99,
  planPays: 999,
};

const viewStyleMock: ViewStyle = {};

const defaultPrescriptionDetailsPropsMock: IPrescriptionDetailsProps = {
  title: titleMock,
  memberSaves: savingsAmountMock,
  planSaves: 0,
  prescriptionDetailsList: [defaultPrescriptionDetailsMock],
  drugPricing: drugPricingMock,
  viewStyle: viewStyleMock,
};

describe('PrescriptionDetails', () => {
  it('renders as View with expected style & children', () => {
    const testRenderer = renderer.create(
      <PrescriptionDetails {...defaultPrescriptionDetailsPropsMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual(
      defaultPrescriptionDetailsPropsMock.viewStyle
    );
    expect(getChildren(view).length).toEqual(4);
  });

  it('renders title BaseText as first child with expected style', () => {
    const testRenderer = renderer.create(
      <PrescriptionDetails {...defaultPrescriptionDetailsPropsMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const baseText = getChildren(view)[0];

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual(
      prescriptionDetailsStyles.titleTextStyle
    );
  });

  it('renders PrescriptionTagList as second child with expected memberSaves, planSaves, and viewStyle', () => {
    const testRenderer = renderer.create(
      <PrescriptionDetails {...defaultPrescriptionDetailsPropsMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const prescriptionTagList = getChildren(view)[1];

    expect(prescriptionTagList.type).toEqual(PrescriptionTagList);
    expect(prescriptionTagList.props.memberSaves).toEqual(
      defaultPrescriptionDetailsPropsMock.memberSaves ?? 0
    );
    expect(prescriptionTagList.props.planSaves).toEqual(
      defaultPrescriptionDetailsPropsMock.planSaves ?? 0
    );
    expect(prescriptionTagList.props.viewStyle).toEqual(
      prescriptionDetailsStyles.prescriptionTagListViewStyle
    );
  });

  it('renders PrescriptionTitle as third child with expected prescriptionDetails, viewStyle', () => {
    const testRenderer = renderer.create(
      <PrescriptionDetails {...defaultPrescriptionDetailsPropsMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const prescriptionTitles = getChildren(
      view
    )[2] as unknown as ReactTestInstance[];

    prescriptionTitles.forEach((prescriptionTitleView, index) => {
      expect(prescriptionTitleView.type).toEqual(View);

      const prescriptionTitle = getChildren(prescriptionTitleView)[0];

      expect(prescriptionTitle.type).toEqual(PrescriptionTitle);
      expect(prescriptionTitle.props.productName).toEqual(
        defaultPrescriptionDetailsPropsMock.prescriptionDetailsList[index]
          .productName
      );
      expect(prescriptionTitle.props.strength).toEqual(
        defaultPrescriptionDetailsPropsMock.prescriptionDetailsList[index]
          .strength
      );
      expect(prescriptionTitle.props.unit).toEqual(
        defaultPrescriptionDetailsPropsMock.prescriptionDetailsList[index].unit
      );
      expect(prescriptionTitle.props.quantity).toEqual(
        defaultPrescriptionDetailsPropsMock.prescriptionDetailsList[index]
          .quantity
      );
      expect(prescriptionTitle.props.supply).toEqual(
        defaultPrescriptionDetailsPropsMock.prescriptionDetailsList[index]
          .supply
      );
      expect(prescriptionTitle.props.formCode).toEqual(
        defaultPrescriptionDetailsPropsMock.prescriptionDetailsList[index]
          .formCode
      );
      expect(prescriptionTitle.props.viewStyle).toEqual(
        prescriptionDetailsStyles.prescriptionTitleViewStyle
      );
      expect(prescriptionTitle.props.hideSeparator).toEqual(true);

      const pricingText = getChildren(prescriptionTitleView)[1];

      expect(pricingText).toBeFalsy();
    });
  });

  it('renders PrescriptionTitle with PricingText details when memberPays && isShowingPriceDetails && isCombination', () => {
    const prescriptionDetailsPropsMock = {
      ...defaultPrescriptionDetailsPropsMock,
      prescriptionDetailsList: [
        defaultPrescriptionDetailsMock,
        defaultPrescriptionDetailsMock2,
      ],
      isShowingPriceDetails: true,
    };

    const testRenderer = renderer.create(
      <PrescriptionDetails {...prescriptionDetailsPropsMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const prescriptionTitles = getChildren(
      view
    )[2] as unknown as ReactTestInstance[];

    prescriptionTitles.forEach((prescriptionTitleView, index) => {
      expect(prescriptionTitleView.type).toEqual(View);

      const prescriptionTitle = getChildren(prescriptionTitleView)[0];

      expect(prescriptionTitle.type).toEqual(PrescriptionTitle);
      expect(prescriptionTitle.props.productName).toEqual(
        prescriptionDetailsPropsMock.prescriptionDetailsList[index].productName
      );
      expect(prescriptionTitle.props.strength).toEqual(
        prescriptionDetailsPropsMock.prescriptionDetailsList[index].strength
      );
      expect(prescriptionTitle.props.unit).toEqual(
        prescriptionDetailsPropsMock.prescriptionDetailsList[index].unit
      );
      expect(prescriptionTitle.props.quantity).toEqual(
        prescriptionDetailsPropsMock.prescriptionDetailsList[index].quantity
      );
      expect(prescriptionTitle.props.supply).toEqual(
        prescriptionDetailsPropsMock.prescriptionDetailsList[index].supply
      );
      expect(prescriptionTitle.props.formCode).toEqual(
        prescriptionDetailsPropsMock.prescriptionDetailsList[index].formCode
      );
      expect(prescriptionTitle.props.viewStyle).toEqual(
        prescriptionDetailsStyles.prescriptionTitleViewStyle
      );
      expect(prescriptionTitle.props.hideSeparator).toEqual(true);

      const pricingText = getChildren(prescriptionTitleView)[1];

      expect(pricingText.type).toEqual(PricingText);
      expect(pricingText.props.drugPricing).toEqual({
        memberPays:
          prescriptionDetailsPropsMock.prescriptionDetailsList[index]
            .memberPays,
        planPays:
          prescriptionDetailsPropsMock.prescriptionDetailsList[index].planPays,
      });
      expect(pricingText.props.pricingTextFormat).toEqual('details');
      expect(pricingText.props.viewStyle).toEqual(
        prescriptionDetailsStyles.pricingTextViewStyle
      );
    });
  });

  it.each([[true], [false]])(
    'renders PricingText as fourth child with expected drugPricing, viewStyle, pricingTextFormat (isCombination: %s)',
    (isCombinationMock: boolean) => {
      const testRenderer = renderer.create(
        <PrescriptionDetails
          {...defaultPrescriptionDetailsPropsMock}
          prescriptionDetailsList={
            isCombinationMock
              ? [
                  defaultPrescriptionDetailsMock,
                  defaultPrescriptionDetailsMock2,
                ]
              : [defaultPrescriptionDetailsMock]
          }
        />
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;

      const pricingText = getChildren(view)[3];

      expect(pricingText.type).toEqual(PricingText);
      expect(pricingText.props.drugPricing).toEqual(
        defaultPrescriptionDetailsPropsMock.drugPricing
      );
      expect(pricingText.props.viewStyle).toEqual(
        prescriptionDetailsStyles.pricingTextViewStyle
      );
      expect(pricingText.props.pricingTextFormat).toEqual('summary');
    }
  );
});
