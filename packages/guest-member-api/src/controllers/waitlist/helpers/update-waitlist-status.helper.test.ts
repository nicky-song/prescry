// Copyright 2021 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { getRecentWaitlistForPhone } from '../../../databases/mongo-database/v1/query-helper/wait-list.query-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IServices } from '../../../models/services';
import { IWaitList } from '../../../models/wait-list';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { getServiceDetailsByServiceType } from '../../../utils/external-api/get-service-details-by-service-type';
import { generateBearerToken } from '../../provider-location/helpers/oauth-api-helper';
import { updateWaitlistStatus } from './update-waitlist-status.helper';

jest.mock('node-fetch');
jest.mock('../../../utils/get-data-from-url');
jest.mock(
  '../../../databases/mongo-database/v1/query-helper/wait-list.query-helper'
);
jest.mock('../../../controllers/provider-location/helpers/oauth-api-helper');
jest.mock('../../../utils/external-api/get-service-details-by-service-type');

const getRecentWaitlistForPhoneMock = getRecentWaitlistForPhone as jest.Mock;
const generateBearerTokenMock = generateBearerToken as jest.Mock;
const getDataFromUrlMock = getDataFromUrl as jest.Mock;
const getServiceDetailsByServiceTypeMock =
  getServiceDetailsByServiceType as jest.Mock;

const phoneNumberMock = 'phone-number';
const databaseMock = {
  Models: {},
} as unknown as IDatabase;
const configurationMock = {
  pharmacyPortalApiClientId: 'pharmacy-client-id',
  pharmacyPortalApiClientSecret: 'pharmacy-client-secret',
  pharmacyPortalApiScope: 'pharmacy-api-scope',
  pharmacyPortalApiTenantId: 'pharmacy-tenant-id',
  pharmacyPortalApiUrl: 'pharmacy-url',
  twilioAccountSid: 'twilio-account-id',
  twilioAuthToken: 'twilio-auth-token',
  twilioMessagingFromPhoneNumber: '+11234567890',
} as IConfiguration;

