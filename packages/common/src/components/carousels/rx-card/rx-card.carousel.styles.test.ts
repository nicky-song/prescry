// Copyright 2023 Prescryptive Health, Inc.

import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  rxIdCardMaxHeight,
  rxIdCardMaxWidth,
  rxIdCardMinHeight,
  rxIdCardMinWidth,
} from '../../cards/rx-id-card/rx-id-card.styles';
import {
  cardShadowRadius,
  twoCardMaxWidth,
  rxCardCarouselViewStyleStyles,
} from './rx-card.carousel.styles'

describe('rxCardCarouselStyles', () => {
  
  it('has expected styles', () => {
    expect(rxCardCarouselViewStyleStyles).toEqual({
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
    });
  });
});
