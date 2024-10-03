// Copyright 2022 Prescryptive Health, Inc.

import { useCobrandingContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-cobranding-content';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ICobrandingContent } from '../../../models/cms-content/co-branding.ui-content';
import {
  IWelcomeModalContent,
  useWelcomeModalContent,
} from './welcome-modal.content';

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-cobranding-content'
);
const useCobrandingContentMock = useCobrandingContent as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

describe('useWelcomeModalContent', () => {
  it('gets content correctly', () => {
    const cobrandingContentMock: ICobrandingContent = {
      logo: '',
      interstitialContent: 'Test cobranding text',
      idCardLogo: '',
      idCardHeaderColor: '',
    };

    useCobrandingContentMock.mockReturnValue(cobrandingContentMock);
    useContentMock.mockReturnValue({ content: { okButton: 'OK' } });

    const expectedWelcomeModalContent: IWelcomeModalContent = {
      welcomeParagraph: 'Test cobranding text',
      okButton: 'OK',
    };

    const welcomeModalContent = useWelcomeModalContent('test-cobranding-id');

    expect(useCobrandingContentMock).toBeCalledWith('test-cobranding-id');
    expect(useContentMock).toBeCalledWith(CmsGroupKey.global, 2);
    expect(welcomeModalContent).toEqual(expectedWelcomeModalContent);
  });
});
