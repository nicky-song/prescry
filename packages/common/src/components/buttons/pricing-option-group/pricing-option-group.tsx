// Copyright 2023 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { ViewStyle, StyleProp, View } from 'react-native';
import { PricingOption } from '../../../models/pricing-option';
import { PbmPricingOptionSelectorButton } from '../pbm-pricing-option-selector/pbm-pricing-option-selector.button';
import { SmartPricePricingOptionSelectorButton } from '../smart-price-pricing-option-selector/smart-price-pricing-option-selector.button';
import { ThirdPartyPricingOptionSelectorButton } from '../third-party-pricing-option-selector/third-party-pricing-option-selector.button';
import { pricingOptionGroupStyle } from './pricing-option-group.styles';

export interface IPricingOptionSelectorOption {
  pricingOption: PricingOption;
  memberPays: number;
  planPays?: number;
}

export interface IPricingOptionGroupProps {
  selected?: PricingOption;
  onSelect: (selectedOption: PricingOption) => void;
  options: IPricingOptionSelectorOption[];
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const PricingOptionGroup = ({
  selected,
  onSelect,
  options,
  viewStyle,
  testID = 'pricingOptionGroup',
}: IPricingOptionGroupProps) => {
  const { defaultViewStyle } = pricingOptionGroupStyle;

  const [selectedOption, setSelectedOption] = useState(selected);

  useEffect(() => {
    if (!selected) {
      setSelectedOption(selected);
    }
  }, [selected]);

  const renderOptions = () => {
    return options.map((option, index) => {
      const onPress = () => {
        onSelect(option.pricingOption);
        setSelectedOption(option.pricingOption);
      };

      if (option.pricingOption === 'pbm') {
        return (
          <PbmPricingOptionSelectorButton
            key={`${option.pricingOption}-${index}`}
            viewStyle={defaultViewStyle}
            isSelected={selectedOption === option.pricingOption}
            memberPays={option.memberPays}
            planPays={option.planPays ?? 0}
            onPress={onPress}
          />
        );
      }

      if (option.pricingOption === 'smartPrice') {
        return (
          <SmartPricePricingOptionSelectorButton
            key={`${option.pricingOption}-${index}`}
            viewStyle={defaultViewStyle}
            isSelected={selectedOption === option.pricingOption}
            memberPays={option.memberPays}
            onPress={onPress}
          />
        );
      }

      return (
        <ThirdPartyPricingOptionSelectorButton
          key={`${option.pricingOption}-${index}`}
          viewStyle={defaultViewStyle}
          isSelected={selectedOption === option.pricingOption}
          memberPays={option.memberPays}
          onPress={onPress}
        />
      );
    });
  };

  return (
    <View testID={testID} accessibilityRole='radiogroup' style={viewStyle}>
      {renderOptions()}
    </View>
  );
};
