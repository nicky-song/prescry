// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { CardContainer, ICardContainerProps } from './card.container';
import { List } from '../../primitives/list';
import { BaseText } from '../../text/base-text/base-text';

export default {
  title: 'Containers/CardContainer',
  component: CardContainer,
};

const ArgsWrapper: Story<ICardContainerProps> = (args) => {
  return args.isSingleton ? (
    <CardContainer {...args}>
      <BaseText>This should be rendered in a div tag</BaseText>
    </CardContainer>
  ) : (
    <List>
      <CardContainer {...args}>
        <BaseText>This should be rendered in an li tag</BaseText>
      </CardContainer>
    </List>
  );
};

export const AsListItem = ArgsWrapper.bind({});
AsListItem.args = {
  isSingleton: false,
};

export const AsSingleton = ArgsWrapper.bind({});
AsSingleton.args = {
  isSingleton: true,
};
