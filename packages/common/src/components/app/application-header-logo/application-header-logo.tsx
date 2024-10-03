// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { ImageAsset } from '../../image-asset/image-asset';
import { applicationHeaderLogoStyles } from './application-header-logo.styles';

export const ApplicationHeaderLogo = (): ReactElement => {
  const brandingInstanceName = 'headerMyPrescryptiveLogo';
  const brandingStyling = applicationHeaderLogoStyles.imageMyPrescryptiveStyle;

  return (
    <ImageAsset
      resizeMode='contain'
      name={brandingInstanceName}
      style={brandingStyling}
    />
  );
};
