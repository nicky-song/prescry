// Copyright 2021 Prescryptive Health, Inc.

import PdfPrinter from 'pdfmake';
import { ContentTable, TDocumentDefinitions } from 'pdfmake/interfaces';
import { ITestResult } from '@phx/common/src/models/api-response/test-result-response';
import { FontConstants } from '../../../constants/fonts-constants';
import { appointmentContent } from '../../../content/appointment.content'; //
import DateFormatter from '@phx/common/src/utils/formatters/date.formatter';
import { buildPdfServiceFooter } from '../../../utils/pdf/pdf-footer.helper';
import {
  buildPdfServiceHeader,
  IPdfServiceHeaderProps,
} from '../../../utils/pdf/pdf-header.helper';

export const buildPatientTestResultPdf = (
  testResult: ITestResult
): Promise<string> => {
  const fonts = {
    OpenSans: {
      normal: Buffer.from(FontConstants.openSansRegular, 'base64'),
      bold: Buffer.from(FontConstants.openSansBold, 'base64'),
      italics: Buffer.from(FontConstants.openSansItalic, 'base64'),
      bolditalics: Buffer.from(FontConstants.openSansMediumItalic, 'base64'),
    },
  };

  const pdfHeaderProps: IPdfServiceHeaderProps = {
    providerAddress: testResult.providerAddress,
    providerCliaNumber: testResult.providerCliaNumber ?? '',
    providerName: testResult.providerName ?? '',
    providerPhoneNumber: testResult.providerPhoneNumber ?? '',
  };

  const docDefinition: TDocumentDefinitions = {
    content: [
      buildPdfServiceHeader(pdfHeaderProps, appointmentContent),
      {
        margin: [0, 3, 5, 3],
        style: 'tableExample',
        table: {
          widths: [130, 80, '*', 100],
          body: [
            [
              {
                border: [true, true, false, false],
                margin: [10, 10, 0, 3],
                text: `${appointmentContent.patientLabel}`,
                bold: false,
                fontSize: 10,
                color: '#0B0B0F',
                alignment: 'left',
              },
              {
                border: [false, true, false, false],
                margin: [0, 10, 0, 0],
                text: `${appointmentContent.dobLabel}`,
                bold: false,
                fontSize: 10,
                color: '#0B0B0F',
                alignment: 'left',
              },
              {
                border: [false, true, false, false],
                margin: [0, 10, 0, 0],
                text: `${
                  testResult.testType ? appointmentContent.testType : ''
                }`,
                bold: false,
                fontSize: 10,
                color: '#0B0B0F',
                alignment: 'left',
              },
              {
                border: [true, true, true, false],
                margin: [10, 10, 0, 0],
                text: `${
                  testResult.testType ? appointmentContent.resultLabel : ''
                }`,
                bold: false,
                fontSize: 10,
                color: '#0B0B0F',
                fillColor: '#E7E7E7',
                alignment: 'left',
              },
            ],
            [
              {
                border: [true, false, false, true],
                margin: [10, -3, 0, 10],
                text: `${testResult.memberFirstName} ${testResult.memberLastName}`,
                italics: true,
                fontSize: 16,
                color: '#0B0B0F',
                alignment: 'left',
              },
              {
                border: [false, false, false, true],
                margin: [0, 0, 0, 10],
                text: `${
                  testResult.memberDateOfBirth
                    ? DateFormatter.formatStringToMMDDYYYY(
                        testResult.memberDateOfBirth
                      )
                    : ''
                }`,
                italics: true,
                fontSize: 12,
                color: '#0B0B0F',
                alignment: 'left',
              },
              {
                border: [false, false, false, true],
                margin: [0, 0, 0, 10],
                text: `${testResult.testType ?? ''}`,
                italics: true,
                fontSize: 12,
                color: '#0B0B0F',
                alignment: 'left',
              },
              {
                border: [true, false, true, true],
                margin: [10, 0, 0, 10],
                text: `${testResult.valueMyRx}`,
                italics: true,
                fontSize: 12,
                color: '#0B0B0F',
                fillColor: '#E7E7E7',
                alignment: 'left',
              },
            ],
          ],
        },
        layout: {
          hLineColor: (i: number, node: ContentTable) => {
            return i === 0 || i === node.table.body.length
              ? '#DBDBDB'
              : '#DBDBDB';
          },
          vLineColor: (i: number, node: ContentTable) => {
            return i === 0 || i === node.table.widths?.length
              ? '#DBDBDB'
              : '#DBDBDB';
          },
        },
      },
      {
        margin: [0, 0, 0, 3],
        style: 'tableExample',
        table: {
          widths: [518],
          body: [
            [
              {
                margin: [0, 20, 0, 3],
                border: [false, false, false, false],
                text: `${appointmentContent.testNotesLabel}`,
                italics: true,
                fontSize: 12,
                alignment: 'left',
              },
            ],
            [
              {
                margin: [0, 0, 0, 25],
                border: [false, false, false, true],
                text: `${testResult.descriptionMyRx}`,
                bold: false,
                fontSize: 10,
                alignment: 'left',
              },
            ],
          ],
        },
        layout: {
          hLineColor: (i: number, node: ContentTable) => {
            return i === 0 || i === node.table.body.length
              ? '#CCCED9'
              : '#CCCED9';
          },
          vLineColor: (i: number, node: ContentTable) => {
            return i === 0 || i === node.table.widths?.length
              ? '#CCCED9'
              : '#CCCED9';
          },
        },
      },
      {
        columns: [
          {
            margin: [0, 10, 0, 0],
            style: 'tableExample',
            table: {
              widths: [100, 145],
              body: [
                [
                  {
                    border: [false, false, false, false],
                    margin: [0, 10, 0, 3],
                    text: `${
                      testResult.testType ? appointmentContent.testType : ''
                    }`,
                    bold: false,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                  {
                    border: [false, false, false, false],
                    margin: [0, 10, 0, 0],
                    text: `${testResult.testType ?? ''}`,
                    italics: true,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                ],
                [
                  {
                    border: [false, false, false, false],
                    margin: [0, 0, 0, 3],
                    text: `${
                      testResult.manufacturer
                        ? appointmentContent.manufacturer
                        : ''
                    }`,
                    bold: false,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                  {
                    border: [false, false, false, false],
                    margin: [0, 0, 0, 3],
                    text: `${testResult.manufacturer ?? ''}`,
                    italics: true,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                ],
                [
                  {
                    border: [false, false, false, false],
                    margin: [0, 0, 0, 3],
                    text: `${
                      testResult.administrationMethod
                        ? appointmentContent.administeredMethod
                        : ''
                    }`,
                    bold: false,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                  {
                    border: [false, false, false, false],
                    margin: [0, 0, 0, 3],
                    text: `${testResult.administrationMethod ?? ''}`,
                    italics: true,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                ],
                [
                  {
                    border: [false, false, false, false],
                    margin: [0, 0, 0, 3],
                    text: '',
                    bold: false,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                  {
                    border: [false, false, false, false],
                    margin: [0, 0, 0, 3],
                    text: '',
                    italics: true,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                ],
              ],
            },
            layout: {
              hLineColor: (i: number, node: ContentTable) => {
                return i === 0 || i === node.table.body.length
                  ? '#DBDBDB'
                  : '#DBDBDB';
              },
              vLineColor: (i: number, node: ContentTable) => {
                return i === 0 || i === node.table.widths?.length
                  ? '#DBDBDB'
                  : '#DBDBDB';
              },
            },
          },
          {
            margin: [0, 10, 0, 0],
            style: 'tableExample',
            table: {
              widths: [100, 130],
              body: [
                [
                  {
                    border: [false, false, false, false],
                    margin: [0, 10, 0, 0],
                    text: `${appointmentContent.dateOfService}`,
                    bold: false,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                  {
                    border: [false, false, false, false],
                    margin: [0, 10, 0, 3],
                    text: `${testResult.date}`,
                    italics: true,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                ],
                [
                  {
                    border: [false, false, false, false],
                    margin: [0, 0, 0, 3],
                    text: `${appointmentContent.timeOfService}`,
                    bold: false,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                  {
                    border: [false, false, false, false],
                    margin: [0, 0, 0, 3],
                    text: `${testResult.time}`,
                    italics: true,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                ],
                [
                  {
                    border: [false, false, false, false],
                    margin: [0, 0, 0, 3],
                    text: `${appointmentContent.resultDateLabel}`,
                    bold: false,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                  {
                    border: [false, false, false, false],
                    margin: [0, 0, 0, 3],
                    text: `${testResult.date}`,
                    italics: true,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                ],
                [
                  {
                    border: [false, false, false, false],
                    margin: [0, 0, 0, 3],
                    text: `${appointmentContent.sourceOfSwabLabel}`,
                    bold: false,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                  {
                    border: [false, false, false, false],
                    margin: [0, 0, 0, 3],
                    text: `${appointmentContent.sourceOfSwabDetail}`,
                    italics: true,
                    fontSize: 10,
                    color: '#0B0B0F',
                    alignment: 'left',
                  },
                ],
              ],
            },
            layout: {
              hLineColor: (i: number, node: ContentTable) => {
                return i === 0 || i === node.table.body.length
                  ? '#DBDBDB'
                  : '#DBDBDB';
              },
              vLineColor: (i: number, node: ContentTable) => {
                return i === 0 || i === node.table.widths?.length
                  ? '#DBDBDB'
                  : '#DBDBDB';
              },
            },
          },
        ],
      },
    ],
    footer: buildPdfServiceFooter(appointmentContent),
    styles: {
      header: {
        fontSize: 9,
        margin: [0, 0, 0, 0],
      },
      subheader: {
        fontSize: 9,
        margin: [0, 0, 0, 0],
      },
      tableExample: {
        margin: [0, 0, 0, 0],
        font: 'OpenSans',
      },
      tableHeader: {
        fontSize: 10,
      },
    },
    defaultStyle: {
      font: 'OpenSans',
      columnGap: 20,
    },
    pageSize: {
      width: 612,
      height: 792,
    },
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
