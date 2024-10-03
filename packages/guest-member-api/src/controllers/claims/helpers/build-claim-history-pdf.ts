// Copyright 2022 Prescryptive Health, Inc.

import { IClaim } from '@phx/common/src/models/claim';
import PdfPrinter from 'pdfmake';
import {
  Content,
  Margins,
  Style,
  StyleDictionary,
  TableCell,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { FontConstants } from '../../../constants/fonts-constants';
import dateFormatter from '@phx/common/src/utils/formatters/date.formatter';
import { MoneyFormatter } from '@phx/common/src/utils/formatters/money-formatter';
import { PrimaryColor, GrayScaleColor } from '@phx/common/src/theming/colors';
import { FontSize } from '@phx/common/src/theming/fonts';
import { Spacing } from '@phx/common/src/theming/spacing';
import {
  bodyFillColor,
  customTableLayout,
} from '../../../utils/pdf/pdf-table.helper';
import { IConfiguration } from '../../../configuration';
import {
  calculateMemberPaysTotal,
  calculateDeductiblesTotal,
} from '../../../utils/pdf/claim-history/claim-history-pdf.helper';
import { getClaimHistoryPdfContent } from './get-claim-history-pdf-content';
import { IIdentity } from '../../../models/identity';
import { MemberNameFormatter } from '@phx/common/src/utils/formatters/member-name-formatter';
import {
  buildPdfFooterWithPageAndDate,
  IPdfFooterWithPageAndDateContent,
} from '../../../utils/pdf/pdf-footer.helper';
import { buildPdfHeader } from '../../../utils/pdf/pdf-header.helper';
import { formatPhoneNumber } from '../../../utils/format-phone-number.helper';

export type IClaimHistoryPdfIdentity = Pick<
  IIdentity,
  'firstName' | 'lastName' | 'isoDateOfBirth'
>;

export const buildClaimHistoryPdf = async (
  configuration: IConfiguration,
  claimHistory: IClaim[],
  memberId: string,
  { firstName, lastName, isoDateOfBirth }: IClaimHistoryPdfIdentity
): Promise<string> => {
  const content = await getClaimHistoryPdfContent(configuration);

  const fonts = {
    OpenSans: {
      normal: Buffer.from(FontConstants.openSansRegular, 'base64'),
      bold: Buffer.from(FontConstants.openSansBold, 'base64'),
      italics: Buffer.from(FontConstants.openSansItalic, 'base64'),
      bolditalics: Buffer.from(FontConstants.openSansMediumItalic, 'base64'),
    },
  };

  const defaultStyle: Style = {
    font: 'OpenSans',
    fontSize: FontSize.small,
    color: GrayScaleColor.primaryText,
  };

  const sectionMargins: Margins = [0, Spacing.times1pt5, 0, 0];

  const styles: StyleDictionary = {
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
  };

  const buildFooter = (currentPage: number, pageCount: number): Content => {
    const footerContent: IPdfFooterWithPageAndDateContent = {
      dateFooterFormat: content.footerPrintedDate ?? '',
      pageFooterFormat: content.footerPageInfo ?? '',
    };
    return buildPdfFooterWithPageAndDate(currentPage, pageCount, footerContent);
  };

  const birthDate = dateFormatter.convertDateOfBirthToDate(isoDateOfBirth);

  const patientInformationTableBody: TableCell[][] = [
    [
      { text: content.memberName },
      {
        text: MemberNameFormatter.formatName(firstName, lastName),
        style: 'value',
      },
    ],
    [
      { text: content.dateOfBirth },
      {
        text: dateFormatter.formatToMMDDYYYY(birthDate),
        style: 'value',
      },
    ],
    [{ text: content.memberId }, { text: memberId, style: 'value' }],
  ];

  const totalsTableHeadings: TableCell[] = [
    {
      style: 'tableHeading',
      width: 'auto',
      text: content.total,
    },
    {
      style: 'tableHeading',
      text: content.amount,
    },
  ];

  const totalsTableBody: TableCell[][] = [
    [
      {
        text: content.patientPayAmount,
        fillColor: bodyFillColor(0),
      },
      {
        text: `${MoneyFormatter.format(
          calculateMemberPaysTotal(claimHistory)
        )}`,
        fillColor: bodyFillColor(0),
      },
    ],
    [
      {
        text: content.amountAppliedToDeductible,
        fillColor: bodyFillColor(1),
      },
      {
        text: `${MoneyFormatter.format(
          calculateDeductiblesTotal(claimHistory)
        )}`,
        fillColor: bodyFillColor(1),
      },
    ],
  ];

  const claimsTableHeadings: TableCell[] = [
    {
      style: 'tableHeading',
      text: content.pharmacyName,
    },
    {
      style: 'tableHeading',
      text: content.pharmacyPhoneNumber,
    },
    {
      style: 'tableHeading',
      text: content.fillDate,
    },
    {
      style: 'tableHeading',
      text: content.medicationName,
    },
    {
      style: 'tableHeading',
      text: content.strength,
    },
    {
      style: 'tableHeading',
      text: content.daysSupply,
    },
    {
      style: 'tableHeading',
      text: content.quantity,
    },
    {
      style: 'tableHeading',
      text: content.format,
    },
    {
      style: 'tableHeading',
      text: content.patientPayAmount,
    },
    {
      style: 'tableHeading',
      text: content.amountAppliedToDeductible,
    },
  ];

  const claimsTableBody = claimHistory.map((claim, index) => {
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
          claim?.filledOn ? dateFormatter.formatToMMDDYYYY(claim?.filledOn) : ''
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

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'LETTER',
    pageMargins: [30, 60, 40, 40],
    pageOrientation: 'landscape',
    defaultStyle,
    styles,
    header: buildPdfHeader,
    footer: buildFooter,
    content: [
      {
        style: 'heading1',
        text: content.title ?? '',
      },
      { text: content.patientInformation ?? '', style: 'heading2' },
      {
        style: 'layoutTable',
        table: {
          body: patientInformationTableBody,
        },
        layout: 'noBorders',
      },
      {
        style: 'table',
        table: {
          body: [totalsTableHeadings, ...totalsTableBody],
        },
        layout: customTableLayout,
      },
      {
        style: 'table',
        table: {
          body: [claimsTableHeadings, ...claimsTableBody],
        },
        layout: customTableLayout,
      },
    ],
  };

  const printer = new PdfPrinter(fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  return new Promise((resolve, reject) => {
    try {
      const chunks: Uint8Array[] = [];
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
      pdfDoc.end();
    } catch (err) {
      reject(err);
    }
  });
};
