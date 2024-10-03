// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Story } from '@storybook/react';
import { LoadingOverlay, ILoadingOverlayProps } from './loading.overlay';
import { BaseText } from '../../text/base-text/base-text';

export default {
  title: 'Overlays/LoadingOverlay',
  component: LoadingOverlay,
};

const ArgsWrapper: Story<ILoadingOverlayProps> = (args) => (
  <>
    <BaseText>
      Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De
      carne lumbering animata corpora quaeritis. Summus brains sit, morbo vel
      maleficia? De apocalypsi gorger omero undead survivor dictum mauris. Hi
      mindless mortuis soulless creaturas, imo evil stalking monstra adventus
      resi dentevil vultus comedat cerebella viventium. Qui animated corpse,
      cricket bat max brucks terribilem incessu zomby. The voodoo sacerdos flesh
      eater, suscitat mortuos comedere carnem virus. Zonbi tattered for solum
      oculi eorum defunctis go lum cerebro. Nescio brains an Undead zombies.
      Sicut malus putrid voodoo horror. Nigh tofth eliv ingdead.
    </BaseText>
    <LoadingOverlay {...args} />
  </>
);

export const Default = ArgsWrapper.bind({});
Default.storyName = 'Default (no message)';
Default.args = {};

export const ShowMessage = ArgsWrapper.bind({});
ShowMessage.storyName = 'Show default message';
ShowMessage.args = { showMessage: true };

export const ShowCustomMessage = ArgsWrapper.bind({});
ShowCustomMessage.storyName = 'Show custom message';
ShowCustomMessage.args = {
  showMessage: true,
  message: 'Sample custom message.',
};
