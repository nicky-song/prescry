// Copyright 2021 Prescryptive Health, Inc.

import { call, IApiConfig } from '../../../utils/api.helper';
import { handleHttpErrors } from './api-v1-helper';
import { getUIContent } from './api-v1.get-ui-content';
import { getEndpointRetryPolicy } from '../../../utils/retry-policies/get-endpoint.retry-policy';
import { getNewDate } from '../../../utils/date-time/get-new-date';
import { GuestExperienceConfig } from '../guest-experience-config';
import { CMSContentVersion } from '../../../models/cms-content/content-version';
import { CMSExperienceEnum } from '../../../models/cms-content/experience.cms-content';
import { cobrandingKeyPrefix } from '../context-providers/session/ui-content-hooks/use-cobranding-content';

jest.mock('../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../utils/api.helper') as object),
  call: jest.fn(),
}));
const mockCall = call as jest.Mock;

jest.mock('./api-v1-helper', () => ({
  ...(jest.requireActual('./api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));
const mockHandleHttpErrors = handleHttpErrors as jest.Mock;

jest.mock('../../../utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    content:
      '/content?groupKey=:groupKey&language=:language&version=:version&experienceKey=:experienceKey',
  },
};

describe('getUIContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('returns correct response when UI content is found', async () => {
    const lastUpdatedMock = new Date();
    getNewDateMock.mockReturnValue(lastUpdatedMock);
    const mockResponse = {
      data: [
        {
          groupKey: 'test',
          fieldKey: 'test',
          language: 'language',
          value: 'value',
          type: 'type',
        },
      ],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });
    const expectedUIResponse = new Map([
      [
        'test',
        {
          content: [
            {
              fieldKey: 'test',
              language: 'language',
              value: 'value',
              type: 'type',
            },
          ],
          lastUpdated: lastUpdatedMock.getTime(),
          isContentLoading: false,
        },
      ],
    ]);
    const response = await getUIContent(mockConfig);
    expect(response).toEqual(expectedUIResponse);
    expect(mockCall).toBeCalledWith(
      'https://localhost:4300/api/content?groupKey=&language=&version=1&experienceKey=MyRx',
      undefined,
      'GET',
      undefined,
      getEndpointRetryPolicy
    );
  });

  it('returns undefined response when UI content is not found', async () => {
    const mockResponse = {
      data: [],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });
    const response = await getUIContent(mockConfig);
    expect(response).toEqual(undefined);
    expect(mockCall).toBeCalledWith(
      'https://localhost:4300/api/content?groupKey=&language=&version=1&experienceKey=MyRx',
      undefined,
      'GET',
      undefined,
      getEndpointRetryPolicy
    );
  });

  it('should add language param if language is passed to getUIContent', async () => {
    const mockResponse = {
      data: [],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });
    const response = await getUIContent(mockConfig, undefined, 'English');
    expect(response).toEqual(undefined);
    expect(mockCall).toBeCalledWith(
      'https://localhost:4300/api/content?groupKey=&language=English&version=1&experienceKey=MyRx',
      undefined,
      'GET',
      undefined,
      getEndpointRetryPolicy
    );
  });

  it('api call should be made when version is undefined', async () => {
    const mockResponse = {
      data: [],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await getUIContent(mockConfig);

    expect(mockCall).toHaveBeenCalled();
  });

  it('api call should be made when version = 1', async () => {
    const mockResponse = {
      data: [],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await getUIContent(mockConfig, 1, undefined, undefined, undefined);

    expect(mockCall).toHaveBeenCalled();
  });

  it('api call should be made when version = 2, group key is defined, language is defined and uiCMSContentMap is undefined', async () => {
    const mockResponse = {
      data: [],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await getUIContent(mockConfig, 2, 'English', 'group-key-mock', undefined);

    expect(mockCall).toHaveBeenCalled();
  });

  it('api call should be made when version = 2, group key is defined, language is defined, uiCMSContentMap is undefined, and experience is defined', async () => {
    const mockResponse = {
      data: [],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await getUIContent(
      mockConfig,
      2,
      'English',
      'group-key-mock',
      undefined,
      CMSExperienceEnum.MYRX_COBRANDING
    );

    const expectedUrl =
      'https://localhost:4300/api/content?groupKey=group-key-mock&language=English&version=2&experienceKey=MyRxCobranding';

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      undefined,
      'GET',
      undefined,
      { getNextRetry: expect.any(Function), pause: 1000, remaining: 3 }
    );
  });

  it('api call should be made when version = 2, group key is defined, language is defined and uiCMSContentMap is defined but does not have specified group key', async () => {
    const mockResponse = {
      data: [],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const uiCMSContentMap = new Map([
      [
        'group-key-mock',
        {
          content: [
            {
              fieldKey: 'test',
              language: 'language',
              value: 'value',
              type: 'type',
            },
          ],
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    await getUIContent(
      mockConfig,
      2,
      'English',
      'group-key-not-found-mock',
      uiCMSContentMap
    );

    expect(mockCall).toHaveBeenCalled();
  });

  it('api call should be made when version = 2, group key is defined, language is defined, uiCMSContentMap is defined, specified group key is defined in map but no content exists at all', async () => {
    const mockResponse = {
      data: [],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const uiCMSContentMap = new Map([
      [
        'group-key-mock',
        {
          content: [],
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    await getUIContent(
      mockConfig,
      2,
      'English',
      'group-key-mock',
      uiCMSContentMap
    );

    expect(mockCall).toHaveBeenCalled();
  });

  it('api call should be made when version = 2, group key is defined, language is defined, uiCMSContentMap is defined, specified group key is defined in map but no content exists of the querying language', async () => {
    const mockResponse = {
      data: [],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const uiCMSContentMap = new Map([
      [
        'group-key-mock',
        {
          content: [
            {
              fieldKey: 'test',
              language: 'Spanish',
              value: 'value',
              type: 'type',
            },
          ],
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    await getUIContent(
      mockConfig,
      2,
      'English',
      'group-key-mock',
      uiCMSContentMap
    );

    expect(mockCall).toHaveBeenCalled();
  });

  it('api call should be made when version = 2, group key is defined, language is defined, uiCMSContentMap is defined, specified group key is defined in map, content exists of the querying language and enough time has passed for a refresh', async () => {
    const nowMock = new Date();
    getNewDateMock.mockReturnValue(nowMock);

    const mockResponse = {
      data: [],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const uiCMSContentMap = new Map([
      [
        'group-key-mock',
        {
          content: [
            {
              fieldKey: 'test',
              language: 'English',
              value: 'value',
              type: 'type',
            },
          ],
          lastUpdated:
            nowMock.getTime() - GuestExperienceConfig.cmsRefreshInterval - 1,
          isContentLoading: false,
        },
      ],
    ]);

    await getUIContent(
      mockConfig,
      2,
      'English',
      'group-key-mock',
      uiCMSContentMap
    );

    expect(mockCall).toHaveBeenCalled();
  });

  it('api call should NOT be made when version is defined and value does not equal 1 or 2', async () => {
    const mockResponse = {
      data: [],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await getUIContent(
      mockConfig,
      3 as CMSContentVersion,
      undefined,
      undefined,
      undefined
    );

    expect(mockCall).not.toHaveBeenCalled();
  });

  it('api call should NOT be made when version = 2 and group key is undefined', async () => {
    const mockResponse = {
      data: [],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const uiCMSContentMap = new Map([
      [
        'group-key-mock',
        {
          content: [
            {
              fieldKey: 'test',
              language: 'English',
              value: 'value',
              type: 'type',
            },
          ],
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    await getUIContent(mockConfig, 2, 'English', undefined, uiCMSContentMap);

    expect(mockCall).not.toHaveBeenCalled();
  });

  it('api call should NOT be made when version = 2 and language is undefined', async () => {
    const mockResponse = {
      data: [],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const uiCMSContentMap = new Map([
      [
        'group-key-mock',
        {
          content: [
            {
              fieldKey: 'test',
              language: 'English',
              value: 'value',
              type: 'type',
            },
          ],
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    await getUIContent(
      mockConfig,
      2,
      undefined,
      'group-key-mock',
      uiCMSContentMap
    );

    expect(mockCall).not.toHaveBeenCalled();
  });

  it('api call should NOT be made when version = 2, group key is defined, language is defined, uiCMSContentMap is defined, specified group key is defined in map, content exists of the querying language and NOT enough time has passed for a refresh', async () => {
    const nowMock = new Date();
    getNewDateMock.mockReturnValue(nowMock);

    const mockResponse = {
      data: [],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const uiCMSContentMap = new Map([
      [
        'group-key-mock',
        {
          content: [
            {
              fieldKey: 'test',
              language: 'English',
              value: 'value',
              type: 'type',
            },
          ],
          lastUpdated:
            nowMock.getTime() - GuestExperienceConfig.cmsRefreshInterval + 1,
          isContentLoading: false,
        },
      ],
    ]);

    await getUIContent(
      mockConfig,
      2,
      'English',
      'group-key-mock',
      uiCMSContentMap
    );

    expect(mockCall).not.toHaveBeenCalled();
  });

  it('should call API with cobranding when experience is undefined but groupKey is cobranding', async () => {
    const mockResponse = {
      data: [],
    };
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await getUIContent(
      mockConfig,
      2,
      'English',
      `${cobrandingKeyPrefix}group-key-mock`,
      undefined,
      undefined
    );

    const expectedUrl = `https://localhost:4300/api/content?groupKey=${cobrandingKeyPrefix}group-key-mock&language=English&version=2&experienceKey=MyRxCobranding`;

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      undefined,
      'GET',
      undefined,
      { getNextRetry: expect.any(Function), pause: 1000, remaining: 3 }
    );
  });
  it('returns uiCMSContentMap even when no data', async () => {
    const lastUpdatedMock = new Date();
    const groupKeyMock = 'group-key-mock';
    getNewDateMock.mockReturnValue(lastUpdatedMock);
    mockCall.mockResolvedValue({
      json: () => [],
      ok: true,
    });
    const expectedUIResponse = new Map([
      [
        'test',
        {
          content: [
            {
              fieldKey: 'test',
              language: 'language',
              value: 'value',
              type: 'type',
            },
          ],
          lastUpdated: lastUpdatedMock.getTime(),
          isContentLoading: false,
        },
      ],
    ]);
    const response = await getUIContent(
      mockConfig,
      undefined,
      undefined,
      groupKeyMock,
      expectedUIResponse
    );
    expect(response).toEqual(expectedUIResponse);
    expect(mockCall).toBeCalledWith(
      `https://localhost:4300/api/content?groupKey=${groupKeyMock}&language=&version=1&experienceKey=MyRx`,
      undefined,
      'GET',
      undefined,
      getEndpointRetryPolicy
    );
  });
});
