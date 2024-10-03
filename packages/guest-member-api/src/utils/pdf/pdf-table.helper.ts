// Copyright 2022 Prescryptive Health, Inc.

import { GrayScaleColor, PrimaryColor } from '@phx/common/src/theming/colors';
import { Spacing } from '@phx/common/src/theming/spacing';
import { ContentTable, CustomTableLayout } from 'pdfmake/interfaces';

export const bodyFillColor = (index: number): string =>
  index % 2 ? GrayScaleColor.lightGray : GrayScaleColor.white;

export const hLineColor = (i: number, node: ContentTable): string =>
  i === 0 || i === node.table.body.length
    ? PrimaryColor.prescryptivePurple
    : GrayScaleColor.borderLines;

export const vLineColor = (i: number, node: ContentTable): string =>
  i === 0 || i === node.table.body[0].length
    ? PrimaryColor.prescryptivePurple
    : '';

export const vLineWidth = (i: number, node: ContentTable): number =>
  i === 0 || i === node.table.body[0].length ? 1 : 0;

export const paddingLeft = (i: number, _node: ContentTable): number =>
  i === 0 ? Spacing.base : Spacing.half;

export const paddingRight = (i: number, node: ContentTable): number =>
  i === node.table.body[0].length - 1 ? Spacing.base : Spacing.half;

export const customTableLayout: CustomTableLayout = {
  hLineColor,
  vLineWidth,
  vLineColor,
  paddingLeft,
  paddingRight,
};
