// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { BaseText } from '../../text/base-text/base-text';
import { InlineLink } from '../links/inline/inline.link';
import { PrimaryColor } from '../../../theming/colors';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { callPhoneNumber } from '../../../utils/link.helper';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { ICommunicationContent } from '../../../models/cms-content/communication.content';
import { IconSize } from '../../../theming/icons';
import { needHelpSectionStyles } from './need-help.section.styles';

export interface INeedHelpSectionProps {
  isSieMember?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const NeedHelpSection = (props: INeedHelpSectionProps) => {
  const globalGroupKey = CmsGroupKey.global;
  const { content: globalContent, isContentLoading: isGlobalContentLoading } =
    useContent<IGlobalContent>(globalGroupKey, 2);

  const communicationGroupKey = CmsGroupKey.communication;
  const {
    content: communicationContent,
    isContentLoading: isCommunicationContentLoading,
  } = useContent<ICommunicationContent>(
    communicationGroupKey,
    2,
    undefined,
    true
  );

  const onContactUsPress = async () => {
    if (communicationContent && !isCommunicationContentLoading) {
      const supportPhoneNumber = props.isSieMember
        ? communicationContent.supportPBMPhone
        : communicationContent.supportCashPhone;

      await callPhoneNumber(supportPhoneNumber);
    }
  };

  return (
    <View style={[needHelpSectionStyles.containerViewStyle, props.viewStyle]}>
      <FontAwesomeIcon
        name='headphones'
        size={IconSize.regular}
        color={PrimaryColor.darkBlue}
        style={needHelpSectionStyles.iconImageStyle}
      />
      <BaseText isSkeleton={isGlobalContentLoading} skeletonWidth='long'>
        {globalContent.needHelp}{' '}
        <InlineLink onPress={onContactUsPress} testID={props.testID}>
          {globalContent.contactUs}
        </InlineLink>
      </BaseText>
    </View>
  );
};
