// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import {
  ImageStyle,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ImageInstanceNames } from '../../../theming/assets';
import { ImageAsset } from '../../image-asset/image-asset';

export interface ICloseButtonProps {
  onPress?: () => void;
  imageName: ImageInstanceNames;
  imageStyle?: ImageStyle;
}

export const CloseButton: React.SFC<ICloseButtonProps> = (
  props: ICloseButtonProps
) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.rowViewStyle}>
        <ImageAsset
          name={props.imageName}
          style={[styles.closeButtonImageStyle, props.imageStyle]}
        />
      </View>
    </TouchableOpacity>
  );
};

const rowViewStyle: ViewStyle = {
  alignItems: 'center',
  alignSelf: 'flex-start',
  flexBasis: 0,
  flexDirection: 'row',
  justifyContent: 'center',
};

const closeButtonImageStyle: ImageStyle = {
  alignItems: 'center',
  alignSelf: 'center',
  flexDirection: 'column',
  height: 26,
  justifyContent: 'center',
  resizeMode: 'contain',
  width: 20,
};

const styles = StyleSheet.create({
  closeButtonImageStyle,
  rowViewStyle,
});
