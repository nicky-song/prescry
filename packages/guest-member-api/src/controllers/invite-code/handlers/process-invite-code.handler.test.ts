// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '@phx/common/src/errors/error-codes';
import { processInviteCodeHandler } from './process-invite-code.handler';
import { ServiceTypes } from '@phx/common/src/models/provider-location';
import { badRequestForInviteCodeResponse } from '../helpers/bad-request-response.helper';
import { getWaitListByIdentifier } from '../../../databases/mongo-database/v1/query-helper/wait-list.query-helper';
import { IWaitList } from '../../../models/wait-list';
import { CalculateAbsoluteAge } from '@phx/common/src/utils/date-time-helper';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import {
  convertToBookingAvailability,
  getAvailableBookingSlotsEndpointHelper,
} from '../../provider-location/helpers/get-available-booking-slots-endpoint.helper';
import { IAvailableBookingSlotsResponse } from '../../../models/pharmacy-portal/get-available-booking-slots.response';
import { IGetAvailableBookingSlotsRequest } from '../../../models/pharmacy-portal/get-available-booking-slots.request';
import { getSlotsAndUnavailableDays } from '../../provider-location/helpers/get-slots-and-unavailable-days';
import { IAvailableSlotsData } from '@phx/common/src/models/api-response/available-slots-response';
import { IBookingAvailability } from '@phx/common/src/models/booking/booking-availability.response';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import { ApiConstants } from '../../../constants/api-constants';
import {
  providerLocationResponseWithoutServicesMock,
  providerLocationResponseWithServiceTypeAndSurveyFilterMock,
  providerLocationResponseWithVaccineServiceFilterMock,
} from '../../../mock-data/provider-location.mock';
import { getProviderLocationByIdAndServiceType } from '../../provider-location/helpers/get-provider-location-by-id-and-service-type.helper';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { buildProviderLocationDetails } from '../../provider-location/helpers/provider-location-details-map.helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { assertIsDefined } from '@phx/common/src/assertions/assert-is-defined';
import { databaseMock } from '../../../mock-data/database.mock';

jest.mock('@phx/common/src/utils/date-time-helper');
jest.mock('../../../utils/response-helper');
jest.mock('../helpers/bad-request-response.helper');
jest.mock(
  '../../../databases/mongo-database/v1/query-helper/wait-list.query-helper'
);
jest.mock(
  '../../provider-location/helpers/get-provider-location-by-id-and-service-type.helper'
);
jest.mock(
  '../../provider-location/helpers/get-available-booking-slots-endpoint.helper'
);
jest.mock('../../provider-location/helpers/get-slots-and-unavailable-days');
jest.mock(
  '../../provider-location/helpers/provider-location-details-map.helper'
);
jest.mock('../../../utils/request/request-app-locals.helper');

const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const calculateAbsoluteAgeMock = CalculateAbsoluteAge as jest.Mock;
const badRequestForInviteCodeResponseMock =
  badRequestForInviteCodeResponse as jest.Mock;
const getWaitListByIdentifierMock = getWaitListByIdentifier as jest.Mock;
const getAvailableBookingSlotsEndpointHelperMock =
  getAvailableBookingSlotsEndpointHelper as jest.Mock;
const convertToBookingAvailabilityMock =
  convertToBookingAvailability as jest.Mock;
const getSlotsAndUnavailableDaysMock = getSlotsAndUnavailableDays as jest.Mock;
const getProviderLocationByIdAndServiceTypeMock =
  getProviderLocationByIdAndServiceType as jest.Mock;
const buildProviderLocationDetailsMock =
  buildProviderLocationDetails as jest.Mock;
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

