// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { Meta, Story } from '@storybook/react';
import { ILinkButtonProps, LinkButton } from './link.button';
import { BaseText } from '../../text/base-text/base-text';

export default {
  title: 'Buttons/LinkButton',
  component: LinkButton,
  argTypes: { onPress: { action: 'pressed' } },
} as Meta;

const ArgsWrapper: Story<ILinkButtonProps> = (args) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
    <BaseText>before </BaseText>
    <LinkButton {...args} />
    <BaseText> after</BaseText>
  </View>
);

export const Default = ArgsWrapper.bind({});
Default.args = { linkText: 'Sample link text' };
