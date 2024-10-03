// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { PricingOptionButton } from '../pricing-option/pricing-option.button';
import {
  SmartPricePricingOptionSelectorButton,
  ISmartPricePricingOptionSelectorButtonProps,
} from './smart-price-pricing-option-selector.button';
import { IPricingOptionContent } from '../../../models/cms-content/pricing-options.content';

jest.mock('../pricing-option/pricing-option.button', () => ({
  PricingOptionButton: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

describe('SmartPricePricingOptionSelectorButton', () => {
  const onPressMock = jest.fn();
  const customViewStyle: ViewStyle = { width: 1 };
  const testID = 'smartPrice-pricing-option-selector-button';
  const props: ISmartPricePricingOptionSelectorButtonProps = {
    memberPays: 10,
    onPress: onPressMock,
    isSelected: false,
    testID,
    viewStyle: customViewStyle,
  };
  const pricingOptionsContentMock: Partial<IPricingOptionContent> = {
    smartPriceTitle: 'smart-price-title',
    smartPriceSubText: 'smart-price-sub-text',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useContentMock.mockReturnValue({
      isContentLoading: false,
      content: pricingOptionsContentMock,
    });
  });

  it('renders correctly', () => {
    const component = renderer.create(
      <SmartPricePricingOptionSelectorButton {...props} />
    );

    const smartPricePricingOptionSelectorButton =
      component.root.findByType(PricingOptionButton);
    expect(smartPricePricingOptionSelectorButton).toBeDefined();
  });

  it('should pass correct props', () => {
    const component = renderer.create(
      <SmartPricePricingOptionSelectorButton {...props} />
    );

    const smartPricePricingOptionSelectorButton =
      component.root.findByType(PricingOptionButton);
    expect(smartPricePricingOptionSelectorButton.props.memberPays).toEqual(
      props.memberPays
    );
    expect(smartPricePricingOptionSelectorButton.props.title).toEqual(
      pricingOptionsContentMock.smartPriceTitle
    );
    expect(smartPricePricingOptionSelectorButton.props.subText).toEqual(
      pricingOptionsContentMock.smartPriceSubText
    );
    expect(smartPricePricingOptionSelectorButton.props.isSelected).toEqual(
      props.isSelected
    );
    expect(smartPricePricingOptionSelectorButton.props.onPress).toEqual(
      props.onPress
    );
    expect(smartPricePricingOptionSelectorButton.props.viewStyle).toEqual(
      props.viewStyle
    );
    expect(smartPricePricingOptionSelectorButton.props.testID).toEqual(
      props.testID
    );
  });
});