describe('processInviteCodeHandler', () => {
  const requestMock = {
    params: { code: 'mock-code' },
  } as unknown as Request;

  const routerResponseMock = {
    locals: {
      account: { dateOfBirth: '2000-02-02', phoneNumber: 'mock-phone' },
    },
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
    getProviderLocationByIdAndServiceTypeMock.mockReturnValue(
      providerLocationResponseWithServiceTypeAndSurveyFilterMock
    );
    getRequiredResponseLocalMock.mockReturnValue(
      routerResponseMock.locals.account
    );
    calculateAbsoluteAgeMock.mockReturnValue(20);
  });

  describe('processInviteCodeHandler failure cases', () => {
    it('returns error if invite code is not provided', async () => {
      const requestLocalMock = {
        params: {},
      } as unknown as Request;
      const routerResponseLocalMock = {} as Response;

      await processInviteCodeHandler(
        requestLocalMock,
        routerResponseLocalMock,
        databaseMock,
        configurationMock
      );

      expect(badRequestForInviteCodeResponseMock).toBeCalledTimes(1);
      expect(badRequestForInviteCodeResponseMock).toHaveBeenCalledWith(
        routerResponseLocalMock,
        ErrorConstants.INVITE_CODE_MISSING,
        InternalResponseCode.INVITE_CODE_MISSING
      );
      expect(getWaitListByIdentifierMock).not.toHaveBeenCalled();
    });

    it('returns error if invite code does not exist in database', async () => {
      getWaitListByIdentifierMock.mockReturnValueOnce(null);
      await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );

      expect(badRequestForInviteCodeResponseMock).toBeCalledTimes(1);
      expect(badRequestForInviteCodeResponseMock).toHaveBeenCalledWith(
        routerResponseMock,
        ErrorConstants.INVITE_CODE_EXPIRED,
        InternalResponseCode.INVITE_CODE_EXPIRED
      );
      expect(getWaitListByIdentifierMock).toBeCalledTimes(1);
      expect(getWaitListByIdentifierMock).toHaveBeenCalledWith(
        databaseMock,
        'mock-code'
      );
    });

    it('returns error if invite code phone does not match with user phone', async () => {
      const waitList: Partial<IWaitList> = {
        phoneNumber: 'mock-phone-2',
        identifier: 'mock-code',
        serviceType: 'mock-service',
        location: 'mock-location',
        status: 'none',
      };
      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);
      await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );

      expect(knownFailureResponseMock).toBeCalledTimes(1);
      expect(knownFailureResponseMock).toHaveBeenCalledWith(
        routerResponseMock,
        HttpStatusCodes.UNAUTHORIZED_REQUEST,
        ErrorConstants.INVITE_CODE_INVALID_PHONE_NUMBER,
        undefined,
        InternalResponseCode.INVITE_CODE_INVALID_PHONE_NUMBER
      );
    });

    it('returns error if invite code is already used and status is not invited', async () => {
      const waitList: Partial<IWaitList> = {
        phoneNumber: 'mock-phone',
        identifier: 'mock-code',
        serviceType: 'mock-service',
        location: 'mock-location',
        status: 'none',
      };
      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);

      await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );

      expect(badRequestForInviteCodeResponseMock).toBeCalledTimes(1);
      expect(badRequestForInviteCodeResponseMock).toHaveBeenCalledWith(
        routerResponseMock,
        ErrorConstants.INVITE_CODE_ALREADY_USED,
        InternalResponseCode.INVITE_CODE_ALREADY_USED
      );
    });

    it('returns error if invite code is for past dates', async () => {
      const waitList: Partial<IWaitList> = {
        phoneNumber: 'mock-phone',
        identifier: 'mock-code',
        serviceType: 'mock-service',
        location: 'mock-location',
        status: 'invited',
        invitation: {
          start: '2021-02-16T14:48:00.000Z',
          end: '2021-02-20T14:48:00.000Z',
        },
      };
      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);

      const dateMock = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1616198400000);
      await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
      dateMock.mockRestore();
      expect(badRequestForInviteCodeResponseMock).toBeCalledTimes(1);
      expect(badRequestForInviteCodeResponseMock).toHaveBeenCalledWith(
        routerResponseMock,
        ErrorConstants.INVITE_CODE_EXPIRED,
        InternalResponseCode.INVITE_CODE_EXPIRED
      );
    });

    it('returns error if invite code does not have location', async () => {
      const waitList: Partial<IWaitList> = {
        phoneNumber: 'mock-phone',
        identifier: 'mock-code',
        serviceType: 'mock-service',
        status: 'invited',
        invitation: {
          start: '2021-02-16T14:48:00.000Z',
          end: '2021-02-20T14:48:00.000Z',
        },
      };
      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);

      const dateMock = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1613692800000);
      await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
      dateMock.mockRestore();
      expect(badRequestForInviteCodeResponseMock).toBeCalledTimes(1);
      expect(badRequestForInviteCodeResponseMock).toHaveBeenCalledWith(
        routerResponseMock,
        ErrorConstants.INVITE_CODE_EXPIRED,
        InternalResponseCode.INVITE_CODE_EXPIRED
      );
    });

    it('returns error if user is not of booking age limit', async () => {
      const routerResponseLocalMock = {
        locals: {
          account: { dateOfBirth: '2010-02-02', phoneNumber: 'mock-phone' },
        },
      } as unknown as Response;
      getRequiredResponseLocalMock.mockReturnValueOnce(
        routerResponseLocalMock.locals.account
      );
      calculateAbsoluteAgeMock.mockReturnValueOnce(10);
      const waitList: Partial<IWaitList> = {
        phoneNumber: 'mock-phone',
        identifier: 'mock-code',
        serviceType: ServiceTypes.antigen,
        location: 'mock-location',
        status: 'invited',
        invitation: {
          start: '2021-02-16T14:48:00.000Z',
          end: '2021-02-25T14:48:00.000Z',
        },
      };
      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);
      const dateMock = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1613692800000);
      await processInviteCodeHandler(
        requestMock,
        routerResponseLocalMock,
        databaseMock,
        configurationMock
      );
      dateMock.mockRestore();

      const serviceTypeDetails =
        providerLocationResponseWithServiceTypeAndSurveyFilterMock.service;
      assertIsDefined(serviceTypeDetails);

      expect(badRequestForInviteCodeResponseMock).toBeCalledTimes(1);
      expect(badRequestForInviteCodeResponseMock).toHaveBeenCalledWith(
        routerResponseLocalMock,
        StringFormatter.format(
          ErrorConstants.DEEP_LINK_SCHEDULER_AGE_REQUIREMENT_NOT_MET,
          new Map<string, string>([
            [
              'ageRequirement',
              (
                serviceTypeDetails.schedulerMinimumAge ||
                ApiConstants.SCHEDULER_MIN_AGE_LIMIT
              ).toString(),
            ],
            ['serviceName', serviceTypeDetails.serviceName],
            ['supportEmail', configurationMock.supportEmail],
          ])
        ),
        InternalResponseCode.SCHEDULER_AGE_REQUIREMENT_NOT_MET
      );
    });

    it('returns error if invite code has invalid service', async () => {
      const waitList: Partial<IWaitList> = {
        phoneNumber: 'mock-phone',
        identifier: 'mock-code',
        serviceType: 'mock-service',
        location: 'mock-location',
        status: 'invited',
        invitation: {
          start: '2021-02-16T14:48:00.000Z',
          end: '2021-02-20T14:48:00.000Z',
        },
      };
      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);
      getProviderLocationByIdAndServiceTypeMock.mockReturnValueOnce(
        providerLocationResponseWithoutServicesMock
      );

      const dateMock = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1613692800000);
      await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
      dateMock.mockRestore();
      expect(badRequestForInviteCodeResponseMock).toBeCalledTimes(1);
      expect(badRequestForInviteCodeResponseMock).toHaveBeenCalledWith(
        routerResponseMock,
        ErrorConstants.INVALID_SERVICE_TYPE,
        InternalResponseCode.INVITE_CODE_EXPIRED
      );
      expect(getAvailableBookingSlotsEndpointHelperMock).not.toHaveBeenCalled();
    });

    it('returns error if invite code has service which is set to off', async () => {
      const waitList: Partial<IWaitList> = {
        phoneNumber: 'mock-phone',
        identifier: 'mock-code',
        serviceType: ServiceTypes.c19VaccineDose1,
        location: 'mock-location',
        status: 'invited',
        invitation: {
          start: '2021-02-16T14:48:00.000Z',
          end: '2021-02-20T14:48:00.000Z',
        },
      };
      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);

      const serviceWithOffStatus = {
        ...providerLocationResponseWithVaccineServiceFilterMock,
        location: {
          ...providerLocationResponseWithVaccineServiceFilterMock.location,
          serviceList: [
            {
              serviceName: 'COVID-19 vaccine dose 1',
              serviceDescription: 'fake-desc',
              questions: [],
              serviceType: 'c19-vaccine-dose1',
              screenTitle: 'screen1',
              screenDescription: 'screen-desc',
              confirmationDescription: 'confirm-desc',
              duration: 15,
              minLeadDays: 'P6D',
              maxLeadDays: 'P30D',
              status: 'off',
            },
          ],
        },
      };
      getProviderLocationByIdAndServiceTypeMock.mockReturnValueOnce(
        serviceWithOffStatus
      );

      const dateMock = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1613692800000);
      await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
      dateMock.mockRestore();
      expect(badRequestForInviteCodeResponseMock).toBeCalledTimes(1);
      expect(badRequestForInviteCodeResponseMock).toHaveBeenCalledWith(
        routerResponseMock,
        ErrorConstants.INVALID_SERVICE_TYPE,
        InternalResponseCode.INVITE_CODE_EXPIRED
      );
      expect(getAvailableBookingSlotsEndpointHelperMock).not.toHaveBeenCalled();
    });

    it('returns error if invite code end is with in minLeadDays for the service', async () => {
      const waitList: Partial<IWaitList> = {
        phoneNumber: 'mock-phone',
        identifier: 'mock-code',
        serviceType: ServiceTypes.c19VaccineDose1,
        location: 'mock-location',
        status: 'invited',
        invitation: {
          start: '2021-02-16T14:48:00.000Z',
          end: '2021-03-21T14:48:00.000Z',
        },
      };
      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);
      const serviceWithminLeadDays = {
        ...providerLocationResponseWithVaccineServiceFilterMock,
        location: {
          ...providerLocationResponseWithVaccineServiceFilterMock.location,
          serviceList: [
            {
              serviceName: 'COVID-19 vaccine dose 1',
              serviceDescription: 'fake-desc',
              questions: [],
              serviceType: 'c19-vaccine-dose1',
              screenTitle: 'screen1',
              screenDescription: 'screen-desc',
              confirmationDescription: 'confirm-desc',
              duration: 15,
              minLeadDays: 'P3D',
              maxLeadDays: 'P30D',
              status: 'everyone',
            },
          ],
        },
      };
      getProviderLocationByIdAndServiceTypeMock.mockReturnValueOnce(
        serviceWithminLeadDays
      );
      const dateMock = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1616198400000);
      await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
      dateMock.mockRestore();
      expect(badRequestForInviteCodeResponseMock).toBeCalledTimes(1);
      expect(badRequestForInviteCodeResponseMock).toHaveBeenCalledWith(
        routerResponseMock,
        ErrorConstants.INVITE_CODE_EXPIRED,
        InternalResponseCode.INVITE_CODE_EXPIRED
      );
      expect(getProviderLocationByIdAndServiceTypeMock).toBeCalledTimes(1);

      expect(getAvailableBookingSlotsEndpointHelperMock).not.toBeCalled();
    });

    it('returns error if  getAvailabileBookingSlots endpoint returns error for getting availability', async () => {
      const waitList: Partial<IWaitList> = {
        phoneNumber: 'mock-phone',
        identifier: 'mock-code',
        serviceType: ServiceTypes.antigen,
        location: 'mock-location',
        status: 'invited',
        invitation: {
          start: '2021-02-16T14:48:00.000Z',
          end: '2021-02-20T14:48:00.000Z',
        },
      };
      const mockApiResponse: IAvailableBookingSlotsResponse = {
        errorCode: 404,
        message: 'error',
      };
      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);

      getAvailableBookingSlotsEndpointHelperMock.mockResolvedValue(
        mockApiResponse
      );
      const dateMock = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1611866127000);
      await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
      dateMock.mockRestore();
      expect(getAvailableBookingSlotsEndpointHelperMock).toBeCalledTimes(1);
      expect(knownFailureResponseMock).toBeCalledTimes(1);
      expect(knownFailureResponseMock).toHaveBeenCalledWith(
        routerResponseMock,
        404,
        'error'
      );
      expect(convertToBookingAvailabilityMock).not.toHaveBeenCalled();
    });

    it('returns error if there is no slots available for the invite code', async () => {
      const waitList: Partial<IWaitList> = {
        phoneNumber: 'mock-phone',
        identifier: 'mock-code',
        serviceType: ServiceTypes.antigen,
        location: 'mock-location',
        status: 'invited',
        invitation: {
          start: '2021-02-16T14:48:00.000Z',
          end: '2021-02-22T14:48:00.000Z',
        },
      };
      const mockApiResponse: IAvailableBookingSlotsResponse = {
        slots: [],
        message: 'success',
      };

      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);
      getAvailableBookingSlotsEndpointHelperMock.mockReturnValueOnce(
        mockApiResponse
      );
      const dateMock = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1611866127000);
      await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
      dateMock.mockRestore();
      expect(getAvailableBookingSlotsEndpointHelperMock).toBeCalledTimes(1);
      expect(badRequestForInviteCodeResponseMock).toBeCalledTimes(1);
      expect(badRequestForInviteCodeResponseMock).toHaveBeenCalledWith(
        routerResponseMock,
        ErrorConstants.INVITE_CODE_ALL_SLOTS_USED,
        InternalResponseCode.INVITE_CODE_ALL_SLOTS_USED
      );
      expect(successResponseMock).not.toHaveBeenCalled();
    });

    it('returns error if slots are undefined for the invite code', async () => {
      const waitList: Partial<IWaitList> = {
        phoneNumber: 'mock-phone',
        identifier: 'mock-code',
        serviceType: ServiceTypes.antigen,
        location: 'mock-location',
        status: 'invited',
        invitation: {
          start: '2021-02-16T14:48:00.000Z',
          end: '2021-02-22T14:48:00.000Z',
        },
      };
      const mockApiResponse: IAvailableBookingSlotsResponse = {
        slots: undefined,
        message: 'error-test',
      };

      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);
      getAvailableBookingSlotsEndpointHelperMock.mockReturnValueOnce(
        mockApiResponse
      );
      const dateMock = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1611866127000);
      await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
      dateMock.mockRestore();

      assertIsDefined(
        providerLocationResponseWithServiceTypeAndSurveyFilterMock.location
          ?.identifier
      );
      assertIsDefined(
        providerLocationResponseWithServiceTypeAndSurveyFilterMock.service
          ?.serviceType
      );

      expect(getAvailableBookingSlotsEndpointHelperMock).toHaveBeenCalledWith(
        configurationMock,
        {
          locationId:
            providerLocationResponseWithServiceTypeAndSurveyFilterMock.location
              .identifier,
          serviceType:
            providerLocationResponseWithServiceTypeAndSurveyFilterMock.service
              .serviceType,
          start: '2021-02-16T06:48:00-08:00',
          end: '2021-02-22T06:48:00-08:00',
        } as IGetAvailableBookingSlotsRequest
      );

      expect(getAvailableBookingSlotsEndpointHelperMock).toBeCalledTimes(1);
      expect(knownFailureResponseMock).toBeCalledTimes(1);
      expect(knownFailureResponseMock).toHaveBeenCalledWith(
        routerResponseMock,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'error-test'
      );
      expect(successResponseMock).not.toHaveBeenCalled();
    });

    it('returns error if any exception', async () => {
      const error = { message: 'internal error' };
      getWaitListByIdentifierMock.mockImplementationOnce(() => {
        throw error;
      });

      await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
      expect(unknownFailureResponseMock).toBeCalledTimes(1);
      expect(unknownFailureResponseMock).toHaveBeenCalledWith(
        routerResponseMock,
        ErrorConstants.INTERNAL_SERVER_ERROR,
        error
      );
    });
  });

  describe('processInviteCodeHandler success cases', () => {
    const waitListModel: Partial<IWaitList> = {
      phoneNumber: 'mock-phone',
      identifier: 'mock-code',
      serviceType: ServiceTypes.antigen,
      location: 'mock-location',
      status: 'invited',
      invitation: {
        start: '2021-03-10T14:48:00.000Z',
        end: '2021-03-12T14:48:00.000Z',
      },
    };

    const mockApiResponse: IAvailableBookingSlotsResponse = {
      slots: ['2021-02-16T08:00:00'],
      message: 'success',
    };

    const mockConvertToBookingAvailabilityResponse: IBookingAvailability[] = [
      {
        date: new Date('2021-02-16T00:00:00'),
        slots: [new Date('2021-02-16T08:00:00')],
      },
    ];
    const expectedService = {
      serviceName: 'service_name',
      serviceType: ServiceTypes.antigen,
      questions: [],
      screenTitle: 'screen1',
      screenDescription: 'screen-desc',
      confirmationAdditionalInfo: 'confirm-add-info',
      minLeadDays: 'P3D',
      maxLeadDays: 'P30D',
      paymentRequired: false,
    };

    const expectedLocation = {
      id: 'mock-location',
      providerName: 'test-location',
      locationName: 'test-location',
      address1: 'mock-address1',
      address2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zip: 'mock-zip',
      distance: 0,
      phoneNumber: 'mock-phone',
      timezone: 'America/Los_Angeles',
      serviceInfo: [expectedService],
    };

    beforeEach(() => {
      buildProviderLocationDetailsMock.mockReturnValueOnce(expectedLocation);
    });

    it('it returns correct success response if all details for invite code is valid', async () => {
      const waitList = {
        ...waitListModel,
        invitation: {
          start: '2021-02-16T14:48:00.000Z',
          end: '2021-02-25T14:48:00.000Z',
        },
      };

      const mockGetAvailabilityResponse: IAvailableSlotsData = {
        slots: [
          {
            start: '2021-02-16T08:00:00',
            day: '2021-02-16',
            slotName: '8:00 am',
          },
          {
            start: '2021-02-16T08:15:00',
            day: '2021-02-16',
            slotName: '8:15 am',
          },
          {
            start: '2021-02-16T08:30:00',
            day: '2021-02-16',
            slotName: '8:30 am',
          },
          {
            start: '2021-02-18T15:00:00',
            day: '2021-02-18',
            slotName: '3:00 pm',
          },
          {
            start: '2021-02-18T16:15:00',
            day: '2021-02-18',
            slotName: '4:15 pm',
          },
        ],
        unAvailableDays: ['2021-02-17', '2021-02-19', '2021-02-20'],
      };
      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);
      getAvailableBookingSlotsEndpointHelperMock.mockResolvedValue(
        mockApiResponse
      );
      convertToBookingAvailabilityMock.mockReturnValueOnce(
        mockConvertToBookingAvailabilityResponse
      );
      getSlotsAndUnavailableDaysMock.mockReturnValueOnce(
        mockGetAvailabilityResponse
      );
      const expected = {};
      successResponseMock.mockReturnValue(expected);
      const dateMock = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1613692800000);
      const actual = await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
      dateMock.mockRestore();

      assertIsDefined(
        providerLocationResponseWithServiceTypeAndSurveyFilterMock.location
          ?.identifier
      );
      assertIsDefined(
        providerLocationResponseWithServiceTypeAndSurveyFilterMock.service
          ?.serviceType
      );

      expect(getAvailableBookingSlotsEndpointHelperMock).toHaveBeenCalledWith(
        configurationMock,
        {
          locationId:
            providerLocationResponseWithServiceTypeAndSurveyFilterMock.location
              .identifier,
          serviceType:
            providerLocationResponseWithServiceTypeAndSurveyFilterMock.service
              .serviceType,
          start: '2021-02-24T00:00:00-08:00',
          end: '2021-02-25T06:48:00-08:00',
        } as IGetAvailableBookingSlotsRequest
      );
      expect(getAvailableBookingSlotsEndpointHelperMock).toBeCalledTimes(1);

      expect(convertToBookingAvailabilityMock).toHaveBeenCalledWith(
        '2021-02-24T00:00:00-08:00',
        '2021-02-25T06:48:00-08:00',
        mockApiResponse.slots
      );
      expect(convertToBookingAvailabilityMock).toBeCalledTimes(1);

      expect(getSlotsAndUnavailableDaysMock).toHaveBeenCalledWith(
        mockConvertToBookingAvailabilityResponse
      );
      expect(getSlotsAndUnavailableDaysMock).toBeCalledTimes(1);

      expect(successResponseMock).toHaveBeenCalledTimes(1);
      expect(actual).toBe(expected);

      const expectedResponse = {
        location: expectedLocation,
        availableSlots: mockGetAvailabilityResponse,
        service: expectedService,
        inviteCode: 'mock-code',
        minDate: '2021-02-24T00:00:00-08:00',
        maxDate: '2021-02-25T06:48:00-08:00',
        aboutDependentDescriptionMyRx: 'dependent policy text',
        aboutQuestionsDescriptionMyRx: 'primary person appointment text',
        cancellationPolicyMyRx: 'cancellation policy text',
        minimumAge: 3,
        serviceNameMyRx: 'service-name-myrx',
      };
      expect(successResponseMock).toHaveBeenNthCalledWith(
        1,
        routerResponseMock,
        SuccessConstants.SUCCESS_OK,
        expectedResponse
      );
    });
    it('it uses start date from invite if start date is in future', async () => {
      const waitList = {
        ...waitListModel,
        invitation: {
          start: '2021-03-10T14:48:00.000Z',
          end: '2021-03-12T14:48:00.000Z',
        },
      };

      const mockGetAvailabilityResponse: IAvailableSlotsData = {
        slots: [
          {
            start: '2021-02-16T08:00:00',
            day: '2021-02-16',
            slotName: '8:00 am',
          },
          {
            start: '2021-02-16T08:15:00',
            day: '2021-02-16',
            slotName: '8:15 am',
          },
          {
            start: '2021-02-16T08:30:00',
            day: '2021-02-16',
            slotName: '8:30 am',
          },
          {
            start: '2021-02-18T15:00:00',
            day: '2021-02-18',
            slotName: '3:00 pm',
          },
          {
            start: '2021-02-18T16:15:00',
            day: '2021-02-18',
            slotName: '4:15 pm',
          },
        ],
        unAvailableDays: ['2021-02-17', '2021-02-19', '2021-02-20'],
      };
      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);
      getAvailableBookingSlotsEndpointHelperMock.mockResolvedValue(
        mockApiResponse
      );
      convertToBookingAvailabilityMock.mockReturnValueOnce(
        mockConvertToBookingAvailabilityResponse
      );
      getSlotsAndUnavailableDaysMock.mockReturnValueOnce(
        mockGetAvailabilityResponse
      );
      const expected = {};
      successResponseMock.mockReturnValue(expected);
      const dateMock = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1613692800000);

      const actual = await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
      dateMock.mockRestore();

      assertIsDefined(
        providerLocationResponseWithServiceTypeAndSurveyFilterMock.location
          ?.identifier
      );
      assertIsDefined(
        providerLocationResponseWithServiceTypeAndSurveyFilterMock.service
          ?.serviceType
      );

      expect(getAvailableBookingSlotsEndpointHelperMock).toHaveBeenCalledWith(
        configurationMock,
        {
          locationId:
            providerLocationResponseWithServiceTypeAndSurveyFilterMock.location
              .identifier,
          serviceType:
            providerLocationResponseWithServiceTypeAndSurveyFilterMock.service
              .serviceType,
          start: '2021-03-10T06:48:00-08:00',
          end: '2021-03-12T06:48:00-08:00',
        } as IGetAvailableBookingSlotsRequest
      );
      expect(getAvailableBookingSlotsEndpointHelperMock).toBeCalledTimes(1);
      expect(getSlotsAndUnavailableDaysMock).toBeCalledTimes(1);

      expect(successResponseMock).toHaveBeenCalledTimes(1);
      expect(actual).toBe(expected);
    });

    it('only returns this first months availability if invite is span over multiple months', async () => {
      const waitList = {
        ...waitListModel,
        invitation: {
          start: '2021-02-26T14:48:00.000Z',
          end: '2021-03-02T14:48:00.000Z',
        },
      };

      const mockGetAvailabilityResponse: IAvailableSlotsData = {
        slots: [
          {
            start: '2021-02-26T08:00:00',
            day: '2021-02-26',
            slotName: '8:00 am',
          },
          {
            start: '2021-02-26T08:15:00',
            day: '2021-02-26',
            slotName: '8:15 am',
          },
          {
            start: '2021-02-26T08:30:00',
            day: '2021-02-26',
            slotName: '8:30 am',
          },
        ],
        unAvailableDays: ['2021-02-27', '2021-02-28'],
      };
      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);
      getAvailableBookingSlotsEndpointHelperMock.mockResolvedValue(
        mockApiResponse
      );
      getSlotsAndUnavailableDaysMock.mockReturnValueOnce(
        mockGetAvailabilityResponse
      );
      const expected = {};
      successResponseMock.mockReturnValue(expected);
      const dateMock = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1613692800000);
      const actual = await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
      dateMock.mockRestore();

      assertIsDefined(
        providerLocationResponseWithServiceTypeAndSurveyFilterMock.location
          ?.identifier
      );
      assertIsDefined(
        providerLocationResponseWithServiceTypeAndSurveyFilterMock.service
          ?.serviceType
      );

      expect(getAvailableBookingSlotsEndpointHelperMock).toHaveBeenCalledWith(
        configurationMock,
        {
          locationId:
            providerLocationResponseWithServiceTypeAndSurveyFilterMock.location
              .identifier,
          serviceType:
            providerLocationResponseWithServiceTypeAndSurveyFilterMock.service
              .serviceType,
          start: '2021-02-26T06:48:00-08:00',
          end: '2021-02-28T23:59:59-08:00',
        } as IGetAvailableBookingSlotsRequest
      );

      expect(getAvailableBookingSlotsEndpointHelperMock).toBeCalledTimes(1);
      expect(getSlotsAndUnavailableDaysMock).toBeCalledTimes(1);

      expect(successResponseMock).toHaveBeenCalledTimes(1);
      expect(actual).toBe(expected);
    });

    it('does not return error if there is no slots available for current month and end of the invite code is in next month', async () => {
      const waitList = {
        ...waitListModel,
        invitation: {
          start: '2021-02-16T14:48:00.000Z',
          end: '2021-03-22T14:48:00.000Z',
        },
      };

      const mockGetAvailabilityResponse: IAvailableSlotsData = {
        slots: [],
        unAvailableDays: [
          '2021-02-16',
          '2021-02-17',
          '2021-02-18',
          '2021-02-19',
          '2021-02-20',
        ],
      };
      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);
      getAvailableBookingSlotsEndpointHelperMock.mockResolvedValue(
        mockApiResponse
      );
      convertToBookingAvailabilityMock.mockReturnValueOnce(
        mockConvertToBookingAvailabilityResponse
      );
      getSlotsAndUnavailableDaysMock.mockReturnValueOnce(
        mockGetAvailabilityResponse
      );
      const dateMock = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1613692800000);
      const expected = {};
      successResponseMock.mockReturnValue(expected);
      const actual = await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
      dateMock.mockRestore();

      assertIsDefined(
        providerLocationResponseWithServiceTypeAndSurveyFilterMock.location
          ?.identifier
      );
      assertIsDefined(
        providerLocationResponseWithServiceTypeAndSurveyFilterMock.service
          ?.serviceType
      );

      expect(getAvailableBookingSlotsEndpointHelperMock).toHaveBeenCalledWith(
        configurationMock,
        {
          locationId:
            providerLocationResponseWithServiceTypeAndSurveyFilterMock.location
              .identifier,
          serviceType:
            providerLocationResponseWithServiceTypeAndSurveyFilterMock.service
              .serviceType,
          start: '2021-02-24T00:00:00-08:00',
          end: '2021-02-28T23:59:59-08:00',
        } as IGetAvailableBookingSlotsRequest
      );
      expect(getAvailableBookingSlotsEndpointHelperMock).toBeCalledTimes(1);
      expect(getSlotsAndUnavailableDaysMock).toBeCalledTimes(1);
      expect(badRequestForInviteCodeResponseMock).not.toBeCalled();
      expect(actual).toBe(expected);
    });

    it('applies minLeadDays if start date is in past but end date is future', async () => {
      const waitList = {
        ...waitListModel,
        invitation: {
          start: '2021-02-10T14:48:00.000Z',
          end: '2021-03-12T14:48:00.000Z',
        },
      };
      const mockGetAvailabilityResponse: IAvailableSlotsData = {
        slots: [
          {
            start: '2021-03-10T08:00:00',
            day: '2021-03-10',
            slotName: '8:00 am',
          },
          {
            start: '2021-03-10T08:15:00',
            day: '2021-03-10',
            slotName: '8:15 am',
          },
          {
            start: '2021-03-10T08:30:00',
            day: '2021-03-10',
            slotName: '8:30 am',
          },
        ],
        unAvailableDays: ['2021-03-11', '2021-03-12'],
      };
      getWaitListByIdentifierMock.mockReturnValueOnce(waitList);
      getAvailableBookingSlotsEndpointHelperMock.mockResolvedValue(
        mockApiResponse
      );
      getSlotsAndUnavailableDaysMock.mockReturnValueOnce(
        mockGetAvailabilityResponse
      );
      const expected = {};
      successResponseMock.mockReturnValue(expected);
      const dateMock = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1613692800000);
      const actual = await processInviteCodeHandler(
        requestMock,
        routerResponseMock,
        databaseMock,
        configurationMock
      );
      dateMock.mockRestore();

      assertIsDefined(
        providerLocationResponseWithServiceTypeAndSurveyFilterMock.location
          ?.identifier
      );
      assertIsDefined(
        providerLocationResponseWithServiceTypeAndSurveyFilterMock.service
          ?.serviceType
      );

      expect(getAvailableBookingSlotsEndpointHelperMock).toHaveBeenCalledWith(
        configurationMock,
        {
          locationId:
            providerLocationResponseWithServiceTypeAndSurveyFilterMock.location
              .identifier,
          serviceType:
            providerLocationResponseWithServiceTypeAndSurveyFilterMock.service
              .serviceType,
          start: '2021-02-24T00:00:00-08:00',
          end: '2021-02-28T23:59:59-08:00',
        } as IGetAvailableBookingSlotsRequest
      );
      expect(getAvailableBookingSlotsEndpointHelperMock).toBeCalledTimes(1);

      expect(getSlotsAndUnavailableDaysMock).toBeCalledTimes(1);

      expect(successResponseMock).toHaveBeenCalledTimes(1);
      expect(actual).toBe(expected);
    });
  });
});
