// Copyright 2022 Prescryptive Health, Inc.

import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  baseSliderStyles,
  pointerStyles,
  IBaseSliderStyles,
  IPointerStyles,
  pointerDimensions,
  IPointerDimensions,
  TickMarkColors,
} from './base.slider.styles';

const {
  outsideDiameter,
  insideDiameter,
  outsideRadius,
  insideRadius,
  insideMargin,
}: IPointerDimensions = pointerDimensions(30);

describe('getPointerStyles', () => {
  it('returns expected styles', () => {
    const expectedPointerStyles: IPointerStyles = {
      outsideViewStyle: {
        height: outsideDiameter,
        width: outsideDiameter,
        borderRadius: outsideRadius,
        backgroundColor: PrimaryColor.prescryptivePurple,
      },
      insideViewStyle: {
        height: insideDiameter,
        width: insideDiameter,
        borderRadius: insideRadius,
        marginTop: insideMargin,
        marginBottom: insideMargin,
        marginLeft: insideMargin,
        backgroundColor: GrayScaleColor.white,
      },
      pointerAndPositionViewStyle: {
        zIndex: 1,
        marginLeft: -7,
        marginBottom: -17,
      },
      cursorViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 64,
        marginLeft: -1,
      },
    };

    expect(pointerStyles).toEqual(expectedPointerStyles);
  });
});

describe('baseSliderStyle', () => {
  it('has expected slider styles', () => {
    const expectedBaseSliderStyle: IBaseSliderStyles = {
      sliderViewStyle: {
        maxHeight: 64,
      },
      barViewStyle: {
        height: 6,
        backgroundColor: GrayScaleColor.disabledGray,
        borderRadius: 3,
        zIndex: -1,
        marginRight: 24,
        marginLeft: 24,
      },
      barFillViewStyle: {
        height: 6,
        backgroundColor: PrimaryColor.prescryptivePurple,
        borderRadius: 3,
      },
      valueTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        marginBottom: Spacing.quarter,
      },
      tickMarkViewStyle: expect.any(Function),
      tickMarkContainerViewStyle: expect.any(Function),
      tickMarkTextStyle: expect.any(Function),
    };

    expect(baseSliderStyles).toEqual(expectedBaseSliderStyle);
  });

  it.each([[PrimaryColor.prescryptivePurple], [GrayScaleColor.disabledGray]])(
    'has expected tickMarkViewStyle (tickMarkColor: %s)',
    (tickMarkColor: unknown) => {
      const tickMarkViewStyle = baseSliderStyles.tickMarkViewStyle(
        tickMarkColor as TickMarkColors
      );

      expect(tickMarkViewStyle).toEqual({
        height: 14,
        width: 14,
        borderRadius: 7,
        backgroundColor: tickMarkColor,
      });
    }
  );

  it.each([
    [0, 10],
    [1, 20],
    [2, 30],
    [3, 40],
  ])(
    'has expected tickMarkContainerViewStyle (index: %d, barSegmentMargin: %d)',
    (index: number, barSegmentMargin: number) => {
      const tickMarkContainerViewStyle =
        baseSliderStyles.tickMarkContainerViewStyle(index, barSegmentMargin);

      expect(tickMarkContainerViewStyle).toEqual({
        position: 'absolute',
        zIndex: -2 * index,
        marginLeft: barSegmentMargin - 7,
        marginTop: -4,
      });
    }
  );

  it.each([[0], [1], [2], [3]])(
    'has expected tickMarkTextStyle (index: %d)',
    (index: number) => {
      const tickMarkTextStyle = baseSliderStyles.tickMarkTextStyle(index);

      expect(tickMarkTextStyle).toEqual({
        marginTop: 12,
        marginLeft: index ? -2 : 2,
      });
    }
  );
});
