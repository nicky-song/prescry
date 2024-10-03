// Copyright 2022 Prescryptive Health, Inc.

import { IClaim } from '@phx/common/src/models/claim';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { GrayScaleColor, PrimaryColor } from '@phx/common/src/theming/colors';
import { FontSize } from '@phx/common/src/theming/fonts';
import { Spacing } from '@phx/common/src/theming/spacing';
import dateFormatter from '@phx/common/src/utils/formatters/date.formatter';
import { MoneyFormatter } from '@phx/common/src/utils/formatters/money-formatter';
import PdfPrinter from 'pdfmake';
import {
  Content,
  ContentTable,
  Margins,
  TableCell,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { FontConstants } from '../../../constants/fonts-constants';
import { IClaimHistoryPdfContent } from './claim-history-pdf.content';
import {
  calculateDeductiblesTotal,
  calculateMemberPaysTotal,
} from '../../../utils/pdf/claim-history/claim-history-pdf.helper';
import { claim1Mock, claim2Mock } from '../mocks/claims.mock';
import {
  buildClaimHistoryPdf,
  IClaimHistoryPdfIdentity,
} from './build-claim-history-pdf';
import {
  bodyFillColor,
  customTableLayout,
} from '../../../utils/pdf/pdf-table.helper';
import { getClaimHistoryPdfContent } from './get-claim-history-pdf-content';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { intEnumLength } from '@phx/common/src/testing/enum.helper';
import { MemberNameFormatter } from '@phx/common/src/utils/formatters/member-name-formatter';
import {
  buildPdfFooterWithPageAndDate,
  IPdfFooterWithPageAndDateContent,
} from '../../../utils/pdf/pdf-footer.helper';
import { buildPdfHeader } from '../../../utils/pdf/pdf-header.helper';
import { formatPhoneNumber } from '../../../utils/format-phone-number.helper';

jest.mock('pdfmake', () => ({
  __esModule: true,
  default: jest.fn(),
}));
const PdfPrintMock = PdfPrinter as jest.Mock;

jest.mock('./get-claim-history-pdf-content');
const getClaimHistoryPdfContentMock = getClaimHistoryPdfContent as jest.Mock;

jest.mock('../../../utils/pdf/pdf-footer.helper');
const buildFooterWithPageAndDateMock =
  buildPdfFooterWithPageAndDate as jest.Mock;

describe('buildClaimHistoryPdf', () => {
  const endMock = jest.fn();

  const chunkMock: Uint8Array = Buffer.from('chunk');
  const onMock = jest
    .fn()
    .mockImplementation(
      (eventName: string, listener: (...args: unknown[]) => void) => {
        if (eventName === 'end') {
          listener();
        }

        listener(chunkMock);
      }
    );

  const createPdfKitDocumentMock = jest.fn().mockReturnValue({
    on: onMock,
    end: endMock,
  });

  enum DocumentComponent {
    title,
    patientInformationHeading,
    patientInformation,
    totalsTable,
    claimsTable,
  }

  beforeEach(() => {
    jest.clearAllMocks();

    PdfPrintMock.mockReturnValue({
      createPdfKitDocument: createPdfKitDocumentMock,
    });
    getClaimHistoryPdfContentMock.mockResolvedValue({});
  });

  it('gets content', async () => {
    await buildClaimHistoryPdf(configurationMock, [], 'member-id', {
      isoDateOfBirth: '2001-01-01',
      firstName: 'first',
      lastName: 'last',
    });

    expectToHaveBeenCalledOnceOnlyWith(
      getClaimHistoryPdfContentMock,
      configurationMock
    );
  });

  it('constructs PDF printer', async () => {
    await buildClaimHistoryPdf(configurationMock, [], 'member-id', {
      isoDateOfBirth: '2001-01-01',
      firstName: 'first',
      lastName: 'last',
    });

    const expectedFonts = {
      OpenSans: {
        normal: Buffer.from(FontConstants.openSansRegular, 'base64'),
        bold: Buffer.from(FontConstants.openSansBold, 'base64'),
        italics: Buffer.from(FontConstants.openSansItalic, 'base64'),
        bolditalics: Buffer.from(FontConstants.openSansMediumItalic, 'base64'),
      },
    };
    expectToHaveBeenCalledOnceOnlyWith(PdfPrintMock, expectedFonts);
  });

  it('builds PDF document', async () => {
    await buildClaimHistoryPdf(configurationMock, [], 'member-id', {
      isoDateOfBirth: '2001-01-01',
      firstName: 'first',
      lastName: 'last',
    });

    const expectedDocument: TDocumentDefinitions = {
      pageSize: expect.any(String),
      pageOrientation: expect.any(String),
      pageMargins: expect.any(Array),
      defaultStyle: expect.any(Object),
      styles: expect.any(Object),
      header: expect.any(Function),
      footer: expect.any(Function),
      content: expect.any(Array),
    };

    expectToHaveBeenCalledOnceOnlyWith(
      createPdfKitDocumentMock,
      expectedDocument
    );
  });

  it('builds PDF document with expected page attributes', async () => {
    await buildClaimHistoryPdf(configurationMock, [], 'member-id', {
      isoDateOfBirth: '2001-01-01',
      firstName: 'first',
      lastName: 'last',
    });

    const document = createPdfKitDocumentMock.mock
      .calls[0][0] as TDocumentDefinitions;

    expect(document.pageSize).toEqual('LETTER');
    expect(document.pageOrientation).toEqual('landscape');
    expect(document.pageMargins).toEqual([30, 60, 40, 40]);
  });

  it('builds PDF document with expected styles', async () => {
    await buildClaimHistoryPdf(configurationMock, [], 'member-id', {
      isoDateOfBirth: '2001-01-01',
      firstName: 'first',
      lastName: 'last',
    });

    const document = createPdfKitDocumentMock.mock
      .calls[0][0] as TDocumentDefinitions;

    expect(document.defaultStyle).toEqual({
      font: 'OpenSans',
      fontSize: FontSize.small,
      color: GrayScaleColor.primaryText,
    });

    const sectionMargins: Margins = [0, Spacing.times1pt5, 0, 0];

    expect(document.styles).toEqual({
      heading1: {
        fontSize: FontSize.h1,
        bold: true,
      },
      heading2: {
        margin: sectionMargins,
        fontSize: FontSize.large,
        bold: true,
      },
      layoutTable: {
        margin: [0, Spacing.base, 0, 0],
      },
      table: {
        margin: sectionMargins,
        fontSize: FontSize.xSmall,
      },
      tableHeading: {
        color: PrimaryColor.prescryptivePurple,
        fillColor: PrimaryColor.lightPurple,
        bold: true,
      },
      value: {
        bold: true,
      },
    });
  });

  it('builds PDF document footer', async () => {
    const contentMock: IClaimHistoryPdfContent = {
      footerPageInfo: 'footer-page-info',
      footerPrintedDate: 'footer-printed-date',
    };
    getClaimHistoryPdfContentMock.mockResolvedValue(contentMock);

    await buildClaimHistoryPdf(configurationMock, [], 'member-id', {
      isoDateOfBirth: '2001-01-01',
      firstName: 'first',
      lastName: 'last',
    });

    const document = createPdfKitDocumentMock.mock
      .calls[0][0] as TDocumentDefinitions;

    const currentPageMock = 1;
    const totalPagesMock = 3;

    const footer = document.footer as (
      current: number,
      total: number
    ) => Content;
    footer(currentPageMock, totalPagesMock);

    const expectedContent: Partial<IPdfFooterWithPageAndDateContent> = {
      dateFooterFormat: contentMock.footerPrintedDate,
      pageFooterFormat: contentMock.footerPageInfo,
    };
    expectToHaveBeenCalledOnceOnlyWith(
      buildFooterWithPageAndDateMock,
      currentPageMock,
      totalPagesMock,
      expectedContent
    );
  });

  it('builds PDF document header', async () => {
    await buildClaimHistoryPdf(configurationMock, [], 'member-id', {
      isoDateOfBirth: '2001-01-01',
      firstName: 'first',
      lastName: 'last',
    });

    const document = createPdfKitDocumentMock.mock
      .calls[0][0] as TDocumentDefinitions;

    expect(document.header).toEqual(buildPdfHeader);
  });

  it('builds PDF document content component array', async () => {
    await buildClaimHistoryPdf(configurationMock, [], 'member-id', {
      isoDateOfBirth: '2001-01-01',
      firstName: 'first',
      lastName: 'last',
    });

    const document = createPdfKitDocumentMock.mock
      .calls[0][0] as TDocumentDefinitions;

    expect(document.content).toBeInstanceOf(Array);

    expect((document.content as []).length).toEqual(
      intEnumLength(DocumentComponent)
    );
  });

  it('builds PDF document title component', async () => {
    const contentMock: IClaimHistoryPdfContent = {
      title: 'title',
    };
    getClaimHistoryPdfContentMock.mockResolvedValue(contentMock);

    await buildClaimHistoryPdf(configurationMock, [], 'member-id', {
      isoDateOfBirth: '2001-01-01',
      firstName: 'first',
      lastName: 'last',
    });

    const document = createPdfKitDocumentMock.mock
      .calls[0][0] as TDocumentDefinitions;

    const content = document.content as unknown[];
    const title = content[DocumentComponent.title];

    expect(title).toEqual({
      style: 'heading1',
      text: contentMock.title,
    });
  });

  it('builds PDF Patient Information heading component', async () => {
    const contentMock: IClaimHistoryPdfContent = {
      patientInformation: 'patient-information',
    };
    getClaimHistoryPdfContentMock.mockResolvedValue(contentMock);

    await buildClaimHistoryPdf(configurationMock, [], 'member-id', {
      isoDateOfBirth: '2001-01-01',
      firstName: 'first',
      lastName: 'last',
    });

    const document = createPdfKitDocumentMock.mock
      .calls[0][0] as TDocumentDefinitions;

    const content = document.content as unknown[];
    const title = content[DocumentComponent.patientInformationHeading];

    expect(title).toEqual({
      style: 'heading2',
      text: contentMock.patientInformation,
    });
  });

  it('builds PDF Patient Information component', async () => {
    const contentMock: IClaimHistoryPdfContent = {
      memberName: 'member-name-content',
      dateOfBirth: 'date-of-birth-content',
      memberId: 'member-id-content',
    };
    getClaimHistoryPdfContentMock.mockResolvedValue(contentMock);

    const memberIdMock = 'member-id';
    const dateOfBirthMock = '2001-01-01';
    const firstNameMock = 'first-name';
    const lastNameMock = 'last-name';
    const identityMock: IClaimHistoryPdfIdentity = {
      isoDateOfBirth: dateOfBirthMock,
      firstName: firstNameMock,
      lastName: lastNameMock,
    };

    await buildClaimHistoryPdf(
      configurationMock,
      [],
      memberIdMock,
      identityMock
    );

    const document = createPdfKitDocumentMock.mock
      .calls[0][0] as TDocumentDefinitions;

    const content = document.content as unknown[];
    const table = content[DocumentComponent.patientInformation] as ContentTable;

    const expectedBirthDate =
      dateFormatter.convertDateOfBirthToDate(dateOfBirthMock);

    expect(table).toEqual({
      style: 'layoutTable',
      table: {
        body: [
          [
            { text: contentMock.memberName },
            {
              text: MemberNameFormatter.formatName(firstNameMock, lastNameMock),
              style: 'value',
            },
          ],
          [
            { text: contentMock.dateOfBirth },
            {
              text: dateFormatter.formatToMMDDYYYY(expectedBirthDate),
              style: 'value',
            },
          ],
          [
            { text: contentMock.memberId },
            { text: memberIdMock, style: 'value' },
          ],
        ],
      },
      layout: 'noBorders',
    });
  });

  it('builds PDF totals table component', async () => {
    const claimsMock: IClaim[] = [claim1Mock, claim2Mock];

    const contentMock: IClaimHistoryPdfContent = {
      total: 'total',
      amount: 'amount',
      patientPayAmount: 'patient-pay-amount',
      amountAppliedToDeductible: 'amount-applied-to-deductible',
    };
    getClaimHistoryPdfContentMock.mockResolvedValue(contentMock);

    await buildClaimHistoryPdf(configurationMock, claimsMock, 'member-id', {
      isoDateOfBirth: '2001-01-01',
      firstName: 'first',
      lastName: 'last',
    });

    const document = createPdfKitDocumentMock.mock
      .calls[0][0] as TDocumentDefinitions;

    const content = document.content as unknown[];
    const table = content[DocumentComponent.totalsTable] as ContentTable;

    const expectedTotalsTableHeadings: TableCell[] = [
      {
        style: 'tableHeading',
        width: 'auto',
        text: contentMock.total,
      },
      {
        style: 'tableHeading',
        text: contentMock.amount,
      },
    ];

    const expectedTotalsTableBody: TableCell[][] = [
      [
        {
          text: contentMock.patientPayAmount,
          fillColor: bodyFillColor(0),
        },
        {
          text: `${MoneyFormatter.format(
            calculateMemberPaysTotal(claimsMock)
          )}`,
          fillColor: bodyFillColor(0),
        },
      ],
      [
        {
          text: contentMock.amountAppliedToDeductible,
          fillColor: bodyFillColor(1),
        },
        {
          text: `${MoneyFormatter.format(
            calculateDeductiblesTotal(claimsMock)
          )}`,
          fillColor: bodyFillColor(1),
        },
      ],
    ];

    expect(table).toEqual({
      style: 'table',
      table: {
        body: [expectedTotalsTableHeadings, ...expectedTotalsTableBody],
      },
      layout: customTableLayout,
    });
  });

  it('builds PDF claims table component', async () => {
    const claimWithNoPhoneMock: IClaim = { ...claim1Mock };
    claimWithNoPhoneMock.pharmacy = {
      ...claim1Mock.pharmacy,
      phoneNumber: undefined,
    };

    const claimsMock: IClaim[] = [claimWithNoPhoneMock, claim2Mock];

    const contentMock: IClaimHistoryPdfContent = {
      pharmacyName: 'pharmacy-name',
      pharmacyPhoneNumber: 'pharmacy-phone-number',
      fillDate: 'fill-date',
      medicationName: 'medication-name',
      strength: 'strength',
      daysSupply: 'days-supply',
      quantity: 'quantity',
      format: 'format',
      patientPayAmount: 'patient-pay-amount',
      amountAppliedToDeductible: 'amount-applied-to-deductible',
    };
    getClaimHistoryPdfContentMock.mockResolvedValue(contentMock);

    await buildClaimHistoryPdf(configurationMock, claimsMock, 'member-id', {
      isoDateOfBirth: '2001-01-01',
      firstName: 'first',
      lastName: 'last',
    });

    const document = createPdfKitDocumentMock.mock
      .calls[0][0] as TDocumentDefinitions;

    const content = document.content as unknown[];
    const table = content[DocumentComponent.claimsTable];

    const expectedClaimsTableHeadings: TableCell[] = [
      {
        style: 'tableHeading',
        text: contentMock.pharmacyName,
      },
      {
        style: 'tableHeading',
        text: contentMock.pharmacyPhoneNumber,
      },
      {
        style: 'tableHeading',
        text: contentMock.fillDate,
      },
      {
        style: 'tableHeading',
        text: contentMock.medicationName,
      },
      {
        style: 'tableHeading',
        text: contentMock.strength,
      },
      {
        style: 'tableHeading',
        text: contentMock.daysSupply,
      },
      {
        style: 'tableHeading',
        text: contentMock.quantity,
      },
      {
        style: 'tableHeading',
        text: contentMock.format,
      },
      {
        style: 'tableHeading',
        text: contentMock.patientPayAmount,
      },
      {
        style: 'tableHeading',
        text: contentMock.amountAppliedToDeductible,
      },
    ];

    const expectedClaimsTableBody = claimsMock.map((claim, index) => {
      const fillColor = bodyFillColor(index);

      return [
        {
          text: `${claim.pharmacy.name}`,
          fillColor,
        },
        {
          text: `${
            claim.pharmacy.phoneNumber
              ? formatPhoneNumber(claim.pharmacy.phoneNumber)
              : '--'
          }`,
          fillColor,
        },
        {
          text: `${
            claim?.filledOn
              ? dateFormatter.formatToMMDDYYYY(claim?.filledOn)
              : ''
          }`,
          fillColor,
        },
        {
          text: `${claim.drugName}`,
          fillColor,
        },
        {
          text: `${claim.strength}`,
          fillColor,
        },
        {
          text: `${claim.daysSupply}`,
          fillColor,
        },
        {
          text: `${claim.quantity}`,
          fillColor,
        },
        {
          text: `${claim.formCode}`,
          fillColor,
        },
        {
          text: `${MoneyFormatter.format(claim.billing.memberPays)}`,
          fillColor,
        },
        {
          text: `${MoneyFormatter.format(claim.billing.deductibleApplied)}`,
          fillColor,
        },
      ];
    });

    expect(table).toEqual({
      style: 'table',
      table: {
        body: [expectedClaimsTableHeadings, ...expectedClaimsTableBody],
      },
      layout: customTableLayout,
    });
  });

  it('returns base64 pdf', async () => {
    const claimsMock: IClaim[] = [claim1Mock, claim2Mock];

    const base64Pdf = await buildClaimHistoryPdf(
      configurationMock,
      claimsMock,
      'member-id',
      { isoDateOfBirth: '2001-01-01', firstName: 'first', lastName: 'last' }
    );

    expect(onMock).toHaveBeenCalledTimes(2);
    expect(onMock).toHaveBeenNthCalledWith(1, 'data', expect.any(Function));
    expect(onMock).toHaveBeenLastCalledWith('end', expect.any(Function));
    expectToHaveBeenCalledOnceOnlyWith(endMock);

    const expectedChunks: Uint8Array[] = [chunkMock];
    expect(base64Pdf).toEqual(Buffer.concat(expectedChunks).toString('base64'));
  });
});
