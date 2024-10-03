// Copyright 2021 Prescryptive Health, Inc.

import { IUICMSResponse } from '../../models/api-response/ui-content-response';
import { IUIContent, IUIContentGroup } from '../../models/ui-content';
import { getNewDate } from '../date-time/get-new-date';
import { getUICMSContent } from './get-ui-cms-content';
import {
  getStaticUIContentByGroupKey,
  getUIContentByGroupKey,
  IUIContentResponse,
  translateContent,
} from './ui-cms-content';

jest.mock('./get-ui-cms-content');
const getUICMSContentMock = getUICMSContent as jest.Mock;

jest.mock('../../utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

describe('getStaticUIContentByGroupKey', () => {
  it('should return correct content from static file', () => {
    const mockStaticInputUIContent: IUIContentResponse[] = [
      {
        experienceKey: 'experience-key-mock',
        fieldKey: 'field-key-mock',
        groupKey: 'group-key-mock',
        language: 'English',
        text: 'text-value-mock',
        type: 'Text',
        version: 1,
      },
      {
        experienceKey: 'experience-key-mock',
        fieldKey: 'another-field-key-mock',
        groupKey: 'another-group-key-mock',
        language: 'English',
        text: 'another-text-value-mock',
        type: 'Text',
        version: 1,
      },
    ];

    const mockUIContentEntry: IUIContent[] = [
      {
        fieldKey: 'field-key-mock',
        language: 'English',
        type: 'Text',
        value: 'text-value-mock',
      },
    ];

    getUICMSContentMock.mockReturnValue(mockStaticInputUIContent);
    const actual = getStaticUIContentByGroupKey('group-key-mock');

    expect(actual).toEqual(mockUIContentEntry);
  });
});

describe('getUIContentByGroupKey', () => {
  it('should return correct content from response', () => {
    const lastUpdatedMock = new Date();
    getNewDateMock.mockReturnValue(lastUpdatedMock);

    const mockUIContentReponse: IUICMSResponse[] = [
      {
        fieldKey: 'field-key-mock',
        groupKey: 'group-key-mock',
        language: 'English',
        value: 'text-value-mock',
        type: 'Text',
      },
      {
        fieldKey: 'another-field-key-mock',
        groupKey: 'another-group-key-mock',
        language: 'English',
        value: 'another-text-value-mock',
        type: 'Text',
      },
    ];

    const mockUIContentEntry: IUIContentGroup = {
      content: [
        {
          fieldKey: 'field-key-mock',
          language: 'English',
          type: 'Text',
          value: 'text-value-mock',
        },
      ],
      lastUpdated: lastUpdatedMock.getTime(),
      isContentLoading: false,
    };

    const actual = getUIContentByGroupKey(
      'group-key-mock',
      mockUIContentReponse
    );

    expect(actual).toEqual(mockUIContentEntry);
  });
});

describe('translateContent', () => {
  it('should return correct translated content when language is defined', () => {
    const mockUIContentEntries: IUIContent[] = [
      {
        fieldKey: 'learn-more',
        language: 'English',
        type: 'Text',
        value: 'Learn more about us',
      },
      {
        fieldKey: 'learn-more',
        language: 'Spanish',
        type: 'Text',
        value: 'Sobre nosotros',
      },
    ];

    const expectedContent: IUIContent[] = [
      {
        fieldKey: 'learn-more',
        language: 'Spanish',
        type: 'Text',
        value: 'Sobre nosotros',
      },
    ];

    const actual = translateContent(mockUIContentEntries, 'Spanish');

    expect(actual).toEqual(expectedContent);
  });
});
