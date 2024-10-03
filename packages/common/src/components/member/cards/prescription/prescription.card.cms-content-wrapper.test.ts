// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { defaultLanguage } from '../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { prescriptionCardCMSContentWrapper } from './prescription.card.cms-content-wrapper';
import { IPrescriptionCardContent } from './prescription.card.content';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('prescriptionCardCMSContentWrapper', () => {
  it('has correct content', () => {
    const actionLabelNotSentMock = 'action-label-not-sent';
    const actionLabelSentMock = 'action-label-sent';
    const statusTagNewMock = 'status-tag-new';
    const statusTagSentMock = 'status-tag-sent';

    findContentValueMock.mockReturnValueOnce(actionLabelNotSentMock);
    findContentValueMock.mockReturnValueOnce(actionLabelSentMock);
    findContentValueMock.mockReturnValueOnce(statusTagNewMock);
    findContentValueMock.mockReturnValueOnce(statusTagSentMock);

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
        CmsGroupKey.prescriptionCard,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = prescriptionCardCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.prescriptionCard,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(4);
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      1,
      'button-label-not-sent',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      2,
      'button-label-sent',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      3,
      'status-tag-not-sent',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      4,
      'status-tag-sent',
      uiContentMock
    );

    const expectedContent: IPrescriptionCardContent = {
      actionLabelNotSent: actionLabelNotSentMock,
      actionLabelSent: actionLabelSentMock,
      statusTagNotSent: statusTagNewMock,
      statusTagSent: statusTagSentMock,
    };
    expect(result).toEqual(expectedContent);
  });
});
