// Copyright 2022 Prescryptive Health, Inc.

import PdfPrinter from 'pdfmake';
import { ContentTable, TDocumentDefinitions } from 'pdfmake/interfaces';
import { FontConstants } from '../../../constants/fonts-constants';
import { IAppointmentItem } from '@phx/common/src/models/api-response/appointment.response';
import { getPaymentStatusDescription } from './get-payment-status-description';
import { appointmentContent } from '../../../content/appointment.content';
import DateFormatter from '@phx/common/src/utils/formatters/date.formatter';
import { buildPdfServiceFooter } from '../../../utils/pdf/pdf-footer.helper';
import {
  buildPdfServiceHeader,
  IPdfServiceHeaderProps,
} from '../../../utils/pdf/pdf-header.helper';

export const buildAppointmentPdf = (
  appointment: IAppointmentItem
): Promise<string> => {
  const fonts = {
    Roboto: {
      normal: Buffer.from(FontConstants.openSansRegular, 'base64'),
      bold: Buffer.from(FontConstants.openSansBold, 'base64'),
      italics: Buffer.from(FontConstants.openSansItalic, 'base64'),
      bolditalics: Buffer.from(FontConstants.openSansMediumItalic, 'base64'),
    },
  };

  const formattedDate = DateFormatter.formatStringToMMDDYYYY(appointment.date);

  const headerProps: IPdfServiceHeaderProps = {
    providerAddress: {
      address1: appointment.address1,
      address2: appointment.address2,
      city: appointment.city,
      state: appointment.state,
      zip: appointment.zip,
    },
    providerCliaNumber: appointment.providerClia ?? '',
    providerName: appointment.locationName ?? '',
    providerPhoneNumber: appointment.providerPhoneNumber,
    providerTaxId: appointment.providerTaxId,
    npi: appointment.providerNpi,
  };

  const header = buildPdfServiceHeader(headerProps, appointmentContent);

  const docDefinition: TDocumentDefinitions = {
    content: [
      header,
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                border: [false, false, false, false],
                width: '*',
                alignment: 'left',
                bold: true,
                stack: [
                  {
                    margin: [0, 0, 0, 0],
                    fontSize: 14,
                    text: `${appointmentContent.appointmentReceiptLabel}`,
                  },
                ],
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

          paddingBottom: () => {
            return 24;
          },
        },
      },
      {
        table: {
          widths: [100, '*', '*'],
          body: [
            [
              {
                border: [false, false, false, true],
                width: '*',
                alignment: 'left',
                stack: [
                  {
                    margin: [0, 0, 0, 0],
                    fontSize: 10,
                    text: `${appointmentContent.patientLabel}`,
                  },
                  appointment.customerDateOfBirth
                    ? {
                        margin: [0, 10, 0, 0],
                        fontSize: 10,
                        text: `${appointmentContent.dobLabel}`,
                      }
                    : null,
                  appointment.orderNumber
                    ? {
                        margin: [0, 10, 0, 0],
                        fontSize: 10,
                        text: `${appointmentContent.orderLabel}`,
                      }
                    : null,
                  appointment.procedureCode
                    ? {
                        margin: [0, 10, 0, 0],
                        fontSize: 10,
                        text: `${appointmentContent.procedureCodeLabel}`,
                      }
                    : null,
                  appointment.diagnosticCode
                    ? {
                        margin: [0, 10, 0, 0],
                        fontSize: 10,
                        text: `${appointmentContent.diagnosisCodeLabel}`,
                      }
                    : null,
                  {
                    margin: [0, 10, 0, 0],
                    fontSize: 10,
                    text: `${appointmentContent.providerNameLabel}`,
                  },
                ],
              },
              {
                border: [false, false, false, true],
                width: '*',
                alignment: 'left',
                stack: [
                  {
                    margin: [0, 0, 0, 0],
                    fontSize: 10,
                    italics: true,
                    text: `${appointment.customerName}`,
                  },
                  appointment.customerDateOfBirth
                    ? {
                        margin: [0, 10, 0, 0],
                        fontSize: 10,
                        italics: true,
                        text: `${DateFormatter.formatStringToMMDDYYYY(
                          appointment.customerDateOfBirth
                        )}`,
                      }
                    : null,
                  appointment.orderNumber
                    ? {
                        margin: [0, 10, 0, 0],
                        fontSize: 10,
                        italics: true,
                        text: `${appointment.orderNumber}`,
                      }
                    : null,
                  appointment.procedureCode
                    ? {
                        margin: [0, 10, 0, 0],
                        fontSize: 10,
                        italics: true,
                        text: `${appointment.procedureCode}`,
                      }
                    : null,
                  appointment.diagnosticCode
                    ? {
                        margin: [0, 10, 0, 0],
                        fontSize: 10,
                        italics: true,
                        text: `${appointment.diagnosticCode}`,
                      }
                    : null,
                  {
                    margin: [0, 10, 0, 0],
                    fontSize: 10,
                    italics: true,
                    text: `${appointment.providerLegalName}`,
                  },
                ],
              },
              {
                border: [false, false, false, true],
                width: '*',
                alignment: 'center',
                stack: [
                  {
                    text: '',
                  },
                ],
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

          paddingBottom: () => {
            return 40;
          },
        },
      },
      {
        table: {
          widths: [100, 300, '*'],
          body: [
            [
              {
                border: [false, false, false, true],
                margin: [0, 10, 0, 0],
                width: '*',
                alignment: 'left',
                stack: [
                  {
                    margin: [0, 0, 0, 0],
                    fontSize: 10,
                    text: `${appointmentContent.dateOfService}`,
                  },
                  {
                    margin: [0, 10, 0, 0],
                    fontSize: 10,
                    italics: true,
                    text: `${formattedDate}`,
                  },
                  {
                    margin: [0, 10, 0, 0],
                    fontSize: 10,
                    bold: true,
                    text: ``,
                  },
                ],
              },
              {
                border: [false, false, false, true],
                margin: [0, 10, 0, 0],
                width: '*',
                alignment: 'left',
                stack: [
                  {
                    margin: [0, 0, 0, 0],
                    fontSize: 10,
                    text: `${appointmentContent.serviceNameLabel}`,
                  },
                  {
                    margin: [0, 10, 0, 0],
                    fontSize: 10,
                    italics: true,
                    text: `${appointment.serviceName}`,
                  },
                  appointment.contractFee
                    ? {
                        margin: [0, 10, 0, 0],
                        fontSize: 10,
                        italics: true,
                        text: `${appointmentContent.testKitLabel}`,
                      }
                    : null,
                ],
              },
              {
                border: [false, false, false, true],
                margin: [0, 10, 0, 0],
                width: '*',
                alignment: 'right',
                stack: [
                  {
                    margin: [0, 0, 0, 0],
                    fontSize: 10,
                    text: `${appointmentContent.amountLabel}`,
                  },
                  {
                    margin: [0, 10, 0, 0],
                    fontSize: 10,
                    italics: true,
                    text: `${
                      appointment.totalCost
                        ? parseFloat(appointment.totalCost) > 0
                          ? '$' +
                            (
                              Math.round(
                                parseFloat(appointment.totalCost) * 100
                              ) / 100
                            ).toFixed(2)
                          : '$0.00'
                        : '$0.00'
                    }`,
                  },
                  {
                    margin: [0, 10, 0, 0],
                    fontSize: 10,
                    italics: true,
                    text: `${
                      appointment.contractFee
                        ? appointment.contractFee > 0
                          ? '$' + appointment.contractFee.toFixed(2)
                          : '$0.00'
                        : ''
                    }`,
                  },
                ],
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
          paddingBottom: () => {
            return 15;
          },
        },
      },
      {
        table: {
          widths: [200, 180, '*'],
          body: [
            [
              {
                margin: [0, 10, 0, 0],
                width: '*',
                alignment: 'left',
                stack: [
                  {
                    text: '',
                  },
                ],
              },
              {
                margin: [0, 10, 0, 0],
                width: '*',
                alignment: 'right',
                stack: [
                  {
                    margin: [0, 0, 0, 0],
                    fontSize: 10,
                    text: `${appointmentContent.totalLabel}`,
                  },
                  {
                    margin: [0, 10, 0, 0],
                    fontSize: 10,
                    text: `${appointmentContent.paymentStatusLabel}`,
                  },
                ],
              },
              {
                margin: [0, 10, 0, 0],
                width: '*',
                alignment: 'right',
                stack: [
                  {
                    margin: [0, 0, 0, 0],
                    fontSize: 10,
                    italics: true,
                    text: `${
                      appointment.totalCost
                        ? parseFloat(appointment.totalCost) > 0
                          ? '$' + parseFloat(appointment.totalCost).toFixed(2)
                          : '$0.00'
                        : '$0.00'
                    }`,
                  },
                  {
                    margin: [0, 10, 0, 0],
                    fontSize: 10,
                    italics: true,
                    text: `${getPaymentStatusDescription(
                      appointment.paymentStatus
                    )}`,
                  },
                ],
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
          hLineWidth: () => {
            return 0;
          },
          vLineWidth: () => {
            return 0;
          },
          paddingBottom: () => {
            return 15;
          },
        },
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
        font: 'Roboto',
      },
      tableHeader: {
        fontSize: 10,
      },
    },
    defaultStyle: {
      font: 'Roboto',
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
