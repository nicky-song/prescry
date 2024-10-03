// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';

import { Heading } from '../heading/heading';
import { BaseText } from '../../text/base-text/base-text';
import { LinkButton } from '../../buttons/link/link.button';
import { supportErrorContainerStyles } from './support-error.container.styles';
import { supportErrorContainerContent } from './support-error.container.content';
import {
  RootStackNavigationProp,
  SupportErrorNavigationProp,
} from '../../../experiences/guest-experience/navigation/stack-navigators/root/root.stack-navigator';
import { useNavigation } from '@react-navigation/native';

export interface ISupportErrorScreenContainerProps {
  errorMessage?: string;
}

export interface ISupportErrorScreenContainerActionProps {
  reloadPageAction: (navigation: RootStackNavigationProp) => void;
}

export const SupportErrorScreenContainer = (
  props: ISupportErrorScreenContainerProps &
    ISupportErrorScreenContainerActionProps
): ReactElement => {
  const navigation = useNavigation<SupportErrorNavigationProp>();

  const errorMessage =
    props.errorMessage || supportErrorContainerContent.defaultError;

  const onPress = () => props.reloadPageAction(navigation);

  return (
    <>
      <Heading textStyle={supportErrorContainerStyles.headingTextStyle}>
        {supportErrorContainerContent.title}
      </Heading>
      <BaseText>{errorMessage}</BaseText>
      <LinkButton
        onPress={onPress}
        linkText={supportErrorContainerContent.reloadLinkText}
        viewStyle={supportErrorContainerStyles.reloadLinkViewStyle}
      />
    </>
  );
};
