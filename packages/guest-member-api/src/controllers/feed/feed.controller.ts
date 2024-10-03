// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IFeedResponseData } from '@phx/common/src/models/api-response/feed-response';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../constants/response-messages';
import { searchStaticFeed } from '../../databases/mongo-database/v1/query-helper/static-feed-helper';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../utils/response-helper';
import {
  getFeedAudience,
  getFeedAudienceV2,
} from './helpers/get-feed-audience';
import { getFeedContext } from './helpers/get-feed-item-context';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../utils/request/request-app-locals.helper';
import { IConfiguration } from '../../configuration';
import { getEndpointVersion } from '../../utils/request/get-endpoint-version';
import { getAllPrimaryMemberIdsFromPatients } from '../../utils/fhir-patient/patient.helper';
export class FeedController {
  public database: IDatabase;
  public configuration: IConfiguration;

  constructor(database: IDatabase, configuration: IConfiguration) {
    this.database = database;
    this.configuration = configuration;
  }

  public getFeed = async (request: Request, response: Response) => {
    try {
      const currentDate = new Date();
      const features = getRequiredResponseLocal(response, 'features');
      const dateOfBirth = getRequiredResponseLocal(
        response,
        'account'
      ).dateOfBirth;

      const isV2Endpoint = getEndpointVersion(request) === 'v2';

      const feedAudience = isV2Endpoint
        ? getFeedAudienceV2(response)
        : getFeedAudience(response);
      const feedItems = await searchStaticFeed(
        this.database,
        feedAudience.rxGroupTypes,
        currentDate
      );
      const personList = getResponseLocal(response, 'personList');

      const loggedInMasterIds = getResponseLocal(response, 'masterIds') ?? [];

      const feedItemResponse = feedItems
        ? await getFeedContext({
            feedItems,
            members: feedAudience.members,
            database: this.database,
            dateOfBirth,
            features,
            rxGroupTypes: feedAudience.rxGroupTypes,
            loggedInMemberIds: isV2Endpoint
              ? getAllPrimaryMemberIdsFromPatients(response)
              : personList
              ? personList.map((person) => person.primaryMemberRxId)
              : [],
            configuration: this.configuration,
            loggedInMasterIds,
          })
        : [];
      return SuccessResponse<IFeedResponseData>(
        response,
        SuccessConstants.DOCUMENT_FOUND,
        { feedItems: feedItemResponse }
      );
    } catch (error) {
      return UnknownFailureResponse(
        response,
        ErrorConstants.INTERNAL_SERVER_ERROR,
        error as Error
      );
    }
  };
}
