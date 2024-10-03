// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { BaseText } from '../../../text/base-text/base-text';
import { noPricePricingOptionInformativePanelStyles } from './no-price-pricing-option-informative.panel.styles';
import { TranslatableView } from '../../../containers/translated-view/translatable-view';
import { IPricingOptionContent } from '../../../../models/cms-content/pricing-options.content';

export interface INoPricePricingOptionInformativePanelProps {
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const NoPricePricingOptionInformativePanel = ({
  viewStyle,
  testID = 'noPricePricingOptionInformativePanel',
}: INoPricePricingOptionInformativePanelProps): ReactElement => {
  const { panelViewStyle } = noPricePricingOptionInformativePanelStyles;

  const {
    content: pricingOptionsContent,
    isContentLoading: pricingOptionsIsContentLoading,
  } = useContent<IPricingOptionContent>(CmsGroupKey.pricingOptions, 2);

  return (
    <TranslatableView style={[panelViewStyle, viewStyle]} testID={testID}>
      <BaseText isSkeleton={pricingOptionsIsContentLoading}>
        {pricingOptionsContent.noPriceLabel}
      </BaseText>
    </TranslatableView>
  );
};
