// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../../testing/test.helper';
import { MoneyFormatter } from '../../../../utils/formatters/money-formatter';
import { BaseText } from '../../../text/base-text/base-text';
import {
  PricingOptionInformativePanel,
  IPricingOptionInformativePanelProps,
} from './pricing-option-informative.panel';
import { pricingOptionInformativePanelStyles } from './pricing-option-informative.panel.styles';
import { ConfirmedAmountText } from '../../../text/confirmed-amount/confirmed-amount.text';

jest.mock('../../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

const customViewStyleMock: ViewStyle = { width: 1 };

const pricingOptionInfoPanelPropsMock: IPricingOptionInformativePanelProps = {
  title: 'With Insurance',
  subText: 'Your plan pays $42.45',
  memberPays: 0,
  isSkeleton: false,
  viewStyle: customViewStyleMock,
  testID: 'pricingOptionInformativePanel',
};

const { panelViewStyle, titleViewStyle, titleTextStyle, subTextStyle } =
  pricingOptionInformativePanelStyles;

describe('PricingOptionInformativePanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it.each([
    [undefined, 'pricingOptionInformativePanel'],
    ['test-id', 'test-id'],
  ])(
    'renders in View container with testID %p',
    (testIdMock: undefined | string, expectedTestId: string) => {
      const testRenderer = renderer.create(
        <PricingOptionInformativePanel
          {...pricingOptionInfoPanelPropsMock}
          testID={testIdMock}
        />
      );
      const container = testRenderer.root.children[0] as ReactTestInstance;

      expect(container.type).toEqual(View);
      expect(container.props.testID).toEqual(expectedTestId);

      expect(container.props.style).toEqual([
        pricingOptionInfoPanelPropsMock.viewStyle,
        panelViewStyle,
      ]);

      expect(getChildren(container).length).toEqual(2);
    }
  );

  it('renders title view', () => {
    const testRenderer = renderer.create(
      <PricingOptionInformativePanel {...pricingOptionInfoPanelPropsMock} />
    );
    const container = testRenderer.root.children[0] as ReactTestInstance;
    const titleView = getChildren(container)[0];

    expect(titleView.type).toEqual(View);
    expect(titleView.props.style).toEqual(titleViewStyle);
    expect(getChildren(container).length).toEqual(2);
  });

  it('renders title in title view', () => {
    const titleMock = 'Title';
    const testRenderer = renderer.create(
      <PricingOptionInformativePanel
        {...pricingOptionInfoPanelPropsMock}
        title={titleMock}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;
    const titleView = getChildren(container)[0];

    const titleText = getChildren(titleView)[0];
    expect(titleText.type).toEqual(BaseText);
    expect(titleText.props.children).toEqual(titleMock);
    expect(titleText.props.style).toEqual(titleTextStyle);
    expect(titleText.props.isSkeleton).toEqual(false);
  });

  it('renders member pays price in title view', () => {
    const memberPaysMock = 50;
    const testRenderer = renderer.create(
      <PricingOptionInformativePanel
        {...pricingOptionInfoPanelPropsMock}
        memberPays={memberPaysMock}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;
    const titleView = getChildren(container)[0];

    const memberPaysText = getChildren(titleView)[1];
    expect(memberPaysText.type).toEqual(ConfirmedAmountText);
    expect(memberPaysText.props.children).toEqual(
      MoneyFormatter.format(memberPaysMock)
    );
    expect(memberPaysText.props.style).toEqual(titleTextStyle);
    expect(memberPaysText.props.isSkeleton).toEqual(false);
  });

  it('renders sub text', () => {
    const subTextMock = 'sub text';
    const testRenderer = renderer.create(
      <PricingOptionInformativePanel
        {...pricingOptionInfoPanelPropsMock}
        subText={subTextMock}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;
    const subText = getChildren(container)[1];
    expect(subText.type).toEqual(BaseText);
    expect(subText.props.children).toEqual(subTextMock);
    expect(subText.props.style).toEqual(subTextStyle);
    expect(subText.props.isSkeleton).toEqual(false);
  });
});
