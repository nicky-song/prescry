// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '@phx/common/src/experiences/guest-experience/state/cms-content/cms-group-key';
import { IUICMSResponse } from '@phx/common/src/models/api-response/ui-content-response';
import { CMSExperienceEnum } from '@phx/common/src/models/cms-content/experience.cms-content';
import { defaultLanguage } from '@phx/common/src/models/language';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { findContentValue } from '@phx/common/src/utils/content/cms-content-wrapper.helper';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { ICMSContentSearchResponse } from '../../../utils/external-api/cms-api-content/get-cms-api-content';
import { searchAndCacheCMSContent } from '../../content/helpers/search-and-cache-cms-content';
import { IClaimHistoryPdfContent } from './claim-history-pdf.content';
import { getClaimHistoryPdfContent } from './get-claim-history-pdf-content';

jest.mock('../../content/helpers/search-and-cache-cms-content');
const searchAndCacheCMSContentMock = searchAndCacheCMSContent as jest.Mock;

jest.mock('@phx/common/src/utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;

describe('getClaimHistoryPdfContent', () => {
  const cmsContentMock: IUICMSResponse[] = [
    {
      fieldKey: 'field-key',
      groupKey: 'group-key',
      language: 'English',
      type: 'Text',
      value: 'value',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    searchAndCacheCMSContentMock.mockResolvedValue({});
  });

  it('gets content', async () => {
    const cmsFieldList: string[] = [
      'amount',
      'amount-applied-to-deductible',
      'date-of-birth',
      'days-supply',
      'fill-date',
      'footer-page-info',
      'footer-printed-date',
      'format',
      'medication-name',
      'member-id',
      'member-name',
      'patient-information',
      'patient-pay-amount',
      'pharmacy-name',
      'pharmacy-phone-number',
      'quantity',
      'strength',
      'title',
      'total',
    ];

    cmsFieldList.forEach((value) => {
      findContentValueMock.mockReturnValueOnce(value + '-mock');
    });

    const responseMock: ICMSContentSearchResponse = {
      content: cmsContentMock,
    };
    searchAndCacheCMSContentMock.mockResolvedValue(responseMock);

    const content = await getClaimHistoryPdfContent(configurationMock);

    expectToHaveBeenCalledOnceOnlyWith(
      searchAndCacheCMSContentMock,
      configurationMock,
      CmsGroupKey.claimHistoryPdf,
      defaultLanguage,
      2,
      CMSExperienceEnum.MYRX
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(cmsFieldList.length);
    cmsFieldList.forEach((fieldKey, index) => {
      expect(findContentValueMock).toHaveBeenNthCalledWith(
        index + 1,
        fieldKey,
        cmsContentMock
      );
    });

    const expectedContent: IClaimHistoryPdfContent = {
      amount: 'amount-mock',
      amountAppliedToDeductible: 'amount-applied-to-deductible-mock',
      dateOfBirth: 'date-of-birth-mock',
      daysSupply: 'days-supply-mock',
      fillDate: 'fill-date-mock',
      footerPageInfo: 'footer-page-info-mock',
      footerPrintedDate: 'footer-printed-date-mock',
      format: 'format-mock',
      medicationName: 'medication-name-mock',
      memberId: 'member-id-mock',
      memberName: 'member-name-mock',
      patientInformation: 'patient-information-mock',
      patientPayAmount: 'patient-pay-amount-mock',
      pharmacyName: 'pharmacy-name-mock',
      pharmacyPhoneNumber: 'pharmacy-phone-number-mock',
      quantity: 'quantity-mock',
      strength: 'strength-mock',
      title: 'title-mock',
      total: 'total-mock',
    };

    expect(content).toEqual(expectedContent);
  });

  it('gets default content', async () => {
    const responseMock: ICMSContentSearchResponse = {
      content: cmsContentMock,
    };
    searchAndCacheCMSContentMock.mockResolvedValue(responseMock);

    findContentValueMock.mockReturnValue(undefined);

    const content = await getClaimHistoryPdfContent(configurationMock);

    const expectedContent: IClaimHistoryPdfContent = {
      amount: 'Amount',
      amountAppliedToDeductible: 'Amount applied to deductible',
      dateOfBirth: 'Date of birth',
      daysSupply: 'Days supply',
      fillDate: 'Fill date',
      footerPageInfo: 'Page {current} of {total}',
      footerPrintedDate: 'Printed on {date}',
      format: 'Format',
      medicationName: 'Medication name',
      memberId: 'Member ID',
      memberName: 'Member name',
      patientInformation: 'Patient information',
      patientPayAmount: 'Patient pay amount',
      pharmacyName: 'Pharmacy name',
      pharmacyPhoneNumber: 'Pharmacy phone number',
      quantity: 'Quantity',
      strength: 'Strength',
      title: 'Claim history',
      total: 'Total',
    };

    expect(content).toEqual(expectedContent);
  });
});
