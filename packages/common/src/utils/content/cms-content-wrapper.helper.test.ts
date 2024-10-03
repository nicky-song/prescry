// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IUIContent, IUIContentGroup } from '../../models/ui-content';
import { findContentValue, getContent } from './cms-content-wrapper.helper';
import {
  getStaticUIContentByGroupKey,
  translateContent,
} from './ui-cms-content';

jest.mock('./ui-cms-content');
const getStaticUIContentByGroupKeyMock =
  getStaticUIContentByGroupKey as jest.Mock;
const translateContentMock = translateContent as jest.Mock;

describe('cmsContentWrapperHelper', () => {
  describe('getContent', () => {
    const foundContentMock: IUIContent[] = [
      {
        fieldKey: 'global-field-key',
        language: 'global-language',
        type: 'global-type',
        value: 'global-value',
      },
    ];

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it.each([
      [undefined, true],
      [new Map(), true],
      [new Map([['x', { content: [{ fieldKey: 'x-field-key' }] }]]), true],
      [new Map([[CmsGroupKey.global, { content: [] }]]), true],
      [
        new Map([
          [
            CmsGroupKey.global,
            {
              content: foundContentMock,
            },
          ],
        ]),
        false,
      ],
    ])(
      'gets content (contentMap: %p)',
      (
        contentMapMock: undefined | Map<string, IUIContentGroup>,
        isStaticExpected: boolean
      ) => {
        const languageMock = 'Spanish';
        const groupKeyMock = CmsGroupKey.global;
        const versionMock = 3;

        const staticContentMock: IUIContent[] = [
          {
            fieldKey: 'static-field-key',
            language: 'static-language',
            type: 'static-type',
            value: 'static-value',
          },
        ];
        getStaticUIContentByGroupKeyMock.mockReturnValue(staticContentMock);

        const translatedContentMock: IUIContent[] = [
          {
            fieldKey: 'translated-field-key',
            language: 'translated-language',
            type: 'translated-type',
            value: 'translated-value',
          },
        ];
        translateContentMock.mockReturnValue(translatedContentMock);

        const result = getContent(
          languageMock,
          contentMapMock,
          groupKeyMock,
          versionMock
        );

        if (isStaticExpected) {
          expect(getStaticUIContentByGroupKeyMock).toHaveBeenCalledWith(
            groupKeyMock,
            versionMock,
            languageMock
          );
          expect(translateContentMock).toHaveBeenCalledWith(
            staticContentMock,
            languageMock
          );
        } else {
          expect(getStaticUIContentByGroupKeyMock).not.toHaveBeenCalled();
          expect(translateContentMock).toHaveBeenCalledWith(
            foundContentMock,
            languageMock
          );
        }

        expect(result).toEqual(translatedContentMock);
      }
    );

    it('defaults static content version to 1', () => {
      const groupKeyMock = CmsGroupKey.global;

      const staticContentMock: IUIContent[] = [
        {
          fieldKey: 'static-field-key',
          language: 'static-language',
          type: 'static-type',
          value: 'static-value',
        },
      ];
      getStaticUIContentByGroupKeyMock.mockReturnValue(staticContentMock);

      const translatedContentMock: IUIContent[] = [
        {
          fieldKey: 'translated-field-key',
          language: 'translated-language',
          type: 'translated-type',
          value: 'translated-value',
        },
      ];
      translateContentMock.mockReturnValue(translatedContentMock);

      const languageMock = 'Spanish';
      getContent(languageMock, new Map(), groupKeyMock);

      const expectedVersion = 1;
      expect(getStaticUIContentByGroupKeyMock).toHaveBeenCalledWith(
        groupKeyMock,
        expectedVersion,
        languageMock
      );
    });
  });

  describe('findContentValue', () => {
    it.each([
      ['key', undefined, ''],
      ['key', [], ''],
      ['key', [{ fieldKey: 'key' }], ''],
      ['key', [{ fieldKey: 'key', value: 'value' }], 'value'],
    ])(
      'returns value from content for field key (fieldKey: %p, uiContent: %p)',
      (
        fieldKeyMock: string,
        uiContentMock: Partial<IUIContent>[] | undefined,
        expectedValue: string
      ) => {
        expect(
          findContentValue(fieldKeyMock, uiContentMock as IUIContent[])
        ).toEqual(expectedValue);
      }
    );
  });
});
