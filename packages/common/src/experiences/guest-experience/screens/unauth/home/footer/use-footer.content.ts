// Copyright 2022 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../../models/language';
import { useSessionContext } from '../../../../context-providers/session/use-session-context.hook';
import { homePageCMSContentWrapper } from '../../../../state/cms-content/cms-content-wrappers/home-page/home-page.cms-content-wrapper';

export interface IFooterContent {
  privacyPolicyLabel: string;
  termsAndConditionsLabel: string;
}

export const useFooterContent = (): IFooterContent => {
  const { sessionState } = useSessionContext();
  const uiContent = homePageCMSContentWrapper(
    defaultLanguage,
    sessionState.uiCMSContentMap
  );
  return {
    privacyPolicyLabel: uiContent.privacyPolicy,
    termsAndConditionsLabel: uiContent.termsAndConditions,
  };
};
