// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { LanguageSideMenuDrawerItem, ILanguageSideMenuDrawerItemProps } from './language.side-menu.drawer-item';

export default {
  title: 'drawer items/LanguageSideMenuDrawerItem',
  component: LanguageSideMenuDrawerItem,
  argTypes: { onPress: { action: 'pressed' } },
};

const ArgsWrapper: Story<ILanguageSideMenuDrawerItemProps> = (args) => <LanguageSideMenuDrawerItem {...args} />;

export const Default = ArgsWrapper.bind({});
Default.args = {
  label: 'Language',
  languageName: 'English',
};

export const Spanish = ArgsWrapper.bind({});
Spanish.args = {
  label: 'Idioma',
  languageName: 'Español',
};