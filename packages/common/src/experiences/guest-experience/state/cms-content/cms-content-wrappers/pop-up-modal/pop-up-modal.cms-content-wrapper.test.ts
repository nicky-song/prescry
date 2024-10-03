// Copyright 2022 Prescryptive Health, Inc.

import { IPopUpModalContent } from '../../../../../../models/cms-content/pop-up-modal-content';
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
import { popUpModalCMSContentWrapper } from './pop-up-modal.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('popUpModalCMSContentWrapper', () => {
  it('has correct content', () => {
    const popUpModalContentKeys: IPopUpModalContent = {
      leavingTitle: 'myrx-logo-click-title',
      leavingDesc: 'myrx-logo-click-description',
      leavingPrimaryButton: 'myrx-logo-click-primary-button',
      leavingSecondButton: 'myrx-logo-click-secondary-button',
    };

    const popUpModalVals = Object.values(popUpModalContentKeys);

    popUpModalVals.forEach((val) => {
      findContentValueMock.mockReturnValueOnce(val);
    });

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
        CmsGroupKey.popUpModal,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = popUpModalCMSContentWrapper(defaultLanguage, cmsContentMapMock);

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.popUpModal,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(4);

    popUpModalVals.forEach((val) => {
      expect(findContentValueMock).toHaveBeenCalledWith(val, uiContentMock);
    });

    expect(result).toEqual(popUpModalContentKeys);
  });
});
