// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { PricingOptionButton } from '../pricing-option/pricing-option.button';
import { IPricingOptionContent } from '../../../models/cms-content/pricing-options.content';

export interface IThirdPartyPricingOptionSelectorButtonProps {
  memberPays: number;
  isSelected?: boolean;
  onPress: () => void;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const ThirdPartyPricingOptionSelectorButton = ({
  memberPays,
  isSelected = false,
  onPress,
  viewStyle,
  testID = 'thirdPartyPricingOptionSelectorButton',
}: IThirdPartyPricingOptionSelectorButtonProps): ReactElement => {
  const {
    content: pricingOptionsContent,
    isContentLoading: pricingOptionsIsContentLoading,
  } = useContent<IPricingOptionContent>(CmsGroupKey.pricingOptions, 2);

  return (
    <PricingOptionButton
      isSkeleton={pricingOptionsIsContentLoading}
      memberPays={memberPays}
      title={pricingOptionsContent.thirdPartyTitle}
      subText={pricingOptionsContent.thirdPartySubText}
      isSelected={isSelected}
      onPress={onPress}
      viewStyle={viewStyle}
      testID={testID}
    />
  );
};
