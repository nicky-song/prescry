// Copyright 2022 Prescryptive Health, Inc.

import { FontSize } from '@phx/common/src/theming/fonts';
import { Spacing } from '@phx/common/src/theming/spacing';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import dateFormatter from '@phx/common/src/utils/formatters/date.formatter';
import { Content } from 'pdfmake/interfaces';
import {
  buildPdfFooterWithPageAndDate,
  buildPdfServiceFooter,
  IPdfFooterWithPageAndDateContent,
  IPdfServiceFooterContent,
} from './pdf-footer.helper';

jest.mock('@phx/common/src/utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

describe('pdfFooterHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buildPdfFooterWithPageAndDate', () => {
    it('builds footer', () => {
      const currentPageMock = 2;
      const totalPagesMock = 5;

      const contentMock: IPdfFooterWithPageAndDateContent = {
        dateFooterFormat: 'printed on {date}',
        pageFooterFormat: 'page {current} of {total}',
      };

      const nowMock = new Date();
      getNewDateMock.mockReturnValue(nowMock);

      const footer = buildPdfFooterWithPageAndDate(
        currentPageMock,
        totalPagesMock,
        contentMock
      );

      const expected: Content = {
        fontSize: FontSize.xSmall,
        margin: [0, Spacing.base, 0, 0],
        columns: [
          {
            text: `page ${currentPageMock} of ${totalPagesMock}`,
            margin: [Spacing.base, 0, 0, 0],
          },
          {
            text: `printed on ${dateFormatter.formatToMMDDYYYY(nowMock)}`,
            alignment: 'right',
            margin: [0, 0, Spacing.base, 0],
          },
        ],
      };

      expect(footer).toEqual(expected);
    });
  });

  describe('buildPdfServiceFooter', () => {
    it('builds footer', () => {
      const contentMock: IPdfServiceFooterContent = {
        footerLabel: 'footer-text',
      };

      const footer = buildPdfServiceFooter(contentMock);

      const expectedFooter: Content = {
        margin: [0, -40, 0, 0],
        columns: [
          {
            margin: [40, 20, 0, 0],
            text: `${contentMock.footerLabel}`,
            bold: false,
            fontSize: 11,
          },
          {
            image:
              'data:image/png;base64,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',
            margin: [-40, 7, 0, 0],
            width: 112,
            height: 42,
            alignment: 'left',
          },
        ],
      };

      expect(footer).toEqual(expectedFooter);
    });
  });
});
