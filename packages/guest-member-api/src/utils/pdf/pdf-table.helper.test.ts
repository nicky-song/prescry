// Copyright 2022 Prescryptive Health, Inc.

import { GrayScaleColor, PrimaryColor } from '@phx/common/src/theming/colors';
import { Spacing } from '@phx/common/src/theming/spacing';
import { ContentTable, CustomTableLayout, TableCell } from 'pdfmake/interfaces';
import {
  bodyFillColor,
  customTableLayout,
  hLineColor,
  paddingLeft,
  paddingRight,
  vLineColor,
  vLineWidth,
} from './pdf-table.helper';

describe('pdfTableHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('bodyFillColor', () => {
    it.each([
      [0, GrayScaleColor.white],
      [1, GrayScaleColor.lightGray],
      [2, GrayScaleColor.white],
      [3, GrayScaleColor.lightGray],
    ])(
      'returns fill color for table body row %p',
      (rowNumberMock: number, expectedColor: string) => {
        expect(bodyFillColor(rowNumberMock)).toEqual(expectedColor);
      }
    );
  });

  describe('hLineColor', () => {
    it.each([
      [0, PrimaryColor.prescryptivePurple],
      [1, GrayScaleColor.borderLines],
      [2, GrayScaleColor.borderLines],
      [3, GrayScaleColor.borderLines],
      [4, PrimaryColor.prescryptivePurple],
    ])(
      'returns horizontal line color for line number %p',
      (lineNumberMock: number, expectedColor: string) => {
        const rowMock: TableCell[] = [{}];

        const contentTableMock: ContentTable = {
          table: {
            body: [rowMock, rowMock, rowMock, rowMock],
          },
        };

        expect(hLineColor(lineNumberMock, contentTableMock)).toEqual(
          expectedColor
        );
      }
    );
  });

  describe('vLineColor', () => {
    it.each([
      [0, PrimaryColor.prescryptivePurple],
      [1, ''],
      [2, ''],
      [3, ''],
      [4, PrimaryColor.prescryptivePurple],
    ])(
      'returns vertical line color for line number %p',
      (lineNumberMock: number, expectedColor: string) => {
        const rowMock: TableCell[] = [{}, {}, {}, {}];

        const contentTableMock: ContentTable = {
          table: {
            body: [rowMock],
          },
        };

        expect(vLineColor(lineNumberMock, contentTableMock)).toEqual(
          expectedColor
        );
      }
    );
  });

  describe('vLineWidth', () => {
    it.each([
      [0, 1],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 1],
    ])(
      'returns vertical line width for line number %p',
      (lineNumberMock: number, expectedWidth: number) => {
        const rowMock: TableCell[] = [{}, {}, {}, {}];

        const contentTableMock: ContentTable = {
          table: {
            body: [rowMock],
          },
        };

        expect(vLineWidth(lineNumberMock, contentTableMock)).toEqual(
          expectedWidth
        );
      }
    );
  });

  describe('paddingLeft', () => {
    it.each([
      [0, Spacing.base],
      [1, Spacing.half],
      [2, Spacing.half],
    ])(
      'returns left padding for column number %p',
      (columnNumberMock: number, expectedPadding: number) => {
        const contentTableMock: ContentTable = {
          table: {
            body: [],
          },
        };

        expect(paddingLeft(columnNumberMock, contentTableMock)).toEqual(
          expectedPadding
        );
      }
    );
  });

  describe('paddingRight', () => {
    it.each([
      [0, Spacing.half],
      [1, Spacing.half],
      [2, Spacing.half],
      [3, Spacing.base],
    ])(
      'returns right padding for column number %p',
      (columnNumberMock: number, expectedPadding: number) => {
        const rowMock: TableCell[] = [{}, {}, {}, {}];

        const contentTableMock: ContentTable = {
          table: {
            body: [rowMock],
          },
        };

        expect(paddingRight(columnNumberMock, contentTableMock)).toEqual(
          expectedPadding
        );
      }
    );
  });

  describe('customTableLayout', () => {
    it('defines custom layout', () => {
      const expectedTableLayout: CustomTableLayout = {
        hLineColor,
        vLineWidth,
        vLineColor,
        paddingLeft,
        paddingRight,
      };

      expect(customTableLayout).toEqual(expectedTableLayout);
    });
  });
});
