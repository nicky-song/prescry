// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../constants/response-messages';
import { searchStaticFeed } from '../../databases/mongo-database/v1/query-helper/static-feed-helper';
import {
  getFeedAudience,
  getFeedAudienceV2,
} from './helpers/get-feed-audience';
import {
  getFeedContext,
  IFeedContextParams,
} from './helpers/get-feed-item-context';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../utils/response-helper';
import { IStaticFeed } from '@phx/common/src/models/static-feed';
import { FeedController } from './feed.controller';
import { FeedAudience } from '../../models/feed-audience';
import { getRequiredResponseLocal } from '../../utils/request/request-app-locals.helper';
import { configurationMock } from '../../mock-data/configuration.mock';
import * as FetchRequestHeader from '../../utils/request-helper';
import { EndpointVersion } from '../../models/endpoint-version';
import { IFeaturesState } from '@phx/common/src/experiences/guest-experience/guest-experience-features';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { getAllPrimaryMemberIdsFromPatients } from '../../utils/fhir-patient/patient.helper';

jest.mock('../../utils/response-helper');
jest.mock('../../databases/mongo-database/v1/query-helper/static-feed-helper');
jest.mock('./helpers/get-feed-audience');
jest.mock('./helpers/get-feed-item-context');
jest.mock('../../utils/request/request-app-locals.helper');
jest.mock('../../utils/fhir-patient/patient.helper');

const routerResponseMock = {
  locals: {
    device: {
      data: 'fake-phone',
    },
  },
} as unknown as Response;

const routerGetFunctionMock = jest.fn();
const searchStaticFeedMock = searchStaticFeed as jest.Mock;
const getFeedAudienceMock = getFeedAudience as jest.Mock;
const getFeedAudienceV2Mock = getFeedAudienceV2 as jest.Mock;
const getFeedContextMock = getFeedContext as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const errorResponseMock = UnknownFailureResponse as jest.Mock;
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;
const getAllPrimaryMemberIdsFromPatientsMock =
  getAllPrimaryMemberIdsFromPatients as jest.Mock;
const fetchRequestHeader = jest.spyOn(FetchRequestHeader, 'fetchRequestHeader');

const databaseMock = {} as IDatabase;
const rxGroupTypesMock: string[] = ['SIE', 'COVID19'];

const feedAudienceMock: FeedAudience = {
  rxGroupTypes: rxGroupTypesMock,
  members: ['id1'],
};
const feedItemsFoundMock = [
  {
    feedCode: 'item1',
  },
  {
    feedCode: 'item2',
  },
  {
    feedCode: 'item3',
  },
] as IStaticFeed[];

const v1: EndpointVersion = 'v1';
const v2: EndpointVersion = 'v2';

const requestMock = { query: {} } as unknown as Request;

const requestV2Mock = {
  ...requestMock,
  headers: {
    [RequestHeaders.apiVersion]: v2,
  },
} as unknown as Request;

const dateOfBirth = '2000-01-01';
const feedContextParamsMock: IFeedContextParams = {
  feedItems: feedItemsFoundMock,
  members: feedAudienceMock.members,
  database: databaseMock,
  dateOfBirth,
  features: {} as IFeaturesState,
  rxGroupTypes: rxGroupTypesMock,
  loggedInMemberIds: [],
  configuration: configurationMock,
};

describe('feedController', () => {
  beforeEach(() => {
    routerGetFunctionMock.mockReset();
    errorResponseMock.mockReset();
    successResponseMock.mockReset();
    getFeedAudienceMock.mockReset();
    getFeedAudienceMock.mockReturnValue(feedAudienceMock);
    getFeedAudienceV2Mock.mockReset();
    getFeedAudienceV2Mock.mockReturnValue(feedAudienceMock);
    getFeedContextMock.mockReset().mockReturnValue(feedItemsFoundMock);
    searchStaticFeedMock.mockReset().mockReturnValue(feedItemsFoundMock);
    getRequiredResponseLocalMock
      .mockReset()
      .mockReturnValueOnce(feedContextParamsMock.features)
      .mockReturnValueOnce({ dateOfBirth });
    fetchRequestHeader.mockReturnValue('');
  });

  it('should create controller object with route methods', () => {
    const feedController = new FeedController(databaseMock, configurationMock);
    expect(feedController.getFeed).toBeDefined();
  });

  it.each([[v1], [v2]])(
    'should get feed items for valid data if person is there in database for phoneNumber Route Version %p',
    async (endpointVersionMock: EndpointVersion) => {
      const routeHandler = new FeedController(databaseMock, configurationMock)
        .getFeed;

      const mockRequest =
        endpointVersionMock === v1 ? requestMock : requestV2Mock;

      getAllPrimaryMemberIdsFromPatientsMock.mockReturnValue(['id1']);

      await routeHandler(mockRequest, routerResponseMock);

      if (endpointVersionMock === 'v2') {
        expectToHaveBeenCalledOnceOnlyWith(
          getFeedAudienceV2Mock,
          routerResponseMock
        );
        expectToHaveBeenCalledOnceOnlyWith(
          getAllPrimaryMemberIdsFromPatientsMock,
          routerResponseMock
        );
        expect(getFeedContextMock).toHaveBeenNthCalledWith(1, {
          ...feedContextParamsMock,
          loggedInMemberIds: ['id1'],
          loggedInMasterIds: [],
        });
      } else {
        expectToHaveBeenCalledOnceOnlyWith(
          getFeedAudienceMock,
          routerResponseMock
        );
        expect(getFeedContextMock).toHaveBeenNthCalledWith(1, {
          ...feedContextParamsMock,
          loggedInMemberIds: [],
          loggedInMasterIds: [],
        });
      }

      expect(getRequiredResponseLocalMock).toHaveBeenNthCalledWith(
        1,
        routerResponseMock,
        'features'
      );

      expect(getRequiredResponseLocalMock).toHaveBeenNthCalledWith(
        2,
        routerResponseMock,
        'account'
      );

      expect(searchStaticFeedMock).toHaveBeenNthCalledWith(
        1,
        databaseMock,
        feedAudienceMock.rxGroupTypes,
        expect.any(Date)
      );

      expect(successResponseMock).toHaveBeenNthCalledWith(
        1,
        routerResponseMock,
        SuccessConstants.DOCUMENT_FOUND,
        { feedItems: feedItemsFoundMock }
      );
    }
  );

  it('should call UnknownFailureResponse if exception occured', async () => {
    const routeHandler = new FeedController(databaseMock, configurationMock)
      .getFeed;
    const error = { message: 'internal error' };
    searchStaticFeedMock.mockImplementation(() => {
      throw error;
    });
    await routeHandler(requestMock, routerResponseMock);
    expect(errorResponseMock).toHaveBeenNthCalledWith(
      1,
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
  it('should return no feed items if db does not have any feed items', async () => {
    const routeHandler = new FeedController(databaseMock, configurationMock)
      .getFeed;
    searchStaticFeedMock.mockReturnValueOnce(null);
    await routeHandler(requestMock, routerResponseMock);
    expect(getFeedContextMock).not.toBeCalled();
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      { feedItems: [] }
    );
  });
});
