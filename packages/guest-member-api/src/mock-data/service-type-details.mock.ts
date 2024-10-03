// Copyright 2021 Prescryptive Health, Inc.

import { IServices } from '../models/services';

export const mockServiceTypeDetails: IServices = {
  serviceType: 'abbott_antigen',
  procedureCode: '87811',
  serviceName: 'Antigen',
  serviceNameMyRx: 'mock-service name',
  confirmationDescriptionMyRx: 'mock-conf-desc',
  aboutDependentDescriptionMyRx: 'mock-dependent-desc',
  aboutQuestionsDescriptionMyRx: 'mock-question-desc',
  cancellationPolicyMyRx: 'mock-cancel',
  minimumAge: 10,
  claimOptions: [
    {
      claimOptionId: '87833b25-bac2-443c-9bc4-aa3c837c9950',
      factSheetLinks: ['https://www.fda.gov/media/141569/download'],
      icd10Code: {
        code: 'U07.1',
        colorMyRx: 'red',
        valueMyRx: 'POSITIVE',
        descriptionMyRx: 'mock-description',
      },
      productOrServiceId: 'ABBNC19AG',
    },
    {
      claimOptionId: 'a42cfff0-af42-4e61-93fd-1736534d9068',
      factSheetLinks: ['https://www.fda.gov/media/141569/download'],
      icd10Code: {
        code: 'Z03.818',
        colorMyRx: 'green',
        valueMyRx: 'NEGATIVE',
        descriptionMyRx: 'mock-description-negative',
      },
      productOrServiceId: 'ABBNC19AG',
    },
  ],
};
