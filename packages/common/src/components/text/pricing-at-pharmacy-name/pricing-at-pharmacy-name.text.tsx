// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IAlternativesContent } from '../../../models/cms-content/alternatives-content';
import { BaseText } from '../base-text/base-text';
import { ProtectedBaseText } from '../protected-base-text/protected-base-text';
import { pricingAtPharmacyNameTextStyles } from './pricing-at-pharmacy-name.text.styles';

export interface IPricingAtPharmacyNameTextProps {
  pharmacyName: string;
  viewStyle?: StyleProp<ViewStyle>;
}

export const PricingAtPharmacyNameText = ({
  pharmacyName,
  viewStyle,
}: IPricingAtPharmacyNameTextProps): ReactElement => {
  const groupKey = CmsGroupKey.alternatives;
  const { content, isContentLoading } = useContent<IAlternativesContent>(
    groupKey,
    2
  );
  const pricingAt = content.pricingAt;
  return (
    <View
      style={[
        pricingAtPharmacyNameTextStyles.pricingAtPharmacyNameViewStyles,
        viewStyle,
      ]}
    >
      <BaseText
        style={pricingAtPharmacyNameTextStyles.textStyle}
        isSkeleton={isContentLoading}
      >
        {pricingAt}
        {` `}
      </BaseText>
      <ProtectedBaseText
        style={pricingAtPharmacyNameTextStyles.textStyle}
        isSkeleton={isContentLoading}
      >
        {pharmacyName}
      </ProtectedBaseText>
    </View>
  );
};
