// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { PricingOptionButton } from '../pricing-option/pricing-option.button';
import {
  ThirdPartyPricingOptionSelectorButton,
  IThirdPartyPricingOptionSelectorButtonProps,
} from './third-party-pricing-option-selector.button';
import { IPricingOptionContent } from '../../../models/cms-content/pricing-options.content';

jest.mock('../pricing-option/pricing-option.button', () => ({
  PricingOptionButton: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

describe('ThirdPartyPricingOptionSelectorButton', () => {
  const onPressMock = jest.fn();
  const customViewStyle: ViewStyle = { width: 1 };
  const testID = 'thirdParty-pricing-option-selector-button';
  const props: IThirdPartyPricingOptionSelectorButtonProps = {
    memberPays: 10,
    onPress: onPressMock,
    isSelected: false,
    testID,
    viewStyle: customViewStyle,
  };
  const pricingOptionsContentMock: Partial<IPricingOptionContent> = {
    thirdPartyTitle: 'third-party-title',
    thirdPartySubText: 'third-party-sub-text',
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
      <ThirdPartyPricingOptionSelectorButton {...props} />
    );

    const thirdPartyPricingOptionSelectorButton =
      component.root.findByType(PricingOptionButton);
    expect(thirdPartyPricingOptionSelectorButton).toBeDefined();
  });

  it('should pass correct props', () => {
    const component = renderer.create(
      <ThirdPartyPricingOptionSelectorButton {...props} />
    );

    const thirdPartyPricingOptionSelectorButton =
      component.root.findByType(PricingOptionButton);
    expect(thirdPartyPricingOptionSelectorButton.props.memberPays).toEqual(
      props.memberPays
    );
    expect(thirdPartyPricingOptionSelectorButton.props.title).toEqual(
      pricingOptionsContentMock.thirdPartyTitle
    );
    expect(thirdPartyPricingOptionSelectorButton.props.subText).toEqual(
      pricingOptionsContentMock.thirdPartySubText
    );
    expect(thirdPartyPricingOptionSelectorButton.props.isSelected).toEqual(
      props.isSelected
    );
    expect(thirdPartyPricingOptionSelectorButton.props.onPress).toEqual(
      props.onPress
    );
    expect(thirdPartyPricingOptionSelectorButton.props.viewStyle).toEqual(
      props.viewStyle
    );
    expect(thirdPartyPricingOptionSelectorButton.props.testID).toEqual(
      props.testID
    );
  });
});
