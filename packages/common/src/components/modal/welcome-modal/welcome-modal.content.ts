// Copyright 2022 Prescryptive Health, Inc.

import { useCobrandingContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-cobranding-content';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IGlobalContent } from '../../../models/cms-content/global.content';

export interface IWelcomeModalContent {
  welcomeParagraph: string;
  okButton: string;
}

export const useWelcomeModalContent = (
  cobrandingId?: string
): IWelcomeModalContent => {
  const cobrandingUIContent = useCobrandingContent(cobrandingId);
  const globalGroupKey = CmsGroupKey.global;
  const { content: globalUIContent } = useContent<IGlobalContent>(
    globalGroupKey,
    2
  );

  return {
    welcomeParagraph: cobrandingUIContent.interstitialContent ?? '',
    okButton: globalUIContent.okButton,
  };
};
