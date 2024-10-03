// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { ViewStyle, View, StyleProp } from 'react-native';
import { FontAwesomeIcon } from '../../../../../../components/icons/font-awesome/font-awesome.icon';
import { Heading } from '../../../../../../components/member/heading/heading';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { PrimaryColor } from '../../../../../../theming/colors';
import { IconSize } from '../../../../../../theming/icons';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { IPharmaciesSectionContent } from './pharmacies.section.content';
import { pharmaciesSectionStyles } from './pharmacies.section.styles';

export interface IPharmaciesSectionProps {
  viewStyle?: StyleProp<ViewStyle>;
}

export const PharmaciesSection = (
  pharmaciesSectionProps: IPharmaciesSectionProps
): ReactElement => {
  const { viewStyle } = pharmaciesSectionProps;

  const { content, isContentLoading } = useContent<IPharmaciesSectionContent>(
    CmsGroupKey.pharmaciesSection,
    2
  );

  return (
    <View style={viewStyle}>
      <Heading level={2} isSkeleton={isContentLoading}>
        {content.heading}
      </Heading>
      <View style={pharmaciesSectionStyles.sectionViewStyle}>
        <View style={pharmaciesSectionStyles.iconViewStyle}>
          <FontAwesomeIcon
            name='phone-alt'
            size={IconSize.regular}
            color={PrimaryColor.darkBlue}
          />
        </View>
        <View style={pharmaciesSectionStyles.textViewStyle}>
          <BaseText
            style={pharmaciesSectionStyles.labelTextStyle}
            isSkeleton={isContentLoading}
          >
            {content.label}
          </BaseText>
          <BaseText
            style={pharmaciesSectionStyles.bodyTextStyle}
            isSkeleton={isContentLoading}
          >
            {content.description}
          </BaseText>
        </View>
      </View>
    </View>
  );
};
