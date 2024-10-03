// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { ILocation } from '@phx/common/src/models/api-response/provider-location-details-response';
import {
  IProviderLocation,
  IService,
  ServiceTypes,
} from '@phx/common/src/models/provider-location';
import { SuccessConstants } from '../../../constants/response-messages';
import { SuccessResponse } from '../../../utils/response-helper';
import { generateSuccessResponseForLocation } from './generate-success-response-location.helper';
import { IServices } from '../../../models/services';
import { buildProviderLocationDetails } from './provider-location-details-map.helper';
import { assertIsDefined } from '@phx/common/src/assertions/assert-is-defined';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

jest.mock('./provider-location-details-map.helper');
const buildProviderLocationDetailsMock =
  buildProviderLocationDetails as jest.Mock;

jest.mock('../../../utils/response-helper');
const successResponseMock = SuccessResponse as jest.Mock;

jest.mock('@phx/common/src/assertions/assert-is-defined');
const assertIsDefinedMock = assertIsDefined as jest.Mock;

describe('generateSuccessResponseForLocation', () => {
  const routerResponseMock = {} as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns document found if request is valid', () => {
    const abbottAntigenServiceMock: IService = {
      serviceName: 'service-name',
      serviceDescription: 'service-desc',
      questions: [],
      serviceType: 'abbott_antigen',
      screenTitle: 'screen1',
      screenDescription: 'screen-desc',
      confirmationDescription: 'confirm-desc',
      duration: 15,
      minLeadDays: 'P6D',
      maxLeadDays: 'P30D',
    };

    const otherTestMock: IService = {
      serviceName: 'service-name2',
      serviceDescription: 'service-desc2',
      questions: [],
      serviceType: 'Other Testing',
      screenTitle: 'screen1',
      screenDescription: 'screen-desc',
      confirmationDescription: 'confirm-desc',
      duration: 15,
      minLeadDays: 'P6D',
      maxLeadDays: 'P30D',
    };

    const providerLocationMock = {
      identifier: 'id-1',
      providerInfo: {
        providerName: 'provider',
      },
      locationName: 'test-location',
      address1: 'mock-address1',
      address2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zip: 'mock-zip',
      phoneNumber: 'mock-phone',
      timezone: 'America/Los_Angeles',
      serviceList: [abbottAntigenServiceMock, otherTestMock],
    } as unknown as IProviderLocation;

    const providerLocationResponseMock = {
      id: 'id-1',
      providerName: 'provider',
      locationName: 'test-location',
      address1: 'mock-address1',
      address2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zip: 'mock-zip',
      distance: undefined,
      phoneNumber: 'mock-phone',
      timezone: 'America/Los_Angeles',
      serviceInfo: [
        {
          serviceName: 'service-name',
          serviceDescription: 'service-desc',
          questions: [],
          serviceType: 'COVID-19 Antigen Testing',
          screenTitle: 'screen1',
          screenDescription: 'screen-desc',
          minLeadDays: 'P6D',
          maxLeadDays: 'P30D',
        },
      ],
    } as unknown as ILocation;

    const mockServiceTypeDetails: IServices = {
      serviceType: 'abbott_antigen',
      procedureCode: '87811',
      serviceDescription: 'COVID-19 Rapid Antigen Test',
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
      administrationMethod: 'Nasal Swab',
      testType: 'Viral – COVID-19 Antigen',
    };

    buildProviderLocationDetailsMock.mockReturnValueOnce(
      providerLocationResponseMock
    );

    generateSuccessResponseForLocation(
      routerResponseMock,
      providerLocationMock,
      mockServiceTypeDetails
    );

    expectToHaveBeenCalledOnceOnlyWith(
      assertIsDefinedMock,
      abbottAntigenServiceMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      {
        location: providerLocationResponseMock,
        aboutDependentDescriptionMyRx: 'mock-dependent-desc',
        aboutQuestionsDescriptionMyRx: 'mock-question-desc',
        cancellationPolicyMyRx: 'mock-cancel',
        minimumAge: 10,
        serviceNameMyRx: 'mock-service name',
      }
    );
  });

  it('returns document found with default values if serviceTypeDetails does not have optional parameters', () => {
    const providerLocationMock = {
      identifier: 'id-1',
      providerInfo: {
        providerName: 'provider',
      },
      locationName: 'test-location',
      address1: 'mock-address1',
      address2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zip: 'mock-zip',
      phoneNumber: 'mock-phone',
      timezone: 'America/Los_Angeles',
      serviceList: [
        {
          serviceName: 'service-name',
          serviceDescription: 'service-desc',
          questions: [],
          serviceType: ServiceTypes.c19Vaccine,
          screenTitle: 'screen1',
          screenDescription: 'screen-desc',
          confirmationTitle: 'confirm-title',
          confirmationDescription: 'confirm-desc',
          duration: 15,
          minLeadDays: 'P6D',
          maxLeadDays: 'P30D',
        },
        {
          serviceName: 'service-name2',
          serviceDescription: 'service-desc2',
          questions: [],
          serviceType: 'Other Testing',
          screenTitle: 'screen1',
          screenDescription: 'screen-desc',
          confirmationTitle: 'confirm-title',
          confirmationDescription: 'confirm-desc',
          duration: 15,
          minLeadDays: 'P6D',
          maxLeadDays: 'P30D',
        },
      ],
      regionName: 'Western Washington',
    } as unknown as IProviderLocation;
    const providerLocationResponseMock = {
      id: 'id-1',
      providerName: 'provider',
      locationName: 'test-location',
      address1: 'mock-address1',
      address2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zip: 'mock-zip',
      distance: undefined,
      phoneNumber: 'mock-phone',
      timezone: 'America/Los_Angeles',
      serviceInfo: [],
    } as unknown as ILocation;

    const mockServiceTypeDetails: IServices = {
      serviceType: 'abbott_antigen',
      procedureCode: '87811',
      serviceDescription: 'COVID-19 Rapid Antigen Test',
      serviceName: 'Antigen',
      serviceNameMyRx: 'mock-service name',
      confirmationDescriptionMyRx: 'mock-conf-desc',
      aboutDependentDescriptionMyRx: 'mock-dependent-desc',
      aboutQuestionsDescriptionMyRx: 'mock-question-desc',
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
      administrationMethod: 'Nasal Swab',
      testType: 'Viral – COVID-19 Antigen',
    };

    buildProviderLocationDetailsMock.mockResolvedValue(
      providerLocationResponseMock
    );

    generateSuccessResponseForLocation(
      routerResponseMock,
      providerLocationMock,
      mockServiceTypeDetails
    );
    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      {
        location: buildProviderLocationDetailsMock(),
        aboutDependentDescriptionMyRx:
          mockServiceTypeDetails.aboutDependentDescriptionMyRx,
        aboutQuestionsDescriptionMyRx:
          mockServiceTypeDetails.aboutQuestionsDescriptionMyRx,
        cancellationPolicyMyRx: '',
        minimumAge: 0,
        serviceNameMyRx: mockServiceTypeDetails.serviceNameMyRx,
      }
    );
  });
});
