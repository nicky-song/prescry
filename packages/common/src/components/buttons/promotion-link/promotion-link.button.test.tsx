// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { PromotionLinkButton } from './promotion-link.button';
import { View } from 'react-native';
import { PromotionLinkButtonStyle } from './promotion-link.button.style';
import { BaseText } from '../../text/base-text/base-text';
import { BaseButton } from '../base/base.button';
import { ImageAsset } from '../../image-asset/image-asset';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';

jest.mock('../../image-asset/image-asset');

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

describe('PromotionLinkButton', () => {
  it('renders with the expected props', () => {
    const onPressMock = jest.fn();
    const props = {
      promotionText: 'Pay as little as $28 with manufacturer coupon.',
      linkText: 'Check my eligibility.',
      viewStyle: { flex: 1 },
      iconName: 'ticket-alt',
      iconColor: 'black',
      iconSize: 18,
    };
    const testRenderer = renderer.create(
      <PromotionLinkButton {...props} onPress={onPressMock} />
    );
    testRenderer.root.findByProps({ onPress: onPressMock }).props.onPress();
    expect(onPressMock).toHaveBeenCalled();

    const container = testRenderer.root.findByType(BaseButton);

    expect(container.props.viewStyle).toEqual([
      PromotionLinkButtonStyle.buttonContainerViewStyle,
      props.viewStyle,
    ]);

    const rowContainer = container.props.children;

    expect(rowContainer.type).toEqual(View);
    expect(rowContainer.props.style).toEqual(
      PromotionLinkButtonStyle.rowViewStyle
    );

    const asset = rowContainer.props.children[0];
    expect(asset.type).toEqual(FontAwesomeIcon);
    expect(asset.props.name).toEqual(props.iconName);
    expect(asset.props.color).toEqual(props.iconColor);
    expect(asset.props.size).toEqual(props.iconSize);

    const promotionText = rowContainer.props.children[1];
    expect(promotionText.type).toEqual(BaseText);
    expect(promotionText.props.weight).toEqual('semiBold');
    expect(promotionText.props.children[0]).toEqual(props.promotionText);

    expect(promotionText.props.children[1].type).toEqual(BaseText);
    expect(promotionText.props.children[1].props.style).toEqual(
      PromotionLinkButtonStyle.linkTextStyle
    );
    expect(promotionText.props.children[1].props.weight).toEqual('semiBold');
    expect(promotionText.props.children[1].props.children).toEqual(
      props.linkText
    );
  });
  it('renders with the expected ImageAsset', () => {
    const onPressMock = jest.fn();
    const imageMock = 'couponIcon';
    const props = {
      promotionText: 'Pay as little as $28 with manufacturer coupon.',
      linkText: 'Check my eligibility.',
      viewStyle: { flex: 1 },
      image: imageMock,
    };
    const testRenderer = renderer.create(
      <PromotionLinkButton {...props} onPress={onPressMock} />
    );
    testRenderer.root.findByProps({ onPress: onPressMock }).props.onPress();
    expect(onPressMock).toHaveBeenCalled();

    const container = testRenderer.root.findByType(BaseButton);

    expect(container.props.viewStyle).toEqual([
      PromotionLinkButtonStyle.buttonContainerViewStyle,
      props.viewStyle,
    ]);

    const rowContainer = container.props.children;

    expect(rowContainer.type).toEqual(View);
    expect(rowContainer.props.style).toEqual(
      PromotionLinkButtonStyle.rowViewStyle
    );

    const asset = rowContainer.props.children[0];
    expect(asset.type).toEqual(ImageAsset);
  });
  it('renders null image or icon when no props given', () => {
    const onPressMock = jest.fn();
    const props = {
      promotionText: 'Pay as little as $28 with manufacturer coupon.',
      linkText: 'Check my eligibility.',
      viewStyle: { flex: 1 },
    };
    const testRenderer = renderer.create(
      <PromotionLinkButton {...props} onPress={onPressMock} />
    );
    testRenderer.root.findByProps({ onPress: onPressMock }).props.onPress();
    expect(onPressMock).toHaveBeenCalled();

    const container = testRenderer.root.findByType(BaseButton);

    expect(container.props.viewStyle).toEqual([
      PromotionLinkButtonStyle.buttonContainerViewStyle,
      props.viewStyle,
    ]);

    const rowContainer = container.props.children;

    expect(rowContainer.type).toEqual(View);
    expect(rowContainer.props.style).toEqual(
      PromotionLinkButtonStyle.rowViewStyle
    );

    expect(rowContainer.props.children[0]).toBeNull();
  });
});