const mockServiceTypeDetails: IServices = {
  serviceType: 'abbott_antigen',
  procedureCode: '87811',
  serviceDescription: 'COVID-19 Rapid Antigen Test',
  serviceName: 'Antigen',
  serviceNameMyRx: 'mock-service-name',
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

describe('updatePharmacyPortalStatusForRemoveWaitlist', () => {
  beforeEach(() => {
    getRecentWaitlistForPhoneMock.mockReset();
    generateBearerTokenMock.mockReset();
    generateBearerTokenMock.mockResolvedValue('token');
    getDataFromUrlMock.mockReset();
    getServiceDetailsByServiceTypeMock.mockReset();
    getServiceDetailsByServiceTypeMock.mockReturnValue({
      service: mockServiceTypeDetails,
    });
  });

  it('returns NoWaitlistForPhone failure type response if no waitlist records for that person in DB', async () => {
    getRecentWaitlistForPhoneMock.mockReturnValueOnce(null);
    getServiceDetailsByServiceTypeMock.mockReturnValueOnce({ service: null });
    const result = await updateWaitlistStatus(
      phoneNumberMock,
      databaseMock,
      configurationMock
    );
    expect(result).toEqual({
      success: false,
      firstName: '',
      lastName: '',
      serviceType: '',
      serviceName: '',
      identifier: '',
      failureType: 'NoWaitlistForPhone',
    });
  });

  it('returns WaitlistCanceled failure type response if waitlist status is canceled in DB', async () => {
    const recentWaitList: Partial<IWaitList> = {
      phoneNumber: 'mock-phone-2',
      identifier: 'mock-code',
      serviceType: 'abbott_antigen',
      location: 'mock-location',
      status: 'cancelled',
      firstName: 'first-name',
      lastName: 'last-name',
      dateOfBirth: '2001-01-01',
    };

    getRecentWaitlistForPhoneMock.mockReturnValueOnce(recentWaitList);

    const result = await updateWaitlistStatus(
      phoneNumberMock,
      databaseMock,
      configurationMock
    );
    expect(result).toEqual({
      success: false,
      firstName: 'first-name',
      lastName: 'last-name',
      serviceType: 'abbott_antigen',
      serviceName: 'mock-service-name',
      identifier: 'mock-code',
      failureType: 'WaitlistCanceled',
    });
  });

  it('returns WaitlistFulfilled failure type response if waitlist status is fulfilled in DB', async () => {
    const recentWaitList: Partial<IWaitList> = {
      phoneNumber: 'mock-phone-2',
      identifier: 'mock-code',
      serviceType: 'abbott_antigen',
      location: 'mock-location',
      status: 'fulfilled',
      firstName: 'first-name',
      lastName: 'last-name',
      dateOfBirth: '2001-01-01',
    };

    getRecentWaitlistForPhoneMock.mockReturnValueOnce(recentWaitList);
    const result = await updateWaitlistStatus(
      phoneNumberMock,
      databaseMock,
      configurationMock
    );
    expect(result).toEqual({
      success: false,
      firstName: 'first-name',
      lastName: 'last-name',
      serviceType: 'abbott_antigen',
      serviceName: 'mock-service-name',
      identifier: 'mock-code',
      failureType: 'WaitlistFulfilled',
    });
  });
  it('updates status in pharmacy portal and returns success response if waitlist status is invited/null in DB', async () => {
    const recentWaitList: Partial<IWaitList> = {
      phoneNumber: 'mock-phone-2',
      identifier: 'mock-identifier',
      serviceType: 'abbott_antigen',
      location: 'mock-location',
      status: 'invited',
      firstName: 'first-name',
      lastName: 'last-name',
    };

    getDataFromUrlMock.mockResolvedValue({
      ok: true,
      json: {
        message: '',
        status: 204,
      },
    });

    getRecentWaitlistForPhoneMock.mockReturnValueOnce(recentWaitList);
    const result = await updateWaitlistStatus(
      phoneNumberMock,
      databaseMock,
      configurationMock
    );

    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );
    expect(getDataFromUrlMock).toBeCalledWith(
      'pharmacy-url/waitlist/mock-identifier',
      null,
      'DELETE',
      {
        Authorization: 'Bearer token',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    expect(result).toEqual({
      success: true,
      firstName: recentWaitList.firstName,
      lastName: recentWaitList.lastName,
      serviceType: recentWaitList.serviceType,
      serviceName: 'mock-service-name',
      identifier: recentWaitList.identifier,
    });
  });

  it('returns WaitlistError failure Type if pharmacy portal returns failure response', async () => {
    const recentWaitList: Partial<IWaitList> = {
      phoneNumber: 'mock-phone-2',
      identifier: 'mock-identifier',
      serviceType: 'abbott_antigen',
      location: 'mock-location',
      status: 'invited',
      firstName: 'first-name',
      lastName: 'last-name',
    };

    getDataFromUrlMock.mockResolvedValue({
      ok: false,
    });

    getRecentWaitlistForPhoneMock.mockReturnValueOnce(recentWaitList);
    const result = await updateWaitlistStatus(
      phoneNumberMock,
      databaseMock,
      configurationMock
    );

    expect(getServiceDetailsByServiceTypeMock).toHaveBeenCalledWith(
      configurationMock,
      recentWaitList.serviceType
    );

    expect(generateBearerTokenMock).toHaveBeenLastCalledWith(
      'pharmacy-tenant-id',
      'pharmacy-client-id',
      'pharmacy-client-secret',
      'pharmacy-api-scope'
    );
    expect(getDataFromUrlMock).toBeCalledWith(
      'pharmacy-url/waitlist/mock-identifier',
      null,
      'DELETE',
      {
        Authorization: 'Bearer token',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    expect(result).toEqual({
      success: false,
      firstName: recentWaitList.firstName,
      lastName: recentWaitList.lastName,
      serviceType: recentWaitList.serviceType,
      serviceName: 'mock-service-name',
      identifier: recentWaitList.identifier,
      failureType: 'WaitlistError',
    });
  });
});
