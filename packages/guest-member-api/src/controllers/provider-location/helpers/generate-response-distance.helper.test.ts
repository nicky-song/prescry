// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { IProviderLocationData } from '@phx/common/src/models/api-response/provider-location-response';
import { SuccessConstants } from '../../../constants/response-messages';
import { IServices } from '../../../models/services';
import {
  SuccessResponse,
  KnownFailureResponse,
} from '../../../utils/response-helper';
import { generateSuccessResponseForLocationsWithDistance } from './generate-response-distance.helper';
import { IProviderLocationListItem } from '../../../models/pharmacy-portal/get-provider-location.response';

jest.mock('../../../utils/response-helper');

const routerResponseMock = {} as Response;
const successResponseMock = SuccessResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;

beforeEach(() => {
  knownFailureResponseMock.mockReset();
  successResponseMock.mockReset();
});

describe('generateSuccessResponseForLocationsWithDistance', () => {
  it('Should return document found if request is valid', () => {
    const providerLocationsMock = [
      {
        id: 'id-1',
        providerName: 'provider',
        locationName: 'test-location',
        address: {
          line1: 'mock-address1',
          line2: 'mock-address2',
          city: 'mock-city',
          state: 'mock-state',
          zipCode: 'mock-zip',
        },
        phoneNumber: 'mock-phone',
        distanceMiles: 5,
      },
      {
        id: 'id-2',
        providerName: 'provider2',
        locationName: 'test-location2',
        address: {
          line1: 'mock2-address1',
          line2: 'mock2-address2',
          city: 'mock-city2',
          state: 'mock-state2',
          zipCode: 'mock-zip2',
        },
        phoneNumber: 'mock-phone2',
        distanceMiles: 3,
      },
      {
        id: 'id-3',
        providerName: 'provider3',
        locationName: 'test-location3',
        address: {
          line1: 'mock3-address1',
          line2: 'mock3-address2',
          city: 'mock-city3',
          state: 'mock-state3',
          zipCode: 'mock-zip3',
        },
        phoneNumber: 'mock-phone3',
        distanceMiles: 4,
      },
    ] as IProviderLocationListItem[];
    const providerLocationsResponseMock: IProviderLocationData = {
      locations: [
        {
          id: 'id-1',
          providerName: 'provider',
          locationName: 'test-location',
          address1: 'mock-address1',
          address2: 'mock-address2',
          city: 'mock-city',
          state: 'mock-state',
          zip: 'mock-zip',
          distance: 5,
          phoneNumber: 'mock-phone',
        },
        {
          id: 'id-2',
          providerName: 'provider2',
          locationName: 'test-location2',
          address1: 'mock2-address1',
          address2: 'mock2-address2',
          city: 'mock-city2',
          state: 'mock-state2',
          zip: 'mock-zip2',
          distance: 3,
          phoneNumber: 'mock-phone2',
        },
        {
          id: 'id-3',
          providerName: 'provider3',
          locationName: 'test-location3',
          address1: 'mock3-address1',
          address2: 'mock3-address2',
          city: 'mock-city3',
          state: 'mock-state3',
          zip: 'mock-zip3',
          distance: 4,
          phoneNumber: 'mock-phone3',
        },
      ],
    };

    generateSuccessResponseForLocationsWithDistance(
      routerResponseMock,
      providerLocationsMock
    );
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      providerLocationsResponseMock
    );
  });

  it('Should return customQuestions instead of default if serviceType has associated questions', () => {
    const providerLocationsMock = [
      {
        id: 'id-1',
        providerName: 'provider',
        locationName: 'test-location',
        address: {
          line1: 'mock-address1',
          line2: 'mock-address2',
          city: 'mock-city',
          state: 'mock-state',
          zipCode: 'mock-zip',
        },
        phoneNumber: 'mock-phone',
        distanceMiles: 5,
      },
      {
        id: 'id-2',
        providerName: 'provider2',
        locationName: 'test-location2',
        address: {
          line1: 'mock2-address1',
          line2: 'mock2-address2',
          city: 'mock-city2',
          state: 'mock-state2',
          zipCode: 'mock-zip2',
        },
        phoneNumber: 'mock-phone2',
        distanceMiles: 3,
      },
      {
        id: 'id-3',
        providerName: 'provider3',
        locationName: 'test-location3',
        address: {
          line1: 'mock3-address1',
          line2: 'mock3-address2',
          city: 'mock-city3',
          state: 'mock-state3',
          zipCode: 'mock-zip3',
        },
        phoneNumber: 'mock-phone3',
        distanceMiles: 4,
      },
    ] as IProviderLocationListItem[];
    const providerLocationsResponseMock: IProviderLocationData = {
      locations: [
        {
          id: 'id-1',
          providerName: 'provider',
          locationName: 'test-location',
          address1: 'mock-address1',
          address2: 'mock-address2',
          city: 'mock-city',
          state: 'mock-state',
          zip: 'mock-zip',
          distance: 5,
          phoneNumber: 'mock-phone',
        },
        {
          id: 'id-2',
          providerName: 'provider2',
          locationName: 'test-location2',
          address1: 'mock2-address1',
          address2: 'mock2-address2',
          city: 'mock-city2',
          state: 'mock-state2',
          zip: 'mock-zip2',
          distance: 3,
          phoneNumber: 'mock-phone2',
        },
        {
          id: 'id-3',
          providerName: 'provider3',
          locationName: 'test-location3',
          address1: 'mock3-address1',
          address2: 'mock3-address2',
          city: 'mock-city3',
          state: 'mock-state3',
          zip: 'mock-zip3',
          distance: 4,
          phoneNumber: 'mock-phone3',
        },
      ],
    };

    generateSuccessResponseForLocationsWithDistance(
      routerResponseMock,
      providerLocationsMock
    );
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toBeCalledWith(
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      providerLocationsResponseMock
    );
  });

  it('Should return serviceName and minimumAge along with empty list if results is empty', () => {
    const providerLocationsMock = [] as IProviderLocationListItem[];
    const mockServiceTypeDetails = {
      serviceType: 'abbott_antigen',
      procedureCode: '87811',
      serviceDescription: 'COVID-19 Rapid Antigen Test',
      serviceName: 'Antigen',
      serviceNameMyRx: 'mock-service name',
      confirmationDescriptionMyRx: 'mock-conf-desc',
      aboutDependentDescriptionMyRx: 'mock-dependent-desc',
      aboutQuestionsDescriptionMyRx: 'mock-question-desc',
      cancellationPolicyMyRx: 'mock-cancel',
      minimumAge: 3,
    } as IServices;
    generateSuccessResponseForLocationsWithDistance(
      routerResponseMock,
      providerLocationsMock,
      mockServiceTypeDetails
    );
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      {
        locations: [],
        minimumAge: mockServiceTypeDetails.minimumAge,
        serviceNameMyRx: mockServiceTypeDetails.serviceNameMyRx,
      }
    );
  });
});
