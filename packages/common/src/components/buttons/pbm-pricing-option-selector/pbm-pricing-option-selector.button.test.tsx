// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { StringFormatter } from '../../../utils/formatters/string.formatter';
import { PricingOptionButton } from '../pricing-option/pricing-option.button';
import {
  PbmPricingOptionSelectorButton,
  IPbmPricingOptionSelectorButtonProps,
} from './pbm-pricing-option-selector.button';
import { IPricingOptionContent } from '../../../models/cms-content/pricing-options.content';

jest.mock('../pricing-option/pricing-option.button', () => ({
  PricingOptionButton: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../../../utils/formatters/string.formatter');
const formatMock = StringFormatter.format as jest.Mock;

describe('PbmPricingOptionSelectorButton', () => {
  const onPressMock = jest.fn();
  const customViewStyle: ViewStyle = { width: 1 };
  const testID = 'pbm-pricing-option-selector-button';
  const props: IPbmPricingOptionSelectorButtonProps = {
    memberPays: 10,
    planPays: 5,
    onPress: onPressMock,
    isSelected: false,
    testID,
    viewStyle: customViewStyle,
  };
  const pricingOptionsContentMock: Partial<IPricingOptionContent> = {
    pbmTitle: 'pbm-title',
    pbmSubText: 'pbm-sub-text',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useContentMock.mockReturnValue({
      isContentLoading: false,
      content: pricingOptionsContentMock,
    });
    formatMock.mockReturnValue(pricingOptionsContentMock.pbmSubText);
  });

  it('renders correctly', () => {
    const component = renderer.create(
      <PbmPricingOptionSelectorButton {...props} />
    );

    const pbmPricingOptionSelectorButton =
      component.root.findByType(PricingOptionButton);
    expect(pbmPricingOptionSelectorButton).toBeDefined();
  });

  it('should pass correct props', () => {
    const component = renderer.create(
      <PbmPricingOptionSelectorButton {...props} />
    );

    const pbmPricingOptionSelectorButton =
      component.root.findByType(PricingOptionButton);
    expect(pbmPricingOptionSelectorButton.props.memberPays).toEqual(
      props.memberPays
    );
    expect(pbmPricingOptionSelectorButton.props.title).toEqual(
      pricingOptionsContentMock.pbmTitle
    );
    expect(pbmPricingOptionSelectorButton.props.subText).toEqual(
      pricingOptionsContentMock.pbmSubText
    );
    expect(pbmPricingOptionSelectorButton.props.isSelected).toEqual(
      props.isSelected
    );
    expect(pbmPricingOptionSelectorButton.props.onPress).toEqual(props.onPress);
    expect(pbmPricingOptionSelectorButton.props.viewStyle).toEqual(
      props.viewStyle
    );
    expect(pbmPricingOptionSelectorButton.props.testID).toEqual(props.testID);
  });
});
