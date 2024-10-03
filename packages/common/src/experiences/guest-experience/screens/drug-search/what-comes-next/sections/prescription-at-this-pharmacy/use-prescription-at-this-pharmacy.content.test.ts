// Copyright 2021 Prescryptive Health, Inc.

import {
  IPrescriptionAtThisPharmacySectionContent,
  usePrescriptionAtThisPharmacySectionContent,
} from './use-prescription-at-this-pharmacy.section.content';
import { useSessionContext } from '../../../../../context-providers/session/use-session-context.hook';
import {
  IUIContent,
  IUIContentGroup,
} from '../../../../../../../models/ui-content';
import { ISessionState } from '../../../../../state/session/session.state';
import { defaultLanguage } from '../../../../../../../models/language';

jest.mock('../../../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

describe('usePrescriptionAtThisPharmacySectionContent', () => {
  it('has expected content', () => {
    const uiContentMock: IUIContent = {
      fieldKey: 'prescription-at-this-pharmacy-instructions-text',
      language: 'English',
      type: 'text',
      value: 'prescription-at-this-pharmacy-instructions-text-mock',
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
    const content = usePrescriptionAtThisPharmacySectionContent();

    const expectedContent: IPrescriptionAtThisPharmacySectionContent = {
      instructions: 'prescription-at-this-pharmacy-instructions-text-mock',
      heading: '',
      unAuthInformation: '',
      signUpButtonLabel: '',
    };

    expect(content).toEqual(expectedContent);
  });
});
