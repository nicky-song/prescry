// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { SlideUpModal, ISlideUpModalProps } from './slide-up.modal';
import { BaseText } from '../../text/base-text/base-text';

export default {
  title: 'Modals/SlideUpModal',
  component: SlideUpModal,
  argTypes: { onClosePress: { action: 'close pressed' } },
};

const ArgsWrapper: Story<ISlideUpModalProps> = (args) => (
  <>
    <BaseText>
      Some content that should be underneath the modal content.
    </BaseText>
    <SlideUpModal {...args} />
  </>
);

export const Default = ArgsWrapper.bind({});
Default.args = {
  heading: 'Sample heading',
  children: (
    <BaseText>
      Beef chicken pork bacon chuck shortloin sirloin shank porkbelly meatloaf,
      doner turkey ut officia laboris ribeye deserunt porchetta porkchop, anim
      irure hamburger tongue veniam consequat minim cornedbeef stripsteak.
      Bresaola sint in chicken shankle ribeye dolore hamburger reprehenderit
      culpa, est pig commodo consequat duis turducken turkey, proident id
      cornedbeef cupidatat rump minim enim bacon. Porchetta turkey ham excepteur
      turducken
    </BaseText>
  ),
};
