// Copyright 2022 Prescryptive Health, Inc.

import { getDataFromUrl } from '../../get-data-from-url';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { getCMSApiContent } from './get-cms-api-content';
import { cmsContentMock } from '../../../mock-data/cms-content.mock';
import { ApiConstants } from '../../../constants/api-constants';
import { IUICMSResponse } from '@phx/common/src/models/api-response/ui-content-response';

jest.mock('../../get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

describe('getCMSApiContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Returns error', async () => {
    const mockError = {
      title: 'One or more validation errors occurred.',
      status: 400,
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: 400,
    });
    const actual = await getCMSApiContent(
      cmsContentMock.groupKey,
      configurationMock,
      cmsContentMock.language
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'content-api-url/ui-content?ExperienceKey=MyRx&Version=1&Language=language-mock&GroupKey.GroupKey_in=group-key-mock',
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual({
      errorCode: mockError.status,
      message: mockError.title,
    });
  });

  it('Return cms content if api return success', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => [cmsContentMock],
      ok: true,
      status: 200,
    });
    const versionMock = 2;
    const actual = await getCMSApiContent(
      cmsContentMock.groupKey,
      configurationMock,
      cmsContentMock.language,
      versionMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'content-api-url/ui-content?ExperienceKey=MyRx&Version=2&Language=language-mock&GroupKey.GroupKey_in=group-key-mock',
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual({ content: [cmsContentMock] });
  });

  it('Return cms content for default language if api return success but does not have user language', async () => {
    const cmsDefaultLanguageContentMock: IUICMSResponse = {
      fieldKey: 'field-key-mock',
      groupKey: 'group-key-mock',
      language: ApiConstants.DEFAULT_LANGUAGE,
      type: 'type-mock',
      value: 'value-mock',
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => [cmsDefaultLanguageContentMock],
      ok: true,
      status: 200,
    });
    const actual = await getCMSApiContent(
      cmsContentMock.groupKey,
      configurationMock,
      cmsContentMock.language
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'content-api-url/ui-content?ExperienceKey=MyRx&Version=1&Language=language-mock&GroupKey.GroupKey_in=group-key-mock',
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    const expectedResponse = { content: [cmsDefaultLanguageContentMock] };
    expect(actual).toEqual(expectedResponse);
  });

  it('Return undefined cms content for no data matching user language or default language', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => [],
      ok: true,
      status: 200,
    });
    const actual = await getCMSApiContent(
      cmsContentMock.groupKey,
      configurationMock,
      cmsContentMock.language
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'content-api-url/ui-content?ExperienceKey=MyRx&Version=1&Language=language-mock&GroupKey.GroupKey_in=group-key-mock',
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual({ content: [] });
  });
});
