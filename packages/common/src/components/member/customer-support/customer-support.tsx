// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { BaseText } from '../../text/base-text/base-text';
import { InlineLink } from '../links/inline/inline.link';
import { customerSupportStyle } from './customer-support.style';
import { PrimaryColor } from '../../../theming/colors';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { IconSize } from '../../../theming/icons';
import { showTalkativeElementStyleDisplay } from '../../../hooks/use-talkative-widget/helpers/show-talkative-element-style-display';
import { hideTalkativeElementStyleDisplay } from '../../../hooks/use-talkative-widget/helpers/hide-talkative-element-style-display';

export interface ICustomerSupportProps {
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const CustomerSupport = (props: ICustomerSupportProps) => {
  const globalGroupKey = CmsGroupKey.global;
  const { content: globalContent, isContentLoading: isGlobalContentLoading } =
    useContent<IGlobalContent>(globalGroupKey, 2);

  useEffect(() => {
    return () => {
      hideTalkativeElementStyleDisplay();
    };
  }, []);

  const onContactUsPress = () => {
    showTalkativeElementStyleDisplay({
      showHeader: false,
      forceExpandedView: true,
    });
  };

  return (
    <View
      style={[
        customerSupportStyle.customerSupportContainerViewStyle,
        props.viewStyle,
      ]}
    >
      <FontAwesomeIcon
        name='headphones'
        size={IconSize.regular}
        color={PrimaryColor.darkBlue}
        style={customerSupportStyle.iconImageStyle}
      />
      <View style={customerSupportStyle.textContainerViewStyle}>
        <BaseText
          isSkeleton={isGlobalContentLoading}
          skeletonWidth='medium'
          style={customerSupportStyle.prescryptiveHelpTextStyle}
        >
          {globalContent.prescryptiveHelp}
        </BaseText>
        <BaseText
          isSkeleton={isGlobalContentLoading}
          skeletonWidth='long'
          style={customerSupportStyle.supportTextStyle}
        >
          <InlineLink onPress={onContactUsPress} testID={props.testID}>
            {globalContent.supportLinkedText}
          </InlineLink>{' '}
          {globalContent.supportUnlinkedText}
        </BaseText>
      </View>
    </View>
  );
};
