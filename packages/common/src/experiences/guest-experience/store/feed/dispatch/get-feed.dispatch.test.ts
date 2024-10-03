// Copyright 2020 Prescryptive Health, Inc.

import {
  IFeedItem,
  IFeedResponse,
} from '../../../../../models/api-response/feed-response';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getFeed } from '../../../api/api-v1.get-feed';
import { getFeedResponseAction } from '../actions/get-feed-response.action';
import { getFeedDispatch } from './get-feed.dispatch';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';

jest.mock('../../../api/api-v1.get-feed', () => ({
  getFeed: jest.fn().mockResolvedValue({ data: {} }),
}));
const getFeedMock = getFeed as jest.Mock;

jest.mock('../../settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

describe('getFeedDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const authTokenMock = 'auth_token';
  const deviceTokenMock = 'device_token';

  it('calls getFeed API with expected arguments', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const state = {
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
      features: {},
      settings: {
        deviceToken: deviceTokenMock,
        token: authTokenMock,
      },
    };
    const getState = jest.fn().mockReturnValue(state);

    const dispatch = jest.fn();
    await getFeedDispatch(dispatch, getState);

    expect(getFeedMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      authTokenMock,
      getEndpointRetryPolicy,
      deviceTokenMock
    );
  });

  it('dispatches getFeed API response', async () => {
    const feedItems: IFeedItem[] = [
      {
        feedCode: 'a',
      },
      {
        feedCode: 'b',
      },
      {
        feedCode: 'c',
      },
    ];

    const feedResponse: IFeedResponse = {
      data: { feedItems },
      message: 'all good',
      refreshToken: 'refresh-token',
      status: 'ok',
    };
    const state = {
      config: {
        apis: {
          guestExperienceApi: 'api',
        },
      },
      features: {
        usegrouptypecovid: true,
      },
      settings: {
        deviceToken: deviceTokenMock,
        token: authTokenMock,
      },
    };
    const getState = jest.fn().mockReturnValue(state);
    getFeedMock.mockResolvedValue(feedResponse);

    const dispatch = jest.fn();
    await getFeedDispatch(dispatch, getState, true);

    const responseAction = getFeedResponseAction(feedItems);
    expect(dispatch).toHaveBeenCalledWith(responseAction);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatch,
      feedResponse.refreshToken
    );
  });

  it('does not dispatch accountTokenUpdate when refreshToken prop false', async () => {
    const feedItems: IFeedItem[] = [
      {
        feedCode: 'a',
      },
      {
        feedCode: 'b',
      },
      {
        feedCode: 'c',
      },
    ];

    const feedResponse: IFeedResponse = {
      data: { feedItems },
      message: 'all good',
      refreshToken: 'refresh-token',
      status: 'ok',
    };
    const state = {
      config: {
        apis: {
          guestExperienceApi: 'api',
        },
      },
      features: {
        usegrouptypecovid: true,
      },
      settings: {
        deviceToken: deviceTokenMock,
        token: authTokenMock,
      },
    };
    const getState = jest.fn().mockReturnValue(state);
    getFeedMock.mockResolvedValue(feedResponse);

    const dispatch = jest.fn();
    const refreshToken = false;
    await getFeedDispatch(dispatch, getState, refreshToken);

    const responseAction = getFeedResponseAction(feedItems);
    expect(dispatch).toHaveBeenCalledWith(responseAction);

    expect(tokenUpdateDispatchMock).not.toHaveBeenCalled();
  });
});
