// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { View, Image, ImageBackground } from 'react-native';
import { Coupon } from './coupon';
import { couponStyles } from './coupon.style';
import { BaseText } from '../../text/base-text/base-text';
import { CouponContent } from './coupon.content';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { getResolvedImageSource } from '../../../utils/assets.helper';
import { ITestContainer } from '../../../testing/test.container';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { ProtectedView } from '../../containers/protected-view/protected-view';

jest.mock('react-native', () => ({
  Platform: { select: jest.fn() },
  Dimensions: { get: jest.fn().mockReturnValue({}) },
  Image: () => <div />,
  ImageBackground: ({ children }: ITestContainer) => <div>{children}</div>,
  View: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../../utils/assets.helper');
const getResolvedImageSourceMock = getResolvedImageSource as jest.Mock;

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

const couponLogoMock = 1;
const semiCircleMock = 2;
const dottedLineMock = 3;

const couponProps = {
  price: 28.99,
  productName: 'Gralise',
  group: 'EC95001001',
  pcn: 'CN',
  bin: '004682',
  memberId: '58685267102',
};

describe('Coupon', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders containers with default props and styles', () => {
    const mockViewStyle = { flex: 1 };
    const testRenderer = renderer.create(
      <Coupon {...couponProps} viewStyle={mockViewStyle} />
    );

    const container = testRenderer.root.findAllByType(View, { deep: false })[0];

    expect(container.props.style).toEqual(mockViewStyle);
    expect(container.props.children[0].type).toEqual(View);
    expect(container.props.children[0].props.style).toEqual(
      couponStyles.topHalfViewStyle
    );
    expect(container.props.children[1].type).toEqual(View);
    expect(container.props.children[1].props.style).toEqual(
      couponStyles.middleContainerViewStyle
    );
    expect(container.props.children[2].type).toEqual(View);
    expect(container.props.children[2].props.style).toEqual(
      couponStyles.bottomHalfViewStyle
    );
  });

  it('renders top container correctly with defaults', () => {
    getResolvedImageSourceMock.mockReturnValueOnce(couponLogoMock);
    getResolvedImageSourceMock.mockReturnValueOnce(semiCircleMock);
    getResolvedImageSourceMock.mockReturnValueOnce(dottedLineMock);

    const testRenderer = renderer.create(<Coupon {...couponProps} />);

    const container = testRenderer.root.findAllByType(View, { deep: false })[0];
    const topContainer = container.props.children[0];

    expect(topContainer.type).toEqual(View);
    expect(topContainer.props.children[0].type).toEqual(View);
    expect(topContainer.props.children[0].props.style).toEqual(
      couponStyles.logoViewStyle
    );

    const logo = topContainer.props.children[0].props.children[0];
    expect(logo.type).toEqual(Image);
    expect(logo.props.style).toEqual(couponStyles.logoImageStyle);
    expect(logo.props.resizeMethod).toEqual('resize');
    expect(logo.props.resizeMode).toEqual('contain');
    expect(logo.props.source).toEqual(couponLogoMock);

    const productName = topContainer.props.children[0].props.children[1];
    expect(productName.type).toEqual(ProtectedBaseText);
    expect(productName.props.style).toEqual(couponStyles.productNameTextStyle);
    expect(productName.props.children).toEqual(couponProps.productName);

    const payLabelContainer = topContainer.props.children[1];
    expect(payLabelContainer.type).toEqual(View);
    expect(payLabelContainer.props.style).toEqual(
      couponStyles.payLabelViewStyle
    );

    const payAsLabel = payLabelContainer.props.children[0];
    expect(payAsLabel.type).toEqual(BaseText);
    expect(payAsLabel.props.style).toEqual(couponStyles.payLabelTextStyle);
    expect(payAsLabel.props.children).toEqual(CouponContent.payAsLittle);

    const priceFormattedLabel = payLabelContainer.props.children[1];
    expect(priceFormattedLabel.type).toEqual(BaseText);
    expect(priceFormattedLabel.props.style).toEqual(
      couponStyles.priceTextStyle
    );
    expect(priceFormattedLabel.props.children).toEqual(
      MoneyFormatter.format(couponProps.price)
    );
  });

  it('renders middle images', () => {
    getResolvedImageSourceMock.mockReturnValueOnce(couponLogoMock);
    getResolvedImageSourceMock.mockReturnValueOnce(semiCircleMock);
    getResolvedImageSourceMock.mockReturnValueOnce(dottedLineMock);

    const testRenderer = renderer.create(<Coupon {...couponProps} />);

    const container = testRenderer.root.findAllByType(View, { deep: false })[0];
    const imageContainer = container.props.children[1];

    expect(imageContainer.type).toEqual(View);
    expect(imageContainer.props.style).toEqual(
      couponStyles.middleContainerViewStyle
    );

    expect(imageContainer.props.children[0].type).toEqual(ImageBackground);
    expect(imageContainer.props.children[0].props.style).toEqual(
      couponStyles.semiCircleLeftViewStyle
    );
    expect(imageContainer.props.children[0].props.resizeMethod).toEqual(
      'resize'
    );
    expect(imageContainer.props.children[0].props.resizeMode).toEqual(
      'contain'
    );
    expect(imageContainer.props.children[0].props.source).toEqual(
      semiCircleMock
    );

    expect(imageContainer.props.children[1].type).toEqual(ImageBackground);
    expect(imageContainer.props.children[1].props.style).toEqual(
      couponStyles.dottedLineViewStyle
    );
    expect(imageContainer.props.children[1].props.resizeMethod).toBeUndefined();
    expect(imageContainer.props.children[1].props.resizeMode).toEqual(
      'stretch'
    );
    expect(imageContainer.props.children[1].props.source).toEqual(
      dottedLineMock
    );

    expect(imageContainer.props.children[2].type).toEqual(ImageBackground);
    expect(imageContainer.props.children[2].props.style).toEqual(
      couponStyles.semiCircleRightViewStyle
    );
    expect(imageContainer.props.children[2].props.resizeMethod).toEqual(
      'resize'
    );
    expect(imageContainer.props.children[2].props.resizeMode).toEqual(
      'contain'
    );
    expect(imageContainer.props.children[2].props.source).toEqual(
      semiCircleMock
    );
  });

  it('renders labels container correctly with defaults', () => {
    const testRenderer = renderer.create(<Coupon {...couponProps} />);

    const container = testRenderer.root.findAllByType(View, { deep: false })[0];
    const labelsContainer = container.props.children[2].props.children[0];

    expect(labelsContainer.type).toEqual(View);

    expect(labelsContainer.props.children[0].type).toEqual(BaseText);
    expect(labelsContainer.props.children[0].props.style).toEqual(
      couponStyles.couponTextStyle
    );
    expect(labelsContainer.props.children[0].props.children).toEqual(
      CouponContent.groupNumberLabel
    );

    expect(labelsContainer.props.children[1].type).toEqual(BaseText);
    expect(labelsContainer.props.children[1].props.style).toEqual(
      couponStyles.couponTextStyle
    );
    expect(labelsContainer.props.children[1].props.children).toEqual(
      CouponContent.pcnLabel
    );

    expect(labelsContainer.props.children[2].type).toEqual(BaseText);
    expect(labelsContainer.props.children[2].props.style).toEqual(
      couponStyles.couponTextStyle
    );
    expect(labelsContainer.props.children[2].props.children).toEqual(
      CouponContent.memberIdLabel
    );

    expect(labelsContainer.props.children[3].type).toEqual(BaseText);
    expect(labelsContainer.props.children[3].props.style).toEqual(
      couponStyles.couponTextStyle
    );
    expect(labelsContainer.props.children[3].props.children).toEqual(
      CouponContent.binLabel
    );
  });

  it('renders content container correctly with defaults', () => {
    const testRenderer = renderer.create(<Coupon {...couponProps} />);

    const container = testRenderer.root.findAllByType(View, { deep: false })[0];
    const labelsContainer = container.props.children[2].props.children[1];

    expect(labelsContainer.type).toEqual(ProtectedView);

    expect(labelsContainer.props.children[0].type).toEqual(BaseText);
    expect(labelsContainer.props.children[0].props.style).toEqual(
      couponStyles.dataTextStyle
    );
    expect(labelsContainer.props.children[0].props.children).toEqual(
      couponProps.group
    );

    expect(labelsContainer.props.children[1].type).toEqual(BaseText);
    expect(labelsContainer.props.children[1].props.style).toEqual(
      couponStyles.dataTextStyle
    );
    expect(labelsContainer.props.children[1].props.children).toEqual(
      couponProps.pcn
    );

    expect(labelsContainer.props.children[2].type).toEqual(BaseText);
    expect(labelsContainer.props.children[2].props.style).toEqual(
      couponStyles.dataTextStyle
    );
    expect(labelsContainer.props.children[2].props.children).toEqual(
      couponProps.memberId
    );

    expect(labelsContainer.props.children[3].type).toEqual(BaseText);
    expect(labelsContainer.props.children[3].props.style).toEqual(
      couponStyles.dataTextStyle
    );
    expect(labelsContainer.props.children[3].props.children).toEqual(
      couponProps.bin
    );
  });
});
