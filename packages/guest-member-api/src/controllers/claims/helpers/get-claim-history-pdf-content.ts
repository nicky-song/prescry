// Copyright 2022 Prescryptive Health, Inc.

import { assertIsDefined } from '@phx/common/src/assertions/assert-is-defined';
import { CmsGroupKey } from '@phx/common/src/experiences/guest-experience/state/cms-content/cms-group-key';
import { CMSExperienceEnum } from '@phx/common/src/models/cms-content/experience.cms-content';
import { defaultLanguage } from '@phx/common/src/models/language';
import { findContentValue } from '@phx/common/src/utils/content/cms-content-wrapper.helper';
import { IConfiguration } from '../../../configuration';
import { searchAndCacheCMSContent } from '../../content/helpers/search-and-cache-cms-content';
import {
  ClaimHistoryPdfContentField,
  IClaimHistoryPdfContent,
} from './claim-history-pdf.content';

interface IClaimHistoryPdfCmsField {
  key: string;
  defaultValue: string;
}

export const getClaimHistoryPdfContent = async (
  configuration: IConfiguration
): Promise<IClaimHistoryPdfContent> => {
  const { content } = await searchAndCacheCMSContent(
    configuration,
    CmsGroupKey.claimHistoryPdf,
    defaultLanguage,
    2,
    CMSExperienceEnum.MYRX
  );

  const fieldKeyMap = new Map<
    ClaimHistoryPdfContentField,
    IClaimHistoryPdfCmsField
  >([
    ['amount', { key: 'amount', defaultValue: 'Amount' }],
    [
      'amountAppliedToDeductible',
      {
        key: 'amount-applied-to-deductible',
        defaultValue: 'Amount applied to deductible',
      },
    ],
    ['dateOfBirth', { key: 'date-of-birth', defaultValue: 'Date of birth' }],
    ['daysSupply', { key: 'days-supply', defaultValue: 'Days supply' }],
    ['fillDate', { key: 'fill-date', defaultValue: 'Fill date' }],
    [
      'footerPageInfo',
      { key: 'footer-page-info', defaultValue: 'Page {current} of {total}' },
    ],
    [
      'footerPrintedDate',
      { key: 'footer-printed-date', defaultValue: 'Printed on {date}' },
    ],
    ['format', { key: 'format', defaultValue: 'Format' }],
    [
      'medicationName',
      { key: 'medication-name', defaultValue: 'Medication name' },
    ],
    ['memberId', { key: 'member-id', defaultValue: 'Member ID' }],
    ['memberName', { key: 'member-name', defaultValue: 'Member name' }],
    [
      'patientInformation',
      { key: 'patient-information', defaultValue: 'Patient information' },
    ],
    [
      'patientPayAmount',
      { key: 'patient-pay-amount', defaultValue: 'Patient pay amount' },
    ],
    ['pharmacyName', { key: 'pharmacy-name', defaultValue: 'Pharmacy name' }],
    [
      'pharmacyPhoneNumber',
      { key: 'pharmacy-phone-number', defaultValue: 'Pharmacy phone number' },
    ],
    ['quantity', { key: 'quantity', defaultValue: 'Quantity' }],
    ['strength', { key: 'strength', defaultValue: 'Strength' }],
    ['title', { key: 'title', defaultValue: 'Claim history' }],
    ['total', { key: 'total', defaultValue: 'Total' }],
  ]);

  const findPdfContentValue = (fieldKey: ClaimHistoryPdfContentField) => {
    const cmsField = fieldKeyMap.get(fieldKey);
    assertIsDefined(cmsField);

    return findContentValue(cmsField.key, content) ?? cmsField.defaultValue;
  };

  return {
    amount: findPdfContentValue('amount'),
    amountAppliedToDeductible: findPdfContentValue('amountAppliedToDeductible'),
    dateOfBirth: findPdfContentValue('dateOfBirth'),
    daysSupply: findPdfContentValue('daysSupply'),
    fillDate: findPdfContentValue('fillDate'),
    footerPageInfo: findPdfContentValue('footerPageInfo'),
    footerPrintedDate: findPdfContentValue('footerPrintedDate'),
    format: findPdfContentValue('format'),
    medicationName: findPdfContentValue('medicationName'),
    memberId: findPdfContentValue('memberId'),
    memberName: findPdfContentValue('memberName'),
    patientInformation: findPdfContentValue('patientInformation'),
    patientPayAmount: findPdfContentValue('patientPayAmount'),
    pharmacyName: findPdfContentValue('pharmacyName'),
    pharmacyPhoneNumber: findPdfContentValue('pharmacyPhoneNumber'),
    quantity: findPdfContentValue('quantity'),
    strength: findPdfContentValue('strength'),
    title: findPdfContentValue('title'),
    total: findPdfContentValue('total'),
  };
};
