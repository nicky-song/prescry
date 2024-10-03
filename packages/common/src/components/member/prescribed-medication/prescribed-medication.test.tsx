// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { PrescriptionTitle } from '../prescription-title/prescription-title';
import { SectionView } from '../../primitives/section-view';
import { IDrugDetails } from '../../../utils/formatters/drug.formatter';
import { getChildren } from '../../../testing/test.helper';
import {
  ContainerFormat,
  PrescriptionPriceContainer,
} from '../../containers/prescription-price/prescription-price.container';
import { BaseText } from '../../text/base-text/base-text';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { PrescribedMedication } from './prescribed-medication';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { prescribedMedicationStyles } from './prescribed-medication.styles';
import { ValueText } from '../../text/value/value.text';
import { LineSeparator } from '../line-separator/line-separator';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { IconButton } from '../../buttons/icon/icon.button';

jest.mock('../../text/protected-base-text/protected-base-text', () => ({
  ProtectedBaseText: () => <div />,
}));

jest.mock('../../buttons/icon/icon.button', () => ({
  IconButton: () => <div />,
}));

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../prescription-title/prescription-title', () => ({
  PrescriptionTitle: () => <div />,
}));

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
const titleLabelMock = 'title-mock';
const youPayLabelMock = 'you-pay-mock';
const planPaysLabelMock = 'plan-pays-mock';
const sentToMessageMock = 'sent-to-message-mock';
const estimatedPriceMessageMock = 'estimated-price-message-mock';
const sentToTextMock = 'sent-to-text-mock';
const isContentLoadingMock = true;

