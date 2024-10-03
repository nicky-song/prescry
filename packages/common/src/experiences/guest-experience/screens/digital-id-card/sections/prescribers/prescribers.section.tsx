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
import { IPrescribersSectionContent } from './prescribers.section.content';
import { prescribersSectionStyles } from './prescribers.section.styles';

export interface IPrescribersSectionProps {
  viewStyle?: StyleProp<ViewStyle>;
}

export const PrescribersSection = (
  prescribersSectionProps: IPrescribersSectionProps
): ReactElement => {
  const { viewStyle } = prescribersSectionProps;

  const { content, isContentLoading } = useContent<IPrescribersSectionContent>(
    CmsGroupKey.prescribersSection,
    2
  );

  return (
    <View style={viewStyle}>
      <Heading level={2} isSkeleton={isContentLoading}>
        {content.heading}
      </Heading>
      <View style={prescribersSectionStyles.sectionViewStyle}>
        <View style={prescribersSectionStyles.iconViewStyle}>
          <FontAwesomeIcon
            name='envelope'
            size={IconSize.regular}
            color={PrimaryColor.darkBlue}
          />
        </View>
        <View style={prescribersSectionStyles.textViewStyle}>
          <BaseText
            style={prescribersSectionStyles.labelTextStyle}
            isSkeleton={isContentLoading}
          >
            {content.labelOne}
          </BaseText>
          <BaseText
            style={prescribersSectionStyles.bodyTextStyle}
            isSkeleton={isContentLoading}
          >
            {content.descriptionOne}
          </BaseText>
        </View>
      </View>
      <View style={prescribersSectionStyles.sectionViewStyle}>
        <View style={prescribersSectionStyles.iconViewStyle}>
          <FontAwesomeIcon
            name='paper-plane'
            size={IconSize.regular}
            color={PrimaryColor.darkBlue}
          />
        </View>
        <View style={prescribersSectionStyles.textViewStyle}>
          <BaseText
            style={prescribersSectionStyles.labelTextStyle}
            isSkeleton={isContentLoading}
          >
            {content.labelTwo}
          </BaseText>
          <BaseText
            style={prescribersSectionStyles.bodyTextStyle}
            isSkeleton={isContentLoading}
          >
            {content.descriptionTwo}
          </BaseText>
        </View>
      </View>
    </View>
  );
};
