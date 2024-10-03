// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { IPopupModalProps, PopupModal } from './popup-modal';

export default {
  title: 'modals/PopupModal',
  component: PopupModal,
};

const ArgsWrapper: Story<IPopupModalProps> = (args) => (
  <PopupModal {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {};

export const WithTitleContentBothButtons = ArgsWrapper.bind({});
WithTitleContentBothButtons.args = {
  isOpen: true,
  titleText: 'Are you leaving?',
  content: 'If you leave now, your progress won’t be saved.',
  primaryButtonLabel: 'Leave anyway',
  secondaryButtonLabel: 'Stay',
  onPrimaryButtonPress: () => alert('You clicked primary button'),
  onSecondaryButtonPress: () => alert('You clicked secondary button'),
};

export const WithTitleBothButtons = ArgsWrapper.bind({});
WithTitleBothButtons.args = {
  isOpen: true,
  titleText: 'Are you leaving?',
  primaryButtonLabel: 'Leave anyway',
  secondaryButtonLabel: 'Stay',
  onPrimaryButtonPress: () => alert('You clicked primary button'),
  onSecondaryButtonPress: () => alert('You clicked secondary button'),
};

export const WithTitleOneButton = ArgsWrapper.bind({});
WithTitleOneButton.args = {
  isOpen: true,
  titleText: 'Are you leaving?',
  primaryButtonLabel: 'Leave anyway',
  onPrimaryButtonPress: () => alert('You clicked primary button'),
};

export const WithContentOneButton = ArgsWrapper.bind({});
WithContentOneButton.args = {
  isOpen: true,
  content: 'If you leave now, your progress won’t be saved.',
  primaryButtonLabel: 'Leave anyway',
  onPrimaryButtonPress: () => alert('You clicked primary button'),
};

export const WithContentTwoButtons = ArgsWrapper.bind({});
WithContentTwoButtons.args = {
  isOpen: true,
  content: 'If you leave now, your progress won’t be saved.',
  primaryButtonLabel: 'Leave anyway',
  secondaryButtonLabel: 'Stay',
  onPrimaryButtonPress: () => alert('You clicked primary button'),
  onSecondaryButtonPress: () => alert('You clicked secondary button'),
};