describe('PrescribedMedication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useContentMock.mockReturnValue({
      content: {
        title: titleLabelMock,
        youPay: youPayLabelMock,
        planPays: planPaysLabelMock,
        sentToMessage: sentToMessageMock,
        estimatedPriceMessage: estimatedPriceMessageMock,
        sentToText: sentToTextMock,
      },
      isContentLoading: isContentLoadingMock,
    });
  });

  it('gets content', () => {
    const drugDetailsMock: IDrugDetails = {
      formCode: 'form-code',
      quantity: 0,
    };
    renderer.create(
      <PrescribedMedication
        drugName='drug-name'
        drugDetails={drugDetailsMock}
        price={0}
        planPrice={0}
      />
    );

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.prescribedMedication,
      2
    );
  });

  it('renders as section', () => {
    const drugDetailsMock: IDrugDetails = {
      formCode: 'form-code',
      quantity: 0,
    };
    const viewStyleMock = {};
    const testRenderer = renderer.create(
      <PrescribedMedication
        drugName='drug-name'
        drugDetails={drugDetailsMock}
        price={0}
        planPrice={0}
        viewStyle={viewStyleMock}
      />
    );

    const section = testRenderer.root.children[0] as ReactTestInstance;

    const expectedTestId = 'prescribedMedication';

    expect(section.type).toEqual(SectionView);
    expect(section.props.testID).toEqual(expectedTestId);
    expect(section.props.style).toEqual(viewStyleMock);
    expect(getChildren(section).length).toEqual(5);
  });

  it('renders as prescribed medication', () => {
    const drugNameMock = 'drug-name';
    const refillsMock = 3;
    const drugDetailsMock: IDrugDetails = {
      formCode: 'form-code',
      strength: '10',
      unit: 'ml',
      quantity: 0,
      supply: 5,
      refills: refillsMock,
    };

    const testRenderer = renderer.create(
      <PrescribedMedication
        drugName={drugNameMock}
        drugDetails={drugDetailsMock}
        price={10}
        planPrice={0}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const prescriptionTitle = getChildren(section)[1];

    expect(prescriptionTitle.type).toEqual(PrescriptionTitle);
    expect(prescriptionTitle.props.productName).toEqual(drugNameMock);
    expect(prescriptionTitle.props.strength).toEqual(drugDetailsMock.strength);
    expect(prescriptionTitle.props.unit).toEqual(drugDetailsMock.unit);
    expect(prescriptionTitle.props.formCode).toEqual(drugDetailsMock.formCode);
    expect(prescriptionTitle.props.quantity).toEqual(drugDetailsMock.quantity);
    expect(prescriptionTitle.props.refills).toEqual(refillsMock);
    expect(prescriptionTitle.props.supply).toEqual(drugDetailsMock.supply);
    expect(prescriptionTitle.props.hideSeparator).toEqual(true);
    expect(prescriptionTitle.props.headingLevel).toEqual(2);
  });

  it('renders only price container when planPrice is not provided', () => {
    const drugDetailsMock: IDrugDetails = {
      formCode: 'form-code',
      quantity: 0,
    };
    const testRenderer = renderer.create(
      <PrescribedMedication
        drugName='drug-name'
        drugDetails={drugDetailsMock}
        price={0}
        planPrice={0}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const planPriceContainer = getChildren(section)[2];

    const expectedContainerFormat: ContainerFormat = 'plain';
    const amountContainer = getChildren(planPriceContainer)[0];
    expect(amountContainer.type).toEqual(PrescriptionPriceContainer);
    expect(amountContainer.props.containerFormat).toEqual(
      expectedContainerFormat
    );
    expect(getChildren(amountContainer).length).toEqual(2);
  });

  it.each([
    [10, 20],
    [undefined, 20],
    [10, undefined],
    [undefined, undefined],
  ])(
    'renders you pay and plan pay container when price is %p and planPrice is %p',
    (price?: number, planPrice?: number) => {
      const drugDetailsMock: IDrugDetails = {
        formCode: 'form-code',
        quantity: 0,
      };
      const testRenderer = renderer.create(
        <PrescribedMedication
          drugName='drug-name'
          drugDetails={drugDetailsMock}
          price={price}
          planPrice={planPrice}
        />
      );

      const expectedContainerFormat: ContainerFormat = 'plain';

      const section = testRenderer.root.findByType(SectionView);
      const topContainer = getChildren(section)[2];

      expect(getChildren(topContainer).length).toEqual(2);
      if (price !== undefined) {
        const priceContainer = getChildren(topContainer)[0];
        expect(priceContainer.type).toEqual(PrescriptionPriceContainer);
        expect(priceContainer.props.containerFormat).toEqual(
          expectedContainerFormat
        );
        expect(getChildren(priceContainer).length).toEqual(2);
      }
      if (planPrice !== undefined && price !== undefined) {
        const planPriceContainer = getChildren(topContainer)[1];
        expect(planPriceContainer.type).toEqual(View);
        expect(getChildren(planPriceContainer).length).toEqual(1);
      } else {
        expect(topContainer.type).toEqual(View);
      }
    }
  );

  it('renders correct labels and value for title, you pay and plan pay', () => {
    const drugDetailsMock: IDrugDetails = {
      formCode: 'form-code',
      quantity: 0,
    };
    const youPayMock = 10;
    const planPaysMock = 20;

    const testRenderer = renderer.create(
      <PrescribedMedication
        drugName='drug-name'
        drugDetails={drugDetailsMock}
        price={youPayMock}
        planPrice={planPaysMock}
      />
    );

    const section = testRenderer.root.findByType(SectionView);
    const title = getChildren(section)[0];
    const topContainer = getChildren(section)[2];

    const priceContainer = getChildren(topContainer)[0];
    const youPayLabel = getChildren(priceContainer)[0];
    const youPayValue = getChildren(priceContainer)[1];

    expect(title.type).toBe(BaseText);
    expect(title.props.children).toBe(titleLabelMock);
    expect(youPayLabel.type).toEqual(BaseText);
    expect(youPayLabel.props.children).toEqual(youPayLabelMock);
    expect(youPayLabel.props.weight).toEqual('semiBold');
    expect(youPayLabel.props.style).toEqual(
      prescribedMedicationStyles.youPayTextStyle
    );

    expect(youPayValue.type).toEqual(ValueText);
    expect(youPayValue.props.style).toEqual(
      prescribedMedicationStyles.priceTextStyle
    );
    expect(youPayValue.props.children).toEqual(
      MoneyFormatter.format(youPayMock)
    );

    const planPriceContainer = getChildren(topContainer)[1];
    const planPays = getChildren(planPriceContainer)[0];
    expect(getChildren(planPays)[0]).toEqual(planPaysLabelMock);
    expect(getChildren(planPays)[1]).toEqual(' ');
    expect(getChildren(planPays)[2].type).toEqual(BaseText);
    expect(getChildren(planPays)[2].props.children).toEqual(
      MoneyFormatter.format(planPaysMock)
    );
  });

  it('renders skeletons when isSkeleton is true', () => {
    const drugDetailsMock: IDrugDetails = {
      formCode: 'form-code',
      quantity: 0,
    };

    const testRenderer = renderer.create(
      <PrescribedMedication
        drugName='drug-name'
        drugDetails={drugDetailsMock}
        price={10}
        planPrice={20}
      />
    );

    const skeletons = testRenderer.root.findAllByProps({ isSkeleton: true });

    expect(skeletons.length).toEqual(3);
  });

  it.each([
    ['pharmacyNameMock', '11/10/2022'],
    [undefined, undefined],
    [undefined, '11/10/2022'],
    ['pharmacyNameMock', undefined],
  ])(
    'renders line separator (pharmacyName: %p,orderDate:%p)',
    (pharmacyName?: string, orderDate?: string) => {
      const drugDetailsMock: IDrugDetails = {
        formCode: 'form-code',
        quantity: 0,
      };
      const testRenderer = renderer.create(
        <PrescribedMedication
          drugName='drug-name'
          drugDetails={drugDetailsMock}
          price={10}
          planPrice={20}
          orderDate={orderDate}
          pharmacyName={pharmacyName}
          isDigitalRx={false}
        />
      );

      const section = testRenderer.root.findByType(SectionView);
      const lineSeparator = getChildren(section)[3];
      if ((pharmacyName && orderDate) || (pharmacyName && !orderDate)) {
        expect(lineSeparator.type).toEqual(LineSeparator);
        expect(lineSeparator.props.viewStyle).toEqual(
          prescribedMedicationStyles.lineSeparatorViewStyle
        );
      } else {
        expect(lineSeparator).toBeFalsy();
      }
    }
  );

  it.each([
    ['pharmacyNameMock', '11/10/2022', false],
    [undefined, undefined, false],
    ['pharmacyNameMock', undefined, true],
    [undefined, undefined, true],
  ])(
    'renders sub text (pharmacyName: %s, orderDate: %s, isDigitalRx: %s)',
    (
      pharmacyName: string | undefined,
      orderDate: string | undefined,
      isDigitalRx: boolean
    ) => {
      const drugDetailsMock: IDrugDetails = {
        formCode: 'form-code',
        quantity: 0,
      };
      const onIconPressMock = jest.fn();
      const testRenderer = renderer.create(
        <PrescribedMedication
          drugName='drug-name'
          drugDetails={drugDetailsMock}
          price={10}
          planPrice={20}
          orderDate={orderDate}
          pharmacyName={pharmacyName}
          isDigitalRx={isDigitalRx}
          onIconPress={onIconPressMock}
        />
      );
      const section = testRenderer.root.findByType(SectionView);
      const subText = getChildren(section)[4];
      if (pharmacyName && isDigitalRx) {
        expect(subText.type).toEqual(View);
        expect(subText.props.style).toEqual(
          prescribedMedicationStyles.estimatedPriceContainerViewStyle
        );

        const estimatedPriceText = getChildren(subText)[0];
        const infoCircleIcon = getChildren(subText)[1];

        expect(estimatedPriceText.type).toEqual(ProtectedBaseText);
        expect(estimatedPriceText.props.size).toEqual('small');
        expect(estimatedPriceText.props.isSkeleton).toEqual(
          isContentLoadingMock
        );
        expect(estimatedPriceText.props.skeletonWidth).toEqual('medium');

        expect(infoCircleIcon.type).toEqual(IconButton);
        expect(infoCircleIcon.props.onPress).toEqual(onIconPressMock);
        expect(infoCircleIcon.props.iconName).toEqual('info-circle');
        expect(infoCircleIcon.props.accessibilityLabel).toEqual(
          'lowestPriceInfoButton'
        );
        expect(infoCircleIcon.props.iconTextStyle).toEqual(
          prescribedMedicationStyles.iconButtonTextStyle
        );
        expect(infoCircleIcon.props.viewStyle).toEqual(
          prescribedMedicationStyles.iconButtonViewStyle
        );
      } else if (pharmacyName && orderDate && !isDigitalRx) {
        expect(subText.type).toEqual(ProtectedBaseText);
        expect(subText.props.style).toEqual(
          prescribedMedicationStyles.sentToPharmacyTextStyle
        );
        expect(subText.props.isSkeleton).toEqual(isContentLoadingMock);
        expect(subText.props.skeletonWidth).toEqual('medium');
        expect(subText.props.children).toEqual(sentToMessageMock);
      } else {
        expect(subText).toEqual(undefined);
      }
    }
  );
});
