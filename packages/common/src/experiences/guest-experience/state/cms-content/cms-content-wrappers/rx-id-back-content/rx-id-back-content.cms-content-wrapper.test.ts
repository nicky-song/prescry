// Copyright 2021 Prescryptive Health, Inc.

import { IRxIdBackContentCmsContent } from '../../../../../../components/cards/rx-id-back-content/rx-id-back-content.cms-content';
import { defaultLanguage } from '../../../../../../models/language';
import {
  IUIContent,
  IUIContentGroup,
} from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';
import { rxIdBackContentCMSContentWrapper } from './rx-id-back-content.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('rxIdBackContentCMSContentWrapper', () => {
  it('has correct content', () => {
    const expectedContent: IRxIdBackContentCmsContent = {
      memberSince: 'member-since-mock',
      myrxURL: 'myrx-url-mock',
      membersTitle: 'members-title-mock',
      membersDescription: 'members-description-mock',
      claimsTitle: 'claims-title-mock',
      claimsDescription: 'claims-description-mock',
      sendPrescriptionsInstruction: 'send-prescriptions-instruction-mock',
      prescryptiveAddress: 'prescryptive-address-mock',
    };

    findContentValueMock.mockReturnValueOnce(expectedContent.memberSince);
    findContentValueMock.mockReturnValueOnce(expectedContent.myrxURL);
    findContentValueMock.mockReturnValueOnce(expectedContent.membersTitle);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.membersDescription
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.claimsTitle);
    findContentValueMock.mockReturnValueOnce(expectedContent.claimsDescription);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.sendPrescriptionsInstruction
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.prescryptiveAddress
    );

    const uiContentMock: IUIContent[] = [
      {
        fieldKey: 'field-key',
        language: 'English',
        type: 'Text',
        value: 'value',
      },
    ];
    getContentMock.mockReturnValue(uiContentMock);

    const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
      [
        CmsGroupKey.rxIdBackContent,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = rxIdBackContentCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.rxIdBackContent,
      2
    );

    const expectedFieldKeys = [
      'member-since',
      'myrx-url',
      'members-title',
      'members-description',
      'claims-title',
      'claims-description',
      'send-prescriptions-instruction',
      'prescryptive-address',
    ];

    expect(findContentValueMock).toHaveBeenCalledTimes(
      expectedFieldKeys.length
    );
    expectedFieldKeys.forEach((key, index) => {
      expect(findContentValueMock).toHaveBeenNthCalledWith(
        index + 1,
        key,
        uiContentMock
      );
    });

    expect(result).toEqual(expectedContent);
  });
});
