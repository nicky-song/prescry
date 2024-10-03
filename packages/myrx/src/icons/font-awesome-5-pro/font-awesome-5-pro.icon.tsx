// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { createIconSet } from '@expo/vector-icons';
import brandsFont from '../../../assets/fonts/FontAwesome5_Pro_Brands.ttf';
import lightFont from '../../../assets/fonts/FontAwesome5_Pro_Light.ttf';
import regularFont from '../../../assets/fonts/FontAwesome5_Pro_Regular.ttf';
import solidFont from '../../../assets/fonts/FontAwesome5_Pro_Solid.ttf';
import glyphMap from '../../../assets/fonts/FontAwesome5Pro.json';
import { ReactElement } from 'react';
import { IFontAwesomeIconProps } from '@phx/common/src/components/icons/font-awesome/font-awesome.icon';

export const FontAwesome5ProIcon = ({
  brand,
  light,
  solid,
  name,
  ...props
}: IFontAwesomeIconProps): ReactElement => {
  if (brand) {
    const BrandsIcon = createIconSet(
      glyphMap,
      'FontAwesome5_Pro_Brands',
      brandsFont
    );
    return <BrandsIcon name={name} {...props} />;
  }

  if (light) {
    const LightIcon = createIconSet(
      glyphMap,
      'FontAwesome5_Pro_Light',
      lightFont
    );
    return <LightIcon name={name} {...props} />;
  }

  if (solid) {
    const SolidIcon = createIconSet(
      glyphMap,
      'FontAwesome5_Pro_Solid',
      solidFont
    );
    return <SolidIcon name={name} {...props} />;
  }

  const RegularIcon = createIconSet(
    glyphMap,
    'FontAwesome5_Pro_Regular',
    regularFont
  );
  return <RegularIcon name={name} {...props} />;
};
