// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View, ViewStyle } from 'react-native';
import { summarySectionStyle } from './summary.section.style';
import { SummarySection } from './summary.section';
import dateFormatter from '../../../../../../utils/formatters/date.formatter';
import { SectionView } from '../../../../../../components/primitives/section-view';
import { Heading } from '../../../../../../components/member/heading/heading';
import { LineSeparator } from '../../../../../../components/member/line-separator/line-separator';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { ConfirmedAmountText } from '../../../../../../components/text/confirmed-amount/confirmed-amount.text';
import { getChildren } from '../../../../../../testing/test.helper';
import { IOrderConfirmationScreenContent } from '../../order-confirmation.screen.content';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { ProtectedBaseText } from '../../../../../../components/text/protected-base-text/protected-base-text';

jest.mock('../../../../context-providers/session/ui-content-hooks/use-content');

const useContentMock = useContent as jest.Mock;

jest.mock('../../../../../../components/primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

const contentMock: Partial<IOrderConfirmationScreenContent> = {
  summaryTitle: 'summary-title-mock',
  summaryOrderDate: 'summary-order-date-mock',
  summaryOrderNumber: 'summary-order-number-mock',
  summaryPlanPays: 'summary-plan-pays-mock',
  summaryYouPay: 'summary-you-pay-mock',
};

describe('SummarySection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });
  });
  it('renders in section', () => {
    const customViewStyle: ViewStyle = { width: 1 };
    const testRenderer = renderer.create(
      <SummarySection viewStyle={customViewStyle} />
    );

    const section = testRenderer.root.children[0] as ReactTestInstance;
    expect(section.type).toEqual(SectionView);
    expect(section.props.style).toEqual([
      summarySectionStyle.sectionViewStyle,
      customViewStyle,
    ]);
    expect(section.props.testID).toEqual('summarySection');
    expect(section.props.children.length).toEqual(3);
  });

  it('renders separator', () => {
    const testRenderer = renderer.create(<SummarySection />);

    const section = testRenderer.root.findByType(SectionView);
    const separator = section.props.children[0];

    expect(separator.type).toEqual(LineSeparator);
    expect(separator.props.viewStyle).toEqual(
      summarySectionStyle.separatorViewStyle
    );
  });

  it('renders title', () => {
    const testRenderer = renderer.create(<SummarySection />);

    const section = testRenderer.root.findByType(SectionView);
    const titleHeading = section.props.children[1];

    expect(titleHeading.type).toEqual(Heading);
    expect(titleHeading.props.level).toEqual(2);
    expect(titleHeading.props.textStyle).toEqual(
      summarySectionStyle.heading2TextStyle
    );
    expect(titleHeading.props.children).toEqual(contentMock.summaryTitle);
  });

  const dateMock = new Date();

  it.each([
    [dateMock, dateFormatter.formatLocalDate(dateMock)],
    [undefined, ''],
  ])(
    'renders order date data row (date: %p)',
    (orderDateMock: Date | undefined, expectedFormattedDate: string) => {
      const testRenderer = renderer.create(
        <SummarySection orderDate={orderDateMock} />
      );

      const section = testRenderer.root.findByType(SectionView);
      const rowContainer = getChildren(section.props.children[2])[0];

      if (orderDateMock) {
        expect(rowContainer.type).toEqual(View);
        expect(rowContainer.props.style).toEqual(
          summarySectionStyle.rowViewStyle
        );
        expect(rowContainer.props.testID).toEqual('summaryRowOrderDate');

        const datelabel = rowContainer.props.children[0];
        expect(datelabel.type).toEqual(BaseText);
        expect(datelabel.props.style).toEqual(
          summarySectionStyle.labelTextStyle
        );
        expect(datelabel.props.children).toEqual(contentMock.summaryOrderDate);

        const dateContent = rowContainer.props.children[1];
        expect(dateContent.type).toEqual(BaseText);
        expect(dateContent.props.style).toEqual(
          summarySectionStyle.dataTextStyle
        );
        expect(dateContent.props.children).toEqual(expectedFormattedDate);
      } else {
        expect(rowContainer).toBeNull();
      }
    }
  );

  it('render expected order number data row', () => {
    const orderNumberMock = '12102-102';
    const testRenderer = renderer.create(
      <SummarySection orderNumber={orderNumberMock} />
    );
    const section = testRenderer.root.findByType(SectionView);
    const rowContainer = getChildren(section.props.children[2])[1];

    expect(rowContainer.type).toEqual(View);
    expect(rowContainer.props.style).toEqual(summarySectionStyle.rowViewStyle);
    expect(rowContainer.props.testID).toEqual('summaryRowOrderNumber');

    const orderLabel = rowContainer.props.children[0];
    expect(orderLabel.type).toEqual(BaseText);
    expect(orderLabel.props.style).toEqual(summarySectionStyle.labelTextStyle);
    expect(orderLabel.props.children).toEqual(contentMock.summaryOrderNumber);

    const orderContent = rowContainer.props.children[1];
    expect(orderContent.type).toEqual(ProtectedBaseText);
    expect(orderContent.props.style).toEqual(summarySectionStyle.dataTextStyle);
    expect(orderContent.props.children).toEqual(orderNumberMock);
  });

  it('render expected price plan data row', () => {
    const testRenderer = renderer.create(
      <SummarySection pricePlanPays={19.99} />
    );
    const section = testRenderer.root.findByType(SectionView);
    const rowContainer = getChildren(section.props.children[2])[2];

    expect(rowContainer.type).toEqual(View);
    expect(rowContainer.props.style).toEqual(summarySectionStyle.rowViewStyle);
    expect(rowContainer.props.testID).toEqual('summaryRowPlanPays');

    const pricePlanLabel = rowContainer.props.children[0];
    expect(pricePlanLabel.type).toEqual(BaseText);
    expect(pricePlanLabel.props.style).toEqual(
      summarySectionStyle.labelTextStyle
    );
    expect(pricePlanLabel.props.children).toEqual(contentMock.summaryPlanPays);

    const pricePlanContent = rowContainer.props.children[1];
    expect(pricePlanContent.type).toEqual(BaseText);
    expect(pricePlanContent.props.style).toEqual(
      summarySectionStyle.dataTextStyle
    );
    expect(pricePlanContent.props.children).toEqual('$19.99');
  });

  it('render expected you pay price data row', () => {
    const testRenderer = renderer.create(<SummarySection priceYouPay={5.66} />);
    const section = testRenderer.root.findByType(SectionView);
    const rowContainer = getChildren(section.props.children[2])[3];

    expect(rowContainer.type).toEqual(View);
    expect(rowContainer.props.style).toEqual(summarySectionStyle.rowViewStyle);
    expect(rowContainer.props.testID).toEqual('summaryRowYouPay');

    const youPaylabel = rowContainer.props.children[0];
    expect(youPaylabel.type).toEqual(BaseText);
    expect(youPaylabel.props.style).toEqual(summarySectionStyle.labelTextStyle);
    expect(youPaylabel.props.children).toEqual(contentMock.summaryYouPay);

    const youPayContent = rowContainer.props.children[1];
    expect(youPayContent.type).toEqual(ConfirmedAmountText);
    expect(youPayContent.props.style).toEqual(
      summarySectionStyle.dataTextStyle
    );
    expect(youPayContent.props.children).toEqual('$5.66');
  });

  it('renders undefined prices label and content without price props', () => {
    const testRenderer = renderer.create(<SummarySection />);
    const section = testRenderer.root.findByType(SectionView);
    const pricePlanContainer = getChildren(section.props.children[2])[2];
    expect(pricePlanContainer).toEqual(null);

    const priceYouPayContainer = getChildren(section.props.children[2])[3];
    expect(priceYouPayContainer).toEqual(null);
  });

  it('renders skeletons when isSkeleton is true', () => {
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: true,
    });
    const testRenderer = renderer.create(<SummarySection />);

    const section = testRenderer.root.findByType(SectionView);
    const titleHeading = section.props.children[1];

    expect(titleHeading.type).toEqual(Heading);
    expect(titleHeading.props.isSkeleton).toEqual(true);
    expect(titleHeading.props.skeletonWidth).toEqual('medium');
  });
});
