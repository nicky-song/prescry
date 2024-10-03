// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { ImageInstanceNames } from '../../../../theming/assets';
import { ImageAsset } from '../../../image-asset/image-asset';
import { ListItem } from '../../../primitives/list-item';
import { BaseText } from '../../../text/base-text/base-text';
import { illustratedListItemStyles } from './illustrated.list-item.styles';

export interface IIllustratedListItemProps {
  imageName: ImageInstanceNames;
  imageStyle: StyleProp<ImageStyle>;
  description: string;
  viewStyle?: StyleProp<ViewStyle>;
  isSkeleton?: boolean;
}

export const IllustratedListItem = ({
  imageName,
  imageStyle,
  description,
  viewStyle,
  isSkeleton,
}: IIllustratedListItemProps): ReactElement => {
  return (
    <ListItem style={[illustratedListItemStyles.viewStyle, viewStyle]}>
      <ImageAsset name={imageName} resizeMode='contain' style={imageStyle} />
      <BaseText
        style={illustratedListItemStyles.descriptionTextStyle}
        isSkeleton={isSkeleton}
      >
        {description}
      </BaseText>
    </ListItem>
  );
};
