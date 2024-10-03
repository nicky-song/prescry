// Copyright 2021 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../../models/ui-content';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import { ISessionState } from '../../../state/session/session.state';
import {
  IWhatComesNextScreenContent,
  useWhatComesNextScreenContent,
} from './use-what-comes-next.screen.content';

jest.mock('../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

describe('useWhatComesNextScreenContent', () => {
  it('has expected content (default)', () => {
    const uiContentMock: IUIContent = {
      fieldKey: 'what-comes-next-another-pharmacy',
      language: 'English',
      type: 'text',
      value: 'what-comes-next-another-pharmacy-mock',
    };
    const uiContentGroupMock: IUIContentGroup = {
      content: [uiContentMock],
      lastUpdated: 0,
      isContentLoading: false,
    };
    const sessionStateMock: Partial<ISessionState> = {
      uiCMSContentMap: new Map([['what-comes-next', uiContentGroupMock]]),
      currentLanguage: defaultLanguage,
    };

    useSessionContextMock.mockReturnValue({
      sessionState: sessionStateMock,
    });
    const content = useWhatComesNextScreenContent();
    const expectedContent: IWhatComesNextScreenContent = {
      anotherPharmacyLabel: 'what-comes-next-another-pharmacy-mock',
      anotherPharmacySubtitle: '',
      newPrescriptionLabel: '',
      newPrescriptionSubtitle: '',
      getStartedLabel: 'Get started',
    };

    expect(content).toEqual(expectedContent);
  });
});
