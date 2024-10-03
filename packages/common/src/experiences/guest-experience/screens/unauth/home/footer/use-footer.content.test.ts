// Copyright 2022 Prescryptive Health, Inc.

import {
  IUIContent,
  IUIContentGroup,
} from '../../../../../../models/ui-content';
import { useSessionContext } from '../../../../context-providers/session/use-session-context.hook';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { ISessionState } from '../../../../state/session/session.state';
import { useFooterContent, IFooterContent } from './use-footer.content';

jest.mock('../../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

describe('useFooterContent', () => {
  it('has expected content (default)', () => {
    const uiContentMock: IUIContent[] = [
      {
        fieldKey: 'privacy-policy',
        language: 'English',
        type: 'text',
        value: 'privacy-mock',
      },
      {
        fieldKey: 't-&-c',
        language: 'English',
        type: 'text',
        value: 't-&-c-mock',
      },
    ];
    const uiContentGroupMock: IUIContentGroup = {
      content: uiContentMock,
      lastUpdated: 0,
      isContentLoading: false,
    };
    const sessionStateMock: Partial<ISessionState> = {
      uiCMSContentMap: new Map([[CmsGroupKey.homePage, uiContentGroupMock]]),
    };
    useSessionContextMock.mockReturnValue({
      sessionState: sessionStateMock,
    });

    const expectedContent: IFooterContent = {
      privacyPolicyLabel: 'privacy-mock',
      termsAndConditionsLabel: 't-&-c-mock',
    };

    expect(useFooterContent()).toEqual(expectedContent);
  });
});
