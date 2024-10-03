// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { PricingOptionInformativePanel } from '../pricing-option-informative/pricing-option-informative.panel';
import { IPricingOptionContent } from '../../../../models/cms-content/pricing-options.content';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';

export interface ISmartPricePricingOptionInformativePanelProps {
  memberPays: number;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const SmartPricePricingOptionInformativePanel = ({
  memberPays,
  viewStyle,
  testID = 'smartPricePricingOptionInformativePanel',
}: ISmartPricePricingOptionInformativePanelProps): ReactElement => {
  const {
    content: pricingOptionsContent,
    isContentLoading: pricingOptionsIsContentLoading,
  } = useContent<IPricingOptionContent>(CmsGroupKey.pricingOptions, 2);

  return (
    <PricingOptionInformativePanel
      title={pricingOptionsContent.smartPriceTitle}
      subText={pricingOptionsContent.smartPriceSubText}
      memberPays={memberPays}
      isSkeleton={pricingOptionsIsContentLoading}
      viewStyle={viewStyle}
      testID={testID}
    />
  );
};
