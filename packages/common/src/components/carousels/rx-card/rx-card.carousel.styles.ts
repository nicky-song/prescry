// Copyright 2023 Prescryptive Health, Inc.

import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  rxIdCardMaxHeight,
  rxIdCardMaxWidth,
  rxIdCardMinHeight,
  rxIdCardMinWidth,
} from '../../cards/rx-id-card/rx-id-card.styles';

export const cardShadowRadius = 8;
export const cardGap = 16;

const oneCardMaxWidth = rxIdCardMaxWidth + cardShadowRadius + cardGap;
const twoCardMinWidth = (rxIdCardMinWidth + cardShadowRadius) * 2 + cardGap;
export const twoCardMaxWidth = (rxIdCardMaxWidth + cardShadowRadius) * 2 + cardGap;

export const getSlidesPerView = (
  windowWidth: number,
  viewStyle: StyleProp<ViewStyle>
): number => {
  const viewCss = StyleSheet.flatten(viewStyle);

  const viewMarginWidth = 
    (viewCss?.marginLeft ? Number(viewCss.marginLeft) : 0) + 
    (viewCss?.marginRight ? Number(viewCss.marginRight) : 0);

  const viewWidth = windowWidth - viewMarginWidth;
  
  if (viewWidth <= oneCardMaxWidth) {
    return 1.12;
  }
  else if (viewWidth < twoCardMinWidth) {
    return 1.12 + ((viewWidth - oneCardMaxWidth) / oneCardMaxWidth);
  }
  else {
    return 2;
  }
};

export interface IRxCardCarouselStyles {
  carouselViewStyle: ViewStyle,
  carouselViewStyle_singleCard: ViewStyle,
  swiperViewStyle: ViewStyle,
  cardViewStyle: ViewStyle,
  cardViewStyle_single: ViewStyle,
  paginationViewStyle: ViewStyle,
}

export const rxCardCarouselViewStyleStyles: IRxCardCarouselStyles = {
  carouselViewStyle: {
    maxWidth: twoCardMaxWidth,
    minWidth: rxIdCardMinWidth + cardShadowRadius,
  },
  carouselViewStyle_singleCard: {
    maxWidth: rxIdCardMaxWidth + cardShadowRadius,
  },
  swiperViewStyle: {
    flexDirection: 'row',
    maxHeight: rxIdCardMaxHeight + cardShadowRadius,
    minHeight: rxIdCardMinHeight + cardShadowRadius,
  },
  cardViewStyle: {
    borderRadius: BorderRadius.times1pt5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: cardShadowRadius,
    shadowColor: GrayScaleColor.black,
    shadowOpacity: 0.15,
    minWidth: rxIdCardMinWidth * 0.9,
    width: `calc(100% - ${cardShadowRadius}px)`,
    height: `calc(100% - ${cardShadowRadius}px)`,
    marginLeft: 4,
    marginTop: 2,
  },
  cardViewStyle_single: {
    minWidth: rxIdCardMinWidth,
  },
  paginationViewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: Spacing.times1pt5,
    marginBottom: -Spacing.half,
  },
};
