// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import {
  PricingOptionButton,
  IPricingOptionButtonProps,
} from './pricing-option.button';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import { pricingOptionButtonStyle } from './pricing-option.button.styles';
import { getChildren } from '../../../testing/test.helper';
import { BaseText } from '../../text/base-text/base-text';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../text/protected-base-text/protected-base-text', () => ({
  ProtectedBaseText: () => <div />,
}));

type Role = Pick<TouchableOpacityProps, 'accessibilityRole'>;
describe('PricingOptionButton', () => {
  const onPressMock = jest.fn();
  const {
    rowViewStyle,
    rowViewActiveStyle,
    rowViewInactiveStyle,
    titleTextStyle,
    priceTextStyle,
    titleContainerViewStyle,
    subTextStyle,
  } = pricingOptionButtonStyle;
  const customViewStyle: ViewStyle = { width: 1 };

  const props: IPricingOptionButtonProps & Role = {
    title: 'Option A',
    subText: 'Some subtext',
    memberPays: 10,
    onPress: onPressMock,
    isSelected: false,
    isSkeleton: false,
    testID: 'pricing-option-button',
    viewStyle: customViewStyle,
    accessibilityRole: 'radio',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Verify components props', () => {
    const testRenderer = renderer.create(<PricingOptionButton {...props} />);
    const roleMock = 'radio';

    const pricingOptionButton =
      testRenderer.root.findAllByType(TouchableOpacity)[0];

    expect(pricingOptionButton.props.accessibilityRole).toEqual(roleMock);
    expect(pricingOptionButton.props.testID).toEqual(props.testID);

    const activeStyles = [props.viewStyle, rowViewStyle, rowViewInactiveStyle];
    expect(pricingOptionButton.props.style).toEqual(activeStyles);

    pricingOptionButton.props.onPress();
    expect(onPressMock).toHaveBeenCalled();
  });

  it('Verify component have 2 child Views', () => {
    const testRenderer = renderer.create(<PricingOptionButton {...props} />);
    const pricingOptionButton =
      testRenderer.root.findAllByType(TouchableOpacity)[0];

    const contentContainer = getChildren(pricingOptionButton);
    expect(contentContainer.length).toEqual(2);
  });

  it('should render the title container with style', () => {
    const testRenderer = renderer.create(<PricingOptionButton {...props} />);
    const pricingOptionButton =
      testRenderer.root.findAllByType(TouchableOpacity)[0];
    const contentContainer = getChildren(pricingOptionButton)[0];
    expect(contentContainer.type).toEqual(View);
    expect(contentContainer.props.style).toEqual(titleContainerViewStyle);
  });

  it('Verify title container view have 2 child Views', () => {
    const testRenderer = renderer.create(<PricingOptionButton {...props} />);
    const pricingOptionButton =
      testRenderer.root.findAllByType(TouchableOpacity)[0];

    const contentContainer = getChildren(pricingOptionButton)[0];
    expect(contentContainer.props.children.length).toEqual(2);
  });

  it('should render the title container', () => {
    const mockSkeletonWidth = 'long';
    const testRenderer = renderer.create(<PricingOptionButton {...props} />);
    const pricingOptionButton =
      testRenderer.root.findAllByType(TouchableOpacity)[0];

    const contentContainer = getChildren(pricingOptionButton)[0];
    const titleContainer = getChildren(contentContainer)[0];

    expect(titleContainer.type).toEqual(BaseText);
    expect(titleContainer.props.style).toEqual(titleTextStyle);
    expect(titleContainer.props.skeletonWidth).toEqual(mockSkeletonWidth);
    expect(titleContainer.props.isSkeleton).toEqual(props.isSkeleton);
    expect(titleContainer.props.children).toEqual(props.title);
  });

  it('should render the subtext container', () => {
    const testRenderer = renderer.create(<PricingOptionButton {...props} />);
    const pricingOptionButton =
      testRenderer.root.findAllByType(TouchableOpacity)[0];

    const contentContainer = getChildren(pricingOptionButton)[1];
    const titleContainer = getChildren(contentContainer)[0];

    expect(titleContainer.type).toEqual(BaseText);
    expect(titleContainer.props.style).toEqual(subTextStyle);
    expect(titleContainer.props.isSkeleton).toEqual(props.isSkeleton);
    expect(titleContainer.props.children).toEqual(props.subText);
  });

  it('should render member pay container', () => {
    const testRenderer = renderer.create(<PricingOptionButton {...props} />);
    const pricingOptionButton =
      testRenderer.root.findAllByType(TouchableOpacity)[0];

    const contentContainer = getChildren(pricingOptionButton)[0];
    const memberPaysContainer = getChildren(contentContainer)[1];
    const formattedMemberPaysMock = MoneyFormatter.format(props.memberPays);
    //member pays
    expect(memberPaysContainer.type).toEqual(ProtectedBaseText);
    expect(memberPaysContainer.props.style).toEqual(priceTextStyle);
    expect(memberPaysContainer.props.isSkeleton).toEqual(props.isSkeleton);
    expect(memberPaysContainer.props.children).toEqual(formattedMemberPaysMock);
  });

  it.each([[true], [false]])(
    `applies style when isSelected (isSelected %p)`,
    (isSelected: boolean) => {
      const testRenderer = renderer.create(
        <PricingOptionButton {...props} isSelected={isSelected} />
      );
      const pricingOptionButton =
        testRenderer.root.findAllByType(TouchableOpacity)[0];
      const selectedStyle = isSelected
        ? rowViewActiveStyle
        : rowViewInactiveStyle;

      const activeStyles = [props.viewStyle, rowViewStyle, selectedStyle];
      expect(pricingOptionButton.props.style).toEqual(activeStyles);
    }
  );

  it('renders skeletons when isSkeleton true', () => {
    const component = renderer.create(
      <PricingOptionButton {...props} isSkeleton={true} />
    );

    const pricingOptionButton =
      component.root.findAllByType(TouchableOpacity)[0];

    const contentContainer = getChildren(pricingOptionButton)[0];
    const memberPaysContainer = getChildren(pricingOptionButton)[1];
    const titleText = getChildren(contentContainer)[0];
    const subText = getChildren(contentContainer)[1];
    const amountText = getChildren(memberPaysContainer)[0];

    expect(titleText.props.isSkeleton).toEqual(true);
    expect(subText.props.isSkeleton).toEqual(true);
    expect(amountText.props.isSkeleton).toEqual(true);
  });
});
