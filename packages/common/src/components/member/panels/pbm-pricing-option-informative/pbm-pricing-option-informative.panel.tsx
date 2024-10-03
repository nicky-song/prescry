// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { MoneyFormatter } from '../../../../utils/formatters/money-formatter';
import { PricingOptionInformativePanel } from '../pricing-option-informative/pricing-option-informative.panel';
import { IPricingOptionContent } from '../../../../models/cms-content/pricing-options.content';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { StringFormatter } from '../../../../utils/formatters/string.formatter';

export interface IPbmPricingOptionInformativePanelProps {
  memberPays: number;
  planPays: number;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const PbmPricingOptionInformativePanel = ({
  memberPays,
  planPays,
  viewStyle,
  testID = 'pbmPricingOptionInformativePanel',
}: IPbmPricingOptionInformativePanelProps): ReactElement => {
  const {
    content: pricingOptionsContent,
    isContentLoading: pricingOptionsIsContentLoading,
  } = useContent<IPricingOptionContent>(CmsGroupKey.pricingOptions, 2);

  const formattedPlanPays = MoneyFormatter.format(planPays);

  const pricingOptionInformativeSubText = StringFormatter.format(
    pricingOptionsContent.pbmSubText,
    new Map([['planPays', formattedPlanPays]])
  );
  return (
    <PricingOptionInformativePanel
      title={pricingOptionsContent.pbmTitle}
      subText={pricingOptionInformativeSubText}
      memberPays={memberPays}
      isSkeleton={pricingOptionsIsContentLoading}
      viewStyle={viewStyle}
      testID={testID}
    />
  );
};
