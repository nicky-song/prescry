// Copyright 2021 Prescryptive Health, Inc.

import { ITestResult } from '@phx/common/src/models/api-response/test-result-response';

import { buildPatientTestResultPdf } from './build-patient-test-result.pdf';
import { pdfMock } from '../../../mock-data/pdf-mock.mock';
import { pdfUndefinedInfoMock } from '../../../mock-data/pdf-undefined-info-mock.mock';
import { buildPdfServiceFooter } from '../../../utils/pdf/pdf-footer.helper';
import { appointmentContent } from '../../../content/appointment.content';

jest.mock('../../../utils/pdf/pdf-footer.helper');
const buildPdfServiceFooterMock = buildPdfServiceFooter as jest.Mock;

describe('buildPatientTestResultPdf', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    buildPdfServiceFooterMock.mockReturnValue({
      margin: [0, -40, 0, 0],
      columns: [
        {
          margin: [40, 20, 0, 0],
          text: `${appointmentContent.footerLabel}`,
          bold: false,
          fontSize: 11,
        },
        {
          margin: [-44, 15, 0, 0],
          image:
            'data:image/png;base64,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',
          width: 68,
          height: 24,
          alignment: 'left',
        },
      ],
    });
  });
  it('returns patient test result with appointment data and location data if there is appointment and location in database', async () => {
    const testResult = {
      icd10: ['U07.D'],
      memberId: '2020052501',
      fillDate: new Date('2020-05-15'),
      orderNumber: '1234',
      memberFirstName: 'First',
      memberLastName: 'Last',
      memberDateOfBirth: '01/01/2000',
      date: 'June 23, 2020',
      time: '1:00 PM',
      productOrService: '00000190000',
      serviceDescription: 'COVID-19 Rapid Antigen Test',
      providerName: 'Test Provider',
      providerAddress: {
        address1: '123 E Main St',
        address2: 'Suite 200',
        city: 'Seattle',
        state: 'WA',
        zip: '55555',
      },
      factSheetLinks: ['(This is a test link)[https://prescryptive.com/]'],
      colorMyRx: '#000000',
      textColorMyRx: '#FFFFFF',
      descriptionMyRx: 'Test description',
      valueMyRx: 'POSITIVE',
      providerPhoneNumber: '(206) 555-1212',
      providerCliaNumber: '33D2184654',
      manufacturer: 'Test Manufacturer',
      testType: 'Viral – COVID-19 Antigen',
      administrationMethod: 'Nasal Swab',
    } as ITestResult;
    const testResultPdf = await buildPatientTestResultPdf(testResult);
    expect(testResultPdf).toContain(pdfMock);
  });

  it('Do not show label and information if information is not available or undefined', async () => {
    const testResult = {
      icd10: ['U07.D'],
      memberId: '2020052501',
      fillDate: new Date('2020-05-15'),
      orderNumber: '1234',
      memberFirstName: 'First',
      memberLastName: 'Last',
      memberDateOfBirth: '01/01/2000',
      date: 'June 23, 2020',
      time: '1:00 PM',
      productOrService: '00000190000',
      serviceDescription: 'COVID-19 Rapid Antigen Test',
      providerName: 'Test Provider',
      providerAddress: {
        address1: '123 E Main St',
        address2: 'Suite 200',
        city: 'Seattle',
        state: 'WA',
        zip: '55555',
      },
      factSheetLinks: ['(This is a test link)[https://prescryptive.com/]'],
      colorMyRx: '#000000',
      textColorMyRx: '#FFFFFF',
      descriptionMyRx: 'Test description',
      valueMyRx: 'POSITIVE',
      providerPhoneNumber: '(206) 555-1212',
      providerCliaNumber: '33D2184654',
      manufacturer: '',
      testType: '',
      administrationMethod: '',
    } as ITestResult;
    const testResultPdf = await buildPatientTestResultPdf(testResult);
    expect(testResultPdf).toContain(pdfUndefinedInfoMock);
  });
});
