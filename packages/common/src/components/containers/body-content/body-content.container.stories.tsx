// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import {
  BodyContentContainer,
  IBodyContentContainerProps,
} from './body-content.container';
import { BaseText } from '../../text/base-text/base-text';

export default {
  title: 'Containers/BodyContentContainer',
  component: BodyContentContainer,
};

const ArgsWrapper: Story<IBodyContentContainerProps> = (args) => (
  <BodyContentContainer {...args} />
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  children: (
    <BaseText>
      This content has standard screen body padding vertical and horizontal.
      Bacon ipsum dolor amet biltong picanha fatback short loin corned beef
      shoulder. Pork chop hamburger beef ribs, meatball t-bone bresaola strip
      steak leberkas shankle. Porchetta prosciutto tongue, pastrami jerky jowl
      fatback chuck landjaeger short ribs shankle kevin. Salami burgdoggen
      bresaola beef ribs cupim sausage jowl strip steak short ribs meatloaf
      pancetta filet mignon beef picanha shoulder. Burgdoggen chicken doner,
      strip steak turducken drumstick beef tenderloin fatback chuck tail bacon
      ribeye rump ham hock. Beef ribs shankle flank, kevin pancetta brisket cow.
    </BaseText>
  ),
};

export const Title = ArgsWrapper.bind({});
Title.storyName = 'With title';
Title.args = {
  title: 'Sample title',
  children: (
    <BaseText>
      This content has standard screen body padding vertical and horizontal.
      Bacon ipsum dolor amet biltong picanha fatback short loin corned beef
      shoulder. Pork chop hamburger beef ribs, meatball t-bone bresaola strip
      steak leberkas shankle. Porchetta prosciutto tongue, pastrami jerky jowl
      fatback chuck landjaeger short ribs shankle kevin. Salami burgdoggen
      bresaola beef ribs cupim sausage jowl strip steak short ribs meatloaf
      pancetta filet mignon beef picanha shoulder. Burgdoggen chicken doner,
      strip steak turducken drumstick beef tenderloin fatback chuck tail bacon
      ribeye rump ham hock. Beef ribs shankle flank, kevin pancetta brisket cow.
    </BaseText>
  ),
};

export const TitleWithFalseColorBackground = ArgsWrapper.bind({});
TitleWithFalseColorBackground.storyName = 'With title (false color background)';
TitleWithFalseColorBackground.args = {
  title: 'Sample title',
  children: (
    <BaseText>
      This content has standard screen body padding vertical and horizontal.
      Bacon ipsum dolor amet biltong picanha fatback short loin corned beef
      shoulder. Pork chop hamburger beef ribs, meatball t-bone bresaola strip
      steak leberkas shankle. Porchetta prosciutto tongue, pastrami jerky jowl
      fatback chuck landjaeger short ribs shankle kevin. Salami burgdoggen
      bresaola beef ribs cupim sausage jowl strip steak short ribs meatloaf
      pancetta filet mignon beef picanha shoulder. Burgdoggen chicken doner,
      strip steak turducken drumstick beef tenderloin fatback chuck tail bacon
      ribeye rump ham hock. Beef ribs shankle flank, kevin pancetta brisket cow.
    </BaseText>
  ),
  viewStyle: {
    backgroundColor: 'lightgray',
  },
};
