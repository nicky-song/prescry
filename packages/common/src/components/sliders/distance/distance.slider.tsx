// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { BaseSlider, IBaseSliderProps } from '../base/base.slider';
import { distanceSliderContent as content } from './distance.slider.content';

type PositionProps = 'defaultPosition' | 'maximumPosition' | 'minimumPosition';

type OptionalBaseSliderProps = Partial<Pick<IBaseSliderProps, PositionProps>>;

export type IDistanceSliderProps = Omit<
  IBaseSliderProps,
  'showCurrentValue' | PositionProps
> &
  OptionalBaseSliderProps;

const defaultDistanceSliderMinimumPosition = 1;
const defaultDistanceSliderSelectedPosition = 25;
export const defaultDistanceSliderMaximumPosition = 100;

export const DistanceSlider = ({
  onSelectedValue,
  defaultPosition = defaultDistanceSliderSelectedPosition,
  minimumPosition = defaultDistanceSliderMinimumPosition,
  maximumPosition = defaultDistanceSliderMaximumPosition,
  unit = content.defaultUnit,
  ...props
}: IDistanceSliderProps) => (
  <BaseSlider
    {...props}
    onSelectedValue={onSelectedValue}
    defaultPosition={defaultPosition}
    minimumPosition={minimumPosition}
    maximumPosition={maximumPosition}
    showCurrentValue={true}
    unit={unit}
  />
);
