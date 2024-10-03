// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IPricingOptionContent } from '../../../models/cms-content/pricing-options.content';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { StringFormatter } from '../../../utils/formatters/string.formatter';
import { PricingOptionButton } from '../pricing-option/pricing-option.button';

export interface IPbmPricingOptionSelectorButtonProps {
  planPays: number;
  memberPays: number;
  isSelected?: boolean;
  onPress: () => void;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const PbmPricingOptionSelectorButton = ({
  memberPays,
  planPays,
  isSelected = false,
  onPress,
  viewStyle,
  testID = 'pbmPricingOptionSelectorButton',
}: IPbmPricingOptionSelectorButtonProps): ReactElement => {
  const {
    content: pricingOptionsContent,
    isContentLoading: pricingOptionsIsContentLoading,
  } = useContent<IPricingOptionContent>(CmsGroupKey.pricingOptions, 2);

  const formattedPlanPays = MoneyFormatter.format(planPays);
  const parameterMap = new Map<string, string>([
    ['planPays', formattedPlanPays],
  ]);

  const formattedSubText = StringFormatter.format(
    pricingOptionsContent.pbmSubText,
    parameterMap
  );

  return (
    <PricingOptionButton
      isSkeleton={pricingOptionsIsContentLoading}
      memberPays={memberPays}
      title={pricingOptionsContent.pbmTitle}
      subText={formattedSubText}
      isSelected={isSelected}
      onPress={onPress}
      viewStyle={viewStyle}
      testID={testID}
    />
  );
};
